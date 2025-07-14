
import { supabase } from '@/integrations/supabase/client';

export interface CrisisAssessment {
  id: string;
  user_id: string;
  assessment_type: string;
  risk_level: string;
  responses: Record<string, any>;
  total_score: number | null;
  severity_indicators: string[] | null;
  immediate_actions_taken: string[] | null;
  professional_contact_made: boolean;
  emergency_services_contacted: boolean;
  follow_up_scheduled: boolean;
  follow_up_date: string | null;
  counselor_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  contact_type: string;
  name: string;
  phone_number: string | null;
  email: string | null;
  relationship: string | null;
  is_primary: boolean;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrisisResource {
  id: string;
  name: string;
  resource_type: string;
  phone_number: string | null;
  website_url: string | null;
  description: string | null;
  availability: string | null;
  target_demographics: string[] | null;
  specialties: string[] | null;
  geographic_coverage: string | null;
  language_support: string[] | null;
  is_active: boolean;
  priority_order: number;
  created_at: string;
  updated_at: string;
}

export interface SafetyPlan {
  id: string;
  user_id: string;
  plan_name: string;
  warning_signs: string[] | null;
  coping_strategies: string[] | null;
  social_contacts: Record<string, any>;
  professional_contacts: Record<string, any>;
  environment_safety: string[] | null;
  reasons_to_live: string[] | null;
  is_active: boolean;
  last_reviewed: string;
  created_at: string;
  updated_at: string;
}

export interface CrisisIntervention {
  id: string;
  user_id: string;
  crisis_assessment_id: string | null;
  intervention_type: string;
  intervention_data: Record<string, any>;
  status: string;
  response_time_minutes: number | null;
  outcome: string | null;
  follow_up_required: boolean;
  created_at: string;
  completed_at: string | null;
}

export class CrisisManagementService {
  // Helper methods to transform data
  private static transformCrisisAssessment(data: any): CrisisAssessment {
    return {
      ...data,
      responses: typeof data.responses === 'string' ? JSON.parse(data.responses) : data.responses || {}
    };
  }

  private static transformSafetyPlan(data: any): SafetyPlan {
    return {
      ...data,
      social_contacts: typeof data.social_contacts === 'string' ? JSON.parse(data.social_contacts) : data.social_contacts || {},
      professional_contacts: typeof data.professional_contacts === 'string' ? JSON.parse(data.professional_contacts) : data.professional_contacts || {}
    };
  }

  private static transformCrisisIntervention(data: any): CrisisIntervention {
    return {
      ...data,
      intervention_data: typeof data.intervention_data === 'string' ? JSON.parse(data.intervention_data) : data.intervention_data || {}
    };
  }

  // Crisis Assessments
  static async createCrisisAssessment(assessmentData: Partial<CrisisAssessment>): Promise<CrisisAssessment | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('crisis_assessments')
        .insert({
          user_id: user.user.id,
          assessment_type: assessmentData.assessment_type || 'self_harm',
          risk_level: assessmentData.risk_level || 'low',
          responses: assessmentData.responses || {},
          total_score: assessmentData.total_score,
          severity_indicators: assessmentData.severity_indicators,
          immediate_actions_taken: assessmentData.immediate_actions_taken,
          professional_contact_made: assessmentData.professional_contact_made || false,
          emergency_services_contacted: assessmentData.emergency_services_contacted || false,
          follow_up_scheduled: assessmentData.follow_up_scheduled || false,
          follow_up_date: assessmentData.follow_up_date,
          counselor_notes: assessmentData.counselor_notes,
          status: assessmentData.status || 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformCrisisAssessment(data);
    } catch (error) {
      console.error('Error creating crisis assessment:', error);
      return null;
    }
  }

  static async getUserCrisisAssessments(userId?: string): Promise<CrisisAssessment[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const targetUserId = userId || user.user.id;

      const { data, error } = await supabase
        .from('crisis_assessments')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(this.transformCrisisAssessment) || [];
    } catch (error) {
      console.error('Error fetching crisis assessments:', error);
      return [];
    }
  }

