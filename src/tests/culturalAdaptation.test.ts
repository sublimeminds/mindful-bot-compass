import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Cultural test data for different backgrounds
const culturalProfiles = {
  westernIndividualistic: {
    language: 'en',
    background: 'western',
    communicationStyle: 'direct',
    familyStructure: 'nuclear',
    religiousBeliefs: 'secular',
    cultureSpecificConcerns: ['work_life_balance', 'individual_achievement']
  },
  eastAsianCollectivist: {
    language: 'zh',
    background: 'east_asian',
    communicationStyle: 'indirect',
    familyStructure: 'extended',
    religiousBeliefs: 'buddhist',
    cultureSpecificConcerns: ['family_honor', 'academic_pressure', 'filial_piety']
  },
  latinoFamilyCentric: {
    language: 'es',
    background: 'latino',
    communicationStyle: 'expressive',
    familyStructure: 'extended',
    religiousBeliefs: 'catholic',
    cultureSpecificConcerns: ['machismo', 'personalismo', 'family_loyalty']
  },
  middleEasternTraditional: {
    language: 'ar',
    background: 'middle_eastern',
    communicationStyle: 'contextual',
    familyStructure: 'patriarchal',
    religiousBeliefs: 'islamic',
    cultureSpecificConcerns: ['honor_shame', 'religious_obligations', 'gender_roles']
  },
  africanCommunal: {
    language: 'en',
    background: 'african',
    communicationStyle: 'storytelling',
    familyStructure: 'community_based',
    religiousBeliefs: 'christian',
    cultureSpecificConcerns: ['ubuntu_philosophy', 'ancestral_wisdom', 'community_healing']
  },
  indigenousHolistic: {
    language: 'en',
    background: 'indigenous',
    communicationStyle: 'circular',
    familyStructure: 'tribal',
    religiousBeliefs: 'traditional_spiritual',
    cultureSpecificConcerns: ['connection_to_land', 'intergenerational_trauma', 'traditional_healing']
  }
};

