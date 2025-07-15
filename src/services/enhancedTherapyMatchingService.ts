interface PersonalityProfile {
  communication: 'direct' | 'empathetic' | 'analytical' | 'nurturing';
  approach: 'structured' | 'flexible' | 'creative' | 'evidence-based';
  cultural_sensitivity: number; // 1-10 scale
  specialties: string[];
  experience_level: 'junior' | 'mid' | 'senior' | 'expert';
}

interface UserProfile {
  culturalBackground?: string;
  communicationStyle?: string;
  problemAreas: string[];
  identityFactors: string[];
  therapyApproachPreferences: string[];
  severityScores: {
    anxiety?: number;
    depression?: number;
  };
}

interface MatchingFactors {
  cultural_compatibility: number;
  communication_alignment: number;
  specialty_relevance: number;
  approach_preference: number;
  severity_appropriateness: number;
  identity_considerations: number;
}

interface TherapistMatch {
  therapist_id: string;
  match_score: number;
  match_factors: MatchingFactors;
  reasoning: string[];
  confidence: number;
}

export class EnhancedTherapyMatchingService {
  
  /**
   * Enhanced AI-powered therapist matching algorithm
   */
  static async matchTherapists(userProfile: UserProfile, availableTherapists: any[]): Promise<TherapistMatch[]> {
    const matches: TherapistMatch[] = [];
    
    for (const therapist of availableTherapists) {
      const matchResult = this.calculateTherapistMatch(userProfile, therapist);
      matches.push(matchResult);
    }
    
    // Sort by match score and return top matches
    return matches.sort((a, b) => b.match_score - a.match_score);
  }
  
  private static calculateTherapistMatch(userProfile: UserProfile, therapist: any): TherapistMatch {
    const factors: MatchingFactors = {
      cultural_compatibility: this.calculateCulturalCompatibility(userProfile, therapist),
      communication_alignment: this.calculateCommunicationAlignment(userProfile, therapist),
      specialty_relevance: this.calculateSpecialtyRelevance(userProfile, therapist),
      approach_preference: this.calculateApproachAlignment(userProfile, therapist),
      severity_appropriateness: this.calculateSeverityAppropriatenesss(userProfile, therapist),
      identity_considerations: this.calculateIdentityConsiderations(userProfile, therapist)
    };
    
    // Weighted scoring system
    const weights = {
      specialty_relevance: 0.25,
      cultural_compatibility: 0.20,
      communication_alignment: 0.15,
      approach_preference: 0.15,
      severity_appropriateness: 0.15,
      identity_considerations: 0.10
    };
    
    const match_score = Object.entries(factors).reduce((total, [key, value]) => {
      const weight = weights[key as keyof typeof weights] || 0;
      return total + (value * weight);
    }, 0);
    
    const reasoning = this.generateMatchReasoning(factors, therapist);
    const confidence = this.calculateConfidence(factors);
    
    return {
      therapist_id: therapist.id,
      match_score: Math.round(match_score * 100),
      match_factors: factors,
      reasoning,
      confidence
    };
  }
  
  private static calculateCulturalCompatibility(userProfile: UserProfile, therapist: any): number {
    let score = 0.5; // Base score
    
    // Cultural background alignment
    if (userProfile.culturalBackground && therapist.cultural_specialties) {
      const userBackground = userProfile.culturalBackground.toLowerCase();
      const therapistSpecialties = therapist.cultural_specialties.map((s: string) => s.toLowerCase());
      
      if (therapistSpecialties.some((specialty: string) => 
        specialty.includes(userBackground) || userBackground.includes(specialty)
      )) {
        score += 0.3;
      }
    }
    
    // Multicultural competency
    if (therapist.multicultural_training || therapist.diversity_focus) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }
  
  private static calculateCommunicationAlignment(userProfile: UserProfile, therapist: any): number {
    let score = 0.6; // Base score
    
    if (userProfile.communicationStyle && therapist.communication_style) {
      const alignmentMap: { [key: string]: string[] } = {
        'direct': ['direct', 'straightforward', 'honest'],
        'indirect': ['gentle', 'contextual', 'nuanced'],
        'formal': ['professional', 'structured', 'respectful'],
        'casual': ['relaxed', 'informal', 'friendly']
      };
      
      const userStyle = userProfile.communicationStyle;
      const therapistStyle = therapist.communication_style.toLowerCase();
      
      if (alignmentMap[userStyle]?.some(style => therapistStyle.includes(style))) {
        score += 0.4;
      }
    }
    
    return Math.min(score, 1.0);
  }
  
