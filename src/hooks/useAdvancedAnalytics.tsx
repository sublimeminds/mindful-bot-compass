import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { realAnalyticsService, MoodPattern, GoalAnalytics, SessionEffectiveness } from '@/services/realAnalyticsService';
import { supabase } from '@/integrations/supabase/client';

export interface AdvancedAnalyticsData {
  moodPatterns: MoodPattern[];
  goalAnalytics: GoalAnalytics;
  sessionEffectiveness: SessionEffectiveness;
  isLoading: boolean;
  error: string | null;
}

export interface PredictiveInsights {
  riskScore: number;
  recommendations: string[];
  predictedOutcomes: {
    moodTrend: 'improving' | 'declining' | 'stable';
    confidence: number;
  };
}

export interface UserBehaviorMetrics {
  sessionFrequency: number;
  avgSessionDuration: number;
  preferredTimeOfDay: string;
  engagementScore: number;
  completionRate: number;
}

export const useAdvancedAnalytics = (timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
  const { user } = useAuth();
  const [data, setData] = useState<AdvancedAnalyticsData>({
    moodPatterns: [],
    goalAnalytics: {
      completion_rate: 0,
      average_time_to_complete: 0,
      most_successful_categories: [],
      improvement_areas: []
    },
    sessionEffectiveness: {
      overall_rating: 0,
      mood_improvement_rate: 0,
      technique_effectiveness: {},
      user_engagement_score: 0
    },
    isLoading: true,
    error: null
  });

  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights>({
    riskScore: 0,
    recommendations: [],
    predictedOutcomes: {
      moodTrend: 'stable',
      confidence: 0
    }
  });

  const [behaviorMetrics, setBehaviorMetrics] = useState<UserBehaviorMetrics>({
    sessionFrequency: 0,
    avgSessionDuration: 0,
    preferredTimeOfDay: 'morning',
    engagementScore: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
      loadPredictiveInsights();
      loadBehaviorMetrics();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      
      const [moodPatterns, goalAnalytics, sessionEffectiveness] = await Promise.all([
        realAnalyticsService.analyzeMoodPatterns(user.id, days),
        realAnalyticsService.calculateGoalAnalytics(user.id),
        realAnalyticsService.calculateSessionEffectiveness(user.id)
      ]);

      setData({
        moodPatterns,
        goalAnalytics,
        sessionEffectiveness,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load analytics data'
      }));
    }
  };

  const loadPredictiveInsights = async () => {
    if (!user) return;

    try {
      // Get recent mood entries for trend prediction
      const { data: recentMoods } = await supabase
        .from('mood_entries')
        .select('overall, anxiety, energy, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(14);

      if (recentMoods && recentMoods.length >= 7) {
        const avgRecent = recentMoods.slice(0, 7).reduce((sum, m) => sum + (m.overall || 0), 0) / 7;
        const avgPrevious = recentMoods.slice(7, 14).reduce((sum, m) => sum + (m.overall || 0), 0) / 7;
        
        const trendDiff = avgRecent - avgPrevious;
        let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
        let confidence = 50;

        if (trendDiff > 0.5) {
          moodTrend = 'improving';
          confidence = Math.min(90, 50 + Math.abs(trendDiff) * 20);
        } else if (trendDiff < -0.5) {
          moodTrend = 'declining';
          confidence = Math.min(90, 50 + Math.abs(trendDiff) * 20);
        }

        // Calculate risk score based on multiple factors
        const avgAnxiety = recentMoods.reduce((sum, m) => sum + (m.anxiety || 0), 0) / recentMoods.length;
        const avgEnergy = recentMoods.reduce((sum, m) => sum + (m.energy || 0), 0) / recentMoods.length;
        
        const riskScore = Math.max(0, Math.min(100, 
          (avgAnxiety * 10) + ((10 - avgEnergy) * 5) + ((10 - avgRecent) * 8)
        ));

        // Generate recommendations based on patterns
        const recommendations = [];
        if (avgAnxiety > 6) recommendations.push('Focus on anxiety reduction techniques');
        if (avgEnergy < 4) recommendations.push('Consider energy-boosting activities');
        if (moodTrend === 'declining') recommendations.push('Schedule additional therapy sessions');
        if (riskScore > 60) recommendations.push('Implement crisis prevention strategies');

        setPredictiveInsights({
          riskScore,
          recommendations,
          predictedOutcomes: { moodTrend, confidence }
        });
      }
    } catch (error) {
      console.error('Error loading predictive insights:', error);
    }
  };

  const loadBehaviorMetrics = async () => {
    if (!user) return;

    try {
      // Get session data for behavior analysis
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (sessions && sessions.length > 0) {
        // Calculate session frequency (sessions per week)
        const sessionDates = sessions.map(s => new Date(s.created_at));
        const firstSession = sessionDates[sessionDates.length - 1];
        const lastSession = sessionDates[0];
        const daysDiff = (lastSession.getTime() - firstSession.getTime()) / (1000 * 60 * 60 * 24);
        const sessionFrequency = (sessions.length / Math.max(daysDiff / 7, 1));

        // Calculate average session duration
        const durationsMs = sessions
          .filter(s => s.start_time && s.end_time)
          .map(s => new Date(s.end_time!).getTime() - new Date(s.start_time).getTime());
        
        const avgSessionDuration = durationsMs.length > 0 
          ? durationsMs.reduce((sum, d) => sum + d, 0) / durationsMs.length / (1000 * 60) // minutes
          : 0;

        // Determine preferred time of day
        const hourCounts = sessions.reduce((acc, s) => {
          const hour = new Date(s.start_time).getHours();
          if (hour >= 6 && hour < 12) acc.morning++;
          else if (hour >= 12 && hour < 18) acc.afternoon++;
          else acc.evening++;
          return acc;
        }, { morning: 0, afternoon: 0, evening: 0 });

        const preferredTimeOfDay = Object.entries(hourCounts)
          .reduce((a, b) => hourCounts[a[0] as keyof typeof hourCounts] > hourCounts[b[0] as keyof typeof hourCounts] ? a : b)[0];

        // Calculate engagement score (based on session completion and frequency)
        const engagementScore = Math.min(100, 
          (sessionFrequency * 15) + 
          (Math.min(avgSessionDuration / 30, 1) * 30) +
          (sessions.length * 2)
        );

        setBehaviorMetrics({
          sessionFrequency,
          avgSessionDuration,
          preferredTimeOfDay,
          engagementScore,
          completionRate: 85 // Mock completion rate
        });
      }
    } catch (error) {
      console.error('Error loading behavior metrics:', error);
    }
  };

  const refreshAnalytics = () => {
    if (user) {
      loadAnalyticsData();
      loadPredictiveInsights();
      loadBehaviorMetrics();
    }
  };

  const exportAnalyticsData = () => {
    const exportData = {
      user_id: user?.id,
      timeRange,
      generated_at: new Date().toISOString(),
      analytics: data,
      predictive_insights: predictiveInsights,
      behavior_metrics: behaviorMetrics
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `therapy-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    data,
    predictiveInsights,
    behaviorMetrics,
    refreshAnalytics,
    exportAnalyticsData
  };
};