import { supabase } from '@/integrations/supabase/client';

export interface CrisisIndicator {
  type: 'mood_decline' | 'stress_spike' | 'isolation_pattern' | 'self_harm_language' | 'hopelessness_expression' | 'substance_mention' | 'trauma_trigger';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence: string[];
  detected_at: string;
  context: string;
}

export interface CrisisAssessment {
  user_id: string;
  overall_risk_level: 'low' | 'moderate' | 'high' | 'critical';
  immediate_risk: boolean;
  indicators: CrisisIndicator[];
  recommendations: string[];
  emergency_contacts_notified: boolean;
  professional_intervention_required: boolean;
  safety_plan_activated: boolean;
  created_at: string;
}

export interface SafetyResource {
  type: 'hotline' | 'text_support' | 'emergency_contact' | 'coping_strategy' | 'safe_location';
  title: string;
  description: string;
  contact_info?: string;
  availability: string;
  immediate_access: boolean;
}

// Export type alias for backward compatibility
export type CrisisResource = SafetyResource;

export class CrisisDetectionService {
  private static readonly CRISIS_KEYWORDS = {
    self_harm: ['hurt myself', 'end it all', 'want to die', 'kill myself', 'not worth living', 'self harm'],
    hopelessness: ['no point', 'nothing matters', 'hopeless', 'give up', 'no future', 'pointless'],
    isolation: ['alone', 'nobody cares', 'isolated', 'no one understands', 'abandoned'],
    substance: ['drinking more', 'using drugs', 'getting high', 'numbing', 'substance'],
    trauma_triggers: ['flashback', 'nightmare', 'triggered', 'trauma', 'ptsd', 'panic attack']
  };

  /**
   * Continuously monitor user data for crisis indicators
   */
  static async performCrisisAssessment(userId: string): Promise<CrisisAssessment | null> {
    try {
      // Gather comprehensive user data
      const [moodData, sessionData, messageData, assignmentData] = await Promise.all([
        this.getRecentMoodData(userId),
        this.getRecentSessionData(userId),
        this.getRecentMessages(userId),
        this.getAssignmentCompletionData(userId)
      ]);

      // Analyze each data source for crisis indicators
      const indicators: CrisisIndicator[] = [];
      
      indicators.push(...this.analyzeMoodPatterns(moodData));
      indicators.push(...this.analyzeSessionContent(sessionData));
      indicators.push(...this.analyzeMessageContent(messageData));
      indicators.push(...this.analyzeEngagementPatterns(assignmentData));

      // Calculate overall risk level
      const overallRisk = this.calculateOverallRisk(indicators);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(indicators, overallRisk);
      
      // Determine intervention needs
      const needsIntervention = this.requiresIntervention(indicators, overallRisk);
      
      if (indicators.length === 0 && overallRisk === 'low') {
        return null; // No crisis indicators detected
      }

      const assessment: CrisisAssessment = {
        user_id: userId,
        overall_risk_level: overallRisk,
        immediate_risk: indicators.some(i => i.severity === 'critical'),
        indicators,
        recommendations,
        emergency_contacts_notified: false,
        professional_intervention_required: needsIntervention,
        safety_plan_activated: false,
        created_at: new Date().toISOString()
      };

      // Store assessment
      await this.storeCrisisAssessment(assessment);
      
      // Trigger interventions if needed
      if (needsIntervention) {
        await this.triggerInterventions(assessment);
      }

      return assessment;
    } catch (error) {
      console.error('Error performing crisis assessment:', error);
      return null; // Return null instead of throwing to prevent UI crashes
    }
  }

  private static async getRecentMoodData(userId: string) {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(14); // 2 weeks

    if (error) {
      console.error('Error fetching mood data:', error);
      return [];
    }
    return data || [];
  }

