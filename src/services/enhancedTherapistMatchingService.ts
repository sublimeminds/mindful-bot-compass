import { supabase } from '@/integrations/supabase/client';

export interface ClinicalAssessmentData {
  anxiety_severity?: number;
  depression_severity?: number;
  trauma_history?: boolean;
  cultural_background?: string;
  therapy_experience?: string;
  communication_style?: string;
  goals?: string[];
  stressors?: string[];
  coping_mechanisms?: string[];
}

export interface TherapistCompatibilityScore {
  therapist_id: string;
  base_score: number;
  clinical_match: number;
  cultural_match: number;
  experience_match: number;
  communication_match: number;
  final_score: number;
  reasoning: string[];
  recommended_interventions: string[];
}

export class EnhancedTherapistMatchingService {
  /**
   * AI-powered therapist compatibility analysis using clinical data
   */
  static async calculateEnhancedCompatibility(
    userId: string,
    assessmentData: ClinicalAssessmentData
  ): Promise<TherapistCompatibilityScore[]> {
    try {
      // Get all therapists
      const { data: therapists } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      if (!therapists) return [];

      // Get user's clinical history
      const userClinicalData = await this.getUserClinicalProfile(userId);
      
      // Calculate compatibility scores for each therapist
      const compatibilityScores = await Promise.all(
        therapists.map(therapist => 
          this.calculateTherapistScore(therapist, assessmentData, userClinicalData)
        )
      );

      // Sort by final score
      return compatibilityScores.sort((a, b) => b.final_score - a.final_score);
    } catch (error) {
      console.error('Enhanced compatibility calculation error:', error);
      return [];
    }
  }