  static async updateCrisisAssessment(assessmentId: string, updates: Partial<CrisisAssessment>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('crisis_assessments')
        .update(updates)
        .eq('id', assessmentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating crisis assessment:', error);
      return false;
    }
  }

  // Emergency Contacts
  static async createEmergencyContact(contactData: Partial<EmergencyContact>): Promise<EmergencyContact | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.user.id,
          contact_type: contactData.contact_type || 'personal',
          name: contactData.name || '',
          phone_number: contactData.phone_number,
          email: contactData.email,
          relationship: contactData.relationship,
          is_primary: contactData.is_primary || false,
          is_active: contactData.is_active !== false,
          notes: contactData.notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating emergency contact:', error);
      return null;
    }
  }

  static async getUserEmergencyContacts(): Promise<EmergencyContact[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      return [];
    }
  }

  static async updateEmergencyContact(contactId: string, updates: Partial<EmergencyContact>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', contactId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating emergency contact:', error);
      return false;
    }
  }

  static async deleteEmergencyContact(contactId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      return false;
    }
  }

  // Crisis Resources with Translation Support
  static async getCrisisResources(filters?: { resourceType?: string; specialty?: string; userLanguage?: string; culturalContext?: string }): Promise<CrisisResource[]> {
    try {
      let query = supabase
        .from('crisis_resources')
        .select('*')
        .eq('is_active', true)
        .order('priority_order', { ascending: true });

      if (filters?.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }

      if (filters?.specialty) {
        query = query.contains('specialties', [filters.specialty]);
      }

      // Filter by language support if specified
      if (filters?.userLanguage && filters.userLanguage !== 'en') {
        query = query.contains('language_support', [filters.userLanguage]);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let resources = data || [];

      // Translate resource content if needed
      if (filters?.userLanguage && filters.userLanguage !== 'en' && resources.length > 0) {
        try {
          const textsToTranslate = resources.flatMap(resource => [
            resource.name,
            resource.description || ''
          ]).filter(text => text.length > 0);

          const { data: translationData, error: translationError } = await supabase.functions.invoke('ai-translate', {
            body: {
              texts: textsToTranslate,
              targetLanguage: filters.userLanguage,
              context: 'crisis_support',
              culturalContext: filters.culturalContext
            }
          });

          if (!translationError && translationData) {
            const translations = translationData.translations;
            let translationIndex = 0;

            resources = resources.map(resource => ({
              ...resource,
              name: translations[translationIndex++] || resource.name,
              description: resource.description ? (translations[translationIndex++] || resource.description) : resource.description
            }));
          }
        } catch (translationError) {
          console.error('Error translating crisis resources:', translationError);
          // Continue with original resources if translation fails
        }
      }

      return resources;
    } catch (error) {
      console.error('Error fetching crisis resources:', error);
      return [];
    }
  }

  // Safety Plans
  static async createSafetyPlan(planData: Partial<SafetyPlan>): Promise<SafetyPlan | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('safety_plans')
        .insert({
          user_id: user.user.id,
          plan_name: planData.plan_name || 'My Safety Plan',
          warning_signs: planData.warning_signs,
          coping_strategies: planData.coping_strategies,
          social_contacts: planData.social_contacts || {},
          professional_contacts: planData.professional_contacts || {},
          environment_safety: planData.environment_safety,
          reasons_to_live: planData.reasons_to_live,
          is_active: planData.is_active !== false
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformSafetyPlan(data);
    } catch (error) {
      console.error('Error creating safety plan:', error);
      return null;
    }
  }

  static async getUserSafetyPlans(): Promise<SafetyPlan[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('safety_plans')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(this.transformSafetyPlan) || [];
    } catch (error) {
      console.error('Error fetching safety plans:', error);
      return [];
    }
  }

  static async updateSafetyPlan(planId: string, updates: Partial<SafetyPlan>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('safety_plans')
        .update({
          ...updates,
          last_reviewed: new Date().toISOString()
        })
        .eq('id', planId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating safety plan:', error);
      return false;
    }
  }

  // Crisis Interventions
  static async createCrisisIntervention(interventionData: Partial<CrisisIntervention>): Promise<CrisisIntervention | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('crisis_interventions')
        .insert({
          user_id: user.user.id,
          crisis_assessment_id: interventionData.crisis_assessment_id,
          intervention_type: interventionData.intervention_type || 'automated_response',
          intervention_data: interventionData.intervention_data || {},
          status: interventionData.status || 'pending',
          response_time_minutes: interventionData.response_time_minutes,
          outcome: interventionData.outcome,
          follow_up_required: interventionData.follow_up_required || false
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformCrisisIntervention(data);
    } catch (error) {
      console.error('Error creating crisis intervention:', error);
      return null;
    }
  }

  static async updateCrisisIntervention(interventionId: string, updates: Partial<CrisisIntervention>): Promise<boolean> {
    try {
      const updateData: any = { ...updates };
      
      if (updates.status === 'completed' && !updates.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('crisis_interventions')
        .update(updateData)
        .eq('id', interventionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating crisis intervention:', error);
      return false;
    }
  }

  // Risk Assessment and Crisis Detection
  static calculateRiskScore(responses: Record<string, any>, assessmentType: string): number {
    let score = 0;
    const maxScore = 100;

    switch (assessmentType) {
      case 'suicide':
        score += (responses.suicidal_thoughts || 0) * 20;
        score += (responses.suicide_plan || 0) * 25;
        score += (responses.previous_attempts || 0) * 15;
        score += (responses.substance_use || 0) * 10;
        score -= (responses.support_system || 0) * 5;
        break;
      
      case 'self_harm':
        score += (responses.self_harm_frequency || 0) * 20;
        score += (responses.self_harm_severity || 0) * 15;
        score += (responses.emotional_distress || 0) * 15;
        score += (responses.impulse_control || 0) * 10;
        break;
      
      case 'substance_abuse':
        score += (responses.usage_frequency || 0) * 20;
        score += (responses.withdrawal_symptoms || 0) * 15;
        score += (responses.life_impact || 0) * 15;
        score += (responses.previous_treatment || 0) * 10;
        break;
      
      default:
        // General mental health assessment
        score += (responses.depression_level || 0) * 15;
        score += (responses.anxiety_level || 0) * 15;
        score += (responses.sleep_issues || 0) * 10;
        score += (responses.appetite_changes || 0) * 10;
        break;
    }

    return Math.max(0, Math.min(maxScore, score));
  }

  static determineRiskLevel(score: number): string {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  static getSeverityIndicators(responses: Record<string, any>, assessmentType: string): string[] {
    const indicators: string[] = [];

    if (assessmentType === 'suicide') {
      if (responses.suicidal_thoughts >= 4) indicators.push('active_suicidal_ideation');
      if (responses.suicide_plan >= 3) indicators.push('detailed_suicide_plan');
      if (responses.previous_attempts) indicators.push('previous_suicide_attempts');
      if (responses.substance_use >= 3) indicators.push('substance_abuse_concern');
      if (responses.social_isolation >= 4) indicators.push('severe_social_isolation');
    }

    if (assessmentType === 'self_harm') {
      if (responses.self_harm_frequency >= 4) indicators.push('frequent_self_harm');
      if (responses.self_harm_severity >= 4) indicators.push('severe_self_harm');
      if (responses.emotional_numbness >= 4) indicators.push('emotional_dysregulation');
    }

    return indicators;
  }

  // Emergency Response
  static async triggerEmergencyResponse(assessmentId: string, riskLevel: string): Promise<boolean> {
    try {
      const interventionType = riskLevel === 'critical' ? 'emergency_contact' : 'professional_referral';
      
      await this.createCrisisIntervention({
        crisis_assessment_id: assessmentId,
        intervention_type: interventionType,
        intervention_data: {
          risk_level: riskLevel,
          automated: true,
          timestamp: new Date().toISOString()
        },
        status: 'pending',
        follow_up_required: true
      });

      return true;
    } catch (error) {
      console.error('Error triggering emergency response:', error);
      return false;
    }
  }
}