  private static async getRecentSessionData(userId: string) {
    const { data, error } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching session data:', error);
      return [];
    }
    return data || [];
  }

  private static async getRecentMessages(userId: string) {
    const { data, error } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching message data:', error);
      return [];
    }
    return data || [];
  }

  private static async getAssignmentCompletionData(userId: string) {
    const { data, error } = await supabase
      .from('therapy_assignments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching assignment data:', error);
      return [];
    }
    return data || [];
  }

  private static analyzeMoodPatterns(moodData: any[]): CrisisIndicator[] {
    const indicators: CrisisIndicator[] = [];

    if (moodData.length < 3) return indicators;

    // Check for rapid mood decline
    const recent3 = moodData.slice(0, 3);
    const avg3 = recent3.reduce((sum, entry) => sum + entry.overall, 0) / 3;
    
    if (avg3 < 3) {
      indicators.push({
        type: 'mood_decline',
        severity: avg3 < 2 ? 'critical' : 'high',
        confidence: 0.8,
        evidence: [`Average mood in last 3 entries: ${avg3.toFixed(1)}/10`],
        detected_at: new Date().toISOString(),
        context: 'Sustained low mood pattern detected'
      });
    }

    // Check for stress spikes
    const highStressEntries = moodData.filter(entry => (entry.stress || 5) > 8);
    if (highStressEntries.length >= 3) {
      indicators.push({
        type: 'stress_spike',
        severity: 'high',
        confidence: 0.7,
        evidence: [`${highStressEntries.length} high-stress entries in recent data`],
        detected_at: new Date().toISOString(),
        context: 'Multiple high-stress episodes detected'
      });
    }

    return indicators;
  }

  private static analyzeSessionContent(sessionData: any[]): CrisisIndicator[] {
    const indicators: CrisisIndicator[] = [];

    for (const session of sessionData) {
      const notes = session.notes || '';
      const techniques = (session.techniques || []).join(' ');
      const content = (notes + ' ' + techniques).toLowerCase();

      // Check for crisis keywords
      for (const [category, keywords] of Object.entries(this.CRISIS_KEYWORDS)) {
        const foundKeywords = keywords.filter(keyword => content.includes(keyword));
        
        if (foundKeywords.length > 0) {
          indicators.push({
            type: category as any,
            severity: this.determineSeverityFromKeywords(foundKeywords, category),
            confidence: 0.6 + (foundKeywords.length * 0.1),
            evidence: foundKeywords,
            detected_at: session.created_at,
            context: `Keywords detected in therapy session`
          });
        }
      }
    }

    return indicators;
  }

  private static analyzeMessageContent(messageData: any[]): CrisisIndicator[] {
    const indicators: CrisisIndicator[] = [];

    for (const message of messageData) {
      const content = message.content.toLowerCase();
      const emotionalContext = message.emotional_context || {};

      // High-intensity negative emotions
      if (emotionalContext.intensity > 8 && 
          ['despair', 'hopeless', 'suicidal', 'rage'].includes(emotionalContext.primary_emotion)) {
        indicators.push({
          type: 'hopelessness_expression',
          severity: 'critical',
          confidence: 0.9,
          evidence: [`High intensity ${emotionalContext.primary_emotion} (${emotionalContext.intensity}/10)`],
          detected_at: message.created_at,
          context: 'Intense negative emotional expression'
        });
      }

      // Crisis language detection
      for (const [category, keywords] of Object.entries(this.CRISIS_KEYWORDS)) {
        const foundKeywords = keywords.filter(keyword => content.includes(keyword));
        
        if (foundKeywords.length > 0) {
          indicators.push({
            type: category as any,
            severity: this.determineSeverityFromKeywords(foundKeywords, category),
            confidence: 0.7,
            evidence: foundKeywords,
            detected_at: message.created_at,
            context: `Crisis language in conversation memory`
          });
        }
      }
    }

    return indicators;
  }

  private static analyzeEngagementPatterns(assignmentData: any[]): CrisisIndicator[] {
    const indicators: CrisisIndicator[] = [];

    // Check for sudden disengagement
    const completionRate = assignmentData.length > 0 ? 
      assignmentData.filter(a => a.completed_at).length / assignmentData.length : 1;

    if (completionRate < 0.2 && assignmentData.length >= 3) {
      indicators.push({
        type: 'isolation_pattern',
        severity: 'medium',
        confidence: 0.6,
        evidence: [`Low assignment completion rate: ${(completionRate * 100).toFixed(0)}%`],
        detected_at: new Date().toISOString(),
        context: 'Sudden disengagement from therapy activities'
      });
    }

    return indicators;
  }

  private static determineSeverityFromKeywords(keywords: string[], category: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalKeywords = ['kill myself', 'end it all', 'want to die'];
    const highKeywords = ['hurt myself', 'self harm', 'no point', 'hopeless'];

    if (keywords.some(k => criticalKeywords.includes(k))) return 'critical';
    if (keywords.some(k => highKeywords.includes(k))) return 'high';
    if (keywords.length > 2) return 'medium';
    return 'low';
  }

  private static calculateOverallRisk(indicators: CrisisIndicator[]): 'low' | 'moderate' | 'high' | 'critical' {
    if (indicators.some(i => i.severity === 'critical')) return 'critical';
    
    const highCount = indicators.filter(i => i.severity === 'high').length;
    const mediumCount = indicators.filter(i => i.severity === 'medium').length;
    
    if (highCount >= 2) return 'high';
    if (highCount >= 1 || mediumCount >= 3) return 'moderate';
    
    return 'low';
  }

  private static generateRecommendations(indicators: CrisisIndicator[], riskLevel: string): string[] {
    const recommendations = [];

    if (riskLevel === 'critical') {
      recommendations.push('Immediate crisis intervention required');
      recommendations.push('Contact emergency services if imminent danger');
      recommendations.push('Activate safety plan immediately');
      recommendations.push('Notify emergency contacts');
    } else if (riskLevel === 'high') {
      recommendations.push('Schedule urgent therapy session within 24 hours');
      recommendations.push('Increase monitoring frequency');
      recommendations.push('Review and update safety plan');
      recommendations.push('Consider temporary increase in support');
    } else if (riskLevel === 'moderate') {
      recommendations.push('Schedule therapy session within 48-72 hours');
      recommendations.push('Provide additional coping resources');
      recommendations.push('Monitor mood patterns closely');
      recommendations.push('Encourage use of support network');
    }

    return recommendations;
  }

  private static requiresIntervention(indicators: CrisisIndicator[], riskLevel: string): boolean {
    return riskLevel === 'critical' || riskLevel === 'high' ||
           indicators.some(i => i.type === 'self_harm_language' && i.severity !== 'low');
  }

  private static async storeCrisisAssessment(assessment: CrisisAssessment) {
    try {
      const { error } = await supabase
        .from('crisis_interventions')
        .insert({
          user_id: assessment.user_id,
          intervention_type: 'assessment',
          status: 'pending',
          intervention_data: assessment as any
        });

      if (error) console.error('Error storing crisis assessment:', error);
    } catch (error) {
      console.error('Error in storeCrisisAssessment:', error);
    }
  }

  private static async triggerInterventions(assessment: CrisisAssessment) {
    try {
      console.log('Crisis intervention triggered for user:', assessment.user_id);
      console.log('Risk level:', assessment.overall_risk_level);
      
      // Ensure crisis resources are available
      await this.ensureCrisisResourcesAvailable(assessment.user_id);
      
    } catch (error) {
      console.error('Error triggering interventions:', error);
    }
  }

  /**
   * Get immediate crisis resources for user
   */
  static async getCrisisResources(userId: string): Promise<SafetyResource[]> {
    const resources: SafetyResource[] = [
      {
        type: 'hotline',
        title: 'National Suicide Prevention Lifeline',
        description: '24/7 crisis support for anyone in emotional distress or suicidal crisis',
        contact_info: '988',
        availability: '24/7',
        immediate_access: true
      },
      {
        type: 'text_support',
        title: 'Crisis Text Line',
        description: 'Free, 24/7 crisis support via text message',
        contact_info: 'Text HOME to 741741',
        availability: '24/7',
        immediate_access: true
      },
      {
        type: 'emergency_contact',
        title: 'Emergency Services',
        description: 'Call for immediate emergency assistance',
        contact_info: '911',
        availability: '24/7',
        immediate_access: true
      }
    ];

    try {
      // Get user's personal emergency contacts
      const { data: emergencyContacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      emergencyContacts?.forEach(contact => {
        resources.push({
          type: 'emergency_contact',
          title: contact.name,
          description: `Personal emergency contact - ${contact.relationship}`,
          contact_info: contact.phone_number || contact.email,
          availability: 'As available',
          immediate_access: true
        });
      });
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }

    return resources;
  }

  private static async ensureCrisisResourcesAvailable(userId: string) {
    try {
      const resources = await this.getCrisisResources(userId);
      console.log(`Crisis resources prepared for user ${userId}:`, resources.length, 'resources available');
    } catch (error) {
      console.error('Error ensuring crisis resources:', error);
    }
  }

  /**
   * Analyze crisis level from message content (for backward compatibility)
   */
  static async analyzeCrisisLevel(message: string): Promise<'low' | 'moderate' | 'high' | 'critical'> {
    try {
      const content = message.toLowerCase();
      
      // Check for critical keywords
      const criticalKeywords = ['kill myself', 'end it all', 'want to die', 'suicide'];
      if (criticalKeywords.some(keyword => content.includes(keyword))) {
        return 'critical';
      }
      
      // Check for high risk keywords
      const highKeywords = ['hurt myself', 'self harm', 'hopeless', 'no point'];
      if (highKeywords.some(keyword => content.includes(keyword))) {
        return 'high';
      }
      
      // Check for moderate risk
      const moderateKeywords = ['depressed', 'anxious', 'overwhelmed', 'stressed'];
      if (moderateKeywords.some(keyword => content.includes(keyword))) {
        return 'moderate';
      }
      
      return 'low';
    } catch (error) {
      console.error('Error analyzing crisis level:', error);
      return 'low';
    }
  }

  /**
   * Generate crisis response based on risk level (for backward compatibility)
   */
  static async generateCrisisResponse(riskLevel: 'low' | 'moderate' | 'high' | 'critical'): Promise<string> {
    try {
      const responses = {
        critical: "I'm very concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to the National Suicide Prevention Lifeline at 988 or emergency services at 911. You don't have to go through this alone.",
        high: "I hear that you're going through a really difficult time. It's important that we connect you with additional support. Please consider reaching out to a crisis helpline at 988 or speaking with a mental health professional today.",
        moderate: "It sounds like you're dealing with some challenging feelings. Remember that it's okay to ask for help, and there are people who want to support you. Would you like some coping strategies or resources?",
        low: "I understand you're facing some difficulties. It's great that you're reaching out and talking about how you're feeling. That takes courage."
      };
      
      return responses[riskLevel] || responses.low;
    } catch (error) {
      console.error('Error generating crisis response:', error);
      return "I'm here to support you. If you're in crisis, please reach out to 988 or emergency services.";
    }
  }

  /**
   * Check if user needs immediate intervention
   */
  static async checkForImmediateRisk(userId: string): Promise<boolean> {
    try {
      const assessment = await this.performCrisisAssessment(userId);
      return assessment?.immediate_risk || false;
    } catch (error) {
      console.error('Error checking immediate risk:', error);
      return false;
    }
  }
}