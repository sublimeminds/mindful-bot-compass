import { supabase } from '@/integrations/supabase/client';

export interface WhatsAppIntegration {
  id: string;
  user_id: string;
  phone_number: string;
  is_verified: boolean;
  verification_code?: string;
  webhook_url?: string;
  api_token?: string;
  preferences: Record<string, any>;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  integration_id: string;
  user_id: string;
  content: string;
  sender_type: 'user' | 'ai';
  message_type: 'text' | 'audio' | 'image';
  delivery_status: 'sent' | 'delivered' | 'read' | 'failed';
  ai_response_metadata?: Record<string, any>;
  therapy_session_id?: string;
  timestamp: string;
}

class WhatsAppIntegrationService {
  async createIntegration(
    userId: string,
    phoneNumber: string,
    preferences: Record<string, any> = {}
  ): Promise<WhatsAppIntegration> {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const integrationData = {
        user_id: userId,
        phone_number: phoneNumber,
        verification_code: verificationCode,
        preferences: {
          auto_responses: true,
          crisis_escalation: true,
          business_hours_only: false,
          response_delay: 2,
          ...preferences
        }
      };

      const { data, error } = await supabase
        .from('whatsapp_integrations')
        .insert(integrationData)
        .select()
        .single();

      if (error) throw error;

      // Send verification code via WhatsApp
      await this.sendVerificationCode(phoneNumber, verificationCode);

      return {
        ...data,
        preferences: data.preferences as Record<string, any>
      };
    } catch (error) {
      console.error('Error creating WhatsApp integration:', error);
      throw error;
    }
  }

  async verifyPhoneNumber(integrationId: string, code: string): Promise<boolean> {
    try {
      const { data: integration, error: fetchError } = await supabase
        .from('whatsapp_integrations')
        .select('verification_code')
        .eq('id', integrationId)
        .single();

      if (fetchError) throw fetchError;

      if (integration.verification_code === code) {
        const { error: updateError } = await supabase
          .from('whatsapp_integrations')
          .update({
            is_verified: true,
            verification_code: null
          })
          .eq('id', integrationId);

        if (updateError) throw updateError;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying phone number:', error);
      throw error;
    }
  }

  async sendMessage(
    integrationId: string,
    content: string,
    messageType: 'text' | 'audio' | 'image' = 'text'
  ): Promise<WhatsAppMessage> {
    try {
      const { data: integration, error: fetchError } = await supabase
        .from('whatsapp_integrations')
        .select('*')
        .eq('id', integrationId)
        .single();

      if (fetchError) throw fetchError;

      if (!integration.is_verified) {
        throw new Error('WhatsApp integration not verified');
      }

      // Create message record
      const messageData = {
        integration_id: integrationId,
        user_id: integration.user_id,
        content,
        sender_type: 'ai' as const,
        message_type: messageType,
        delivery_status: 'sent' as const
      };

      const { data: message, error: messageError } = await supabase
        .from('whatsapp_messages')
        .insert(messageData)
        .select()
        .single();

      if (messageError) throw messageError;

      // Send via WhatsApp API (would use actual WhatsApp Business API)
      await this.sendWhatsAppMessage(integration.phone_number, content, messageType);

      return {
        ...message,
        sender_type: message.sender_type as 'user' | 'ai',
        message_type: message.message_type as 'text' | 'audio' | 'image',
        delivery_status: message.delivery_status as 'sent' | 'delivered' | 'read' | 'failed',
        ai_response_metadata: message.ai_response_metadata as Record<string, any>
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async processIncomingMessage(
    phoneNumber: string,
    content: string,
    messageType: 'text' | 'audio' | 'image' = 'text'
  ): Promise<void> {
    try {
      // Find integration by phone number
      const { data: integration, error: fetchError } = await supabase
        .from('whatsapp_integrations')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('is_verified', true)
        .single();

      if (fetchError) throw fetchError;

      // Save incoming message
      const messageData = {
        integration_id: integration.id,
        user_id: integration.user_id,
        content,
        sender_type: 'user' as const,
        message_type: messageType,
        delivery_status: 'delivered' as const
      };

      const { data: message, error: messageError } = await supabase
        .from('whatsapp_messages')
        .insert(messageData)
        .select()
        .single();

      if (messageError) throw messageError;

      // Check for crisis indicators
      const crisisCheck = await this.checkForCrisisIndicators(content);
      
      if (crisisCheck.requiresEscalation) {
        await this.handleCrisisEscalation(integration.user_id, content);
      }

      // Generate AI response if auto-responses enabled
      const preferences = integration.preferences as Record<string, any>;
      if (preferences.auto_responses) {
        await this.generateAIResponse(integration, content);
      }

      // Update last activity
      await supabase
        .from('whatsapp_integrations')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', integration.id);

    } catch (error) {
      console.error('Error processing incoming WhatsApp message:', error);
    }
  }

  private async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    // In a real implementation, this would use WhatsApp Business API
    console.log(`Sending verification code ${code} to ${phoneNumber}`);
    
    // For demo, we'll simulate this
    // await whatsappAPI.sendMessage(phoneNumber, `Your verification code is: ${code}`);
  }

  private async sendWhatsAppMessage(
    phoneNumber: string,
    content: string,
    messageType: string
  ): Promise<void> {
    // In a real implementation, this would use WhatsApp Business API
    console.log(`Sending ${messageType} message to ${phoneNumber}: ${content}`);
    
    // await whatsappAPI.sendMessage(phoneNumber, content, messageType);
  }

  private async checkForCrisisIndicators(content: string): Promise<{ requiresEscalation: boolean }> {
    const crisisKeywords = ['suicide', 'kill myself', 'hurt myself', 'end it all'];
    const requiresEscalation = crisisKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    return { requiresEscalation };
  }

  private async handleCrisisEscalation(userId: string, content: string): Promise<void> {
    // Create crisis alert
    await supabase
      .from('crisis_alerts')
      .insert({
        user_id: userId,
        alert_type: 'whatsapp_crisis',
        severity_level: 'high',
        ai_confidence: 0.8,
        trigger_data: { message_content: content, platform: 'whatsapp' }
      });

    // Send immediate crisis resources
    await supabase
      .from('intelligent_notifications')
      .insert({
        user_id: userId,
        notification_type: 'crisis_support',
        title: 'Crisis Support Available',
        message: 'We noticed you might need immediate support. Crisis counselors are available 24/7.',
        priority: 'high',
        data: { crisis_resources: true }
      });
  }

  private async generateAIResponse(integration: WhatsAppIntegration, userMessage: string): Promise<void> {
    try {
      // Get conversation context
      const { data: recentMessages } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('integration_id', integration.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      // Generate AI response (would use actual AI service)
      const aiResponse = await this.generateTherapeuticResponse(userMessage, recentMessages || []);

      // Send AI response with delay
      const delay = integration.preferences.response_delay || 2;
      setTimeout(async () => {
        await this.sendMessage(integration.id, aiResponse);
      }, delay * 1000);

    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  }

  private async generateTherapeuticResponse(userMessage: string, context: any[]): Promise<string> {
    // This would integrate with your AI therapy service
    // For now, return a supportive response
    const supportiveResponses = [
      "I hear you, and I'm here to support you through this.",
      "Thank you for sharing that with me. How are you feeling right now?",
      "That sounds challenging. What would be most helpful for you today?",
      "I appreciate your openness. Let's explore this together.",
      "You're not alone in this. What's one small step you could take today?"
    ];

    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  }

  async getUserIntegration(userId: string): Promise<WhatsAppIntegration | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_verified', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        preferences: data.preferences as Record<string, any>
      };
    } catch (error) {
      console.error('Error fetching WhatsApp integration:', error);
      return null;
    }
  }

  async getMessages(integrationId: string, limit: number = 50): Promise<WhatsAppMessage[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('integration_id', integrationId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      return (data || []).map(message => ({
        ...message,
        sender_type: message.sender_type as 'user' | 'ai',
        message_type: message.message_type as 'text' | 'audio' | 'image',
        delivery_status: message.delivery_status as 'sent' | 'delivered' | 'read' | 'failed',
        ai_response_metadata: message.ai_response_metadata as Record<string, any>
      }));
    } catch (error) {
      console.error('Error fetching WhatsApp messages:', error);
      return [];
    }
  }
}

export const whatsappIntegrationService = new WhatsAppIntegrationService();