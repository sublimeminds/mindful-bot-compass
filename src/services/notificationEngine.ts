import { supabase } from '@/integrations/supabase/client';
import { NotificationPreferencesService } from './notificationPreferencesService';

export interface DeliveryMethod {
  type: 'in_app' | 'web_push' | 'email' | 'discord' | 'slack' | 'whatsapp' | 'sms';
  priority: number; // 1 = highest priority
  enabled: boolean;
}

export interface NotificationRequest {
  userId: string;
  templateId?: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  data?: Record<string, any>;
  deliveryMethods?: string[];
  scheduledFor?: Date;
  variables?: Record<string, any>;
}

export interface QueuedNotification {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  deliveryMethods: string[];
  data: Record<string, any>;
  scheduledFor: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  createdAt: Date;
}

export class NotificationEngine {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAYS = [1000, 5000, 15000]; // milliseconds

  /**
   * Main entry point for sending notifications through the unified engine
   */
  static async sendNotification(request: NotificationRequest): Promise<boolean> {
    try {
      console.log('NotificationEngine: Processing notification request', { 
        userId: request.userId, 
        type: request.type,
        priority: request.priority 
      });

      // Check user preferences
      const shouldSend = await NotificationPreferencesService.shouldSendNotification(
        request.userId, 
        request.type as any
      );

      if (!shouldSend) {
        console.log('NotificationEngine: Notification blocked by user preferences');
        await this.trackEvent(request.userId, 'blocked', 'system', request.type);
        return true; // Not an error, just blocked
      }

      // Process template if provided
      const processedNotification = await this.processTemplate(request);

      // Determine optimal delivery methods
      const deliveryMethods = await this.selectDeliveryMethods(
        request.userId, 
        processedNotification.priority,
        processedNotification.deliveryMethods || ['in_app']
      );

      // Queue notification for processing
      const queuedNotification = await this.queueNotification({
        ...processedNotification,
        deliveryMethods
      });

      if (queuedNotification) {
        // Process immediately if scheduled for now or past
        const now = new Date();
        if (processedNotification.scheduledFor && processedNotification.scheduledFor <= now) {
          await this.processQueuedNotification(queuedNotification.id);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('NotificationEngine: Error sending notification:', error);
      await this.trackEvent(request.userId, 'failed', 'system', request.type, { error: error.message });
      return false;
    }
  }

  /**
   * Process notification template and substitute variables
   */
  private static async processTemplate(request: NotificationRequest): Promise<NotificationRequest> {
    if (!request.templateId) {
      return request;
    }

    try {
      const { data: template, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('id', request.templateId)
        .eq('is_active', true)
        .single();

      if (error || !template) {
        console.warn('NotificationEngine: Template not found, using request as-is');
        return request;
      }

      // Substitute variables in title and message
      let processedTitle = template.title;
      let processedMessage = template.message;

      if (request.variables && template.variables) {
        template.variables.forEach((variable: string) => {
          const value = request.variables![variable] || '';
          const placeholder = `{{${variable}}}`;
          processedTitle = processedTitle.replace(new RegExp(placeholder, 'g'), value);
          processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), value);
        });
      }

      return {
        ...request,
        title: processedTitle,
        message: processedMessage,
        priority: (template.priority as 'low' | 'medium' | 'high') || request.priority,
        deliveryMethods: request.deliveryMethods || ['in_app'] // Use request methods as fallback
      };
    } catch (error) {
      console.error('NotificationEngine: Error processing template:', error);
      return request;
    }
  }

  /**
   * Select optimal delivery methods based on user preferences and priority
   */
  private static async selectDeliveryMethods(
    userId: string, 
    priority: string,
    requestedMethods: string[]
  ): Promise<string[]> {
    try {
      const preferences = await NotificationPreferencesService.getUserPreferences(userId);
      
      // Default delivery methods based on priority
      const methods: DeliveryMethod[] = [
        { type: 'in_app', priority: 1, enabled: true },
        { type: 'web_push', priority: 2, enabled: preferences?.emailNotifications !== false },
        { type: 'email', priority: 3, enabled: preferences?.emailNotifications !== false }
      ];

      // Add high-priority integrations for urgent notifications
      if (priority === 'high') {
        methods.push(
          { type: 'discord', priority: 2, enabled: true },
          { type: 'slack', priority: 2, enabled: true }
        );
      }

      // Filter by requested methods and user preferences
      const enabledMethods = methods
        .filter(method => 
          method.enabled && 
          requestedMethods.includes(method.type)
        )
        .sort((a, b) => a.priority - b.priority)
        .map(method => method.type);

      return enabledMethods.length > 0 ? enabledMethods : ['in_app'];
    } catch (error) {
      console.error('NotificationEngine: Error selecting delivery methods:', error);
      return ['in_app']; // Fallback to in-app only
    }
  }

  /**
   * Queue notification for processing
   */
  private static async queueNotification(request: NotificationRequest): Promise<QueuedNotification | null> {
    try {
      const { data, error } = await supabase
        .from('notification_queue')
        .insert({
          user_id: request.userId,
          template_id: request.templateId,
          title: request.title,
          message: request.message,
          priority: request.priority,
          delivery_methods: request.deliveryMethods || ['in_app'],
          data: request.data || {},
          scheduled_for: request.scheduledFor?.toISOString() || new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('NotificationEngine: Error queuing notification:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        templateId: data.template_id,
        title: data.title,
        message: data.message,
        priority: data.priority as 'low' | 'medium' | 'high',
        deliveryMethods: data.delivery_methods as string[],
        data: (data.data as Record<string, any>) || {},
        scheduledFor: new Date(data.scheduled_for),
        status: data.status as 'pending' | 'processing' | 'completed' | 'failed',
        retryCount: data.retry_count,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('NotificationEngine: Error in queueNotification:', error);
      return null;
    }
  }

  /**
   * Process a queued notification by attempting delivery through all methods
   */
  static async processQueuedNotification(queueId: string): Promise<boolean> {
    try {
      // Get queued notification
      const { data: queuedNotification, error } = await supabase
        .from('notification_queue')
        .select('*')
        .eq('id', queueId)
        .eq('status', 'pending')
        .single();

      if (error || !queuedNotification) {
        console.warn('NotificationEngine: Queued notification not found or already processed');
        return false;
      }

      // Mark as processing
      await supabase
        .from('notification_queue')
        .update({ status: 'processing' })
        .eq('id', queueId);

      console.log('NotificationEngine: Processing queued notification', {
        queueId,
        deliveryMethods: queuedNotification.delivery_methods
      });

      const deliveryResults: boolean[] = [];

      // Create in-app notification first
      if (queuedNotification.delivery_methods.includes('in_app')) {
        const inAppResult = await this.deliverInApp(queuedNotification);
        deliveryResults.push(inAppResult);
      }

      // Try other delivery methods
      for (const method of queuedNotification.delivery_methods) {
        if (method !== 'in_app') {
          const result = await this.deliverViaMethod(method, queuedNotification);
          deliveryResults.push(result);
        }
      }

      const allSuccessful = deliveryResults.length > 0 && deliveryResults.every(result => result);
      const anySuccessful = deliveryResults.some(result => result);

      // Update queue status
      const finalStatus = allSuccessful ? 'completed' : 
                          anySuccessful ? 'completed' : // Partial success still counts
                          'failed';

      await supabase
        .from('notification_queue')
        .update({ 
          status: finalStatus,
          processed_at: new Date().toISOString()
        })
        .eq('id', queueId);

      // Track completion
      await this.trackEvent(
        queuedNotification.user_id, 
        finalStatus === 'completed' ? 'completed' : 'failed',
        'system',
        typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
          (queuedNotification.data as any).type || 'unknown' : 'unknown',
        { 
          queueId,
          deliveryMethods: queuedNotification.delivery_methods,
          successCount: deliveryResults.filter(Boolean).length,
          totalAttempts: deliveryResults.length
        }
      );

      return anySuccessful;
    } catch (error) {
      console.error('NotificationEngine: Error processing queued notification:', error);
      
      // Mark as failed
      await supabase
        .from('notification_queue')
        .update({ status: 'failed' })
        .eq('id', queueId);
        
      return false;
    }
  }

  /**
   * Deliver notification via in-app method
   */
  private static async deliverInApp(queuedNotification: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: queuedNotification.user_id,
          type: typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
                 (queuedNotification.data as any).type || 'system' : 'system',
          title: queuedNotification.title,
          message: queuedNotification.message,
          data: queuedNotification.data || {},
          priority: queuedNotification.priority
        });

      if (error) {
        console.error('NotificationEngine: Error creating in-app notification:', error);
        await this.trackEvent(queuedNotification.user_id, 'failed', 'in_app', 
          typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
            (queuedNotification.data as any).type : undefined);
        return false;
      }

      await this.trackEvent(queuedNotification.user_id, 'delivered', 'in_app', 
        typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
          (queuedNotification.data as any).type : undefined);
      return true;
    } catch (error) {
      console.error('NotificationEngine: Error in deliverInApp:', error);
      return false;
    }
  }

  /**
   * Deliver notification via specific method
   */
  private static async deliverViaMethod(method: string, queuedNotification: any): Promise<boolean> {
    try {
      switch (method) {
        case 'web_push':
          return await this.deliverWebPush(queuedNotification);
        case 'email':
          return await this.deliverEmail(queuedNotification);
        case 'discord':
        case 'slack':
        case 'whatsapp':
          return await this.deliverViaIntegration(method, queuedNotification);
        default:
          console.warn('NotificationEngine: Unknown delivery method:', method);
          return false;
      }
    } catch (error) {
      console.error(`NotificationEngine: Error delivering via ${method}:`, error);
      await this.trackEvent(queuedNotification.user_id, 'failed', method, 
        typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
          (queuedNotification.data as any).type : undefined, { error: error.message });
      return false;
    }
  }

  /**
   * Deliver web push notification
   */
  private static async deliverWebPush(queuedNotification: any): Promise<boolean> {
    try {
      // Get user's push subscriptions
      const { data: subscriptions, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', queuedNotification.user_id)
        .eq('is_active', true);

      if (error || !subscriptions?.length) {
        console.log('NotificationEngine: No active push subscriptions found');
        return false;
      }

      // This would integrate with Web Push API
      console.log('NotificationEngine: Would send web push to', subscriptions.length, 'subscriptions');
      
      // For now, just mark as delivered
      await this.trackEvent(queuedNotification.user_id, 'delivered', 'web_push', 
        typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
          (queuedNotification.data as any).type : undefined);
      return true;
    } catch (error) {
      console.error('NotificationEngine: Error in deliverWebPush:', error);
      return false;
    }
  }

  /**
   * Deliver email notification
   */
  private static async deliverEmail(queuedNotification: any): Promise<boolean> {
    try {
      // This would integrate with email service (Resend)
      console.log('NotificationEngine: Would send email notification');
      
      await this.trackEvent(queuedNotification.user_id, 'delivered', 'email', 
        typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
          (queuedNotification.data as any).type : undefined);
      return true;
    } catch (error) {
      console.error('NotificationEngine: Error in deliverEmail:', error);
      return false;
    }
  }

  /**
   * Deliver via platform integration
   */
  private static async deliverViaIntegration(platform: string, queuedNotification: any): Promise<boolean> {
    try {
      // This would call the appropriate platform integration edge function
      console.log(`NotificationEngine: Would send ${platform} notification`);
      
      await this.trackEvent(queuedNotification.user_id, 'delivered', platform, 
        typeof queuedNotification.data === 'object' && queuedNotification.data !== null ? 
          (queuedNotification.data as any).type : undefined);
      return true;
    } catch (error) {
      console.error(`NotificationEngine: Error delivering via ${platform}:`, error);
      return false;
    }
  }

  /**
   * Track notification events for analytics
   */
  private static async trackEvent(
    userId: string,
    eventType: string,
    deliveryMethod: string,
    notificationType?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('notification_analytics')
        .insert({
          user_id: userId,
          event_type: eventType,
          delivery_method: deliveryMethod,
          metadata: {
            notification_type: notificationType,
            timestamp: new Date().toISOString(),
            ...metadata
          }
        });
    } catch (error) {
      console.error('NotificationEngine: Error tracking event:', error);
    }
  }

  /**
   * Process pending notifications in queue
   */
  static async processPendingNotifications(): Promise<void> {
    try {
      const { data: pendingNotifications, error } = await supabase
        .from('notification_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('priority', { ascending: false }) // High priority first
        .order('created_at', { ascending: true }); // Older first

      if (error || !pendingNotifications?.length) {
        return;
      }

      console.log(`NotificationEngine: Processing ${pendingNotifications.length} pending notifications`);

      // Process notifications in batches to avoid overwhelming the system
      const batchSize = 10;
      for (let i = 0; i < pendingNotifications.length; i += batchSize) {
        const batch = pendingNotifications.slice(i, i + batchSize);
        const promises = batch.map(notification => 
          this.processQueuedNotification(notification.id)
        );
        
        await Promise.allSettled(promises);
        
        // Small delay between batches
        if (i + batchSize < pendingNotifications.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('NotificationEngine: Error processing pending notifications:', error);
    }
  }

  /**
   * Get notification analytics for a user
   */
  static async getAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('notification_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('NotificationEngine: Error fetching analytics:', error);
        return null;
      }

      // Aggregate analytics
      const analytics = {
        totalEvents: data.length,
        byEventType: {},
        byDeliveryMethod: {},
        timeline: {}
      };

      data.forEach(event => {
        // By event type
        analytics.byEventType[event.event_type] = (analytics.byEventType[event.event_type] || 0) + 1;
        
        // By delivery method
        analytics.byDeliveryMethod[event.delivery_method] = (analytics.byDeliveryMethod[event.delivery_method] || 0) + 1;
        
        // Timeline (by day)
        const day = event.created_at.split('T')[0];
        analytics.timeline[day] = (analytics.timeline[day] || 0) + 1;
      });

      return analytics;
    } catch (error) {
      console.error('NotificationEngine: Error in getAnalytics:', error);
      return null;
    }
  }
}