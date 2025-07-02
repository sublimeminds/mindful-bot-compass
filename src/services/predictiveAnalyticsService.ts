import { supabase } from '@/integrations/supabase/client';

export interface PredictiveInsight {
  type: 'crisis_risk' | 'engagement_drop' | 'treatment_success' | 'goal_completion';
  confidence: number;
  timeframe: string;
  description: string;
  recommendations: string[];
  risk_level: 'low' | 'medium' | 'high';
}

export interface UserBehaviorPrediction {
  user_id: string;
  predicted_mood_trend: 'improving' | 'declining' | 'stable';
  engagement_probability: number;
  next_session_optimal_time: Date;
  recommended_interventions: string[];
  insights: PredictiveInsight[];
}

class PredictiveAnalyticsService {
  async generateUserPredictions(userId: string): Promise<UserBehaviorPrediction> {
    try {
      // Get user's historical data
      const [behaviorData, sessionData, moodData] = await Promise.all([
        this.getUserBehaviorHistory(userId),
        this.getUserSessionHistory(userId),
        this.getUserMoodHistory(userId)
      ]);

      // Generate predictions based on historical patterns
      const predictions = await this.analyzePredictivePatterns(
        userId,
        behaviorData,
        sessionData,
        moodData
      );

      return predictions;
    } catch (error) {
      console.error('Error generating predictions:', error);
      return this.getDefaultPredictions(userId);
    }
  }

