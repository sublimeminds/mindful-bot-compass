
import { supabase } from '@/integrations/supabase/client';

export interface IntakeAnalysis {
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  personalityProfile: Record<string, any>;
  treatmentRecommendations: string[];
  therapistMatchCriteria: Record<string, any>;
  interventionPriorities: string[];
  estimatedDuration: number;
}

export interface TherapistMatch {
  therapistId: string;
  compatibilityScore: number;
  matchingFactors: string[];
  specialtyMatch: boolean;
  communicationStyleMatch: boolean;
}

class SmartTherapyService {
  async analyzeIntakeData(userId: string): Promise<IntakeAnalysis> {
    try {
      // Fetch user's intake data
      const { data: intakeData } = await supabase
        .from('user_intake_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch assessment results
      const { data: assessments } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .eq('user_id', userId);

      if (!intakeData || !assessments) {
        throw new Error('Incomplete assessment data');
      }

      // Analyze risk level
      const riskLevel = this.calculateRiskLevel(assessments);
      
      // Generate personality profile
      const personalityProfile = this.generatePersonalityProfile(intakeData, assessments);
      
      // Create treatment recommendations
      const treatmentRecommendations = this.generateTreatmentRecommendations(intakeData, assessments, riskLevel);
      
      // Define therapist matching criteria
      const therapistMatchCriteria = this.generateTherapistCriteria(intakeData, assessments);
      
      // Prioritize interventions
      const interventionPriorities = this.prioritizeInterventions(assessments, riskLevel);
      
      // Estimate therapy duration
      const estimatedDuration = this.estimateTherapyDuration(assessments, riskLevel);

      const analysis: IntakeAnalysis = {
        riskLevel,
        personalityProfile,
        treatmentRecommendations,
        therapistMatchCriteria,
        interventionPriorities,
        estimatedDuration
      };

      // Save analysis to database
      await supabase
        .from('ai_therapy_analysis')
        .upsert({
          user_id: userId,
          personality_profile: personalityProfile,
          treatment_recommendations: treatmentRecommendations,
          therapist_match_scores: therapistMatchCriteria,
          computed_risk_level: riskLevel,
          intervention_priorities: interventionPriorities,
          estimated_therapy_duration: estimatedDuration,
          confidence_score: 0.85
        });

      return analysis;
    } catch (error) {
      console.error('Error analyzing intake data:', error);
      throw error;
    }
  }

  private calculateRiskLevel(assessments: any[]): 'low' | 'moderate' | 'high' | 'crisis' {
    const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9');
    const gad7 = assessments.find(a => a.assessment_type === 'GAD-7');

    let riskScore = 0;

    // Depression risk
    if (phq9) {
      if (phq9.total_score >= 15) riskScore += 3;
      else if (phq9.total_score >= 10) riskScore += 2;
      else if (phq9.total_score >= 5) riskScore += 1;
    }

    // Anxiety risk
    if (gad7) {
      if (gad7.total_score >= 15) riskScore += 3;
      else if (gad7.total_score >= 10) riskScore += 2;
      else if (gad7.total_score >= 5) riskScore += 1;
    }

    if (riskScore >= 5) return 'crisis';
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'moderate';
    return 'low';
  }

  private generatePersonalityProfile(intakeData: any, assessments: any[]): Record<string, any> {
    const profile: Record<string, any> = {
      communicationStyle: intakeData.preferred_communication_style || 'supportive',
      stressLevel: intakeData.financial_stress_level || 5,
      socialSupport: intakeData.social_support_level || 5,
      sleepQuality: intakeData.sleep_hours_avg < 6 ? 'poor' : intakeData.sleep_hours_avg > 8 ? 'good' : 'average',
      exerciseLevel: intakeData.exercise_frequency || 'low',
      previousTherapyExperience: intakeData.previous_therapy,
      culturalBackground: intakeData.cultural_background
    };

    // Add assessment-based traits
    const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9');
    const gad7 = assessments.find(a => a.assessment_type === 'GAD-7');

    if (phq9) {
      profile.depressionSeverity = phq9.severity_level;
    }

    if (gad7) {
      profile.anxietySeverity = gad7.severity_level;
    }

    return profile;
  }

  private generateTreatmentRecommendations(intakeData: any, assessments: any[], riskLevel: string): string[] {
    const recommendations: string[] = [];

    // Risk-based recommendations
    if (riskLevel === 'crisis' || riskLevel === 'high') {
      recommendations.push('Immediate crisis intervention protocol');
      recommendations.push('Weekly therapy sessions recommended');
      recommendations.push('Consider psychiatric evaluation for medication');
    }

    // Assessment-based recommendations
    const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9');
    const gad7 = assessments.find(a => a.assessment_type === 'GAD-7');

    if (phq9 && phq9.total_score >= 10) {
      recommendations.push('Cognitive Behavioral Therapy (CBT) for depression');
      recommendations.push('Behavioral activation techniques');
    }

    if (gad7 && gad7.total_score >= 10) {
      recommendations.push('Anxiety management and relaxation techniques');
      recommendations.push('Mindfulness-based stress reduction');
    }

    // Lifestyle recommendations
    if (intakeData.sleep_hours_avg < 7) {
      recommendations.push('Sleep hygiene improvement program');
    }

    if (intakeData.exercise_frequency === 'none' || intakeData.exercise_frequency === '1-2-times-week') {
      recommendations.push('Regular exercise routine integration');
    }

    if (intakeData.social_support_level < 5) {
      recommendations.push('Social support network building');
    }

    return recommendations;
  }

  private generateTherapistCriteria(intakeData: any, assessments: any[]): Record<string, any> {
    const criteria: Record<string, any> = {
      communicationStyle: intakeData.preferred_communication_style,
      culturalCompetency: intakeData.cultural_background ? [intakeData.cultural_background] : [],
      specialties: [],
      experienceLevel: 'experienced'
    };

    // Add specialty requirements based on assessments
    const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9');
    const gad7 = assessments.find(a => a.assessment_type === 'GAD-7');

    if (phq9 && phq9.total_score >= 10) {
      criteria.specialties.push('depression', 'CBT');
    }

    if (gad7 && gad7.total_score >= 10) {
      criteria.specialties.push('anxiety', 'mindfulness');
    }

    if (intakeData.mental_health_diagnoses?.includes('PTSD')) {
      criteria.specialties.push('trauma', 'EMDR');
    }

    return criteria;
  }

  private prioritizeInterventions(assessments: any[], riskLevel: string): string[] {
    const priorities: string[] = [];

    if (riskLevel === 'crisis' || riskLevel === 'high') {
      priorities.push('Crisis stabilization');
      priorities.push('Safety planning');
    }

    const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9');
    const gad7 = assessments.find(a => a.assessment_type === 'GAD-7');

    if (phq9 && phq9.total_score >= gad7?.total_score) {
      priorities.push('Depression treatment');
      priorities.push('Anxiety management');
    } else if (gad7) {
      priorities.push('Anxiety management');
      priorities.push('Depression treatment');
    }

    priorities.push('Lifestyle improvements');
    priorities.push('Coping skills development');

    return priorities;
  }

  private estimateTherapyDuration(assessments: any[], riskLevel: string): number {
    let baseWeeks = 12; // Default 12 weeks

    // Adjust based on risk level
    if (riskLevel === 'crisis') baseWeeks = 24;
    else if (riskLevel === 'high') baseWeeks = 18;
    else if (riskLevel === 'moderate') baseWeeks = 12;
    else baseWeeks = 8;

    // Adjust based on severity
    const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9');
    const gad7 = assessments.find(a => a.assessment_type === 'GAD-7');

    if (phq9 && phq9.total_score >= 15) baseWeeks += 4;
    if (gad7 && gad7.total_score >= 15) baseWeeks += 4;

    return Math.min(baseWeeks, 52); // Cap at 1 year
  }

  async generateTherapistMatches(userId: string): Promise<TherapistMatch[]> {
    try {
      // Get AI analysis
      const { data: analysis } = await supabase
        .from('ai_therapy_analysis')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get available therapists
      const { data: therapists } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      if (!analysis || !therapists) {
        return [];
      }

      const matches: TherapistMatch[] = therapists.map(therapist => {
        const compatibilityScore = this.calculateCompatibilityScore(analysis, therapist);
        const matchingFactors = this.getMatchingFactors(analysis, therapist);
        
        return {
          therapistId: therapist.id,
          compatibilityScore,
          matchingFactors,
          specialtyMatch: this.checkSpecialtyMatch(analysis, therapist),
          communicationStyleMatch: this.checkCommunicationMatch(analysis, therapist)
        };
      });

      // Sort by compatibility score
      matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      return matches.slice(0, 5); // Return top 5 matches
    } catch (error) {
      console.error('Error generating therapist matches:', error);
      return [];
    }
  }

  private calculateCompatibilityScore(analysis: any, therapist: any): number {
    let score = 0.5; // Base score

    // Communication style match
    if (analysis.personality_profile?.communicationStyle === therapist.communication_style) {
      score += 0.2;
    }

    // Specialty match
    const userNeeds = analysis.intervention_priorities || [];
    const therapistSpecialties = therapist.specialties || [];
    
    const specialtyOverlap = userNeeds.filter((need: string) => 
      therapistSpecialties.some((specialty: string) => 
        specialty.toLowerCase().includes(need.toLowerCase())
      )
    ).length;

    score += (specialtyOverlap / Math.max(userNeeds.length, 1)) * 0.3;

    return Math.min(score, 1.0); // Cap at 1.0
  }

  private getMatchingFactors(analysis: any, therapist: any): string[] {
    const factors: string[] = [];

    if (analysis.personality_profile?.communicationStyle === therapist.communication_style) {
      factors.push('Communication style match');
    }

    // Check specialty overlaps
    const userNeeds = analysis.intervention_priorities || [];
    const therapistSpecialties = therapist.specialties || [];
    
    userNeeds.forEach((need: string) => {
      if (therapistSpecialties.some((specialty: string) => 
        specialty.toLowerCase().includes(need.toLowerCase())
      )) {
        factors.push(`Specialty in ${need}`);
      }
    });

    return factors;
  }

  private checkSpecialtyMatch(analysis: any, therapist: any): boolean {
    const userNeeds = analysis.intervention_priorities || [];
    const therapistSpecialties = therapist.specialties || [];
    
    return userNeeds.some((need: string) => 
      therapistSpecialties.some((specialty: string) => 
        specialty.toLowerCase().includes(need.toLowerCase())
      )
    );
  }

  private checkCommunicationMatch(analysis: any, therapist: any): boolean {
    return analysis.personality_profile?.communicationStyle === therapist.communication_style;
  }
}

export const smartTherapyService = new SmartTherapyService();
