
import { supabase } from '@/integrations/supabase/client';

export interface CrisisDetection {
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  indicators: string[];
  recommendations: string[];
  requiresImmediate: boolean;
  confidenceScore: number;
}

export interface SafetyPlanStep {
  step: number;
  title: string;
  description: string;
  actions: string[];
}

class RealCrisisService {
  private crisisKeywords = {
    crisis: ['suicide', 'kill myself', 'end it all', 'want to die', 'better off dead'],
    high: ['hopeless', 'worthless', 'trapped', 'unbearable', 'can\'t go on'],
    moderate: ['overwhelmed', 'desperate', 'lost', 'breaking point', 'give up'],
    selfHarm: ['cut myself', 'hurt myself', 'self harm', 'self-harm', 'cutting']
  };

  async detectCrisisInMessage(message: string, userId: string): Promise<CrisisDetection> {
    try {
      const messageText = message.toLowerCase();
      let riskLevel: 'low' | 'moderate' | 'high' | 'crisis' = 'low';
      const indicators: string[] = [];
      let confidenceScore = 0;

      // Check for crisis keywords
      for (const keyword of this.crisisKeywords.crisis) {
        if (messageText.includes(keyword)) {
          riskLevel = 'crisis';
          indicators.push(`Suicidal ideation detected: "${keyword}"`);
          confidenceScore += 0.9;
        }
      }

      // Check for self-harm indicators
      for (const keyword of this.crisisKeywords.selfHarm) {
        if (messageText.includes(keyword)) {
          riskLevel = riskLevel === 'crisis' ? 'crisis' : 'high';
          indicators.push(`Self-harm indication: "${keyword}"`);
          confidenceScore += 0.8;
        }
      }

      // Check for high-risk keywords
      if (riskLevel !== 'crisis') {
        for (const keyword of this.crisisKeywords.high) {
          if (messageText.includes(keyword)) {
            riskLevel = riskLevel === 'low' ? 'high' : riskLevel;
            indicators.push(`High-risk indicator: "${keyword}"`);
            confidenceScore += 0.6;
          }
        }
      }

      // Check for moderate risk keywords
      if (riskLevel === 'low') {
        for (const keyword of this.crisisKeywords.moderate) {
          if (messageText.includes(keyword)) {
            riskLevel = 'moderate';
            indicators.push(`Moderate-risk indicator: "${keyword}"`);
            confidenceScore += 0.4;
          }
        }
      }

      // Get user's recent crisis history
      const recentCrisisHistory = await this.getRecentCrisisHistory(userId);
      if (recentCrisisHistory.length > 0 && riskLevel !== 'low') {
        confidenceScore += 0.3;
        indicators.push('Recent crisis history increases risk level');
      }

      // Adjust confidence score
      confidenceScore = Math.min(confidenceScore, 1.0);

      const recommendations = this.generateRecommendations(riskLevel, indicators);
      const requiresImmediate = riskLevel === 'crisis' || riskLevel === 'high';

      // Log the crisis assessment
      if (riskLevel !== 'low') {
        await this.logCrisisAssessment(userId, riskLevel, indicators, confidenceScore, message);
      }

      return {
        riskLevel,
        indicators,
        recommendations,
        requiresImmediate,
        confidenceScore
      };
    } catch (error) {
      console.error('Error detecting crisis:', error);
      return {
        riskLevel: 'low',
        indicators: [],
        recommendations: ['Continue supportive conversation'],
        requiresImmediate: false,
        confidenceScore: 0
      };
    }
  }

  async createSafetyPlan(userId: string): Promise<SafetyPlanStep[]> {
    try {
      // Check if user already has a safety plan
      const { data: existingPlan } = await supabase
        .from('safety_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (existingPlan) {
        return this.formatSafetyPlan(existingPlan);
      }

      // Create a new safety plan template
      const defaultPlan = {
        user_id: userId,
        plan_name: 'My Safety Plan',
        warning_signs: [
          'Feeling hopeless or worthless',
          'Thoughts of suicide or self-harm',
          'Extreme mood changes',
          'Withdrawing from others'
        ],
        coping_strategies: [
          'Call a trusted friend or family member',
          'Practice deep breathing exercises',
          'Go for a walk or do light exercise',
          'Listen to calming music'
        ],
        reasons_to_live: [
          'My family and friends care about me',
          'I have goals I want to achieve',
          'Things can get better with help',
          'I matter and my life has value'
        ],
        social_contacts: {
          emergency: '988',
          family: '',
          friend: '',
          therapist: ''
        },
        professional_contacts: {
          crisis_line: '988 Suicide & Crisis Lifeline',
          emergency: '911',
          mental_health_provider: ''
        },
        environment_safety: [
          'Remove or secure means of self-harm',
          'Stay in safe, public places when distressed',
          'Ask someone to stay with me if needed'
        ]
      };

      const { data: newPlan } = await supabase
        .from('safety_plans')
        .insert(defaultPlan)
        .select()
        .single();

      return this.formatSafetyPlan(newPlan);
    } catch (error) {
      console.error('Error creating safety plan:', error);
      return this.getDefaultSafetySteps();
    }
  }

