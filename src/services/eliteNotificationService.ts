import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 
  | 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update'
  | 'session_followup' | 'technique_suggestion' | 'breathing_reminder' | 'streak_celebration'
  | 'goal_progress' | 'crisis_detected' | 'emergency_contacts' | 'safety_plan_reminder'
  | 'professional_escalation' | 'inactive_user' | 'new_content' | 'community_invite'
  | 'challenge_invitation' | 'cross_platform_sync' | 'integration_status' | 'backup_reminder';

export interface ActionButton {
  text: string;
  action: string;
  style?: 'primary' | 'secondary' | 'destructive';
  deep_link?: string;
}

export interface EnhancedNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  scheduledFor?: Date;
  deepLinkUrl?: string;
  actionButtons?: ActionButton[];
  richContent?: Record<string, any>;
  deliveryChannels?: string[];
  expiresAt?: Date;
  interactionData?: Record<string, any>;
  personalizationScore?: number;
}

export class EliteNotificationService {
  // Deep link URL mapping for different notification types
  private static getDeepLinkUrl(type: NotificationType, data?: Record<string, any>): string {
    const baseRoutes: Record<NotificationType, string> = {
      'mood_check': '/mood-tracker',
      'goal_progress': data?.goalId ? `/goals?id=${data.goalId}` : '/goals',
      'session_reminder': '/therapy-chat',
      'session_followup': '/therapy-chat',
      'milestone_achieved': '/progress-overview',
      'technique_suggestion': '/therapy-chat',
      'breathing_reminder': '/breathing-exercises',
      'community_invite': '/community',
      'crisis_detected': '/crisis-support',
      'emergency_contacts': '/emergency-contacts',
      'safety_plan_reminder': '/safety-plan',
      'professional_escalation': '/professional-support',
      'inactive_user': '/dashboard',
      'new_content': '/content-library',
      'challenge_invitation': '/challenges',
      'streak_celebration': '/progress-overview',
      'insight_generated': '/insights',
      'progress_update': '/progress-overview',
      'cross_platform_sync': '/settings/integrations',
      'integration_status': '/settings/integrations',
      'backup_reminder': '/settings/data'
    };
    
    return baseRoutes[type] || '/dashboard';
  }

  // Generate contextual action buttons for notifications
  private static generateActionButtons(type: NotificationType, data?: Record<string, any>): ActionButton[] {
    const defaultButtons = [
      { text: 'View', action: 'view', style: 'primary' as const, deep_link: this.getDeepLinkUrl(type, data) }
    ];

    const buttonMap: Partial<Record<NotificationType, ActionButton[]>> = {
      'mood_check': [
        { text: 'Log Mood', action: 'log_mood', style: 'primary', deep_link: '/mood-tracker' },
        { text: 'Skip', action: 'dismiss', style: 'secondary' }
      ],
      'session_reminder': [
        { text: 'Start Session', action: 'start_session', style: 'primary', deep_link: '/therapy-chat' },
        { text: 'Reschedule', action: 'reschedule', style: 'secondary' }
      ],
      'breathing_reminder': [
        { text: 'Start Exercise', action: 'start_breathing', style: 'primary', deep_link: '/breathing-exercises' },
        { text: 'Later', action: 'snooze', style: 'secondary' }
      ],
      'milestone_achieved': [
        { text: 'View Progress', action: 'view_progress', style: 'primary', deep_link: '/progress-overview' },
        { text: 'Share Achievement', action: 'share', style: 'secondary' }
      ],
      'crisis_detected': [
        { text: 'Get Help Now', action: 'crisis_support', style: 'destructive', deep_link: '/crisis-support' },
        { text: 'I\'m Safe', action: 'mark_safe', style: 'secondary' }
      ],
      'goal_progress': [
        { text: 'Update Goal', action: 'update_goal', style: 'primary', deep_link: data?.goalId ? `/goals?id=${data.goalId}` : '/goals' },
        { text: 'View All Goals', action: 'view_goals', style: 'secondary', deep_link: '/goals' }
      ],
      'technique_suggestion': [
        { text: 'Try Technique', action: 'try_technique', style: 'primary', deep_link: '/therapy-chat' },
        { text: 'Not Now', action: 'dismiss', style: 'secondary' }
      ],
      'community_invite': [
        { text: 'Join Community', action: 'join_community', style: 'primary', deep_link: '/community' },
        { text: 'Maybe Later', action: 'snooze', style: 'secondary' }
      ]
    };

    return buttonMap[type] || defaultButtons;
  }

