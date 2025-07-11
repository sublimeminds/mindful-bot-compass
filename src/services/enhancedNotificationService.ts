import { supabase } from '@/integrations/supabase/client';

export interface NotificationType {
  id: string;
  name: string;
  category: 'crisis' | 'therapy' | 'progress' | 'community' | 'integration' | 'administrative';
  priority_weight: number;
  delivery_methods: string[];
  template_variables: string[];
  is_active: boolean;
}

export interface PushSubscription {
  id?: string;
  user_id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
  user_agent?: string;
  is_active: boolean;
}

export interface PlatformIntegration {
  id?: string;
  user_id: string;
  platform_type: 'whatsapp' | 'slack' | 'teams' | 'messenger' | 'discord' | 'telegram' | 'signal';
  platform_user_id?: string;
  access_tokens: Record<string, any>;
  integration_settings: Record<string, any>;
  crisis_escalation_enabled: boolean;
  is_active: boolean;
  last_sync?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  category: string;
  type: string;
  data?: Record<string, any>;
  url?: string;
  icon?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
}

export class EnhancedNotificationService {
  private static vapidPublicKey = 'BH7Cb6Dbs9LUWs6gGf7WQ-oGGNl-Hf8XjX4W8ZBtX0k1D9F5G8b0Qm5K2L8b6T5c4P9E7D3a8B1K5m6W0'; // Would be from environment

  // Get all notification types
  static async getNotificationTypes(): Promise<NotificationType[]> {
    try {
      const { data, error } = await supabase
        .from('notification_types')
        .select('*')
        .eq('is_active', true)
        .order('priority_weight', { ascending: false });

      if (error) throw error;
      return data?.map(type => ({
        ...type,
        category: type.category as NotificationType['category']
      })) || [];
    } catch (error) {
      console.error('Error fetching notification types:', error);
      return [];
    }
  }

  // Request push notification permission
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (!('serviceWorker' in navigator)) {
      console.log('This browser does not support service workers');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Subscribe to push notifications
  static async subscribeToPush(userId: string): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      const pushSubscription: PushSubscription = {
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh_key: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth_key: this.arrayBufferToBase64(subscription.getKey('auth')!),
        user_agent: navigator.userAgent,
        is_active: true
      };

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert([pushSubscription], { 
          onConflict: 'endpoint',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  // Send push notification via edge function
  static async sendPushNotification(
    userId: string, 
    payload: NotificationPayload
  ): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: { userId, payload }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  // Create notification record
  static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<string | null> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          type,
          title,
          message,
          data: data || {},
          read: false
        }])
        .select()
        .single();

      if (error) throw error;
      return notification.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Send multi-platform notification
  static async sendMultiPlatformNotification(
    userId: string,
    payload: NotificationPayload,
    platforms: string[] = ['push']
  ): Promise<void> {
    try {
      // Create notification record
      await this.createNotification(userId, payload.type, payload.title, payload.body, payload.data);

      // Send via requested platforms
      const promises = platforms.map(async (platform) => {
        switch (platform) {
          case 'push':
            return this.sendPushNotification(userId, payload);
          case 'whatsapp':
            return this.sendWhatsAppNotification(userId, payload);
          case 'slack':
            return this.sendSlackNotification(userId, payload);
          case 'teams':
            return this.sendTeamsNotification(userId, payload);
          case 'email':
            return this.sendEmailNotification(userId, payload);
          case 'messenger':
            return this.sendMessengerNotification(userId, payload);
          case 'discord':
            return this.sendDiscordNotification(userId, payload);
          case 'telegram':
            return this.sendTelegramNotification(userId, payload);
          case 'signal':
            return this.sendSignalNotification(userId, payload);
          default:
            return Promise.resolve(false);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending multi-platform notification:', error);
    }
  }

  // Platform-specific notification methods
  private static async sendWhatsAppNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('whatsapp-send-message', {
        body: { 
          userId, 
          message: `${payload.title}\n\n${payload.body}`,
          notificationData: payload
        }
      });
      return !error;
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  }

  private static async sendSlackNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('slack-send-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      return false;
    }
  }

  private static async sendTeamsNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('teams-send-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending Teams notification:', error);
      return false;
    }
  }

  private static async sendEmailNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-email-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  private static async sendMessengerNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('messenger-send-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending Messenger notification:', error);
      return false;
    }
  }

  private static async sendDiscordNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('discord-send-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending Discord notification:', error);
      return false;
    }
  }

  private static async sendTelegramNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('telegram-send-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }

  private static async sendSignalNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('signal-send-notification', {
        body: { userId, payload }
      });
      return !error;
    } catch (error) {
      console.error('Error sending Signal notification:', error);
      return false;
    }
  }

  // Get user's platform integrations
  static async getUserIntegrations(userId: string): Promise<PlatformIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      return data?.map(integration => ({
        ...integration,
        platform_type: integration.platform_type as PlatformIntegration['platform_type'],
        access_tokens: integration.access_tokens as Record<string, any>,
        integration_settings: integration.integration_settings as Record<string, any>
      })) || [];
    } catch (error) {
      console.error('Error fetching user integrations:', error);
      return [];
    }
  }

  // Add platform integration
  static async addPlatformIntegration(integration: Omit<PlatformIntegration, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .upsert([integration], {
          onConflict: 'user_id,platform_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding platform integration:', error);
      return false;
    }
  }

  // Utility functions
  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Crisis notification with immediate delivery
  static async sendCrisisAlert(
    userId: string, 
    message: string, 
    escalationLevel: 'low' | 'medium' | 'high' | 'critical' = 'high'
  ): Promise<void> {
    const payload: NotificationPayload = {
      title: '🚨 Crisis Support Available',
      body: message,
      category: 'crisis',
      type: 'crisis_alert',
      requireInteraction: true,
      tag: `crisis-${escalationLevel}`,
      data: { escalationLevel, timestamp: Date.now() },
      actions: [
        { action: 'emergency', title: 'Get Help Now' },
        { action: 'therapy', title: 'Start Crisis Session' },
        { action: 'resources', title: 'Crisis Resources' }
      ]
    };

    // Get user's preferred crisis platforms
    const integrations = await this.getUserIntegrations(userId);
    const crisisPlatforms = integrations
      .filter(i => i.crisis_escalation_enabled)
      .map(i => i.platform_type);

    // Always include push notifications for crisis
    const platforms = ['push', ...crisisPlatforms];

    await this.sendMultiPlatformNotification(userId, payload, platforms);
  }
}

// Export both class and alias for compatibility
export const enhancedNotificationService = EnhancedNotificationService;
export default EnhancedNotificationService;