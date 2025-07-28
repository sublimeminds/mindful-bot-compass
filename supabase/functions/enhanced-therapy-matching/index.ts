import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userProfile, userAssessment } = await req.json();
    console.log('Enhanced therapy matching request:', { userProfile, userAssessment });

    // Get available therapist personalities
    const { data: therapists, error: therapistsError } = await supabaseClient
      .from('therapist_personalities')
      .select('*')
      .eq('is_active', true);

    if (therapistsError) {
      throw new Error(`Failed to fetch therapists: ${therapistsError.message}`);
    }

    // Get available therapy approaches
    const { data: approaches, error: approachesError } = await supabaseClient
      .from('therapy_approach_combinations')
      .select('*')
      .eq('is_active', true);

    if (approachesError) {
      throw new Error(`Failed to fetch therapy approaches: ${approachesError.message}`);
    }

    // Build comprehensive user profile from assessment data
    const enhancedProfile: UserProfile = {
      culturalBackground: userAssessment?.culturalBackground || userProfile?.culturalBackground,
      communicationStyle: userAssessment?.communicationStyle || userProfile?.communicationStyle || 'balanced',
      problemAreas: [
        ...(userAssessment?.specificProblems || []),
        ...(userAssessment?.problemDescription ? [userAssessment.problemDescription] : []),
        ...(userProfile?.problemAreas || [])
      ],
      identityFactors: [
        ...(userAssessment?.identityFactors || []),
        ...(userProfile?.identityFactors || [])
      ],
      therapyApproachPreferences: [
        ...(userAssessment?.therapyApproachPreferences || []),
        ...(userProfile?.therapyApproachPreferences || [])
      ],
      severityScores: {
        anxiety: userAssessment?.anxietyLevel || userProfile?.severityScores?.anxiety || 5,
        depression: userAssessment?.depressionLevel || userProfile?.severityScores?.depression || 5,
      }
    };

    console.log('Enhanced user profile:', enhancedProfile);

    // Calculate matches for each therapist
    const matches: TherapistMatch[] = [];
    
    for (const therapist of therapists) {
      const matchResult = calculateTherapistMatch(enhancedProfile, therapist);
      matches.push(matchResult);
    }

    // Sort by match score
    const sortedMatches = matches.sort((a, b) => b.match_score - a.match_score);

    // Select top 3 matches and provide detailed analysis
    const topMatches = sortedMatches.slice(0, 3);

    // Get therapy approach recommendations
    const approachMatches = calculateTherapyApproachMatches(enhancedProfile, approaches);

    const response = {
      success: true,
      analysis: {
        topTherapists: topMatches,
        recommendedApproaches: approachMatches.slice(0, 3),
        userProfileSummary: {
          primaryConcerns: enhancedProfile.problemAreas.slice(0, 3),
          riskLevel: Math.max(
            enhancedProfile.severityScores.anxiety || 0,
            enhancedProfile.severityScores.depression || 0
          ),
          culturalConsiderations: enhancedProfile.culturalBackground || 'General',
          communicationPreference: enhancedProfile.communicationStyle
        },
        matchingConfidence: topMatches.length > 0 ? topMatches[0].confidence : 0
      }
    };

    console.log('Enhanced therapy matching response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced therapy matching error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to perform therapy matching',
      analysis: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateTherapistMatch(userProfile: UserProfile, therapist: any): TherapistMatch {
  const factors: MatchingFactors = {
    cultural_compatibility: calculateCulturalCompatibility(userProfile, therapist),
    communication_alignment: calculateCommunicationAlignment(userProfile, therapist),
    specialty_relevance: calculateSpecialtyRelevance(userProfile, therapist),
    approach_preference: calculateApproachAlignment(userProfile, therapist),
    severity_appropriateness: calculateSeverityAppropriateness(userProfile, therapist),
    identity_considerations: calculateIdentityConsiderations(userProfile, therapist)
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
  
  const reasoning = generateMatchReasoning(factors, therapist);
  const confidence = calculateConfidence(factors);
  
  return {
    therapist_id: therapist.id,
    match_score: Math.round(match_score * 100),
    match_factors: factors,
    reasoning,
    confidence
  };
}

function calculateCulturalCompatibility(userProfile: UserProfile, therapist: any): number {
  let score = 0.5; // Base score
  
  // Cultural background alignment
  if (userProfile.culturalBackground && therapist.specialties) {
    const userBackground = userProfile.culturalBackground.toLowerCase();
    const therapistSpecialties = therapist.specialties.map((s: string) => s.toLowerCase());
    
    if (therapistSpecialties.some((specialty: string) => 
      specialty.includes('cultural') || specialty.includes('diversity') ||
      specialty.includes(userBackground) || userBackground.includes('multicultural')
    )) {
      score += 0.4;
    }
  }
  
  return Math.min(score, 1.0);
}

function calculateCommunicationAlignment(userProfile: UserProfile, therapist: any): number {
  let score = 0.6; // Base score
  
  if (userProfile.communicationStyle && therapist.communication_style) {
    const alignmentMap: { [key: string]: string[] } = {
      'direct': ['direct', 'straightforward', 'honest'],
      'indirect': ['gentle', 'contextual', 'nuanced'],
      'formal': ['professional', 'structured', 'respectful'],
      'casual': ['relaxed', 'informal', 'friendly'],
      'balanced': ['adaptive', 'flexible', 'personalized']
    };
    
    const userStyle = userProfile.communicationStyle;
    const therapistStyle = therapist.communication_style.toLowerCase();
    
    if (alignmentMap[userStyle]?.some(style => therapistStyle.includes(style))) {
      score += 0.4;
    }
  }
  
  return Math.min(score, 1.0);
}

function calculateSpecialtyRelevance(userProfile: UserProfile, therapist: any): number {
  let score = 0;
  const userProblems = userProfile.problemAreas.map(p => p.toLowerCase());
  const therapistSpecialties = therapist.specialties.map((s: string) => s.toLowerCase());
  
  // Direct specialty matches
  let matches = 0;
  const totalProblems = userProblems.length;
  
  for (const problem of userProblems) {
    if (therapistSpecialties.some(specialty => 
      specialty.includes(problem) || problem.includes(specialty) ||
      isRelatedSpecialty(problem, specialty)
    )) {
      matches++;
    }
  }
  
  score = totalProblems > 0 ? matches / totalProblems : 0.5;
  
  // Bonus for high-need specialties
  const criticalSpecialties = ['trauma', 'ptsd', 'eating disorders', 'substance abuse', 'crisis'];
  if (userProblems.some(problem => criticalSpecialties.some(critical => problem.includes(critical))) &&
      therapistSpecialties.some(specialty => criticalSpecialties.some(critical => specialty.includes(critical)))) {
    score += 0.2;
  }
  
  return Math.min(score, 1.0);
}

function calculateApproachAlignment(userProfile: UserProfile, therapist: any): number {
  let score = 0.5; // Base score
  
  if (userProfile.therapyApproachPreferences.length > 0) {
    const userPreferences = userProfile.therapyApproachPreferences.map(p => p.toLowerCase());
    const therapistApproaches = (therapist.therapeutic_techniques || []).map((a: string) => a.toLowerCase());
    
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

function calculateSeverityAppropriateness(userProfile: UserProfile, therapist: any): number {
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

function calculateIdentityConsiderations(userProfile: UserProfile, therapist: any): number {
  let score = 0.5; // Base score
  
  if (userProfile.identityFactors.length > 0) {
    const identityFactors = userProfile.identityFactors.map(f => f.toLowerCase());
    const therapistSpecialties = (therapist.specialties || []).map((s: string) => s.toLowerCase());
    
    let matches = 0;
    for (const factor of identityFactors) {
      if (therapistSpecialties.some(specialty => 
        specialty.includes(factor) || factor.includes(specialty)
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

function generateMatchReasoning(factors: MatchingFactors, therapist: any): string[] {
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

function calculateConfidence(factors: MatchingFactors): number {
  const scores = Object.values(factors);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
  
  // Higher confidence when scores are consistently high and low variance
  const consistency = Math.max(0, 1 - variance);
  const quality = average;
  
  return Math.min((consistency * 0.3 + quality * 0.7), 1.0);
}

function calculateTherapyApproachMatches(userProfile: UserProfile, approaches: any[]): any[] {
  return approaches.map(approach => {
    let score = 0.5; // Base score
    
    // Match based on problem areas
    const userProblems = userProfile.problemAreas.map(p => p.toLowerCase());
    const approachSpecialties = (approach.effective_for || []).map((s: string) => s.toLowerCase());
    
    let matches = 0;
    for (const problem of userProblems) {
      if (approachSpecialties.some(specialty => 
        specialty.includes(problem) || problem.includes(specialty)
      )) {
        matches++;
      }
    }
    
    if (userProblems.length > 0) {
      score = matches / userProblems.length;
    }
    
    // Bonus for evidence-based approaches
    if (approach.evidence_level === 'strong') {
      score += 0.2;
    }
    
    return {
      approach: approach.name,
      match_score: Math.round(score * 100),
      reasoning: `Effective for ${approach.effective_for?.slice(0, 2).join(', ')}`,
      confidence: score
    };
  }).sort((a, b) => b.match_score - a.match_score);
}

function isRelatedSpecialty(userProblem: string, therapistSpecialty: string): boolean {
  const relatedTerms: { [key: string]: string[] } = {
    'anxiety': ['stress', 'worry', 'panic', 'phobia'],
    'depression': ['mood', 'sadness', 'melancholy', 'dysthymia'],
    'trauma': ['ptsd', 'abuse', 'violence', 'grief'],
    'relationship': ['couples', 'family', 'intimacy', 'communication'],
    'addiction': ['substance', 'dependency', 'compulsive', 'behavioral']
  };
  
  for (const [category, terms] of Object.entries(relatedTerms)) {
    if (userProblem.includes(category) || terms.some(term => userProblem.includes(term))) {
      if (therapistSpecialty.includes(category) || terms.some(term => therapistSpecialty.includes(term))) {
        return true;
      }
    }
  }
  
  return false;
}