describe('Cultural Adaptation Tests', () => {
  beforeEach(() => {
    vi.mocked(supabase.functions.invoke).mockImplementation((functionName, options) => {
      const body = options?.body as any;
      const culturalContext = body?.culturalContext || body?.userProfile?.cultural_context;
      
      if (functionName === 'enhanced-therapy-matching') {
        return Promise.resolve({
          data: {
            culturallyAdaptedApproaches: getCulturallyAdaptedApproaches(culturalContext),
            languageSpecificResources: getLanguageResources(culturalContext?.language),
            culturalCompetencyScore: 0.92,
            recommendedTherapists: getCulturallyMatchedTherapists(culturalContext)
          },
          error: null
        });
      }
      
      if (functionName === 'adaptive-therapy-planner') {
        return Promise.resolve({
          data: {
            culturalAdaptations: getCulturalAdaptations(culturalContext),
            communicationStyleAdjustments: getCommunicationAdjustments(culturalContext),
            culturallyRelevantTechniques: getCulturalTechniques(culturalContext)
          },
          error: null
        });
      }
      
      return Promise.resolve({ data: null, error: null });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Language and Communication Adaptation', () => {
    it('should adapt communication style for different cultural backgrounds', async () => {
      for (const [cultureName, profile] of Object.entries(culturalProfiles)) {
        const response = await supabase.functions.invoke('enhanced-therapy-matching', {
          body: {
            culturalContext: profile,
            primaryConcerns: ['anxiety', 'depression']
          }
        });

        expect(response.data.culturallyAdaptedApproaches).toBeDefined();
        expect(response.data.languageSpecificResources).toBeDefined();
        expect(response.data.culturalCompetencyScore).toBeGreaterThan(0.8);
        
        console.log(`✅ ${cultureName}: Cultural adaptation successful`);
      }
    });

    it('should provide language-specific resources and materials', async () => {
      const languages = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja', 'ko'];
      
      for (const language of languages) {
        const response = await supabase.functions.invoke('enhanced-therapy-matching', {
          body: {
            culturalContext: { language, background: 'multicultural' }
          }
        });

        expect(response.data.languageSpecificResources).toHaveProperty('language', language);
        expect(response.data.languageSpecificResources.materials).toBeDefined();
        expect(response.data.languageSpecificResources.assessmentTools).toBeDefined();
      }
    });

    it('should adjust communication patterns for high-context vs low-context cultures', async () => {
      const highContextProfile = culturalProfiles.eastAsianCollectivist;
      const lowContextProfile = culturalProfiles.westernIndividualistic;

      const highContextResponse = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userProfile: { cultural_context: highContextProfile },
          concerns: ['family_pressure']
        }
      });

      const lowContextResponse = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userProfile: { cultural_context: lowContextProfile },
          concerns: ['work_stress']
        }
      });

      expect(highContextResponse.data.communicationStyleAdjustments.approach).toBe('indirect_respectful');
      expect(lowContextResponse.data.communicationStyleAdjustments.approach).toBe('direct_solution_focused');
    });
  });

  describe('Religious and Spiritual Integration', () => {
    it('should integrate religious beliefs into therapy approaches', async () => {
      const religiousProfiles = [
        { beliefs: 'islamic', background: 'middle_eastern' },
        { beliefs: 'buddhist', background: 'east_asian' },
        { beliefs: 'catholic', background: 'latino' },
        { beliefs: 'traditional_spiritual', background: 'indigenous' }
      ];

      for (const profile of religiousProfiles) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              cultural_context: {
                religiousBeliefs: profile.beliefs,
                background: profile.background
              }
            }
          }
        });

        expect(response.data.culturalAdaptations.spiritualIntegration).toBeDefined();
        expect(response.data.culturalAdaptations.religiousConsiderations).toBeDefined();
        expect(response.data.culturallyRelevantTechniques).toContain(`${profile.beliefs}_integration`);
      }
    });

    it('should respect religious boundaries and restrictions', async () => {
      const islamicProfile = culturalProfiles.middleEasternTraditional;
      
      const response = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userProfile: { cultural_context: islamicProfile },
          concernAreas: ['anxiety', 'marital_issues']
        }
      });

      expect(response.data.culturalAdaptations.religiousConsiderations).toContain('prayer_times_respect');
      expect(response.data.culturalAdaptations.religiousConsiderations).toContain('gender_sensitive_approach');
      expect(response.data.culturalAdaptations.religiousConsiderations).toContain('halal_coping_strategies');
    });
  });

  describe('Family and Social Structure Considerations', () => {
    it('should adapt therapy for individualistic vs collectivistic orientations', async () => {
      const individualisticProfile = culturalProfiles.westernIndividualistic;
      const collectivisticProfile = culturalProfiles.eastAsianCollectivist;

      const individualisticResponse = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userProfile: { cultural_context: individualisticProfile }
        }
      });

      const collectivisticResponse = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userProfile: { cultural_context: collectivisticProfile }
        }
      });

      expect(individualisticResponse.data.culturalAdaptations.focusArea).toBe('personal_autonomy');
      expect(collectivisticResponse.data.culturalAdaptations.focusArea).toBe('family_harmony');
      
      expect(individualisticResponse.data.culturallyRelevantTechniques).toContain('individual_goal_setting');
      expect(collectivisticResponse.data.culturallyRelevantTechniques).toContain('family_systems_approach');
    });

    it('should consider family involvement based on cultural norms', async () => {
      const profiles = [
        { name: 'Latino', profile: culturalProfiles.latinoFamilyCentric, expectedInvolvement: 'high' },
        { name: 'East Asian', profile: culturalProfiles.eastAsianCollectivist, expectedInvolvement: 'moderate' },
        { name: 'Western', profile: culturalProfiles.westernIndividualistic, expectedInvolvement: 'low' }
      ];

      for (const { name, profile, expectedInvolvement } of profiles) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: { cultural_context: profile }
          }
        });

        expect(response.data.culturalAdaptations.familyInvolvement).toBe(expectedInvolvement);
        console.log(`✅ ${name}: Family involvement level - ${expectedInvolvement}`);
      }
    });
  });

  describe('Culture-Specific Mental Health Concepts', () => {
    it('should recognize and address culture-bound syndromes', async () => {
      const cultureBoundSyndromes = [
        { culture: 'latino', syndrome: 'susto', symptoms: ['soul_loss', 'fright_illness'] },
        { culture: 'east_asian', syndrome: 'neurasthenia', symptoms: ['mental_fatigue', 'weakness'] },
        { culture: 'african', syndrome: 'spirit_possession', symptoms: ['dissociation', 'behavioral_changes'] }
      ];

      for (const { culture, syndrome, symptoms } of cultureBoundSyndromes) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              cultural_context: { background: culture },
              presentingSymptoms: symptoms
            }
          }
        });

        expect(response.data.culturalAdaptations.recognizedSyndromes).toContain(syndrome);
        expect(response.data.culturallyRelevantTechniques).toContain(`${syndrome}_intervention`);
      }
    });

    it('should incorporate traditional healing practices where appropriate', async () => {
      const traditionalHealingProfiles = [
        { culture: 'indigenous', practices: ['smudging', 'talking_circles', 'nature_connection'] },
        { culture: 'african', practices: ['ubuntu_philosophy', 'ancestral_guidance', 'community_ritual'] },
        { culture: 'east_asian', practices: ['qi_balance', 'meditation', 'acupressure'] }
      ];

      for (const { culture, practices } of traditionalHealingProfiles) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              cultural_context: { background: culture },
              openToTraditionalHealing: true
            }
          }
        });

        expect(response.data.culturalAdaptations.traditionalPractices).toBeDefined();
        practices.forEach(practice => {
          expect(response.data.culturallyRelevantTechniques).toContain(practice);
        });
      }
    });
  });

  describe('Cross-Cultural Assessment and Diagnosis', () => {
    it('should adapt assessment tools for cultural validity', async () => {
      const assessmentAdaptations = [
        { culture: 'east_asian', adaptations: ['shame_vs_guilt_focus', 'somatic_expression_awareness'] },
        { culture: 'latino', adaptations: ['personalismo_consideration', 'familismo_impact'] },
        { culture: 'middle_eastern', adaptations: ['honor_shame_dynamics', 'gender_role_expectations'] }
      ];

      for (const { culture, adaptations } of assessmentAdaptations) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: { cultural_context: { background: culture } },
            assessmentNeeded: true
          }
        });

        expect(response.data.culturalAdaptations.assessmentModifications).toBeDefined();
        adaptations.forEach(adaptation => {
          expect(response.data.culturalAdaptations.assessmentModifications).toContain(adaptation);
        });
      }
    });

    it('should consider cultural expressions of distress', async () => {
      const culturalDistressExpressions = [
        { culture: 'latino', expressions: ['somatization', 'nervios', 'emotional_expressiveness'] },
        { culture: 'east_asian', expressions: ['emotional_restraint', 'physical_symptoms', 'indirect_communication'] },
        { culture: 'african', expressions: ['spiritual_attribution', 'community_context', 'storytelling'] }
      ];

      for (const { culture, expressions } of culturalDistressExpressions) {
        const response = await supabase.functions.invoke('enhanced-therapy-matching', {
          body: {
            culturalContext: { background: culture },
            symptomPresentation: expressions
          }
        });

        expect(response.data.culturallyAdaptedApproaches.distressRecognition).toBeDefined();
        expressions.forEach(expression => {
          expect(response.data.culturallyAdaptedApproaches.distressRecognition).toContain(expression);
        });
      }
    });
  });

  describe('Therapist-Client Cultural Matching', () => {
    it('should prioritize cultural competency in therapist matching', async () => {
      for (const [cultureName, profile] of Object.entries(culturalProfiles)) {
        const response = await supabase.functions.invoke('enhanced-therapy-matching', {
          body: {
            culturalContext: profile,
            matchingPreferences: { culturalMatch: 'preferred' }
          }
        });

        expect(response.data.recommendedTherapists).toBeDefined();
        expect(response.data.recommendedTherapists.length).toBeGreaterThan(0);
        
        response.data.recommendedTherapists.forEach((therapist: any) => {
          expect(therapist.culturalCompetency).toBeGreaterThan(0.8);
          expect(therapist.languageSkills).toContain(profile.language);
        });
      }
    });

    it('should consider same-culture vs cross-culture therapeutic relationships', async () => {
      const culturalMatchingScenarios = [
        { scenario: 'same_culture_preferred', expectation: 'cultural_insider_therapist' },
        { scenario: 'cross_culture_open', expectation: 'culturally_competent_outsider' },
        { scenario: 'bicultural_identity', expectation: 'multicultural_therapist' }
      ];

      for (const { scenario, expectation } of culturalMatchingScenarios) {
        const response = await supabase.functions.invoke('enhanced-therapy-matching', {
          body: {
            culturalContext: culturalProfiles.latinoFamilyCentric,
            matchingPreferences: { culturalMatchPreference: scenario }
          }
        });

        expect(response.data.recommendedTherapists[0].matchingRationale).toContain(expectation);
      }
    });
  });

  describe('Cultural Trauma and Historical Context', () => {
    it('should recognize and address historical trauma patterns', async () => {
      const historicalTraumaProfiles = [
        { community: 'indigenous', traumas: ['colonization', 'forced_assimilation', 'land_loss'] },
        { community: 'african_american', traumas: ['slavery_legacy', 'systemic_racism', 'intergenerational_trauma'] },
        { community: 'refugee', traumas: ['war_displacement', 'cultural_loss', 'acculturation_stress'] }
      ];

      for (const { community, traumas } of historicalTraumaProfiles) {
        const response = await supabase.functions.invoke('adaptive-therapy-planner', {
          body: {
            userProfile: {
              cultural_context: { background: community },
              traumaHistory: traumas
            }
          }
        });

        expect(response.data.culturalAdaptations.historicalTraumaAwareness).toBeDefined();
        expect(response.data.culturallyRelevantTechniques).toContain('trauma_informed_cultural_approach');
        traumas.forEach(trauma => {
          expect(response.data.culturalAdaptations.historicalTraumaAwareness).toContain(trauma);
        });
      }
    });
  });
});

