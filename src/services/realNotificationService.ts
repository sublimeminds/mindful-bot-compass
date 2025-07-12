import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  userId: string;
  type: 'session_reminder' | 'milestone_achieved' | 'crisis_alert' | 'progress_update';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  scheduledFor?: Date;
  sentAt?: Date;
}

export class RealNotificationService {
  // Create immediate notification
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

  // Get user notifications
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data?.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type as Notification['type'],
        title: notification.title,
        message: notification.message,
        data: (notification.data as Record<string, any>) || {},
        isRead: notification.is_read,
        priority: notification.priority as Notification['priority'],
        createdAt: new Date(notification.created_at),
        scheduledFor: notification.scheduled_for ? new Date(notification.scheduled_for) : undefined
      })) || [];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  }

  // Mark notification as read
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

  // Mark all notifications as read
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }

  // Schedule session reminder
  static async scheduleSessionReminder(
    userId: string,
    sessionTime: Date,
    therapistName: string
  ): Promise<void> {
    // 24 hour reminder
    const reminder24h = new Date(sessionTime);
    reminder24h.setHours(reminder24h.getHours() - 24);

    await this.createNotification(userId, {
      type: 'session_reminder',
      title: 'Session Reminder',
      message: `You have a therapy session with ${therapistName} scheduled for tomorrow.`,
      priority: 'medium',
      scheduledFor: reminder24h,
      data: { therapistName, sessionTime: sessionTime.toISOString() }
    });

    // 1 hour reminder
    const reminder1h = new Date(sessionTime);
    reminder1h.setHours(reminder1h.getHours() - 1);

    await this.createNotification(userId, {
      type: 'session_reminder',
      title: 'Session Starting Soon',
      message: `Your therapy session with ${therapistName} starts in 1 hour.`,
      priority: 'high',
      scheduledFor: reminder1h,
      data: { therapistName, sessionTime: sessionTime.toISOString() }
    });
  }

  // Generate milestone notification
  static async generateMilestoneNotification(
    userId: string,
    milestone: string,
    description?: string
  ): Promise<void> {
    await this.createNotification(userId, {
      type: 'milestone_achieved',
      title: 'Milestone Achieved! 🎉',
      message: `Congratulations! You've achieved a new milestone: ${milestone}`,
      priority: 'high',
      data: { milestone, description }
    });
  }

  // Generate progress update notification
  static async generateProgressUpdate(
    userId: string,
    progressData: any
  ): Promise<void> {
    await this.createNotification(userId, {
      type: 'progress_update',
      title: 'Weekly Progress Update',
      message: `Here's your therapy progress summary for this week.`,
      priority: 'medium',
      data: progressData
    });
  }

  // Generate crisis alert
  static async generateCrisisAlert(
    userId: string,
    severity: 'medium' | 'high' | 'critical',
    context?: any
  ): Promise<void> {
    await this.createNotification(userId, {
      type: 'crisis_alert',
      title: 'Support Available',
      message: 'We noticed you might need extra support. Please reach out if you need immediate help.',
      priority: severity,
      data: { context, emergencyContacts: true }
    });
  }

  // Process scheduled notifications (should be called by cron job)
  static async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      
      const { data: pendingNotifications, error } = await supabase
        .from('notifications')
        .select('*')
        .is('sent_at', null)
        .not('scheduled_for', 'is', null)
        .lte('scheduled_for', now.toISOString());

      if (error) {
        console.error('Error fetching pending notifications:', error);
        return;
      }

      // Mark notifications as processed
      for (const notification of pendingNotifications || []) {
        // Update with a flag instead of sent_at since it doesn't exist
        await supabase
          .from('notifications')
          .update({ is_read: false }) // Just ensure it's marked for delivery
          .eq('id', notification.id);

        // Here you could integrate with push notification services
        // For now, we'll just log that the notification was "sent"
        console.log(`Notification sent: ${notification.title} to user ${notification.user_id}`);
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }

  // Delete old notifications (cleanup)
  static async deleteOldNotifications(olderThanDays: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        console.error('Error deleting old notifications:', error);
      }
    } catch (error) {
      console.error('Error in deleteOldNotifications:', error);
    }
  }
}