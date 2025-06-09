
import { supabase } from '@/integrations/supabase/client';

export interface UserEngagementPattern {
  userId: string;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday = 0)
  engagementScore: number; // 0-1
  responseTime: number; // in minutes
  notificationType: string;
  contextFactors: {
    moodLevel?: number;
    sessionActivity?: boolean;
    streakStatus?: number;
  };
  timestamp: Date;
}

export interface OptimalTimingPrediction {
  recommendedTime: Date;
  confidence: number;
  reasoning: string;
  alternativeTimes: Date[];
  contextualFactors: string[];
}

export class AITimingOptimizationService {
  static async analyzeUserPatterns(userId: string): Promise<UserEngagementPattern[]> {
    try {
      // Fetch user's notification interaction history
      const { data: analytics } = await supabase
        .from('notification_analytics')
        .select(`
          *,
          notifications!inner(type, created_at)
        `)
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(500);

      if (!analytics) return [];

      // Process the data to extract patterns
      return analytics.map(item => {
        const timestamp = new Date(item.timestamp);
        const notificationTime = new Date(item.notifications.created_at);
        const responseTime = (timestamp.getTime() - notificationTime.getTime()) / (1000 * 60); // minutes

        return {
          userId,
          timeOfDay: timestamp.getHours(),
          dayOfWeek: timestamp.getDay(),
          engagementScore: this.calculateEngagementScore(item.event),
          responseTime,
          notificationType: item.notifications.type,
          contextFactors: item.metadata || {},
          timestamp
        };
      });
    } catch (error) {
      console.error('Error analyzing user patterns:', error);
      return [];
    }
  }

  static async predictOptimalTiming(
    userId: string,
    notificationType: string,
    contextFactors?: Record<string, any>
  ): Promise<OptimalTimingPrediction> {
    try {
      const patterns = await this.analyzeUserPatterns(userId);
      
      // Filter patterns relevant to the notification type
      const relevantPatterns = patterns.filter(p => 
        p.notificationType === notificationType || 
        this.getNotificationCategory(p.notificationType) === this.getNotificationCategory(notificationType)
      );

      if (relevantPatterns.length === 0) {
        // No historical data, use general best practices
        return this.getDefaultTiming(notificationType);
      }

      // Analyze patterns by time of day and day of week
      const timeAnalysis = this.analyzeTimePatterns(relevantPatterns);
      const dayAnalysis = this.analyzeDayPatterns(relevantPatterns);
      
      // Find optimal time slot
      const optimalHour = this.findOptimalHour(timeAnalysis);
      const optimalDay = this.findOptimalDay(dayAnalysis);
      
      // Generate prediction
      const now = new Date();
      const recommendedTime = new Date(now);
      
      // Set to optimal hour today or next occurrence
      recommendedTime.setHours(optimalHour, 0, 0, 0);
      
      // If optimal time has passed today, move to tomorrow
      if (recommendedTime <= now) {
        recommendedTime.setDate(recommendedTime.getDate() + 1);
      }
      
      // Adjust for optimal day of week if needed
      const daysUntilOptimal = (optimalDay - recommendedTime.getDay() + 7) % 7;
      if (daysUntilOptimal > 0 && daysUntilOptimal <= 3) {
        recommendedTime.setDate(recommendedTime.getDate() + daysUntilOptimal);
      }

      // Generate alternative times
      const alternatives = this.generateAlternativeTimes(recommendedTime, timeAnalysis);
      
      // Calculate confidence based on data quality
      const confidence = this.calculateConfidence(relevantPatterns);
      
      // Generate reasoning
      const reasoning = this.generateReasoning(optimalHour, optimalDay, relevantPatterns);
      
      return {
        recommendedTime,
        confidence,
        reasoning,
        alternativeTimes: alternatives,
        contextualFactors: this.getContextualFactors(relevantPatterns, contextFactors)
      };
    } catch (error) {
      console.error('Error predicting optimal timing:', error);
      return this.getDefaultTiming(notificationType);
    }
  }

  static async adaptTimingBasedOnResponse(
    userId: string,
    notificationId: string,
    responseType: 'viewed' | 'clicked' | 'dismissed' | 'ignored',
    responseTime: number
  ): Promise<void> {
    try {
      // Store the response data for future learning
      await supabase
        .from('notification_timing_feedback')
        .insert({
          user_id: userId,
          notification_id: notificationId,
          response_type: responseType,
          response_time: responseTime,
          feedback_score: this.calculateFeedbackScore(responseType, responseTime)
        });

      // Update user's timing preferences if needed
      await this.updateUserTimingPreferences(userId, responseType, responseTime);
    } catch (error) {
      console.error('Error adapting timing:', error);
    }
  }

