import { supabase } from '@/integrations/supabase/client';

export interface TherapyTranslationData {
  therapy_plan_id: string;
  language_code: string;
  title?: string;
  description?: string;
  goals?: any[];
  milestones?: any[];
  focus_areas?: string[];
  current_phase?: string;
  cultural_adaptations?: any;
}

export interface TherapeuticTerm {
  id?: string;
  english_term: string;
  german_term: string;
  category: 'technique' | 'disorder' | 'approach' | 'concept';
  definition_en?: string;
  definition_de?: string;
  cultural_context?: any;
  usage_examples?: any;
}

export interface SessionTranslationData {
  session_id: string;
  language_code: string;
  session_notes?: string;
  homework_assignments?: any[];
  techniques_used?: any[];
  cultural_considerations?: any;
}

export class TherapyTranslationService {
  // Therapeutic Terminology Management
  static async getTherapeuticTerms(category?: string): Promise<TherapeuticTerm[]> {
    try {
      let query = supabase
        .from('therapeutic_terminology')
        .select('*')
        .eq('is_active', true)
        .order('english_term');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as TherapeuticTerm[];
    } catch (error) {
      console.error('Error fetching therapeutic terms:', error);
      throw error;
    }
  }

  static async addTherapeuticTerm(term: TherapeuticTerm): Promise<TherapeuticTerm> {
    try {
      const { data, error } = await supabase
        .from('therapeutic_terminology')
        .insert(term)
        .select()
        .single();

      if (error) throw error;
      return data as TherapeuticTerm;
    } catch (error) {
      console.error('Error adding therapeutic term:', error);
      throw error;
    }
  }

  static async translateTherapeuticText(text: string, targetLanguage: string = 'de'): Promise<string> {
    try {
      // Get all therapeutic terms for context-aware translation
      const terms = await this.getTherapeuticTerms();
      
      // Create a mapping for therapeutic terminology
      const terminologyMap = terms.reduce((map, term) => {
        if (targetLanguage === 'de') {
          map[term.english_term.toLowerCase()] = term.german_term;
        }
        return map;
      }, {} as Record<string, string>);

      // Apply therapeutic terminology replacements
      let translatedText = text;
      Object.entries(terminologyMap).forEach(([english, german]) => {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        translatedText = translatedText.replace(regex, german);
      });

      // For now, return the terminology-replaced text
      // In a real implementation, this would call an AI translation service
      // with therapeutic context awareness
      return translatedText;
    } catch (error) {
      console.error('Error translating therapeutic text:', error);
      return text; // Fallback to original text
    }
  }

  // Therapy Plan Translation
  static async translateTherapyPlan(
    therapyPlanId: string, 
    originalPlan: any, 
    targetLanguage: string = 'de'
  ): Promise<TherapyTranslationData> {
    try {
      // Translate therapy plan components
      const translatedTitle = await this.translateTherapeuticText(originalPlan.title, targetLanguage);
      const translatedDescription = await this.translateTherapeuticText(originalPlan.description, targetLanguage);
      
      // Translate goals with therapeutic context
      const translatedGoals = await Promise.all(
        (originalPlan.goals || []).map(async (goal: any) => ({
          ...goal,
          title: await this.translateTherapeuticText(goal.title, targetLanguage),
          description: await this.translateTherapeuticText(goal.description, targetLanguage)
        }))
      );

      // Translate milestones
      const translatedMilestones = await Promise.all(
        (originalPlan.milestones || []).map(async (milestone: any) => ({
          ...milestone,
          title: await this.translateTherapeuticText(milestone.title, targetLanguage),
          description: await this.translateTherapeuticText(milestone.description, targetLanguage)
        }))
      );

      // Translate focus areas
      const translatedFocusAreas = await Promise.all(
        (originalPlan.focus_areas || []).map(area => 
          this.translateTherapeuticText(area, targetLanguage)
        )
      );

      const translatedPhase = originalPlan.current_phase ? 
        await this.translateTherapeuticText(originalPlan.current_phase, targetLanguage) : 
        undefined;

      // Cultural adaptations for German therapy context
      const culturalAdaptations = {
        communication_style: targetLanguage === 'de' ? 'direct_german' : 'general',
        therapeutic_approach: 'german_clinical_standards',
        privacy_considerations: 'high_german_privacy_expectations',
        family_involvement: 'german_family_dynamics'
      };

      const translationData: TherapyTranslationData = {
        therapy_plan_id: therapyPlanId,
        language_code: targetLanguage,
        title: translatedTitle,
        description: translatedDescription,
        goals: translatedGoals,
        milestones: translatedMilestones,
        focus_areas: translatedFocusAreas,
        current_phase: translatedPhase,
        cultural_adaptations: culturalAdaptations
      };

      // Store translation in database
      const { data, error } = await supabase
        .from('therapy_plan_translations')
        .upsert(translationData, { onConflict: 'therapy_plan_id,language_code' })
        .select()
        .single();

      if (error) throw error;
      return data as TherapyTranslationData;
    } catch (error) {
      console.error('Error translating therapy plan:', error);
      throw error;
    }
  }