  private static calculateSpecialtyRelevance(userProfile: UserProfile, therapist: any): number {
    let score = 0;
    const userProblems = userProfile.problemAreas.map(p => p.toLowerCase());
    const therapistSpecialties = therapist.specialties.map((s: string) => s.toLowerCase());
    
    // Direct specialty matches
    let matches = 0;
    const totalProblems = userProblems.length;
    
    for (const problem of userProblems) {
      if (therapistSpecialties.some(specialty => 
        specialty.includes(problem) || problem.includes(specialty)
      )) {
        matches++;
      }
    }
    
    score = totalProblems > 0 ? matches / totalProblems : 0.5;
    
    // Bonus for high-need specialties
    const criticalSpecialties = ['trauma', 'ptsd', 'eating disorders', 'substance abuse'];
    if (userProblems.some(problem => criticalSpecialties.includes(problem)) &&
        therapistSpecialties.some(specialty => criticalSpecialties.some(critical => specialty.includes(critical)))) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }
  
  private static calculateApproachAlignment(userProfile: UserProfile, therapist: any): number {
    let score = 0.5; // Base score
    
    if (userProfile.therapyApproachPreferences.length > 0) {
      const userPreferences = userProfile.therapyApproachPreferences.map(p => p.toLowerCase());
      const therapistApproaches = (therapist.therapy_approaches || []).map((a: string) => a.toLowerCase());
      
      let matches = 0;
      for (const preference of userPreferences) {
        if (therapistApproaches.some(approach => 
          approach.includes(preference) || preference.includes(approach)
        )) {
          matches++;
        }
      }
      
      if (userPreferences.length > 0) {
        score = matches / userPreferences.length;
      }
    }
    
    return Math.min(score, 1.0);
  }
  
  private static calculateSeverityAppropriatenesss(userProfile: UserProfile, therapist: any): number {
    let score = 0.7; // Base score
    
    const anxiety = userProfile.severityScores?.anxiety || 0;
    const depression = userProfile.severityScores?.depression || 0;
    const maxSeverity = Math.max(anxiety, depression);
    
    // Match therapist experience level with severity
    if (maxSeverity >= 15) { // Severe
      if (therapist.experience_level === 'expert' || therapist.years_experience > 10) {
        score += 0.3;
      }
    } else if (maxSeverity >= 10) { // Moderate
      if (['senior', 'expert'].includes(therapist.experience_level) || therapist.years_experience > 5) {
        score += 0.2;
      }
    } else { // Mild
      score += 0.1; // Any therapist can handle mild cases
    }
    
    return Math.min(score, 1.0);
  }
  
  private static calculateIdentityConsiderations(userProfile: UserProfile, therapist: any): number {
    let score = 0.5; // Base score
    
    if (userProfile.identityFactors.length > 0) {
      const identityFactors = userProfile.identityFactors.map(f => f.toLowerCase());
      const therapistFocus = (therapist.identity_specializations || []).map((s: string) => s.toLowerCase());
      
      let matches = 0;
      for (const factor of identityFactors) {
        if (therapistFocus.some(focus => 
          focus.includes(factor) || factor.includes(focus)
        )) {
          matches++;
        }
      }
      
      if (identityFactors.length > 0) {
        score = Math.min(0.5 + (matches / identityFactors.length) * 0.5, 1.0);
      }
    }
    
    return score;
  }
  
  private static generateMatchReasoning(factors: MatchingFactors, therapist: any): string[] {
    const reasoning: string[] = [];
    
    if (factors.specialty_relevance > 0.7) {
      reasoning.push(`Specializes in your main areas of concern`);
    }
    
    if (factors.cultural_compatibility > 0.7) {
      reasoning.push(`Strong cultural compatibility and sensitivity`);
    }
    
    if (factors.communication_alignment > 0.7) {
      reasoning.push(`Communication style aligns with your preferences`);
    }
    
    if (factors.approach_preference > 0.7) {
      reasoning.push(`Uses therapy approaches you prefer`);
    }
    
    if (factors.severity_appropriateness > 0.8) {
      reasoning.push(`Experience level matches your needs`);
    }
    
    if (factors.identity_considerations > 0.7) {
      reasoning.push(`Understanding of your identity and background`);
    }
    
    if (therapist.years_experience > 10) {
      reasoning.push(`Extensive clinical experience (${therapist.years_experience}+ years)`);
    }
    
    if (therapist.user_rating > 4.5) {
      reasoning.push(`Highly rated by clients (${therapist.user_rating}/5.0)`);
    }
    
    return reasoning.slice(0, 3); // Return top 3 reasons
  }
  
  private static calculateConfidence(factors: MatchingFactors): number {
    const scores = Object.values(factors);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    
    // Higher confidence when scores are consistently high and low variance
    const consistency = Math.max(0, 1 - variance);
    const quality = average;
    
    return Math.min((consistency * 0.3 + quality * 0.7), 1.0);
  }
}