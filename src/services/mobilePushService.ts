
export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
}

export class MobilePushService {
  private static VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // Would be from env

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

  static async subscribeToPush(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY)
      });

      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return null;
    }
  }

  static async unsubscribeFromPush(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        return await subscription.unsubscribe();
      }
      
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  }

  static async sendLocalNotification(payload: PushNotificationPayload): Promise<void> {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: payload.badge,
        data: payload.data,
        requireInteraction: payload.requireInteraction,
        silent: payload.silent,
        tag: payload.tag
      });
    }
  }

  static async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  static async checkNotificationSupport(): Promise<{
    supported: boolean;
    permission: NotificationPermission;
    serviceWorkerSupported: boolean;
    pushSupported: boolean;
  }> {
    return {
      supported: 'Notification' in window,
      permission: 'Notification' in window ? Notification.permission : 'denied',
      serviceWorkerSupported: 'serviceWorker' in navigator,
      pushSupported: 'PushManager' in window
    };
  }

  // Utility methods
  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
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
}
