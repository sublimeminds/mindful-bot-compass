import { supabase } from '@/integrations/supabase/client';

export interface MoodPattern {
  pattern_type: string;
  frequency: number;
  trend: 'improving' | 'declining' | 'stable';
  triggers: string[];
  recommendations: string[];
}

export interface GoalAnalytics {
  completion_rate: number;
  average_time_to_complete: number;
  most_successful_categories: string[];
  improvement_areas: string[];
}

export interface SessionEffectiveness {
  overall_rating: number;
  mood_improvement_rate: number;
  technique_effectiveness: Record<string, number>;
  user_engagement_score: number;
}

class RealAnalyticsService {
  async analyzeMoodPatterns(userId: string, days: number = 30): Promise<MoodPattern[]> {
    try {
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (!moodEntries || moodEntries.length === 0) {
        return [];
      }

      const patterns: MoodPattern[] = [];

      // Analyze mood trend
      const moodTrend = this.calculateMoodTrend(moodEntries);
      patterns.push({
        pattern_type: 'overall_mood_trend',
        frequency: moodEntries.length,
        trend: moodTrend,
        triggers: this.extractCommonTriggers(moodEntries),
        recommendations: this.generateMoodRecommendations(moodTrend, moodEntries)
      });

      // Analyze anxiety patterns
      const anxietyPattern = this.analyzeAnxietyPatterns(moodEntries);
      if (anxietyPattern) {
        patterns.push(anxietyPattern);
      }

      // Analyze energy patterns
      const energyPattern = this.analyzeEnergyPatterns(moodEntries);
      if (energyPattern) {
        patterns.push(energyPattern);
      }

      return patterns;
    } catch (error) {
      console.error('Error analyzing mood patterns:', error);
      return [];
    }
  }

