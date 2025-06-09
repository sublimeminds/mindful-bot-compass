
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  sessionReminders: boolean;
  progressUpdates: boolean;
  milestoneNotifications: boolean;
  insightNotifications: boolean;
  streakReminders: boolean;
  dailySummaries: boolean;
  weeklyReports: boolean;
  notificationFrequency: 'minimal' | 'normal' | 'frequent';
  quietHoursStart?: string;
  quietHoursEnd?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationPreferencesService {
  static async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, create default ones
          return await this.createDefaultPreferences(userId);
        }
        console.error('Error fetching notification preferences:', error);
        return null;
      }

      return this.mapToPreferences(data);
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return null;
    }
  }

  static async updatePreferences(
    userId: string,
    preferences: Partial<Omit<NotificationPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          email_notifications: preferences.emailNotifications,
          session_reminders: preferences.sessionReminders,
          progress_updates: preferences.progressUpdates,
          milestone_notifications: preferences.milestoneNotifications,
          insight_notifications: preferences.insightNotifications,
          streak_reminders: preferences.streakReminders,
          daily_summaries: preferences.dailySummaries,
          weekly_reports: preferences.weeklyReports,
          notification_frequency: preferences.notificationFrequency,
          quiet_hours_start: preferences.quietHoursStart,
          quiet_hours_end: preferences.quietHoursEnd
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating notification preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    }
  }

  static async createDefaultPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: userId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating default preferences:', error);
        return null;
      }

      return this.mapToPreferences(data);
    } catch (error) {
      console.error('Error in createDefaultPreferences:', error);
      return null;
    }
  }

  static async shouldSendNotification(
    userId: string,
    notificationType: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'progress_update' | 'streak_reminder'
  ): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) return true; // Default to sending if no preferences

      // Check if it's during quiet hours
      if (this.isQuietHours(preferences)) {
        return false;
      }

      // Check specific notification type preferences
      switch (notificationType) {
        case 'session_reminder':
          return preferences.sessionReminders;
        case 'milestone_achieved':
          return preferences.milestoneNotifications;
        case 'insight_generated':
          return preferences.insightNotifications;
        case 'progress_update':
          return preferences.progressUpdates;
        case 'streak_reminder':
          return preferences.streakReminders;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return true; // Default to sending on error
    }
  }

  private static isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = preferences.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      // Same day range (e.g., 22:00 - 08:00 next day)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Crosses midnight (e.g., 22:00 - 06:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private static mapToPreferences(data: any): NotificationPreferences {
    return {
      id: data.id,
      userId: data.user_id,
      emailNotifications: data.email_notifications,
      sessionReminders: data.session_reminders,
      progressUpdates: data.progress_updates,
      milestoneNotifications: data.milestone_notifications,
      insightNotifications: data.insight_notifications,
      streakReminders: data.streak_reminders,
      dailySummaries: data.daily_summaries,
      weeklyReports: data.weekly_reports,
      notificationFrequency: data.notification_frequency,
      quietHoursStart: data.quiet_hours_start,
      quietHoursEnd: data.quiet_hours_end,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}