// Helper functions for mock responses
function getCulturallyAdaptedApproaches(culturalContext: any) {
  const approaches: Record<string, string[]> = {
    western: ['CBT', 'psychodynamic', 'humanistic'],
    east_asian: ['mindfulness_based', 'somatic_approaches', 'family_systems'],
    latino: ['narrative_therapy', 'family_therapy', 'expressive_arts'],
    middle_eastern: ['integrative_approach', 'religious_counseling', 'family_mediation'],
    african: ['ubuntu_therapy', 'community_healing', 'narrative_approaches'],
    indigenous: ['traditional_healing_integration', 'nature_based_therapy', 'ceremonial_healing']
  };
  
  return {
    primaryApproaches: approaches[culturalContext?.background] || approaches.western,
    adaptationLevel: 'high',
    distressRecognition: [`${culturalContext?.background}_specific_symptoms`]
  };
}

function getLanguageResources(language: string) {
  return {
    language,
    materials: [`${language}_therapy_workbooks`, `${language}_assessment_tools`],
    assessmentTools: [`${language}_validated_scales`],
    interpreterServices: language !== 'en'
  };
}

function getCulturallyMatchedTherapists(culturalContext: any) {
  return [
    {
      id: `therapist_${culturalContext?.background}_1`,
      culturalCompetency: 0.95,
      languageSkills: [culturalContext?.language, 'en'],
      specialties: [`${culturalContext?.background}_mental_health`],
      matchingRationale: `High cultural competency for ${culturalContext?.background} clients`
    }
  ];
}