  private async getUserBehaviorHistory(userId: string) {
    const { data } = await supabase
      .from('user_behavior_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    return data || [];
  }

  private async getUserSessionHistory(userId: string) {
    const { data } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(20);

    return data || [];
  }

  private async getUserMoodHistory(userId: string) {
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    return data || [];
  }

  private async analyzePredictivePatterns(
    userId: string,
    behaviorData: any[],
    sessionData: any[],
    moodData: any[]
  ): Promise<UserBehaviorPrediction> {
    const insights: PredictiveInsight[] = [];

    // Analyze crisis risk
    const crisisRisk = this.calculateCrisisRisk(moodData, behaviorData);
    if (crisisRisk.confidence > 0.6) {
      insights.push(crisisRisk);
    }

    // Analyze engagement patterns
    const engagementRisk = this.calculateEngagementRisk(behaviorData, sessionData);
    if (engagementRisk.confidence > 0.5) {
      insights.push(engagementRisk);
    }

    // Predict mood trend
    const moodTrend = this.predictMoodTrend(moodData);
    
    // Calculate engagement probability
    const engagementProbability = this.calculateEngagementProbability(behaviorData);

    // Predict optimal session time
    const optimalTime = this.predictOptimalSessionTime(sessionData);

    // Generate recommendations
    const recommendations = this.generateRecommendations(insights, moodTrend);

    return {
      user_id: userId,
      predicted_mood_trend: moodTrend,
      engagement_probability: engagementProbability,
      next_session_optimal_time: optimalTime,
      recommended_interventions: recommendations,
      insights
    };
  }

  private calculateCrisisRisk(moodData: any[], behaviorData: any[]): PredictiveInsight {
    const recentMoods = moodData.slice(0, 7);
    const avgMood = recentMoods.reduce((sum, entry) => sum + (entry.overall || 5), 0) / recentMoods.length;
    const moodTrend = this.calculateTrend(recentMoods.map(m => m.overall || 5));
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let confidence = 0.3;

    if (avgMood < 3 && moodTrend < -0.5) {
      riskLevel = 'high';
      confidence = 0.8;
    } else if (avgMood < 4 && moodTrend < -0.3) {
      riskLevel = 'medium';
      confidence = 0.6;
    }

    return {
      type: 'crisis_risk',
      confidence,
      timeframe: '7-14 days',
      description: `Based on recent mood patterns, there is a ${riskLevel} risk of crisis within the next 1-2 weeks`,
      recommendations: this.getCrisisPreventionRecommendations(riskLevel),
      risk_level: riskLevel
    };
  }

  private calculateEngagementRisk(behaviorData: any[], sessionData: any[]): PredictiveInsight {
    const recentBehavior = behaviorData.slice(0, 7);
    const avgEngagement = recentBehavior.reduce((sum, day) => sum + (day.engagement_score || 0.5), 0) / recentBehavior.length;
    const sessionFrequency = sessionData.length / 30; // sessions per day over last month

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let confidence = 0.4;

    if (avgEngagement < 0.3 && sessionFrequency < 0.2) {
      riskLevel = 'high';
      confidence = 0.7;
    } else if (avgEngagement < 0.5 && sessionFrequency < 0.4) {
      riskLevel = 'medium';
      confidence = 0.6;
    }

    return {
      type: 'engagement_drop',
      confidence,
      timeframe: '3-7 days',
      description: `User engagement is predicted to ${riskLevel === 'high' ? 'significantly decrease' : 'decrease'} in the coming week`,
      recommendations: this.getEngagementRecommendations(riskLevel),
      risk_level: riskLevel
    };
  }

  private predictMoodTrend(moodData: any[]): 'improving' | 'declining' | 'stable' {
    if (moodData.length < 5) return 'stable';

    const recent = moodData.slice(0, 5).map(m => m.overall || 5);
    const earlier = moodData.slice(5, 10).map(m => m.overall || 5);

    const recentAvg = recent.reduce((sum, mood) => sum + mood, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, mood) => sum + mood, 0) / earlier.length;

    const difference = recentAvg - earlierAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  private calculateEngagementProbability(behaviorData: any[]): number {
    if (behaviorData.length === 0) return 0.5;

    const recentEngagement = behaviorData.slice(0, 7);
    const avgEngagement = recentEngagement.reduce((sum, day) => sum + (day.engagement_score || 0.5), 0) / recentEngagement.length;
    
    // Factor in consistency
    const consistency = this.calculateConsistency(recentEngagement.map(d => d.engagement_score || 0.5));
    
    return Math.min(avgEngagement + (consistency * 0.2), 1.0);
  }

  private predictOptimalSessionTime(sessionData: any[]): Date {
    // Analyze historical session times to find optimal windows
    const hourCounts = new Map<number, number>();
    
    sessionData.forEach(session => {
      const hour = new Date(session.start_time).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    // Find most common hour
    let optimalHour = 14; // Default to 2 PM
    let maxCount = 0;

    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        optimalHour = hour;
      }
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(optimalHour, 0, 0, 0);

    return tomorrow;
  }

  private generateRecommendations(insights: PredictiveInsight[], moodTrend: string): string[] {
    const recommendations: string[] = [];

    if (moodTrend === 'declining') {
      recommendations.push('Increase session frequency to twice weekly');
      recommendations.push('Focus on mood stabilization techniques');
    }

    insights.forEach(insight => {
      recommendations.push(...insight.recommendations);
    });

    // Remove duplicates
    return [...new Set(recommendations)];
  }

  private getCrisisPreventionRecommendations(riskLevel: string): string[] {
    const base = [
      'Monitor mood daily',
      'Ensure emergency contacts are updated',
      'Practice grounding techniques regularly'
    ];

    if (riskLevel === 'high') {
      return [
        ...base,
        'Consider immediate professional consultation',
        'Activate crisis support network',
        'Schedule daily check-ins'
      ];
    }

    if (riskLevel === 'medium') {
      return [
        ...base,
        'Increase therapy session frequency',
        'Implement stress reduction techniques'
      ];
    }

    return base;
  }

  private getEngagementRecommendations(riskLevel: string): string[] {
    const base = [
      'Set smaller, achievable goals',
      'Try new therapy techniques',
      'Schedule sessions at optimal times'
    ];

    if (riskLevel === 'high') {
      return [
        ...base,
        'Send motivational notifications',
        'Offer incentives for session completion',
        'Consider changing therapeutic approach'
      ];
    }

    return base;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = values.reduce((sum, _, index) => sum + (index * index), 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateConsistency(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.max(0, 1 - Math.sqrt(variance));
  }

  private getDefaultPredictions(userId: string): UserBehaviorPrediction {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    return {
      user_id: userId,
      predicted_mood_trend: 'stable',
      engagement_probability: 0.5,
      next_session_optimal_time: tomorrow,
      recommended_interventions: ['Continue current therapy approach'],
      insights: []
    };
  }

  async storeRealtimeMetric(metricType: string, value: number, metadata: Record<string, any> = {}) {
    try {
      await supabase
        .from('real_time_metrics')
        .insert({
          metric_type: metricType,
          metric_value: value,
          metric_metadata: metadata
        });
    } catch (error) {
      console.error('Error storing real-time metric:', error);
    }
  }
}

export const predictiveAnalyticsService = new PredictiveAnalyticsService();