  static async getPersonalizedFrequency(userId: string): Promise<{
    dailyLimit: number;
    hourlyLimit: number;
    minimumInterval: number; // minutes
    quietHours: { start: string; end: string };
  }> {
    try {
      const patterns = await this.analyzeUserPatterns(userId);
      
      // Analyze user's response fatigue
      const responseFatigue = this.analyzeResponseFatigue(patterns);
      
      // Get user's preferences
      const { data: preferences } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        dailyLimit: this.calculateOptimalDailyLimit(responseFatigue),
        hourlyLimit: 2, // Conservative default
        minimumInterval: this.calculateMinimumInterval(patterns),
        quietHours: {
          start: preferences?.quiet_hours_start || '22:00',
          end: preferences?.quiet_hours_end || '08:00'
        }
      };
    } catch (error) {
      console.error('Error getting personalized frequency:', error);
      return {
        dailyLimit: 5,
        hourlyLimit: 2,
        minimumInterval: 30,
        quietHours: { start: '22:00', end: '08:00' }
      };
    }
  }

  // Helper methods
  private static calculateEngagementScore(event: string): number {
    switch (event) {
      case 'clicked': return 1.0;
      case 'viewed': return 0.7;
      case 'delivered': return 0.3;
      case 'dismissed': return 0.1;
      default: return 0.0;
    }
  }

  private static getNotificationCategory(type: string): string {
    const categories: Record<string, string> = {
      'session_reminder': 'engagement',
      'mood_check': 'engagement',
      'milestone_achieved': 'achievement',
      'insight_generated': 'insight',
      'progress_update': 'insight'
    };
    return categories[type] || 'general';
  }

  private static analyzeTimePatterns(patterns: UserEngagementPattern[]) {
    const hourlyScores: Record<number, { totalScore: number; count: number }> = {};
    
    patterns.forEach(pattern => {
      if (!hourlyScores[pattern.timeOfDay]) {
        hourlyScores[pattern.timeOfDay] = { totalScore: 0, count: 0 };
      }
      hourlyScores[pattern.timeOfDay].totalScore += pattern.engagementScore;
      hourlyScores[pattern.timeOfDay].count += 1;
    });

    return Object.entries(hourlyScores).map(([hour, data]) => ({
      hour: parseInt(hour),
      averageScore: data.totalScore / data.count,
      count: data.count
    }));
  }

  private static analyzeDayPatterns(patterns: UserEngagementPattern[]) {
    const dailyScores: Record<number, { totalScore: number; count: number }> = {};
    
    patterns.forEach(pattern => {
      if (!dailyScores[pattern.dayOfWeek]) {
        dailyScores[pattern.dayOfWeek] = { totalScore: 0, count: 0 };
      }
      dailyScores[pattern.dayOfWeek].totalScore += pattern.engagementScore;
      dailyScores[pattern.dayOfWeek].count += 1;
    });

    return Object.entries(dailyScores).map(([day, data]) => ({
      day: parseInt(day),
      averageScore: data.totalScore / data.count,
      count: data.count
    }));
  }

  private static findOptimalHour(timeAnalysis: any[]): number {
    if (timeAnalysis.length === 0) return 9; // Default to 9 AM
    
    return timeAnalysis
      .filter(t => t.count >= 2) // Require minimum data points
      .sort((a, b) => b.averageScore - a.averageScore)[0]?.hour || 9;
  }

  private static findOptimalDay(dayAnalysis: any[]): number {
    if (dayAnalysis.length === 0) return 1; // Default to Monday
    
    return dayAnalysis
      .filter(d => d.count >= 2)
      .sort((a, b) => b.averageScore - a.averageScore)[0]?.day || 1;
  }

  private static generateAlternativeTimes(baseTime: Date, timeAnalysis: any[]): Date[] {
    const alternatives: Date[] = [];
    const topHours = timeAnalysis
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(1, 4); // Get 2nd, 3rd, 4th best times

    topHours.forEach(({ hour }) => {
      const altTime = new Date(baseTime);
      altTime.setHours(hour);
      if (altTime.getTime() !== baseTime.getTime()) {
        alternatives.push(altTime);
      }
    });

    return alternatives;
  }

  private static calculateConfidence(patterns: UserEngagementPattern[]): number {
    if (patterns.length === 0) return 0.3;
    if (patterns.length < 10) return 0.5;
    if (patterns.length < 50) return 0.7;
    return 0.9;
  }

  private static generateReasoning(hour: number, day: number, patterns: UserEngagementPattern[]): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    const avgResponseTime = patterns.reduce((sum, p) => sum + p.responseTime, 0) / patterns.length;
    const avgEngagement = patterns.reduce((sum, p) => sum + p.engagementScore, 0) / patterns.length;
    
    return `Based on your ${patterns.length} recent interactions, you're most engaged during ${timeOfDay} (${hour}:00) on ${dayNames[day]}s. Your average response time is ${Math.round(avgResponseTime)} minutes with ${Math.round(avgEngagement * 100)}% engagement rate.`;
  }

  private static getContextualFactors(patterns: UserEngagementPattern[], contextFactors?: Record<string, any>): string[] {
    const factors = [];
    
    // Analyze mood correlation
    const moodPatterns = patterns.filter(p => p.contextFactors.moodLevel);
    if (moodPatterns.length > 0) {
      const avgMood = moodPatterns.reduce((sum, p) => sum + (p.contextFactors.moodLevel || 0), 0) / moodPatterns.length;
      factors.push(`Best engagement when mood is ${avgMood > 7 ? 'high' : avgMood > 4 ? 'moderate' : 'low'}`);
    }
    
    // Analyze session activity correlation
    const sessionPatterns = patterns.filter(p => p.contextFactors.sessionActivity);
    if (sessionPatterns.length > 0) {
      factors.push('Higher engagement during active therapy periods');
    }
    
    return factors;
  }

  private static getDefaultTiming(notificationType: string): OptimalTimingPrediction {
    const now = new Date();
    const recommendedTime = new Date(now);
    
    // Default times based on notification type
    const defaultHours: Record<string, number> = {
      'session_reminder': 9,
      'mood_check': 19,
      'milestone_achieved': 10,
      'insight_generated': 14,
      'progress_update': 18
    };
    
    const hour = defaultHours[notificationType] || 10;
    recommendedTime.setHours(hour, 0, 0, 0);
    
    if (recommendedTime <= now) {
      recommendedTime.setDate(recommendedTime.getDate() + 1);
    }
    
    return {
      recommendedTime,
      confidence: 0.3,
      reasoning: `Using default timing for ${notificationType} (no historical data available)`,
      alternativeTimes: [],
      contextualFactors: ['No personalization data available']
    };
  }

  private static calculateFeedbackScore(responseType: string, responseTime: number): number {
    let baseScore = this.calculateEngagementScore(responseType);
    
    // Adjust based on response time (faster response = higher score)
    if (responseTime <= 5) baseScore *= 1.2;
    else if (responseTime <= 30) baseScore *= 1.0;
    else if (responseTime <= 120) baseScore *= 0.8;
    else baseScore *= 0.6;
    
    return Math.min(baseScore, 1.0);
  }

  private static async updateUserTimingPreferences(userId: string, responseType: string, responseTime: number): Promise<void> {
    // This would update user-specific timing preferences based on response patterns
    // Implementation would depend on your specific preference storage strategy
  }

  private static analyzeResponseFatigue(patterns: UserEngagementPattern[]): number {
    if (patterns.length === 0) return 0;
    
    // Calculate engagement decline over time
    const sortedPatterns = patterns.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const recentPatterns = sortedPatterns.slice(-20); // Last 20 interactions
    const olderPatterns = sortedPatterns.slice(0, 20); // First 20 interactions
    
    if (recentPatterns.length === 0 || olderPatterns.length === 0) return 0;
    
    const recentAvg = recentPatterns.reduce((sum, p) => sum + p.engagementScore, 0) / recentPatterns.length;
    const olderAvg = olderPatterns.reduce((sum, p) => sum + p.engagementScore, 0) / olderPatterns.length;
    
    return Math.max(0, olderAvg - recentAvg); // Fatigue = decline in engagement
  }

  private static calculateOptimalDailyLimit(fatigue: number): number {
    // Reduce daily limit if user shows fatigue
    const baseLimits = [3, 5, 7, 10]; // Conservative to aggressive
    const fatigueIndex = Math.floor(fatigue * 4);
    return baseLimits[Math.max(0, 3 - fatigueIndex)];
  }

  private static calculateMinimumInterval(patterns: UserEngagementPattern[]): number {
    if (patterns.length === 0) return 60; // Default 1 hour
    
    // Analyze how engagement drops with shorter intervals
    const intervals = patterns
      .slice(0, -1)
      .map((pattern, i) => ({
        interval: (patterns[i + 1].timestamp.getTime() - pattern.timestamp.getTime()) / (1000 * 60),
        engagement: patterns[i + 1].engagementScore
      }))
      .filter(item => item.interval < 480); // Less than 8 hours
    
    if (intervals.length === 0) return 60;
    
    // Find minimum interval that maintains good engagement
    const goodEngagementThreshold = 0.6;
    const minGoodInterval = intervals
      .filter(item => item.engagement >= goodEngagementThreshold)
      .reduce((min, item) => Math.min(min, item.interval), 180);
    
    return Math.max(30, Math.min(180, minGoodInterval)); // Between 30 minutes and 3 hours
  }
}
