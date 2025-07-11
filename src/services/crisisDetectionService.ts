import { supabase } from '@/integrations/supabase/client';

export interface CrisisAlert {
  id: string;
  user_id: string;
  session_id?: string;
  alert_type: string;
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  ai_confidence: number;
  trigger_data: Record<string, any>;
  escalated_to?: string;
  resolution_status: 'pending' | 'escalated' | 'resolved' | 'false_positive';
  resolved_at?: string;
  created_at: string;
}

export interface CrisisIndicators {
  crisis_score: number;
  indicators: string[];
  confidence: number;
  requires_escalation: boolean;
}

export interface SafetyResource {
  id: string;
  name: string;
  title: string;
  phone_number?: string;
  website_url?: string;
  description?: string;
  availability?: string;
  resource_type: string;
  contact_info?: {
    phone: string;
    website: string;
  };
  immediate_access?: boolean;
}

export interface CrisisIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

class CrisisDetectionService {
  private crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
    'want to die', 'not worth living', 'better off dead', 'no point',
    'hopeless', 'can\'t go on', 'overwhelming pain'
  ];

  async detectCrisisRisk(
    userId: string,
    sessionId: string,
    messages: string[],
    moodData: Record<string, any>
  ): Promise<CrisisIndicators> {
    try {
      // Get user history for context
      const { data: userHistory } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Call database function for crisis detection
      const { data: indicators, error } = await supabase
        .rpc('detect_crisis_indicators', {
          session_messages: messages,
          mood_data: moodData,
          user_history: userHistory || {}
        });

      if (error) throw error;

      // If crisis detected, create alert
      const crisisData = indicators as any;
      if (crisisData.requires_escalation) {
        await this.createCrisisAlert(userId, sessionId, crisisData);
      }

      return crisisData as CrisisIndicators;
    } catch (error) {
      console.error('Error analyzing crisis risk:', error);
      // Fallback to client-side detection
      return this.fallbackCrisisDetection(messages, moodData);
    }
  }

  private async createCrisisAlert(
    userId: string,
    sessionId: string,
    indicators: CrisisIndicators
  ): Promise<void> {
    try {
      const alertData = {
        user_id: userId,
        session_id: sessionId,
        alert_type: 'crisis_detected',
        severity_level: this.getSeverityLevel(indicators.crisis_score),
        ai_confidence: indicators.confidence,
        trigger_data: {
          indicators: indicators.indicators,
          crisis_score: indicators.crisis_score,
          timestamp: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('crisis_alerts')
        .insert(alertData);

      if (error) throw error;

      // Send immediate notification to crisis team
      await this.escalateCrisis(alertData);
    } catch (error) {
      console.error('Error creating crisis alert:', error);
    }
  }

  private async escalateCrisis(alertData: any): Promise<void> {
    try {
      // Create immediate notification
      const { error } = await supabase
        .from('intelligent_notifications')
        .insert({
          user_id: alertData.user_id,
          notification_type: 'crisis_alert',
          title: 'Crisis Support Available',
          message: 'We noticed you might be going through a difficult time. Professional support is available 24/7.',
          priority: 'high',
          data: {
            crisis_resources: true,
            immediate_support: true,
            emergency_contacts: true
          }
        });

      if (error) throw error;

      // In a real implementation, this would also:
      // - Send SMS to crisis counselor
      // - Create escalation ticket
      // - Trigger immediate intervention workflow
    } catch (error) {
      console.error('Error escalating crisis:', error);
    }
  }

  private fallbackCrisisDetection(
    messages: string[],
    moodData: Record<string, any>
  ): CrisisIndicators {
    let score = 0;
    const indicators: string[] = [];

    // Check for crisis keywords
    const messageText = messages.join(' ').toLowerCase();
    for (const keyword of this.crisisKeywords) {
      if (messageText.includes(keyword)) {
        score += 0.3;
        indicators.push('crisis_language');
        break;
      }
    }

    // Check mood data
    const currentMood = moodData.current_mood || 5;
    if (currentMood <= 2) {
      score += 0.4;
      indicators.push('very_low_mood');
    }

    const confidence = Math.min(1.0, messages.length * 0.1 + 0.3);

    return {
      crisis_score: Math.min(1.0, score),
      indicators,
      confidence,
      requires_escalation: score > 0.6
    };
  }

  private getSeverityLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  async getCrisisAlerts(userId: string): Promise<CrisisAlert[]> {
    try {
      const { data, error } = await supabase
        .from('crisis_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(alert => ({
        ...alert,
        severity_level: alert.severity_level as 'low' | 'medium' | 'high' | 'critical',
        resolution_status: alert.resolution_status as 'pending' | 'escalated' | 'resolved' | 'false_positive',
        trigger_data: (typeof alert.trigger_data === 'string' ? JSON.parse(alert.trigger_data) : alert.trigger_data) || {}
      }));
    } catch (error) {
      console.error('Error fetching crisis alerts:', error);
      return [];
    }
  }

  async analyzeCrisisLevel(messages: string[]): Promise<number> {
    const indicators = this.fallbackCrisisDetection(messages, {});
    return indicators.crisis_score;
  }

  async generateCrisisResponse(messages: string[]): Promise<string> {
    const score = await this.analyzeCrisisLevel(messages);
    if (score > 0.6) {
      return "I'm here to support you. If you're having thoughts of self-harm, please reach out to a crisis helpline immediately. Your safety is the priority.";
    }
    return "I understand you're going through a difficult time. Let's talk about how you're feeling.";
  }

  async getCrisisResources(): Promise<SafetyResource[]> {
    try {
      const { data, error } = await supabase
        .from('crisis_resources')
        .select('*')
        .eq('is_active', true)
        .order('priority_order');

      if (error) throw error;

      return (data || []).map(resource => ({
        id: resource.id,
        name: resource.name,
        title: resource.name,
        phone_number: resource.phone_number,
        website_url: resource.website_url,
        description: resource.description,
        availability: resource.availability,
        resource_type: resource.resource_type,
        contact_info: {
          phone: resource.phone_number || '',
          website: resource.website_url || ''
        },
        immediate_access: resource.resource_type === 'hotline'
      }));
    } catch (error) {
      console.error('Error fetching crisis resources:', error);
      return [];
    }
  }

  async resolveCrisisAlert(alertId: string, resolution: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('crisis_alerts')
        .update({
          resolution_status: 'resolved',
          resolved_at: new Date().toISOString(),
          escalated_to: resolution
        })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resolving crisis alert:', error);
      throw error;
    }
  }
}

export const crisisDetectionService = new CrisisDetectionService();
export { CrisisDetectionService };