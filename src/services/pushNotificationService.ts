import { supabase } from '@/integrations/supabase/client';

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dhKey: string;
  authKey: string;
  userAgent?: string;
  lastUsedAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  silent?: boolean;
  timestamp?: number;
  requireInteraction?: boolean;
}

export class PushNotificationService {
  private static readonly VAPID_PUBLIC_KEY = 'BKGECrC8Yt8TqLW4kLtEYL8wOj6o9zqGxWCZjCwPyZ_UtVJeZwTL1v8P';

  /**
   * Request notification permission and register service worker
   */
  static async requestPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      if (!('serviceWorker' in navigator)) {
        console.warn('This browser does not support service workers');
        return false;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');

      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Subscribe user to push notifications
   */
  static async subscribe(userId: string): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Create push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY)
      });

      // Save subscription to database
      const subscriptionData = subscription.toJSON();
      
      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: userId,
          endpoint: subscription.endpoint,
          p256dh_key: subscriptionData.keys?.p256dh || '',
          auth_key: subscriptionData.keys?.auth || '',
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error saving push subscription:', error);
        return false;
      }

      console.log('Push subscription saved successfully');
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  static async unsubscribe(userId: string): Promise<boolean> {
    try {
      // Unsubscribe from browser
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Deactivate all subscriptions in database
      const { error } = await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (error) {
        console.error('Error deactivating push subscriptions:', error);
        return false;
      }

      console.log('Push subscription removed successfully');
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  /**
   * Check if user has active push subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1);

      if (error) {
        console.error('Error checking push subscription:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasActiveSubscription:', error);
      return false;
    }
  }

  /**
   * Send push notification to user
   */
  static async sendNotification(
    userId: string, 
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      // Get user's active subscriptions
      const { data: subscriptions, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !subscriptions?.length) {
        console.log('No active push subscriptions found for user');
        return false;
      }

      // Send notification to all active subscriptions
      const results = await Promise.allSettled(
        subscriptions.map(subscription => 
          this.sendToSubscription(subscription, payload)
        )
      );

      // Check if at least one notification was sent successfully
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length;

      console.log(`Push notification sent to ${successCount}/${subscriptions.length} subscriptions`);
      return successCount > 0;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  /**
   * Send notification to specific subscription
   */
  private static async sendToSubscription(
    subscription: any, 
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      // This would typically be done server-side with VAPID keys
      // For now, we'll use the browser's notification API as a fallback
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/icon-192x192.png',
          badge: payload.badge || '/badge.png',
          data: payload.data,
          requireInteraction: payload.requireInteraction || false,
          silent: payload.silent || false
        });

        // Update last used timestamp
        await supabase
          .from('push_subscriptions')
          .update({ last_used_at: new Date().toISOString() } as any)
          .eq('id', subscription.id);

        // Auto-close notification after 5 seconds unless requireInteraction is true
        if (!payload.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 5000);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error sending to subscription:', error);
      
      // Mark subscription as inactive if it's invalid
      if (error.name === 'NotificationAPIError' || error.message.includes('invalid')) {
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('id', subscription.id);
      }
      
      return false;
    }
  }

  /**
   * Show therapy-specific notification types
   */
  static async showSessionReminder(
    userId: string,
    sessionTime: string,
    therapistName?: string
  ): Promise<boolean> {
    return this.sendNotification(userId, {
      title: 'Therapy Session Reminder',
      body: `Your session ${therapistName ? `with ${therapistName}` : ''} is starting at ${sessionTime}`,
      icon: '/therapy-icon.png',
      actions: [
        { action: 'join', title: 'Join Session', icon: '/join-icon.png' },
        { action: 'reschedule', title: 'Reschedule', icon: '/reschedule-icon.png' }
      ],
      data: { type: 'session_reminder', sessionTime },
      requireInteraction: true
    });
  }

  static async showMilestoneAchieved(
    userId: string,
    milestone: string
  ): Promise<boolean> {
    return this.sendNotification(userId, {
      title: 'Milestone Achieved! 🎉',
      body: `Congratulations! You've reached: ${milestone}`,
      icon: '/achievement-icon.png',
      actions: [
        { action: 'view', title: 'View Progress', icon: '/progress-icon.png' },
        { action: 'share', title: 'Share Achievement', icon: '/share-icon.png' }
      ],
      data: { type: 'milestone_achieved', milestone },
      requireInteraction: true
    });
  }

  static async showMoodCheckIn(userId: string): Promise<boolean> {
    return this.sendNotification(userId, {
      title: 'Mood Check-In',
      body: 'How are you feeling today? Take a moment to log your mood.',
      icon: '/mood-icon.png',
      actions: [
        { action: 'checkin', title: 'Log Mood', icon: '/mood-log-icon.png' },
        { action: 'later', title: 'Remind Later', icon: '/later-icon.png' }
      ],
      data: { type: 'mood_check' }
    });
  }

  static async showInsightAvailable(
    userId: string,
    insight: string
  ): Promise<boolean> {
    return this.sendNotification(userId, {
      title: 'New Insight Available',
      body: `We've discovered something interesting about your progress: ${insight.substring(0, 80)}...`,
      icon: '/insight-icon.png',
      actions: [
        { action: 'view', title: 'View Insight', icon: '/view-icon.png' }
      ],
      data: { type: 'insight_generated', insight }
    });
  }

  /**
   * Cleanup inactive subscriptions
   */
  static async cleanupInactiveSubscriptions(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .lt('last_used_at', thirtyDaysAgo.toISOString())
        .eq('is_active', true);

      if (error) {
        console.error('Error cleaning up inactive subscriptions:', error);
      } else {
        console.log('Cleaned up inactive push subscriptions');
      }
    } catch (error) {
      console.error('Error in cleanupInactiveSubscriptions:', error);
    }
  }

  /**
   * Helper function to convert VAPID key
   */
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
}