  private static async getUserClinicalProfile(userId: string) {
    try {
      const [moodData, traumaData, culturalData, sessionHistory] = await Promise.all([
        // Recent mood patterns
        supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30),
        
        // Trauma history
        supabase
          .from('trauma_history')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
        
        // Cultural profile
        supabase
          .from('user_cultural_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
        
        // Therapy session outcomes
        supabase
          .from('therapy_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        moodPatterns: moodData.data || [],
        traumaHistory: traumaData.data,
        culturalProfile: culturalData.data,
        sessionHistory: sessionHistory.data || []
      };
    } catch (error) {
      console.error('Error fetching user clinical profile:', error);
      return {
        moodPatterns: [],
        traumaHistory: null,
        culturalProfile: null,
        sessionHistory: []
      };
    }
  }

  private static async calculateTherapistScore(
    therapist: any,
    assessmentData: ClinicalAssessmentData,
    userClinicalData: any
  ): Promise<TherapistCompatibilityScore> {
    const scores = {
      base_score: 0.7, // Base compatibility
      clinical_match: 0,
      cultural_match: 0,
      experience_match: 0,
      communication_match: 0
    };

    const reasoning: string[] = [];
    const recommendedInterventions: string[] = [];

    // Clinical Severity Matching (40% weight)
    scores.clinical_match = this.calculateClinicalMatch(
      therapist, 
      assessmentData, 
      userClinicalData,
      reasoning,
      recommendedInterventions
    );

    // Cultural Compatibility (20% weight)
    scores.cultural_match = this.calculateCulturalMatch(
      therapist,
      assessmentData,
      userClinicalData,
      reasoning
    );

    // Experience Level Matching (20% weight)
    scores.experience_match = this.calculateExperienceMatch(
      therapist,
      assessmentData,
      reasoning
    );

    // Communication Style Matching (20% weight)
    scores.communication_match = this.calculateCommunicationMatch(
      therapist,
      assessmentData,
      reasoning
    );

    // Calculate weighted final score
    const final_score = Math.min(0.98, Math.max(0.65,
      scores.base_score + 
      (scores.clinical_match * 0.4) +
      (scores.cultural_match * 0.2) +
      (scores.experience_match * 0.2) +
      (scores.communication_match * 0.2)
    ));

    return {
      therapist_id: therapist.id,
      ...scores,
      final_score: Math.round(final_score * 100) / 100,
      reasoning,
      recommended_interventions: recommendedInterventions
    };
  }

  private static calculateClinicalMatch(
    therapist: any,
    assessmentData: ClinicalAssessmentData,
    userClinicalData: any,
    reasoning: string[],
    recommendedInterventions: string[]
  ): number {
    let score = 0;
    
    // Anxiety severity matching
    if (assessmentData.anxiety_severity && assessmentData.anxiety_severity > 6) {
      if (therapist.specialties.includes('Anxiety') || therapist.specialties.includes('CBT')) {
        score += 0.3;
        reasoning.push('High anxiety - matches therapist anxiety specialization');
        recommendedInterventions.push('Cognitive restructuring exercises');
        recommendedInterventions.push('Progressive muscle relaxation');
      }
    }

    // Depression severity matching
    if (assessmentData.depression_severity && assessmentData.depression_severity > 6) {
      if (therapist.specialties.includes('Depression') || therapist.approach === 'Cognitive Behavioral Therapy') {
        score += 0.3;
        reasoning.push('Depression symptoms - matches CBT approach');
        recommendedInterventions.push('Behavioral activation');
        recommendedInterventions.push('Thought record exercises');
      }
    }

    // Trauma-informed care
    if (assessmentData.trauma_history || userClinicalData.traumaHistory) {
      if (therapist.title === 'Trauma-Informed Therapist' || 
          therapist.specialties.includes('Trauma Recovery')) {
        score += 0.4;
        reasoning.push('Trauma history - matches trauma-informed approach');
        recommendedInterventions.push('Grounding techniques');
        recommendedInterventions.push('Safety planning');
      } else {
        score -= 0.2; // Penalty for non-trauma specialists with trauma history
      }
    }

    return Math.min(1, Math.max(0, score));
  }

  private static calculateCulturalMatch(
    therapist: any,
    assessmentData: ClinicalAssessmentData,
    userClinicalData: any,
    reasoning: string[]
  ): number {
    let score = 0.5; // Neutral base

    const culturalProfile = userClinicalData.culturalProfile;
    if (!culturalProfile) return score;

    // Religious considerations
    if (culturalProfile.religious_considerations) {
      if (therapist.approach.includes('Holistic') || therapist.title.includes('Holistic')) {
        score += 0.3;
        reasoning.push('Religious considerations - matches holistic approach');
      }
    }

    // Communication style matching
    if (culturalProfile.communication_style === 'indirect' && 
        therapist.communication_style === 'supportive') {
      score += 0.2;
      reasoning.push('Indirect communication style - matches supportive approach');
    }

    return Math.min(1, Math.max(0, score));
  }

  private static calculateExperienceMatch(
    therapist: any,
    assessmentData: ClinicalAssessmentData,
    reasoning: string[]
  ): number {
    let score = 0.7; // Default good match

    if (assessmentData.therapy_experience === 'New to therapy') {
      if (therapist.experience_level === 'beginner' || therapist.communication_style === 'supportive') {
        score += 0.3;
        reasoning.push('New to therapy - matches beginner-friendly approach');
      }
    } else if (assessmentData.therapy_experience === 'Experienced with therapy') {
      if (therapist.experience_level === 'advanced') {
        score += 0.2;
        reasoning.push('Therapy experience - matches advanced techniques');
      }
    }

    return Math.min(1, Math.max(0, score));
  }

  private static calculateCommunicationMatch(
    therapist: any,
    assessmentData: ClinicalAssessmentData,
    reasoning: string[]
  ): number {
    let score = 0.5;

    if (assessmentData.communication_style) {
      const styleMap: Record<string, string> = {
        'Direct and structured': 'direct',
        'Gentle and supportive': 'supportive',
        'Encouraging and optimistic': 'encouraging'
      };

      const preferredStyle = styleMap[assessmentData.communication_style];
      if (preferredStyle && therapist.communication_style === preferredStyle) {
        score += 0.5;
        reasoning.push(`Communication style match: ${assessmentData.communication_style}`);
      }
    }

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Save enhanced assessment results
   */
  static async saveEnhancedAssessment(
    userId: string,
    assessmentData: ClinicalAssessmentData,
    compatibilityScores: TherapistCompatibilityScore[],
    selectedTherapistId?: string
  ) {
    try {
      const { error } = await supabase
        .from('therapist_assessments')
        .upsert({
          user_id: userId,
          responses: assessmentData as any,
          recommended_therapists: compatibilityScores.slice(0, 3) as any,
          selected_therapist_id: selectedTherapistId,
          assessment_version: 2,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving enhanced assessment:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered therapist recommendations based on ongoing therapy data
   */
  static async getAITherapistRecommendations(userId: string) {
    try {
      // Analyze recent session outcomes, mood patterns, and progress
      const [sessionOutcomes, moodTrends, currentTherapist] = await Promise.all([
        this.analyzeSessionOutcomes(userId),
        this.analyzeMoodTrends(userId),
        this.getCurrentTherapist(userId)
      ]);

      // Generate AI recommendation
      if (sessionOutcomes.averageRating < 3.5 || moodTrends.trend === 'declining') {
        return {
          shouldConsiderChange: true,
          reason: sessionOutcomes.averageRating < 3.5 
            ? 'Session satisfaction below optimal threshold'
            : 'Mood trends showing decline',
          recommendedAction: 'Consider exploring different therapeutic approaches',
          alternativeTherapists: await this.getAlternativeTherapists(userId, currentTherapist)
        };
      }

      return {
        shouldConsiderChange: false,
        currentMatch: 'Good',
        continueWithCurrent: true
      };
    } catch (error) {
      console.error('Error getting AI therapist recommendations:', error);
      return null;
    }
  }

  private static async analyzeSessionOutcomes(userId: string) {
    const { data } = await supabase
      .from('therapy_sessions')
      .select('mood_before, mood_after')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const improvements = data?.map(s => (s.mood_after || 5) - (s.mood_before || 5)) || [];
    const avgImprovement = improvements.length ? improvements.reduce((a, b) => a + b, 0) / improvements.length : 0;
    
    return {
      averageRating: Math.max(1, Math.min(5, 3 + avgImprovement)), // Convert improvement to 1-5 scale
      sessionCount: improvements.length,
      moodImprovement: avgImprovement
    };
  }

  private static async analyzeMoodTrends(userId: string) {
    const { data } = await supabase
      .from('mood_entries')
      .select('overall, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(14);

    if (!data || data.length < 7) return { trend: 'insufficient_data' };

    const recent = data.slice(0, 7);
    const previous = data.slice(7, 14);
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.overall, 0) / recent.length;
    const previousAvg = previous.reduce((sum, entry) => sum + entry.overall, 0) / previous.length;

    return {
      trend: recentAvg > previousAvg + 0.5 ? 'improving' : 
             recentAvg < previousAvg - 0.5 ? 'declining' : 'stable',
      recentAverage: recentAvg,
      previousAverage: previousAvg
    };
  }

  private static async getCurrentTherapist(userId: string) {
    const { data } = await supabase
      .from('therapist_assessments')
      .select('selected_therapist_id')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.selected_therapist_id;
  }

  private static async getAlternativeTherapists(userId: string, currentTherapistId?: string) {
    const { data: therapists } = await supabase
      .from('therapist_personalities')
      .select('*')
      .eq('is_active', true)
      .neq('id', currentTherapistId || '');

    return therapists?.slice(0, 3) || [];
  }
}