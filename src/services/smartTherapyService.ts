
import { supabase } from '@/integrations/supabase/client';

export interface IntakeAnalysis {
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  confidence: number;
  recommendedApproaches: string[];
  sessionRecommendations: {
    frequency: string;
    duration: number;
    focusAreas: string[];
  };
}

export const smartTherapyService = {
  analyzeIntakeData: async (userId: string): Promise<IntakeAnalysis> => {
    try {
      // Get user's clinical assessments and cultural preferences
      const { data: assessments } = await supabase
        .from('clinical_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('administered_at', { ascending: false })
        .limit(1);

      const { data: culturalProfile } = await supabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: traumaHistory } = await supabase
        .from('trauma_history')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Get available therapy approaches from database
      const { data: therapyApproaches } = await supabase
        .from('therapeutic_approach_configs')
        .select('*')
        .eq('is_active', true);

      // Analyze risk level based on assessment data
      let riskLevel: 'low' | 'moderate' | 'high' | 'crisis' = 'moderate';
      let confidence = 75;
      
      if (assessments && assessments.length > 0) {
        const latestAssessment = assessments[0];
        
        // Calculate risk based on assessment data
        if (latestAssessment.severity_level === 'severe' || latestAssessment.total_score > 20) {
          riskLevel = 'crisis';
          confidence = 90;
        } else if (latestAssessment.severity_level === 'moderate' || latestAssessment.total_score > 15) {
          riskLevel = 'high';
          confidence = 85;
        } else if (latestAssessment.severity_level === 'mild' || latestAssessment.total_score > 8) {
          riskLevel = 'moderate';
          confidence = 80;
        } else {
          riskLevel = 'low';
          confidence = 75;
        }
      }

      // Get recommended approaches based on conditions and cultural factors
      const recommendedApproaches = therapyApproaches
        ?.filter(approach => {
          // Match based on target conditions
          const hasMatchingCondition = approach.target_conditions.some((condition: string) => 
            assessments?.[0]?.assessment_type?.toLowerCase().includes(condition.toLowerCase()) ||
            traumaHistory?.trauma_types?.some((trauma: string) => 
              trauma.toLowerCase().includes(condition.toLowerCase())
            )
          );
          
          // Consider cultural compatibility
          const culturallyAppropriate = !culturalProfile?.cultural_sensitivities?.some((sensitivity: string) =>
            approach.name.toLowerCase().includes(sensitivity.toLowerCase())
          );
          
          return hasMatchingCondition && culturallyAppropriate;
        })
        .sort((a, b) => b.effectiveness_score - a.effectiveness_score)
        .slice(0, 3)
        .map(approach => approach.name) || [
          'Cognitive Behavioral Therapy',
          'Mindfulness-Based Therapy',
          'Solution-Focused Therapy'
        ];

      // Generate session recommendations
      const sessionRecommendations = {
        frequency: riskLevel === 'crisis' ? 'Daily check-ins' : 
                  riskLevel === 'high' ? 'Twice weekly' :
                  riskLevel === 'moderate' ? 'Weekly' : 'Bi-weekly',
        duration: riskLevel === 'crisis' ? 60 : 
                 riskLevel === 'high' ? 50 : 45,
        focusAreas: [
          ...(traumaHistory?.trauma_types ? ['Trauma Processing'] : []),
          ...(assessments?.[0]?.assessment_type?.includes('anxiety') ? ['Anxiety Management'] : []),
          ...(assessments?.[0]?.assessment_type?.includes('depression') ? ['Mood Regulation'] : []),
          'Coping Skills Development',
          'Stress Reduction'
        ].slice(0, 4)
      };

      return {
        riskLevel,
        confidence,
        recommendedApproaches,
        sessionRecommendations
      };
    } catch (error) {
      console.error('Error analyzing intake data:', error);
      // Fallback to default analysis
      return {
        riskLevel: 'moderate',
        confidence: 70,
        recommendedApproaches: [
          'Cognitive Behavioral Therapy',
          'Mindfulness-Based Therapy',
          'Solution-Focused Therapy'
        ],
        sessionRecommendations: {
          frequency: 'Weekly',
          duration: 45,
          focusAreas: ['Stress Management', 'Coping Skills', 'Emotional Regulation']
        }
      };
    }
  }
};
