import { supabase } from '@/integrations/supabase/client';

export interface PlatformIntegration {
  id: string;
  userId: string;
  platformType: string;
  platformUserId: string;
  accessTokens: Record<string, any>;
  integrationSettings: Record<string, any>;
  crisisEscalationEnabled: boolean;
  isActive: boolean;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryAttempt {
  platform: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  response: Record<string, any>;
  timestamp: Date;
  deliveryTime?: number;
  errorMessage?: string;
}

export class PlatformIntegrationService {
  /**
   * Get user's platform integrations
   */
  static async getUserIntegrations(userId: string): Promise<PlatformIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      return data.map(integration => ({
        id: integration.id,
        userId: integration.user_id,
        platformType: integration.platform_type,
        platformUserId: integration.platform_user_id,
        accessTokens: integration.access_tokens as Record<string, any>,
        integrationSettings: integration.integration_settings as Record<string, any>,
        crisisEscalationEnabled: integration.crisis_escalation_enabled,
        isActive: integration.is_active,
        lastSync: integration.last_sync ? new Date(integration.last_sync) : undefined,
        createdAt: new Date(integration.created_at),
        updatedAt: new Date(integration.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching user integrations:', error);
      return [];
    }
  }

  /**
   * Add or update platform integration
   */
  static async upsertIntegration(integration: Partial<PlatformIntegration>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .upsert({
          user_id: integration.userId,
          platform_type: integration.platformType,
          platform_user_id: integration.platformUserId || '',
          access_tokens: integration.accessTokens || {},
          integration_settings: integration.integrationSettings || {},
          crisis_escalation_enabled: integration.crisisEscalationEnabled ?? false,
          is_active: integration.isActive ?? true
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error upserting integration:', error);
      return false;
    }
  }

  /**
   * Send notification through specific platform
   */
  static async sendThroughPlatform(
    integration: PlatformIntegration,
    notificationData: {
      title: string;
      message: string;
      data?: Record<string, any>;
      recipient?: string;
    }
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      switch (integration.platformType) {
        case 'email':
          return await this.sendEmail(integration, notificationData);
        case 'sms':
          return await this.sendSMS(integration, notificationData);
        case 'push':
          return await this.sendPushNotification(integration, notificationData);
        case 'webhook':
          return await this.sendWebhook(integration, notificationData);
        case 'slack':
          return await this.sendSlackMessage(integration, notificationData);
        case 'discord':
          return await this.sendDiscordMessage(integration, notificationData);
        case 'whatsapp':
          return await this.sendWhatsAppMessage(integration, notificationData);
        default:
          throw new Error(`Unsupported platform type: ${integration.platformType}`);
      }
    } catch (error) {
      return {
        platform: integration.platformType,
        status: 'failed',
        response: {},
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static async sendEmail(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      // Call Supabase edge function for email sending
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          integrationId: integration.id,
          to: notificationData.recipient,
          subject: notificationData.title,
          content: notificationData.message,
          data: notificationData.data
        }
      });

      if (error) throw error;

      return {
        platform: integration.platformType,
        status: 'sent',
        response: data,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  private static async sendSMS(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('send-sms-notification', {
        body: {
          integrationId: integration.id,
          to: notificationData.recipient,
          message: `${notificationData.title}\n\n${notificationData.message}`,
          data: notificationData.data
        }
      });

      if (error) throw error;

      return {
        platform: integration.platformType,
        status: 'sent',
        response: data,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  private static async sendPushNotification(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          integrationId: integration.id,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data
        }
      });

      if (error) throw error;

      return {
        platform: integration.platformType,
        status: 'sent',
        response: data,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  private static async sendWebhook(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      const webhookUrl = integration.integrationSettings.webhook_url;
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(integration.accessTokens.headers || {})
        },
        body: JSON.stringify({
          title: notificationData.title,
          message: notificationData.message,
          timestamp: new Date().toISOString(),
          data: notificationData.data
        })
      });

      const responseData = await response.json().catch(() => ({}));

      return {
        platform: integration.platformType,
        status: response.ok ? 'sent' : 'failed',
        response: responseData,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  private static async sendSlackMessage(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('send-slack-notification', {
        body: {
          integrationId: integration.id,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data
        }
      });

      if (error) throw error;

      return {
        platform: integration.platformType,
        status: 'sent',
        response: data,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  private static async sendDiscordMessage(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('send-discord-notification', {
        body: {
          integrationId: integration.id,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data
        }
      });

      if (error) throw error;

      return {
        platform: integration.platformType,
        status: 'sent',
        response: data,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  private static async sendWhatsAppMessage(
    integration: PlatformIntegration,
    notificationData: any
  ): Promise<DeliveryAttempt> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          integrationId: integration.id,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data
        }
      });

      if (error) throw error;

      return {
        platform: integration.platformType,
        status: 'sent',
        response: data,
        timestamp: new Date(),
        deliveryTime: Date.now() - startTime
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update usage statistics for an integration (simplified for existing schema)
   */
  static async updateUsageStats(
    integrationId: string,
    deliveryAttempt: DeliveryAttempt
  ): Promise<void> {
    try {
      // Simply update the last_sync timestamp for now
      await supabase
        .from('platform_integrations')
        .update({
          last_sync: new Date().toISOString()
        })
        .eq('id', integrationId);
    } catch (error) {
      console.error('Error updating usage stats:', error);
    }
  }

  /**
   * Check rate limits (simplified - always allow for existing schema)
   */
  static async checkRateLimit(integrationId: string): Promise<boolean> {
    // For existing schema, we don't have rate limiting fields, so always allow
    return true;
  }
}