  async calculateGoalAnalytics(userId: string): Promise<GoalAnalytics> {
    try {
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      if (!goals || goals.length === 0) {
        return {
          completion_rate: 0,
          average_time_to_complete: 0,
          most_successful_categories: [],
          improvement_areas: []
        };
      }

      const completedGoals = goals.filter(g => g.is_completed);
      const completion_rate = (completedGoals.length / goals.length) * 100;

      // Calculate average time to complete
      const completionTimes = completedGoals
        .filter(g => g.start_date && g.target_date)
        .map(g => {
          const start = new Date(g.start_date);
          const end = new Date(g.target_date);
          return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
        });

      const average_time_to_complete = completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;

      // Analyze category performance
      const categoryStats = goals.reduce((acc, goal) => {
        if (!acc[goal.category]) {
          acc[goal.category] = { total: 0, completed: 0 };
        }
        acc[goal.category].total++;
        if (goal.is_completed) {
          acc[goal.category].completed++;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      const most_successful_categories = Object.entries(categoryStats)
        .map(([category, stats]) => ({
          category,
          rate: (stats.completed / stats.total) * 100
        }))
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 3)
        .map(item => item.category);

      const improvement_areas = Object.entries(categoryStats)
        .map(([category, stats]) => ({
          category,
          rate: (stats.completed / stats.total) * 100
        }))
        .sort((a, b) => a.rate - b.rate)
        .slice(0, 2)
        .map(item => item.category);

      return {
        completion_rate,
        average_time_to_complete,
        most_successful_categories,
        improvement_areas
      };
    } catch (error) {
      console.error('Error calculating goal analytics:', error);
      return {
        completion_rate: 0,
        average_time_to_complete: 0,
        most_successful_categories: [],
        improvement_areas: []
      };
    }
  }

  async calculateSessionEffectiveness(userId: string, sessionId?: string): Promise<SessionEffectiveness> {
    try {
      let query = supabase
        .from('session_analytics')
        .select('*');

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      } else {
        // Get recent sessions for the user
        const { data: recentSessions } = await supabase
          .from('session_messages')
          .select('session_id')
          .eq('sender', 'user')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (recentSessions) {
          const sessionIds = [...new Set(recentSessions.map(s => s.session_id))];
          query = query.in('session_id', sessionIds);
        }
      }

      const { data: analytics } = await query;

      if (!analytics || analytics.length === 0) {
        return {
          overall_rating: 0,
          mood_improvement_rate: 0,
          technique_effectiveness: {},
          user_engagement_score: 0
        };
      }

      const overall_rating = analytics.reduce((sum, a) => sum + (Number(a.session_rating) || 0), 0) / analytics.length;
      const mood_improvement_rate = analytics.reduce((sum, a) => sum + (Number(a.mood_improvement) || 0), 0) / analytics.length;
      const user_engagement_score = analytics.reduce((sum, a) => sum + (Number(a.effectiveness_score) || 0), 0) / analytics.length;

      // Aggregate technique effectiveness
      const technique_effectiveness = analytics.reduce((acc, a) => {
        if (a.techniques_effectiveness) {
          Object.entries(a.techniques_effectiveness).forEach(([technique, score]) => {
            if (!acc[technique]) acc[technique] = [];
            acc[technique].push(Number(score) || 0);
          });
        }
        return acc;
      }, {} as Record<string, number[]>);

      // Calculate averages for techniques
      const avgTechniqueEffectiveness = Object.entries(technique_effectiveness).reduce((acc, [technique, scores]) => {
        acc[technique] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return acc;
      }, {} as Record<string, number>);

      return {
        overall_rating,
        mood_improvement_rate,
        technique_effectiveness: avgTechniqueEffectiveness,
        user_engagement_score
      };
    } catch (error) {
      console.error('Error calculating session effectiveness:', error);
      return {
        overall_rating: 0,
        mood_improvement_rate: 0,
        technique_effectiveness: {},
        user_engagement_score: 0
      };
    }
  }

  private calculateMoodTrend(moodEntries: any[]): 'improving' | 'declining' | 'stable' {
    if (moodEntries.length < 2) return 'stable';

    const recentMoods = moodEntries.slice(-7); // Last 7 entries
    const earlierMoods = moodEntries.slice(0, 7); // First 7 entries

    const recentAvg = recentMoods.reduce((sum, entry) => sum + (Number(entry.overall) || 0), 0) / recentMoods.length;
    const earlierAvg = earlierMoods.reduce((sum, entry) => sum + (Number(entry.overall) || 0), 0) / earlierMoods.length;

    const difference = recentAvg - earlierAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private extractCommonTriggers(moodEntries: any[]): string[] {
    const allTriggers = moodEntries
      .filter(entry => entry.triggers && entry.triggers.length > 0)
      .flatMap(entry => entry.triggers);

    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger);
  }

  private generateMoodRecommendations(trend: string, moodEntries: any[]): string[] {
    const recommendations = [];

    if (trend === 'declining') {
      recommendations.push('Consider scheduling more frequent therapy sessions');
      recommendations.push('Focus on identifying and managing stress triggers');
      recommendations.push('Implement daily mindfulness or meditation practices');
    } else if (trend === 'improving') {
      recommendations.push('Continue current therapeutic approaches');
      recommendations.push('Document successful coping strategies');
      recommendations.push('Consider setting new wellness goals');
    } else {
      recommendations.push('Maintain consistent self-care routines');
      recommendations.push('Track mood patterns for better insights');
    }

    // Analyze specific issues
    const avgAnxiety = moodEntries.reduce((sum, e) => sum + (Number(e.anxiety) || 0), 0) / moodEntries.length;
    if (avgAnxiety > 7) {
      recommendations.push('Focus on anxiety management techniques');
    }

    const avgEnergy = moodEntries.reduce((sum, e) => sum + (Number(e.energy) || 0), 0) / moodEntries.length;
    if (avgEnergy < 4) {
      recommendations.push('Consider energy-boosting activities and sleep hygiene');
    }

    return recommendations;
  }

  private analyzeAnxietyPatterns(moodEntries: any[]): MoodPattern | null {
    const anxietyLevels = moodEntries.map(entry => Number(entry.anxiety) || 0);
    const avgAnxiety = anxietyLevels.reduce((sum, level) => sum + level, 0) / anxietyLevels.length;

    if (avgAnxiety < 3) return null; // No significant anxiety pattern

    const trend = this.calculateTrendForMetric(anxietyLevels);
    
    return {
      pattern_type: 'anxiety_pattern',
      frequency: moodEntries.length,
      trend,
      triggers: this.extractCommonTriggers(moodEntries.filter(e => (Number(e.anxiety) || 0) > 6)),
      recommendations: [
        'Practice deep breathing exercises',
        'Consider cognitive behavioral therapy techniques',
        'Maintain a consistent sleep schedule'
      ]
    };
  }

  private analyzeEnergyPatterns(moodEntries: any[]): MoodPattern | null {
    const energyLevels = moodEntries.map(entry => Number(entry.energy) || 0);
    const avgEnergy = energyLevels.reduce((sum, level) => sum + level, 0) / energyLevels.length;

    if (avgEnergy > 6) return null; // No significant energy issues

    const trend = this.calculateTrendForMetric(energyLevels);
    
    return {
      pattern_type: 'energy_pattern',
      frequency: moodEntries.length,
      trend,
      triggers: this.extractCommonTriggers(moodEntries.filter(e => (Number(e.energy) || 0) < 4)),
      recommendations: [
        'Establish regular exercise routine',
        'Improve sleep quality and duration',
        'Consider nutritional factors'
      ]
    };
  }

  private calculateTrendForMetric(values: number[]): 'improving' | 'declining' | 'stable' {
    if (values.length < 2) return 'stable';

    const recent = values.slice(-Math.ceil(values.length / 3));
    const earlier = values.slice(0, Math.ceil(values.length / 3));

    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, val) => sum + val, 0) / earlier.length;

    const difference = recentAvg - earlierAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }
}

export const realAnalyticsService = new RealAnalyticsService();
