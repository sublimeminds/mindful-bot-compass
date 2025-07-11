import { supabase } from '@/integrations/supabase/client';
import { DetailedSession } from './sessionService';

export interface IntelligentNotification {
  id: string;
  userId: string;
  notificationType: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  data: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export class IntelligentNotificationService {
  static async processSessionCompletion(userId: string, sessionDetails: DetailedSession): Promise<void> {
    try {
      // Analyze session for insights and generate notifications
      const insights = await this.generateSessionInsights(sessionDetails);
      
      // Create personalized notifications based on insights
      for (const insight of insights) {
        await this.createNotification(
          userId,
          'insight_generated',
          insight.title,
          insight.description,
          insight.priority,
          { sessionId: sessionDetails.id, confidence: insight.confidenceScore }
        );
      }

      // Check for milestone achievements
      await this.checkForMilestones(userId, sessionDetails);
      
      // Generate progress-based recommendations
      await this.generateProgressRecommendations(userId, sessionDetails);
      
    } catch (error) {
      console.error('Error processing session completion:', error);
    }
  }

  static async createCustomNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intelligent_notifications')
        .insert({
          user_id: userId,
          notification_type: type,
          title,
          message,
          priority,
          data: data || {}
        });

      return !error;
    } catch (error) {
      console.error('Error creating custom notification:', error);
      return false;
    }
  }

  static async getUserNotifications(userId: string, limit: number = 10): Promise<IntelligentNotification[]> {
    try {
      const { data, error } = await supabase
        .from('intelligent_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        notificationType: notification.notification_type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority as 'low' | 'medium' | 'high',
        data: (typeof notification.data === 'object' && notification.data !== null) ? notification.data as Record<string, any> : {},
        isRead: notification.is_read,
        readAt: notification.read_at ? new Date(notification.read_at) : undefined,
        createdAt: new Date(notification.created_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intelligent_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  private static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high',
    data: Record<string, any>
  ): Promise<void> {
    await supabase
      .from('intelligent_notifications')
      .insert({
        user_id: userId,
        notification_type: type,
        title,
        message,
        priority,
        data
      });
  }

  private static async generateSessionInsights(session: DetailedSession) {
    // Simplified insight generation - in real implementation, this would use ML/AI
    const insights = [];

    if (session.moodAfter && session.moodBefore && session.moodAfter > session.moodBefore) {
      insights.push({
        title: 'Mood Improvement Detected',
        description: `Your mood improved by ${session.moodAfter - session.moodBefore} points during this session`,
        priority: 'medium' as const,
        confidenceScore: 0.85
      });
    }

    if (session.duration && session.duration > 45) {
      insights.push({
        title: 'Extended Session Benefits',
        description: 'Longer sessions often lead to deeper breakthroughs. Consider scheduling more time when possible.',
        priority: 'low' as const,
        confidenceScore: 0.7
      });
    }

    return insights;
  }

  private static async checkForMilestones(userId: string, session: DetailedSession): Promise<void> {
    // Check session count milestones
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('total_sessions')
      .eq('user_id', userId)
      .single();

    if (userStats) {
      const milestones = [5, 10, 25, 50, 100];
      for (const milestone of milestones) {
        if (userStats.total_sessions === milestone) {
          await this.createNotification(
            userId,
            'milestone_achieved',
            `🎉 ${milestone} Sessions Completed!`,
            `Congratulations on completing ${milestone} therapy sessions. You're making great progress!`,
            'high',
            { milestone: 'sessions', count: milestone }
          );
        }
      }
    }
  }

  private static async generateProgressRecommendations(userId: string, session: DetailedSession): Promise<void> {
    // Generate recommendations based on session patterns
    if (session.techniques && session.techniques.length > 0) {
      const mainTechnique = session.techniques[0];
      await this.createNotification(
        userId,
        'progress_update',
        'Technique Suggestion',
        `Based on your recent session, practicing ${mainTechnique} between sessions could enhance your progress.`,
        'medium',
        { technique: mainTechnique, sessionId: session.id }
      );
    }
  }
}