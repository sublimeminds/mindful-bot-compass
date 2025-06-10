
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from './notificationService';

export interface SessionDetails {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  moodBefore?: number;
  moodAfter?: number;
  summary?: string;
  insights?: string[];
  techniques?: string[];
  duration?: number;
}

export class IntelligentNotificationService {
  static async processSessionCompletion(userId: string, sessionDetails: SessionDetails): Promise<void> {
    console.log('Processing session completion for intelligent notifications...', sessionDetails);
    
    try {
      // Analyze session for insights
      const insights = await this.analyzeSession(sessionDetails);
      
      // Generate personalized notifications based on insights
      await this.generateInsightNotifications(userId, insights);
      
      // Check for milestones
      await this.checkMilestones(userId);
      
    } catch (error) {
      console.error('Error processing session for intelligent notifications:', error);
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

  static async generateInactivityReminders(): Promise<void> {
    console.log('Generating inactivity reminders...');
    
    try {
      // Get users who haven't had sessions in the last 3 days
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: inactiveUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .not('id', 'in', `(
          SELECT DISTINCT user_id 
          FROM therapy_sessions 
          WHERE start_time > '${threeDaysAgo.toISOString()}'
        )`);

      if (error) {
        console.error('Error fetching inactive users:', error);
        return;
      }

      // Send reminders to inactive users
      for (const user of inactiveUsers || []) {
        await this.createCustomNotification(
          user.id,
          'session_reminder',
          '🌱 Time for Self-Care',
          "It's been a few days since your last session. Take a moment to check in with yourself.",
          'medium'
        );
      }
    } catch (error) {
      console.error('Error generating inactivity reminders:', error);
    }
  }

  private static async analyzeSession(sessionDetails: SessionDetails): Promise<string[]> {
    const insights = [];

    // Mood improvement analysis
    if (sessionDetails.moodBefore && sessionDetails.moodAfter) {
      const improvement = sessionDetails.moodAfter - sessionDetails.moodBefore;
      if (improvement > 0) {
        insights.push(`Mood improved by ${improvement} points during this session`);
      }
    }

    // Session duration analysis
    if (sessionDetails.endTime && sessionDetails.startTime) {
      const duration = Math.round((sessionDetails.endTime.getTime() - sessionDetails.startTime.getTime()) / (1000 * 60));
      if (duration >= 30) {
        insights.push(`Engaged in a substantial ${duration}-minute therapy session`);
      }
    }

    return insights;
  }

  private static async generateInsightNotifications(userId: string, insights: string[]): Promise<void> {
    for (const insight of insights) {
      await NotificationService.createNotification(userId, {
        type: 'insight_generated',
        title: 'New Insight from Your Session',
        message: insight,
        priority: 'medium',
        data: { insight }
      });
    }
  }

  private static async checkMilestones(userId: string): Promise<void> {
    // Check for session count milestones
    const { count: totalSessions } = await supabase
      .from('therapy_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const milestones = [1, 5, 10, 25, 50, 100];
    if (milestones.includes(totalSessions || 0)) {
      await NotificationService.createNotification(userId, {
        type: 'milestone_achieved',
        title: 'Milestone Achieved! 🎉',
        message: `Congratulations! You've completed ${totalSessions} therapy sessions.`,
        priority: 'high',
        data: { milestone: `${totalSessions}_sessions` }
      });
    }
  }
}
