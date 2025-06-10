
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from './notificationService';
import { NotificationTemplateService } from './notificationTemplateService';

export interface ScheduledNotification {
  id: string;
  userId: string;
  templateId: string;
  scheduledFor: Date;
  variables: Record<string, any>;
  status: 'pending' | 'sent' | 'cancelled';
  createdAt: Date;
}

export class NotificationSchedulerService {
  static async scheduleNotification(
    userId: string,
    templateId: string,
    scheduledFor: Date,
    variables: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: userId,
          template_id: templateId,
          scheduled_for: scheduledFor.toISOString(),
          variables: variables,
          status: 'pending'
        });

      if (error) {
        console.error('Error scheduling notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in scheduleNotification:', error);
      return false;
    }
  }

  static async scheduleSessionReminder(userId: string, scheduledFor: Date): Promise<boolean> {
    const template = await NotificationTemplateService.getTemplateByType('session_reminder');
    if (!template) {
      console.error('Session reminder template not found');
      return false;
    }

    return this.scheduleNotification(userId, template.id, scheduledFor, {
      userName: 'there', // Will be replaced with actual user name
      time: scheduledFor.toLocaleTimeString()
    });
  }

  static async scheduleMoodCheckIn(userId: string, scheduledFor: Date): Promise<boolean> {
    const template = await NotificationTemplateService.getTemplateByType('mood_check');
    if (!template) {
      console.error('Mood check template not found');
      return false;
    }

    return this.scheduleNotification(userId, template.id, scheduledFor);
  }

  static async processPendingNotifications(): Promise<void> {
    try {
      const now = new Date();
      
      const { data: pendingNotifications, error } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', now.toISOString());

      if (error) {
        console.error('Error fetching pending notifications:', error);
        return;
      }

      for (const scheduledNotification of pendingNotifications || []) {
        try {
          // Get the template separately
          const { data: template } = await supabase
            .from('notification_templates')
            .select('*')
            .eq('id', scheduledNotification.template_id)
            .single();

          if (!template) continue;

          const processedContent = NotificationTemplateService.processTemplate(
            {
              id: template.id,
              name: template.name,
              type: template.type as any,
              title: template.title,
              message: template.message,
              priority: template.priority as any,
              variables: template.variables || [],
              isActive: template.is_active,
              createdAt: new Date(template.created_at),
              updatedAt: new Date(template.updated_at)
            },
            (scheduledNotification.variables as Record<string, any>) || {}
          );

          const success = await NotificationService.createNotification(
            scheduledNotification.user_id,
            {
              type: template.type as 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update',
              title: processedContent.title,
              message: processedContent.message,
              priority: template.priority as any,
              data: (scheduledNotification.variables as Record<string, any>) || {}
            }
          );

          if (success) {
            await supabase
              .from('scheduled_notifications')
              .update({ status: 'sent' })
              .eq('id', scheduledNotification.id);
          }
        } catch (error) {
          console.error('Error processing scheduled notification:', error);
        }
      }
    } catch (error) {
      console.error('Error in processPendingNotifications:', error);
    }
  }

  static async getUserScheduledNotifications(userId: string): Promise<ScheduledNotification[]> {
    try {
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching user scheduled notifications:', error);
        return [];
      }

      return data?.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        templateId: notification.template_id,
        scheduledFor: new Date(notification.scheduled_for),
        variables: (notification.variables as Record<string, any>) || {},
        status: notification.status as ScheduledNotification['status'],
        createdAt: new Date(notification.created_at)
      })) || [];
    } catch (error) {
      console.error('Error in getUserScheduledNotifications:', error);
      return [];
    }
  }

  static async cancelScheduledNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .update({ status: 'cancelled' })
        .eq('id', notificationId);

      if (error) {
        console.error('Error cancelling scheduled notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cancelScheduledNotification:', error);
      return false;
    }
  }
}
