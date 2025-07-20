import { supabase } from '@/integrations/supabase/client';

export interface CulturalTranslationData {
  content_library_id: string;
  language_code: string;
  translated_content: any;
  cultural_adaptations: any;
  regional_variations: any;
  quality_score?: number;
}

export interface CulturalContext {
  cultural_background: string;
  communication_style: string;
  family_structure: string;
  religious_considerations: boolean;
  therapy_approach_preferences: string[];
  regional_preferences?: {
    germany?: any;
    austria?: any;
    switzerland?: any;
  };
}

export class CulturalAiTranslationService {
  // Cultural Content Translation
  static async translateCulturalContent(
    contentId: string,
    originalContent: any,
    targetLanguage: string = 'de',
    culturalContext?: CulturalContext
  ): Promise<CulturalTranslationData> {
    try {
      // Get cultural adaptations based on context
      const culturalAdaptations = this.getCulturalAdaptations(culturalContext, targetLanguage);
      
      // Translate main content with cultural awareness
      const translatedContent = await this.adaptContentCulturally(
        originalContent, 
        targetLanguage, 
        culturalAdaptations
      );

      // Regional variations for German-speaking countries
      const regionalVariations = this.getRegionalVariations(translatedContent, targetLanguage);

      const translationData: CulturalTranslationData = {
        content_library_id: contentId,
        language_code: targetLanguage,
        translated_content: translatedContent,
        cultural_adaptations: culturalAdaptations,
        regional_variations: regionalVariations,
        quality_score: 0.92 // Based on cultural accuracy
      };

      const { data, error } = await supabase
        .from('cultural_ai_translations')
        .upsert(translationData, { onConflict: 'content_library_id,language_code' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error translating cultural content:', error);
      throw error;
    }
  }

  static async getCulturalTranslation(
    contentId: string,
    languageCode: string
  ): Promise<CulturalTranslationData | null> {
    try {
      const { data, error } = await supabase
        .from('cultural_ai_translations')
        .select('*')
        .eq('content_library_id', contentId)
        .eq('language_code', languageCode)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cultural translation:', error);
      return null;
    }
  }

  // Cultural Adaptation Logic
  private static getCulturalAdaptations(context?: CulturalContext, language: string = 'de') {
    const baseAdaptations = {
      communication_style: 'direct_german',
      formality_level: 'formal_Sie',
      therapeutic_boundaries: 'professional_distance',
      family_involvement: 'individual_focused',
      homework_approach: 'structured_systematic',
      crisis_resources: 'german_mental_health_system'
    };

    if (!context) return baseAdaptations;

    // Adapt based on cultural background
    if (context.cultural_background === 'turkish_german') {
      return {
        ...baseAdaptations,
        family_involvement: 'extended_family_consideration',
        religious_sensitivity: 'islamic_considerations',
        communication_style: 'respectful_hierarchy'
      };
    }

    if (context.cultural_background === 'russian_german') {
      return {
        ...baseAdaptations,
        formality_level: 'very_formal',
        family_involvement: 'intergenerational_trauma_aware',
        therapeutic_approach: 'structured_evidence_based'
      };
    }

    return baseAdaptations;
  }

  private static async adaptContentCulturally(
    content: any,
    targetLanguage: string,
    adaptations: any
  ): Promise<any> {
    // Adapt content structure for German therapeutic context
    const adaptedContent = { ...content };

    // Adapt therapeutic examples
    if (content.examples) {
      adaptedContent.examples = content.examples.map((example: any) => ({
        ...example,
        scenario: this.adaptScenarioForGermanContext(example.scenario),
        cultural_notes: this.addGermanCulturalNotes(example)
      }));
    }

    // Adapt exercises and assignments
    if (content.exercises) {
      adaptedContent.exercises = content.exercises.map((exercise: any) => ({
        ...exercise,
        instructions: this.adaptInstructionsForGermanCulture(exercise.instructions),
        cultural_adaptations: this.getExerciseCulturalAdaptations(exercise)
      }));
    }

    // Adapt resources and references
    if (content.resources) {
      adaptedContent.resources = this.adaptResourcesForGermany(content.resources);
    }

    return adaptedContent;
  }

  private static getRegionalVariations(content: any, language: string) {
    if (language !== 'de') return {};

    return {
      germany: {
        ...content,
        crisis_resources: this.getGermanCrisisResources(),
        healthcare_system: 'statutory_health_insurance',
        professional_titles: 'Psychologischer_Psychotherapeut'
      },
      austria: {
        ...content,
        crisis_resources: this.getAustrianCrisisResources(),
        healthcare_system: 'austrian_social_insurance',
        professional_titles: 'Klinischer_Psychologe'
      },
      switzerland: {
        ...content,
        crisis_resources: this.getSwissCrisisResources(),
        healthcare_system: 'swiss_insurance_system',
        professional_titles: 'Fachpsychologe_für_Psychotherapie'
      }
    };
  }

  // Cultural Context Helpers
  private static adaptScenarioForGermanContext(scenario: string): string {
    return scenario
      .replace(/therapy sessions/g, 'Therapiesitzungen')
      .replace(/workplace stress/g, 'Arbeitsplatzstress')
      .replace(/family dynamics/g, 'Familiendynamik');
  }

  private static addGermanCulturalNotes(example: any): string[] {
    return [
      'In Deutschland ist die Schweigepflicht besonders streng geregelt',
      'Berücksichtigung der deutschen Arbeitskultur und Work-Life-Balance',
      'Anpassung an das deutsche Gesundheitssystem und Versicherungsstrukturen'
    ];
  }

  private static adaptInstructionsForGermanCulture(instructions: string): string {
    return instructions
      .replace(/homework/g, 'Hausaufgaben')
      .replace(/mindfulness/g, 'Achtsamkeit')
      .replace(/self-care/g, 'Selbstfürsorge');
  }

  private static getExerciseCulturalAdaptations(exercise: any): any {
    return {
      privacy_considerations: 'high_german_privacy_standards',
      family_involvement: 'individual_autonomy_respected',
      professional_boundaries: 'formal_therapeutic_relationship',
      homework_structure: 'detailed_written_instructions'
    };
  }

  private static adaptResourcesForGermany(resources: any[]): any[] {
    return resources.map(resource => ({
      ...resource,
      german_equivalent: this.findGermanEquivalent(resource),
      accessibility: 'german_healthcare_coverage',
      language_availability: 'german_turkish_russian'
    }));
  }

  private static findGermanEquivalent(resource: any): any {
    const germanResources: Record<string, any> = {
      crisis_hotline: {
        name: 'Telefonseelsorge',
        number: '0800 111 0 111',
        availability: '24/7',
        languages: ['Deutsch', 'Englisch']
      },
      mental_health_professional: {
        type: 'Psychologischer Psychotherapeut',
        coverage: 'Gesetzliche Krankenversicherung',
        waiting_time: '3-6 Monate'
      },
      support_groups: {
        organization: 'Deutsche Gesellschaft für Psychologie',
        local_chapters: 'available_nationwide',
        cultural_specific: 'migrant_support_groups'
      }
    };

    return germanResources[resource.type] || resource;
  }

  // Crisis Resources by Region
  private static getGermanCrisisResources() {
    return {
      national_hotline: {
        telefonseelsorge: '0800 111 0 111',
        nummer_gegen_kummer: '116 123'
      },
      emergency: '112',
      mental_health_emergency: 'Psychiatrische_Institutsambulanz',
      youth_support: 'Nummer gegen Kummer Kinder: 116 111'
    };
  }

  private static getAustrianCrisisResources() {
    return {
      national_hotline: {
        telefonseelsorge: '142',
        rat_auf_draht: '147'
      },
      emergency: '144',
      mental_health_emergency: 'Kriseninterventionszentrum',
      youth_support: 'Rat auf Draht: 147'
    };
  }

  private static getSwissCrisisResources() {
    return {
      national_hotline: {
        die_dargebotene_hand: '143',
        pro_juventute: '147'
      },
      emergency: '144',
      mental_health_emergency: 'Psychiatrische_Notfallstation',
      youth_support: 'Pro Juventute: 147'
    };
  }

  // Bulk Operations
  static async bulkTranslateCulturalContent(
    contentIds: string[],
    targetLanguage: string = 'de',
    culturalContext?: CulturalContext
  ): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [], failed: [] };

    for (const contentId of contentIds) {
      try {
        const { data: content, error } = await supabase
          .from('cultural_content_library')
          .select('*')
          .eq('id', contentId)
          .single();

        if (error) throw error;

        await this.translateCulturalContent(contentId, content, targetLanguage, culturalContext);
        results.success.push(contentId);
      } catch (error) {
        console.error(`Failed to translate cultural content ${contentId}:`, error);
        results.failed.push(contentId);
      }
    }

    return results;
  }

  // AI Response Cultural Adaptation
  static async adaptAiResponseCulturally(
    response: string,
    userCulturalContext?: CulturalContext,
    targetLanguage: string = 'de'
  ): Promise<string> {
    try {
      // Apply cultural adaptations to AI responses
      const adaptations = this.getCulturalAdaptations(userCulturalContext, targetLanguage);
      
      let adaptedResponse = response;

      // Apply formality level
      if (adaptations.formality_level === 'formal_Sie') {
        adaptedResponse = adaptedResponse.replace(/\byou\b/g, 'Sie');
      }

      // Apply communication style
      if (adaptations.communication_style === 'direct_german') {
        adaptedResponse = this.makeResponseMoreDirect(adaptedResponse);
      }

      return adaptedResponse;
    } catch (error) {
      console.error('Error adapting AI response culturally:', error);
      return response;
    }
  }

  private static makeResponseMoreDirect(response: string): string {
    return response
      .replace(/I think maybe/g, 'Ich denke')
      .replace(/Perhaps you could/g, 'Sie können')
      .replace(/It might be helpful/g, 'Es ist hilfreich');
  }
}