  async triggerCrisisIntervention(userId: string, riskLevel: string, context: string): Promise<void> {
    try {
      // Create crisis intervention record
      await supabase.from('crisis_interventions').insert({
        user_id: userId,
        intervention_type: riskLevel === 'crisis' ? 'immediate' : 'support',
        intervention_data: {
          context,
          timestamp: new Date().toISOString(),
          auto_triggered: true
        },
        status: 'active'
      });

      // If crisis level, also create immediate follow-up tasks
      if (riskLevel === 'crisis') {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'crisis_support',
          title: '🚨 Crisis Support Available',
          message: 'Immediate help is available. You are not alone.',
          priority: 'high',
          data: {
            crisis_resources: [
              { name: '988 Suicide & Crisis Lifeline', phone: '988', availability: '24/7' },
              { name: 'Crisis Text Line', phone: 'Text HOME to 741741', availability: '24/7' },
              { name: 'Emergency Services', phone: '911', availability: '24/7' }
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error triggering crisis intervention:', error);
    }
  }

  private async getRecentCrisisHistory(userId: string): Promise<any[]> {
    const { data } = await supabase
      .from('crisis_assessments')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  }

  private async logCrisisAssessment(
    userId: string, 
    riskLevel: string, 
    indicators: string[], 
    confidenceScore: number,
    originalMessage: string
  ): Promise<void> {
    try {
      await supabase.from('crisis_assessments').insert({
        user_id: userId,
        assessment_type: 'ai_detected',
        risk_level: riskLevel,
        severity_indicators: indicators,
        responses: {
          original_message: originalMessage,
          confidence_score: confidenceScore,
          detected_at: new Date().toISOString()
        },
        status: riskLevel === 'crisis' ? 'requires_immediate_attention' : 'monitored'
      });
    } catch (error) {
      console.error('Error logging crisis assessment:', error);
    }
  }

  private generateRecommendations(riskLevel: string, indicators: string[]): string[] {
    const baseRecommendations = [];

    switch (riskLevel) {
      case 'crisis':
        baseRecommendations.push(
          'Contact 988 Suicide & Crisis Lifeline immediately',
          'Reach out to emergency services if in immediate danger',
          'Connect with a trusted friend or family member right now',
          'Go to your nearest emergency room if you have a plan to hurt yourself'
        );
        break;
      case 'high':
        baseRecommendations.push(
          'Consider contacting a crisis helpline: 988',
          'Reach out to your therapist or mental health provider',
          'Connect with a trusted support person',
          'Use your safety plan if you have one'
        );
        break;
      case 'moderate':
        baseRecommendations.push(
          'Practice grounding techniques or deep breathing',
          'Reach out to a friend or family member',
          'Consider scheduling a therapy session',
          'Engage in self-care activities'
        );
        break;
      default:
        baseRecommendations.push(
          'Continue with regular self-care practices',
          'Keep tracking your mood and feelings',
          'Maintain your support network connections'
        );
    }

    return baseRecommendations;
  }

  private formatSafetyPlan(plan: any): SafetyPlanStep[] {
    return [
      {
        step: 1,
        title: 'Recognize Warning Signs',
        description: 'Identify when you might be in crisis',
        actions: plan.warning_signs || []
      },
      {
        step: 2,
        title: 'Use Coping Strategies',
        description: 'Things you can do to help yourself feel better',
        actions: plan.coping_strategies || []
      },
      {
        step: 3,
        title: 'Contact Support People',
        description: 'People you can reach out to for help',
        actions: Object.values(plan.social_contacts || {}).filter(Boolean)
      },
      {
        step: 4,
        title: 'Contact Professionals',
        description: 'Professional help available to you',
        actions: Object.values(plan.professional_contacts || {}).filter(Boolean)
      },
      {
        step: 5,
        title: 'Make Environment Safe',
        description: 'Remove or reduce access to means of self-harm',
        actions: plan.environment_safety || []
      },
      {
        step: 6,
        title: 'Reasons for Living',
        description: 'Remember what makes life worth living',
        actions: plan.reasons_to_live || []
      }
    ];
  }

  private getDefaultSafetySteps(): SafetyPlanStep[] {
    return [
      {
        step: 1,
        title: 'Recognize Warning Signs',
        description: 'Identify when you might be in crisis',
        actions: ['Feeling hopeless', 'Thoughts of self-harm', 'Extreme mood changes']
      },
      {
        step: 2,
        title: 'Use Coping Strategies',
        description: 'Things you can do to help yourself feel better',
        actions: ['Deep breathing', 'Call a friend', 'Go for a walk']
      },
      {
        step: 3,
        title: 'Get Immediate Help',
        description: 'Crisis resources available 24/7',
        actions: ['988 Suicide & Crisis Lifeline', 'Text HOME to 741741', 'Call 911']
      }
    ];
  }
}

export const realCrisisService = new RealCrisisService();
