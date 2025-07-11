import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RealMoodEntry {
  id: string;
  user_id: string;
  overall: number;
  anxiety?: number;
  depression?: number;
  stress?: number;
  energy?: number;
  sleep_quality?: number;
  factors?: string[];
  notes?: string;
  context?: any;
  created_at: string;
}

export interface MoodPattern {
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  bestTimeOfDay: string;
  commonFactors: string[];
  weeklyAverage: number;
  monthlyAverage: number;
}

export interface MoodInsight {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'recommendation' | 'alert';
  confidence: number;
  actionable: boolean;
  suggestion?: string;
}

export interface MoodAnalytics {
  totalEntries: number;
  averageMood: number;
  moodDistribution: Record<string, number>;
  weeklyTrends: Array<{
    week: string;
    average: number;
    entries: number;
  }>;
  factorCorrelations: Array<{
    factor: string;
    correlation: number;
    frequency: number;
  }>;
}

export const useRealMoodData = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<RealMoodEntry[]>([]);
  const [patterns, setPatterns] = useState<MoodPattern | null>(null);
  const [insights, setInsights] = useState<MoodInsight[]>([]);
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMoodData();
    }
  }, [user]);

  const loadMoodData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load mood entries
      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (moodError) throw moodError;

      setMoodEntries(moodData || []);

      // Calculate patterns and analytics
      if (moodData && moodData.length > 0) {
        const patterns = calculateMoodPatterns(moodData);
        const insights = generateMoodInsights(moodData, patterns);
        const analytics = calculateMoodAnalytics(moodData);

        setPatterns(patterns);
        setInsights(insights);
        setAnalytics(analytics);
      }

    } catch (err) {
      console.error('Error loading mood data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mood data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMoodPatterns = (entries: RealMoodEntry[]): MoodPattern => {
    const recentEntries = entries.slice(0, 30); // Last 30 entries
    const totalMood = recentEntries.reduce((acc, entry) => acc + entry.overall, 0);
    const averageMood = totalMood / recentEntries.length;

    // Calculate trend
    const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
    const firstHalfAvg = firstHalf.reduce((acc, entry) => acc + entry.overall, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((acc, entry) => acc + entry.overall, 0) / secondHalf.length;
    
    const difference = secondHalfAvg - firstHalfAvg;
    const moodTrend = difference > 0.5 ? 'improving' : difference < -0.5 ? 'declining' : 'stable';

    // Find best time of day
    const timeGroups: Record<string, number[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      night: []
    };

    recentEntries.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      if (hour >= 6 && hour < 12) timeGroups.morning.push(entry.overall);
      else if (hour >= 12 && hour < 17) timeGroups.afternoon.push(entry.overall);
      else if (hour >= 17 && hour < 22) timeGroups.evening.push(entry.overall);
      else timeGroups.night.push(entry.overall);
    });

    const timeAverages = Object.entries(timeGroups).map(([time, moods]) => ({
      time,
      average: moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0
    }));

    const bestTimeOfDay = timeAverages.reduce((best, current) => 
      current.average > best.average ? current : best
    ).time;

    // Find common factors
    const allFactors = recentEntries.flatMap(entry => entry.factors || []);
    const factorCounts = allFactors.reduce((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonFactors = Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([factor]) => factor);

    // Calculate weekly and monthly averages
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEntries = recentEntries.filter(entry => new Date(entry.created_at) >= oneWeekAgo);
    const weeklyAverage = weeklyEntries.length > 0 
      ? weeklyEntries.reduce((acc, entry) => acc + entry.overall, 0) / weeklyEntries.length 
      : averageMood;

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const monthlyEntries = recentEntries.filter(entry => new Date(entry.created_at) >= oneMonthAgo);
    const monthlyAverage = monthlyEntries.length > 0 
      ? monthlyEntries.reduce((acc, entry) => acc + entry.overall, 0) / monthlyEntries.length 
      : averageMood;

    return {
      averageMood,
      moodTrend,
      bestTimeOfDay,
      commonFactors,
      weeklyAverage,
      monthlyAverage
    };
  };

  const generateMoodInsights = (entries: RealMoodEntry[], patterns: MoodPattern): MoodInsight[] => {
    const insights: MoodInsight[] = [];

    // Trend insight
    if (patterns.moodTrend === 'improving') {
      insights.push({
        id: 'trend-improving',
        title: 'Positive Mood Trend',
        description: 'Your mood has been improving over the past few weeks. Keep up the great work!',
        type: 'pattern',
        confidence: 0.85,
        actionable: false
      });
    } else if (patterns.moodTrend === 'declining') {
      insights.push({
        id: 'trend-declining',
        title: 'Mood Needs Attention',
        description: 'Your mood has been declining recently. Consider reaching out for support.',
        type: 'alert',
        confidence: 0.9,
        actionable: true,
        suggestion: 'Schedule a therapy session or practice stress management techniques'
      });
    }

    // Time-based insight
    insights.push({
      id: 'best-time',
      title: `${patterns.bestTimeOfDay.charAt(0).toUpperCase() + patterns.bestTimeOfDay.slice(1)} is Your Best Time`,
      description: `Your mood tends to be highest in the ${patterns.bestTimeOfDay}. Consider scheduling important activities during this time.`,
      type: 'pattern',
      confidence: 0.75,
      actionable: true,
      suggestion: `Plan your most challenging tasks for the ${patterns.bestTimeOfDay}`
    });

    // Factor-based insights
    if (patterns.commonFactors.length > 0) {
      insights.push({
        id: 'common-factors',
        title: 'Mood Influencers Identified',
        description: `The factors "${patterns.commonFactors.slice(0, 2).join('" and "')}" appear frequently in your mood entries.`,
        type: 'pattern',
        confidence: 0.8,
        actionable: true,
        suggestion: 'Monitor these factors and develop strategies to manage their impact'
      });
    }

    return insights;
  };

  const calculateMoodAnalytics = (entries: RealMoodEntry[]): MoodAnalytics => {
    const totalMood = entries.reduce((acc, entry) => acc + entry.overall, 0);
    const averageMood = entries.length > 0 ? totalMood / entries.length : 0;

    // Mood distribution
    const moodDistribution = entries.reduce((acc, entry) => {
      const moodRange = entry.overall <= 3 ? 'low' : entry.overall <= 6 ? 'medium' : 'high';
      acc[moodRange] = (acc[moodRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Weekly trends
    const weeklyTrends = calculateWeeklyTrends(entries);

    // Factor correlations
    const factorCorrelations = calculateFactorCorrelations(entries);

    return {
      totalEntries: entries.length,
      averageMood,
      moodDistribution,
      weeklyTrends,
      factorCorrelations
    };
  };

  const calculateWeeklyTrends = (entries: RealMoodEntry[]) => {
    const weeks: Record<string, { total: number; count: number }> = {};
    
    entries.forEach(entry => {
      const weekStart = getWeekStart(new Date(entry.created_at));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { total: 0, count: 0 };
      }
      
      weeks[weekKey].total += entry.overall;
      weeks[weekKey].count++;
    });

    return Object.entries(weeks)
      .map(([week, data]) => ({
        week,
        average: data.count > 0 ? data.total / data.count : 0,
        entries: data.count
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12);
  };

  const calculateFactorCorrelations = (entries: RealMoodEntry[]) => {
    const factorMoods: Record<string, number[]> = {};
    
    entries.forEach(entry => {
      (entry.factors || []).forEach(factor => {
        if (!factorMoods[factor]) {
          factorMoods[factor] = [];
        }
        factorMoods[factor].push(entry.overall);
      });
    });

    return Object.entries(factorMoods)
      .map(([factor, moods]) => {
        const average = moods.reduce((a, b) => a + b, 0) / moods.length;
        const overallAverage = entries.reduce((acc, entry) => acc + entry.overall, 0) / entries.length;
        const correlation = (average - overallAverage) / 5; // Normalized correlation
        
        return {
          factor,
          correlation,
          frequency: moods.length
        };
      })
      .filter(item => item.frequency >= 3) // Only factors that appear at least 3 times
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
      .slice(0, 10);
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const addMoodEntry = async (moodData: {
    overall: number;
    anxiety: number;
    depression: number;
    stress: number;
    energy: number;
    sleep_quality?: number;
    notes?: string;
    activities?: string[];
    triggers?: string[];
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert([{ 
          ...moodData, 
          user_id: user.id,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      await loadMoodData(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error adding mood entry:', err);
      throw err;
    }
  };

  const refreshData = () => {
    loadMoodData();
  };

  return {
    moodEntries,
    patterns,
    insights,
    analytics,
    loading,
    error,
    addMoodEntry,
    refreshData
  };
};