
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from './notificationService';
import { NotificationPreferencesService } from './notificationPreferencesService';

export interface SessionPattern {
  userId: string;
  typicalSessionTimes: number[]; // hours of day when user usually sessions
  averageSessionLength: number; // in minutes
  preferredTechniques: string[];
  lastSessionDate?: Date;
  sessionStreak: number;
  totalSessions: number;
}

export interface UserProgress {
  userId: string;
  weeklySessionCount: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  averageMoodImprovement: number;
  consistencyScore: number; // 0-100
  milestones: string[];
}

export class IntelligentNotificationService {
  static async processSessionCompletion(userId: string, sessionDetails: any): Promise<void> {
    try {
      console.log('Processing session completion for intelligent notifications...', userId);
      
      // Analyze session patterns
      const patterns = await this.analyzeUserPatterns(userId);
      
      // Generate insights-based notifications
      await this.generateSessionInsights(userId, sessionDetails, patterns);
      
      // Check for milestone achievements
      await this.checkMilestoneAchievements(userId, patterns);
      
      // Update user progress tracking
      await this.updateProgressTracking(userId, sessionDetails);
      
    } catch (error) {
      console.error('Error processing session completion:', error);
    }
  }

  static async analyzeUserPatterns(userId: string): Promise<SessionPattern> {
    try {
      const { data: sessions, error } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time, techniques')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(30);

      if (error || !sessions) {
        console.error('Error fetching sessions for pattern analysis:', error);
        return this.getDefaultPattern(userId);
      }

      // Analyze session timing patterns
      const sessionTimes = sessions
        .filter(session => session.start_time)
        .map(session => new Date(session.start_time).getHours());

      const typicalSessionTimes = this.findMostCommonHours(sessionTimes);

      // Calculate average session length
      const completedSessions = sessions.filter(s => s.start_time && s.end_time);
      const averageLength = completedSessions.length > 0 
        ? completedSessions.reduce((sum, session) => {
            const start = new Date(session.start_time).getTime();
            const end = new Date(session.end_time).getTime();
            return sum + (end - start) / (1000 * 60); // minutes
          }, 0) / completedSessions.length
        : 25; // default 25 minutes

      // Find preferred techniques
      const allTechniques = sessions.flatMap(s => s.techniques || []);
      const techniqueCount: Record<string, number> = {};
      allTechniques.forEach(tech => {
        techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
      });

      const preferredTechniques = Object.entries(techniqueCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([tech]) => tech);

      // Calculate session streak
      const sessionStreak = this.calculateSessionStreak(sessions);

      return {
        userId,
        typicalSessionTimes,
        averageSessionLength: Math.round(averageLength),
        preferredTechniques,
        lastSessionDate: sessions.length > 0 ? new Date(sessions[0].start_time) : undefined,
        sessionStreak,
        totalSessions: sessions.length
      };
    } catch (error) {
      console.error('Error analyzing user patterns:', error);
      return this.getDefaultPattern(userId);
    }
  }

  private static getDefaultPattern(userId: string): SessionPattern {
    return {
      userId,
      typicalSessionTimes: [9, 13, 18], // Default session times
      averageSessionLength: 25,
      preferredTechniques: [],
      sessionStreak: 0,
      totalSessions: 0
    };
  }