  static async getTherapyPlanTranslation(
    therapyPlanId: string, 
    languageCode: string
  ): Promise<TherapyTranslationData | null> {
    try {
      const { data, error } = await supabase
        .from('therapy_plan_translations')
        .select('*')
        .eq('therapy_plan_id', therapyPlanId)
        .eq('language_code', languageCode)
        .maybeSingle();

      if (error) throw error;
      return data as TherapyTranslationData;
    } catch (error) {
      console.error('Error fetching therapy plan translation:', error);
      return null;
    }
  }

  // Session Translation
  static async translateSession(
    sessionId: string,
    sessionData: any,
    targetLanguage: string = 'de'
  ): Promise<SessionTranslationData> {
    try {
      const translatedNotes = sessionData.notes ? 
        await this.translateTherapeuticText(sessionData.notes, targetLanguage) : 
        undefined;

      const translatedAssignments = await Promise.all(
        (sessionData.homework_assignments || []).map(async (assignment: any) => ({
          ...assignment,
          title: await this.translateTherapeuticText(assignment.title, targetLanguage),
          description: await this.translateTherapeuticText(assignment.description, targetLanguage)
        }))
      );

      const translatedTechniques = await Promise.all(
        (sessionData.techniques_used || []).map(async (technique: any) => ({
          ...technique,
          name: await this.translateTherapeuticText(technique.name, targetLanguage),
          description: await this.translateTherapeuticText(technique.description, targetLanguage)
        }))
      );

      const culturalConsiderations = {
        therapeutic_relationship: 'formal_german_boundaries',
        communication_preferences: 'direct_feedback_german',
        homework_approach: 'structured_german_methodology'
      };

      const translationData: SessionTranslationData = {
        session_id: sessionId,
        language_code: targetLanguage,
        session_notes: translatedNotes,
        homework_assignments: translatedAssignments,
        techniques_used: translatedTechniques,
        cultural_considerations: culturalConsiderations
      };

      const { data, error } = await supabase
        .from('therapy_session_translations')
        .upsert(translationData, { onConflict: 'session_id,language_code' })
        .select()
        .single();

      if (error) throw error;
      return data as SessionTranslationData;
    } catch (error) {
      console.error('Error translating session:', error);
      throw error;
    }
  }

  static async getSessionTranslation(
    sessionId: string,
    languageCode: string
  ): Promise<SessionTranslationData | null> {
    try {
      const { data, error } = await supabase
        .from('therapy_session_translations')
        .select('*')
        .eq('session_id', sessionId)
        .eq('language_code', languageCode)
        .maybeSingle();

      if (error) throw error;
      return data as SessionTranslationData;
    } catch (error) {
      console.error('Error fetching session translation:', error);
      return null;
    }
  }

  // Bulk Translation Operations
  static async bulkTranslateTherapyPlans(
    therapyPlanIds: string[], 
    targetLanguage: string = 'de'
  ): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [], failed: [] };

    for (const planId of therapyPlanIds) {
      try {
        // Fetch original therapy plan
        const { data: plan, error } = await supabase
          .from('therapy_plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (error) throw error;

        await this.translateTherapyPlan(planId, plan, targetLanguage);
        results.success.push(planId);
      } catch (error) {
        console.error(`Failed to translate therapy plan ${planId}:`, error);
        results.failed.push(planId);
      }
    }

    return results;
  }
}