import { supabase } from '@/integrations/supabase/client';

export interface AssessmentMatch {
  id: string;
  user_id: string;
  assessment_id: string;
  therapist_id: string;
  compatibility_score: number;
  matching_factors: Record<string, any>;
  created_at: string;
}

export interface TherapistMatchRequest {
  userId: string;
  assessmentId: string;
  assessmentData: Record<string, any>;
  preferences: Record<string, any>;
}

class AssessmentMatchingService {
  async createMatches(request: TherapistMatchRequest): Promise<AssessmentMatch[]> {
    try {
      // Get available therapists
      const { data: therapists } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      if (!therapists) return [];

      // Calculate compatibility scores
      const matches = therapists.map(therapist => ({
        user_id: request.userId,
        assessment_id: request.assessmentId,
        therapist_id: therapist.id,
        compatibility_score: this.calculateCompatibility(request.assessmentData, therapist, request.preferences),
        matching_factors: this.getMatchingFactors(request.assessmentData, therapist, request.preferences)
      }));

      // Sort by compatibility score and take top 5
      const topMatches = matches
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, 5);

      // Save matches to database
      const { data: savedMatches, error } = await supabase
        .from('assessment_matches')
        .insert(topMatches)
        .select();

      if (error) throw error;
      return (savedMatches || []).map(match => ({
        ...match,
        matching_factors: match.matching_factors as Record<string, any>
      }));
    } catch (error) {
      console.error('Error creating assessment matches:', error);
      throw error;
    }
  }

  async getMatchesForUser(userId: string): Promise<AssessmentMatch[]> {
    try {
      const { data, error } = await supabase
        .from('assessment_matches')
        .select('*')
        .eq('user_id', userId)
        .order('compatibility_score', { ascending: false });

      if (error) throw error;
      return (data || []).map(match => ({
        ...match,
        matching_factors: match.matching_factors as Record<string, any>
      }));
    } catch (error) {
      console.error('Error fetching assessment matches:', error);
      throw error;
    }
  }

  private calculateCompatibility(
    assessmentData: Record<string, any>,
    therapist: any,
    preferences: Record<string, any>
  ): number {
    let score = 0.5; // Base score

    // Specialty matching
    const userNeeds = assessmentData.primaryConcerns || [];
    const therapistSpecialties = therapist.specialties || [];
    const specialtyMatch = userNeeds.filter((need: string) => 
      therapistSpecialties.some((specialty: string) => 
        specialty.toLowerCase().includes(need.toLowerCase()) ||
        need.toLowerCase().includes(specialty.toLowerCase())
      )
    ).length;
    score += (specialtyMatch / Math.max(userNeeds.length, 1)) * 0.3;

    // Communication style matching
    if (preferences.communicationStyle && therapist.communication_style) {
      if (preferences.communicationStyle === therapist.communication_style) {
        score += 0.2;
      }
    }

    // Experience level preference
    if (preferences.experienceLevel) {
      const therapistYears = therapist.years_experience || 5;
      if (preferences.experienceLevel === 'beginner' && therapistYears <= 3) score += 0.1;
      if (preferences.experienceLevel === 'experienced' && therapistYears >= 7) score += 0.1;
      if (preferences.experienceLevel === 'senior' && therapistYears >= 10) score += 0.1;
    }

    // Therapy approach matching
    if (assessmentData.preferredApproach && therapist.approach) {
      if (assessmentData.preferredApproach.toLowerCase().includes(therapist.approach.toLowerCase())) {
        score += 0.15;
      }
    }

    return Math.min(1.0, Math.max(0.0, score));
  }

  private getMatchingFactors(
    assessmentData: Record<string, any>,
    therapist: any,
    preferences: Record<string, any>
  ): Record<string, any> {
    return {
      specialty_matches: (assessmentData.primaryConcerns || []).filter((concern: string) =>
        (therapist.specialties || []).some((specialty: string) =>
          specialty.toLowerCase().includes(concern.toLowerCase())
        )
      ),
      communication_match: preferences.communicationStyle === therapist.communication_style,
      approach_match: assessmentData.preferredApproach?.toLowerCase().includes(therapist.approach?.toLowerCase()),
      experience_fit: this.getExperienceFit(preferences.experienceLevel, therapist.years_experience),
      user_rating: therapist.user_rating || 4.5,
      success_rate: therapist.success_rate || 0.85
    };
  }

  private getExperienceFit(preferredLevel: string, therapistYears: number): string {
    if (!preferredLevel || !therapistYears) return 'unknown';
    
    if (preferredLevel === 'beginner' && therapistYears <= 3) return 'perfect';
    if (preferredLevel === 'experienced' && therapistYears >= 5 && therapistYears <= 10) return 'perfect';
    if (preferredLevel === 'senior' && therapistYears >= 10) return 'perfect';
    
    return 'good';
  }
}

export const assessmentMatchingService = new AssessmentMatchingService();