  private static findMostCommonHours(hours: number[]): number[] {
    const hourCount: Record<number, number> = {};
    hours.forEach(hour => {
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    return Object.entries(hourCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
  }

  private static calculateSessionStreak(sessions: any[]): number {
    if (sessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.start_time);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff === streak + 1) {
        // Allow for one day gap
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  static async generateSessionInsights(userId: string, sessionDetails: any, patterns: SessionPattern): Promise<void> {
    try {
      const insights: Array<{type: string, title: string, message: string, priority: 'low' | 'medium' | 'high'}> = [];

      // Streak achievements
      if (patterns.sessionStreak > 0 && patterns.sessionStreak % 7 === 0) {
        insights.push({
          type: 'milestone_achieved',
          title: '🔥 Amazing Streak!',
          message: `You've maintained a ${patterns.sessionStreak}-day therapy streak! Your consistency is paying off.`,
          priority: 'high'
        });
      }

      // Technique recommendations
      if (sessionDetails.techniques && sessionDetails.techniques.length > 0) {
        const newTechniques = sessionDetails.techniques.filter((tech: string) => 
          !patterns.preferredTechniques.includes(tech)
        );
        
        if (newTechniques.length > 0) {
          insights.push({
            type: 'insight_generated',
            title: '🌟 Exploring New Techniques',
            message: `Great job trying ${newTechniques[0]}! Expanding your toolkit can lead to better outcomes.`,
            priority: 'medium'
          });
        }
      }

      // Session length insights
      if (sessionDetails.duration) {
        const durationMinutes = sessionDetails.duration / (1000 * 60);
        if (durationMinutes > patterns.averageSessionLength * 1.5) {
          insights.push({
            type: 'insight_generated',
            title: '⏰ Extended Session',
            message: `You spent extra time on self-care today (${Math.round(durationMinutes)} minutes). Deep work often leads to meaningful breakthroughs.`,
            priority: 'low'
          });
        }
      }

      // Create notifications for insights - now respects user preferences
      for (const insight of insights) {
        await NotificationService.createNotification(userId, {
          type: insight.type as any,
          title: insight.title,
          message: insight.message,
          priority: insight.priority
        });
      }
    } catch (error) {
      console.error('Error generating session insights:', error);
    }
  }

  static async checkMilestoneAchievements(userId: string, patterns: SessionPattern): Promise<void> {
    try {
      const milestones = [
        { sessions: 5, title: 'First Steps', message: 'You\'ve completed 5 therapy sessions!' },
        { sessions: 10, title: 'Building Momentum', message: 'Double digits! 10 sessions completed.' },
        { sessions: 25, title: 'Quarter Century', message: '25 sessions - you\'re building lasting habits!' },
        { sessions: 50, title: 'Half Century', message: '50 sessions! Your commitment to growth is inspiring.' },
        { sessions: 100, title: 'Century Club', message: '100 sessions! You\'ve built an incredible foundation for mental wellness.' }
      ];

      const achievedMilestone = milestones.find(m => m.sessions === patterns.totalSessions);
      
      if (achievedMilestone) {
        // Now respects user preferences
        await NotificationService.createNotification(userId, {
          type: 'milestone_achieved',
          title: `🎉 ${achievedMilestone.title}`,
          message: achievedMilestone.message,
          priority: 'high',
          data: { milestone: achievedMilestone.title, sessionCount: patterns.totalSessions }
        });
      }
    } catch (error) {
      console.error('Error checking milestone achievements:', error);
    }
  }

  static async updateProgressTracking(userId: string, sessionDetails: any): Promise<void> {
    try {
      // This could be expanded to track detailed progress metrics
      // For now, we'll just log the update
      console.log('Progress tracking updated for user:', userId);
    } catch (error) {
      console.error('Error updating progress tracking:', error);
    }
  }

  static async generateInactivityReminders(): Promise<void> {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name');

      if (error || !profiles) {
        console.error('Error fetching profiles for inactivity check:', error);
        return;
      }

      const inactiveUsers = [];

      for (const profile of profiles) {
        const { data: recentSessions } = await supabase
          .from('therapy_sessions')
          .select('start_time')
          .eq('user_id', profile.id)
          .gte('start_time', threeDaysAgo.toISOString())
          .limit(1);

        if (!recentSessions || recentSessions.length === 0) {
          inactiveUsers.push(profile);
        }
      }

      // Create gentle reminders for inactive users - now respects preferences
      for (const user of inactiveUsers) {
        await NotificationService.createNotification(user.id, {
          type: 'session_reminder',
          title: 'We miss you! 💙',
          message: "It's been a few days since your last session. Even a few minutes of self-care can make a difference.",
          priority: 'medium'
        });
      }

      console.log(`Generated reminders for ${inactiveUsers.length} inactive users`);
    } catch (error) {
      console.error('Error generating inactivity reminders:', error);
    }
  }

  static async createCustomNotification(
    userId: string,
    type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update',
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    data?: Record<string, any>
  ): Promise<boolean> {
    return await NotificationService.createNotification(userId, {
      type,
      title,
      message,
      priority,
      data
    });
  }
}
