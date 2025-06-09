
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  userId: string;
  type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  scheduledFor?: Date;
}

export class NotificationService {
  static async createNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          priority: notification.priority,
          scheduled_for: notification.scheduledFor?.toISOString()
        });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return false;
    }
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data?.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        isRead: notification.is_read,
        priority: notification.priority,
        createdAt: new Date(notification.created_at),
        scheduledFor: notification.scheduled_for ? new Date(notification.scheduled_for) : undefined
      })) || [];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  static async generateSessionReminder(userId: string): Promise<void> {
    await this.createNotification(userId, {
      type: 'session_reminder',
      title: 'Time for Your Therapy Session',
      message: 'Take a few minutes to check in with yourself and practice some mindfulness.',
      priority: 'medium',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });
  }

  static async generateMilestoneNotification(userId: string, milestone: string): Promise<void> {
    await this.createNotification(userId, {
      type: 'milestone_achieved',
      title: 'Milestone Achieved! 🎉',
      message: `Congratulations! You've reached a new milestone: ${milestone}`,
      priority: 'high',
      data: { milestone }
    });
  }

  static async generateInsightNotification(userId: string, insight: string): Promise<void> {
    await this.createNotification(userId, {
      type: 'insight_generated',
      title: 'New Insight Available',
      message: `We've discovered a new pattern in your progress: ${insight}`,
      priority: 'medium',
      data: { insight }
    });
  }
}