  // Create an intelligent notification with enhanced features
  static async createIntelligentNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      priority?: 'low' | 'medium' | 'high';
      data?: Record<string, any>;
      scheduledFor?: Date;
      richContent?: Record<string, any>;
      customActions?: ActionButton[];
    } = {}
  ): Promise<boolean> {
    try {
      const {
        priority = 'medium',
        data = {},
        scheduledFor,
        richContent = {},
        customActions
      } = options;

      const deepLinkUrl = this.getDeepLinkUrl(type, data);
      const actionButtons = customActions || this.generateActionButtons(type, data);

      const { data: notificationResult, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          priority,
          data,
          deep_link_url: deepLinkUrl,
          action_buttons: actionButtons as any,
          delivery_channels: ['in_app'],
          expires_at: new Date(Date.now() + (priority === 'high' ? 7 : priority === 'medium' ? 3 : 1) * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating intelligent notification:', error);
        return false;
      }

      // Track analytics for notification creation
      if (notificationResult) {
        await this.trackNotificationEvent(notificationResult.id, userId, 'created', 'system');
      }

      return true;
    } catch (error) {
      console.error('Error in createIntelligentNotification:', error);
      return false;
    }
  }

  // Get enhanced notifications with all features
  static async getUserNotifications(userId: string, limit: number = 20): Promise<EnhancedNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching enhanced notifications:', error);
        return [];
      }

      return data?.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type as NotificationType,
        title: notification.title,
        message: notification.message,
        data: (notification.data as Record<string, any>) || {},
        isRead: notification.is_read,
        priority: notification.priority as 'low' | 'medium' | 'high',
        createdAt: new Date(notification.created_at),
        scheduledFor: notification.scheduled_for ? new Date(notification.scheduled_for) : undefined,
        deepLinkUrl: notification.deep_link_url,
        actionButtons: (notification.action_buttons as any as ActionButton[]) || [],
        richContent: (notification.rich_content as Record<string, any>) || {},
        deliveryChannels: (notification.delivery_channels as string[]) || ['in_app'],
        expiresAt: notification.expires_at ? new Date(notification.expires_at) : undefined,
        interactionData: (notification.interaction_data as Record<string, any>) || {},
        personalizationScore: notification.personalization_score || 0.5
      })) || [];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  }

  // Handle notification interactions (click, action, etc.)
  static async handleNotificationInteraction(
    notificationId: string,
    userId: string,
    action: string,
    eventData?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Track the interaction
      await this.trackNotificationEvent(notificationId, userId, 'action_taken', 'in_app', {
        action,
        ...eventData
      });

      // Update interaction data
      const { error } = await supabase
        .from('notifications')
        .update({
          interaction_data: {
            last_action: action,
            action_timestamp: new Date().toISOString(),
            ...eventData
          }
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error updating notification interaction:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in handleNotificationInteraction:', error);
      return false;
    }
  }

  // Track notification analytics
  static async trackNotificationEvent(
    notificationId: string,
    userId: string,
    eventType: 'delivered' | 'opened' | 'clicked' | 'dismissed' | 'action_taken' | 'created',
    channel: string = 'in_app',
    eventData?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('notification_analytics')
        .insert({
          notification_id: notificationId,
          user_id: userId,
          event_type: eventType,
          delivery_method: channel,
          metadata: eventData || {}
        });
    } catch (error) {
      console.error('Error tracking notification event:', error);
    }
  }

  // Mark notification as read and track analytics
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      // Track analytics
      await this.trackNotificationEvent(notificationId, userId, 'opened', 'in_app');

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  // Get notification analytics for a user
  static async getNotificationAnalytics(userId: string, days: number = 30) {
    try {
      const { data, error } = await supabase
        .from('notification_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notification analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNotificationAnalytics:', error);
      return [];
    }
  }

  // Get smart notification preferences for a user
  static async getSmartPreferences(userId: string, notificationType: NotificationType) {
    try {
      const { data, error } = await supabase
        .from('smart_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('notification_type', notificationType)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching smart preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSmartPreferences:', error);
      return null;
    }
  }

  // Update smart notification preferences
  static async updateSmartPreferences(
    userId: string,
    notificationType: NotificationType,
    preferences: {
      preferredChannels?: string[];
      preferredTimes?: { start: string; end: string };
      frequencyLimit?: number;
      quietHours?: { start: string; end: string };
      aiOptimizationEnabled?: boolean;
      crisisOverride?: boolean;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('smart_notification_preferences')
        .upsert({
          user_id: userId,
          notification_type: notificationType,
          preferred_channels: preferences.preferredChannels,
          preferred_times: preferences.preferredTimes,
          frequency_limit: preferences.frequencyLimit,
          quiet_hours: preferences.quietHours,
          ai_optimization_enabled: preferences.aiOptimizationEnabled,
          crisis_override: preferences.crisisOverride
        }, {
          onConflict: 'user_id,notification_type'
        });

      if (error) {
        console.error('Error updating smart preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSmartPreferences:', error);
      return false;
    }
  }
}