function getCulturalAdaptations(culturalContext: any) {
  return {
    communicationStyle: culturalContext?.communicationStyle,
    familyInvolvement: culturalContext?.familyStructure === 'nuclear' ? 'low' : 'high',
    spiritualIntegration: culturalContext?.religiousBeliefs !== 'secular',
    religiousConsiderations: [`${culturalContext?.religiousBeliefs}_sensitivity`],
    focusArea: culturalContext?.background === 'western' ? 'personal_autonomy' : 'family_harmony',
    recognizedSyndromes: [`${culturalContext?.background}_culture_bound_syndromes`],
    assessmentModifications: [`${culturalContext?.background}_cultural_adaptations`],
    traditionalPractices: [`${culturalContext?.background}_healing_practices`],
    historicalTraumaAwareness: [`${culturalContext?.background}_historical_context`]
  };
}

function getCommunicationAdjustments(culturalContext: any) {
  const adjustments: Record<string, string> = {
    direct: 'direct_solution_focused',
    indirect: 'indirect_respectful',
    expressive: 'emotionally_validating',
    contextual: 'context_sensitive',
    storytelling: 'narrative_based',
    circular: 'holistic_approach'
  };
  
  return {
    approach: adjustments[culturalContext?.communicationStyle] || 'balanced_approach',
    pacing: culturalContext?.communicationStyle === 'indirect' ? 'slower' : 'moderate',
    directness: culturalContext?.communicationStyle === 'direct' ? 'high' : 'low'
  };
}

function getCulturalTechniques(culturalContext: any) {
  const techniques: Record<string, string[]> = {
    western: ['individual_goal_setting', 'cognitive_restructuring', 'behavioral_modification'],
    east_asian: ['mindfulness_meditation', 'qi_balance', 'family_systems_approach', 'neurasthenia_intervention'],
    latino: ['personalismo_integration', 'familismo_therapy', 'susto_intervention'],
    middle_eastern: ['islamic_integration', 'honor_shame_therapy', 'gender_sensitive_approach'],
    african: ['ubuntu_philosophy', 'ancestral_guidance', 'community_ritual', 'spirit_possession_intervention'],
    indigenous: ['smudging', 'talking_circles', 'nature_connection', 'traditional_healing_integration']
  };
  
  return techniques[culturalContext?.background] || techniques.western;
}