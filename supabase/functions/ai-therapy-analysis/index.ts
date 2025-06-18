
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  userId: string;
  includeTherapistMatching?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, includeTherapistMatching = true }: AnalysisRequest = await req.json()

    // Fetch user's intake data and assessments
    const { data: intakeData } = await supabaseClient
      .from('user_intake_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: assessments } = await supabaseClient
      .from('mental_health_assessments')
      .select('*')
      .eq('user_id', userId)

    if (!intakeData || !assessments) {
      return new Response(
        JSON.stringify({ error: 'Incomplete assessment data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Perform AI analysis (simplified version)
    const analysis = await performAIAnalysis(intakeData, assessments)

    // Save analysis results
    const { error: saveError } = await supabaseClient
      .from('ai_therapy_analysis')
      .upsert({
        user_id: userId,
        personality_profile: analysis.personalityProfile,
        treatment_recommendations: analysis.treatmentRecommendations,
        therapist_match_scores: analysis.therapistMatchCriteria,
        computed_risk_level: analysis.riskLevel,
        intervention_priorities: analysis.interventionPriorities,
        estimated_therapy_duration: analysis.estimatedDuration,
        confidence_score: analysis.confidenceScore
      })

    if (saveError) {
      console.error('Error saving analysis:', saveError)
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate therapist matches if requested
    let therapistMatches = null
    if (includeTherapistMatching) {
      therapistMatches = await generateTherapistMatches(supabaseClient, analysis, userId)
    }

    return new Response(
      JSON.stringify({ 
        analysis,
        therapistMatches,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function performAIAnalysis(intakeData: any, assessments: any[]) {
  // Calculate risk level
  const riskLevel = calculateRiskLevel(assessments)
  
  // Generate personality profile
  const personalityProfile = {
    communicationStyle: intakeData.preferred_communication_style || 'supportive',
    stressLevel: intakeData.financial_stress_level || 5,
    socialSupport: intakeData.social_support_level || 5,
    sleepQuality: intakeData.sleep_hours_avg < 6 ? 'poor' : intakeData.sleep_hours_avg > 8 ? 'good' : 'average',
    exerciseLevel: intakeData.exercise_frequency || 'low',
    previousTherapyExperience: intakeData.previous_therapy,
    culturalBackground: intakeData.cultural_background
  }

  // Add assessment-based traits
  const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9')
  const gad7 = assessments.find(a => a.assessment_type === 'GAD-7')

  if (phq9) personalityProfile.depressionSeverity = phq9.severity_level
  if (gad7) personalityProfile.anxietySeverity = gad7.severity_level

  // Generate treatment recommendations
  const treatmentRecommendations = generateTreatmentRecommendations(intakeData, assessments, riskLevel)
  
  // Create therapist matching criteria
  const therapistMatchCriteria = {
    communicationStyle: intakeData.preferred_communication_style,
    culturalCompetency: intakeData.cultural_background ? [intakeData.cultural_background] : [],
    specialties: [],
    experienceLevel: 'experienced'
  }

  // Add specialty requirements
  if (phq9 && phq9.total_score >= 10) {
    therapistMatchCriteria.specialties.push('depression', 'CBT')
  }
  if (gad7 && gad7.total_score >= 10) {
    therapistMatchCriteria.specialties.push('anxiety', 'mindfulness')
  }

  // Prioritize interventions
  const interventionPriorities = prioritizeInterventions(assessments, riskLevel)
  
  // Estimate therapy duration
  const estimatedDuration = estimateTherapyDuration(assessments, riskLevel)

  return {
    riskLevel,
    personalityProfile,
    treatmentRecommendations,
    therapistMatchCriteria,
    interventionPriorities,
    estimatedDuration,
    confidenceScore: 0.85
  }
}

function calculateRiskLevel(assessments: any[]): string {
  const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9')
  const gad7 = assessments.find(a => a.assessment_type === 'GAD-7')

  let riskScore = 0

  if (phq9) {
    if (phq9.total_score >= 15) riskScore += 3
    else if (phq9.total_score >= 10) riskScore += 2
    else if (phq9.total_score >= 5) riskScore += 1
  }

  if (gad7) {
    if (gad7.total_score >= 15) riskScore += 3
    else if (gad7.total_score >= 10) riskScore += 2
    else if (gad7.total_score >= 5) riskScore += 1
  }

  if (riskScore >= 5) return 'crisis'
  if (riskScore >= 3) return 'high'
  if (riskScore >= 1) return 'moderate'
  return 'low'
}

function generateTreatmentRecommendations(intakeData: any, assessments: any[], riskLevel: string): string[] {
  const recommendations: string[] = []

  if (riskLevel === 'crisis' || riskLevel === 'high') {
    recommendations.push('Immediate crisis intervention protocol')
    recommendations.push('Weekly therapy sessions recommended')
    recommendations.push('Consider psychiatric evaluation for medication')
  }

  const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9')
  const gad7 = assessments.find(a => a.assessment_type === 'GAD-7')

  if (phq9 && phq9.total_score >= 10) {
    recommendations.push('Cognitive Behavioral Therapy (CBT) for depression')
    recommendations.push('Behavioral activation techniques')
  }

  if (gad7 && gad7.total_score >= 10) {
    recommendations.push('Anxiety management and relaxation techniques')
    recommendations.push('Mindfulness-based stress reduction')
  }

  if (intakeData.sleep_hours_avg < 7) {
    recommendations.push('Sleep hygiene improvement program')
  }

  if (intakeData.exercise_frequency === 'none' || intakeData.exercise_frequency === '1-2-times-week') {
    recommendations.push('Regular exercise routine integration')
  }

  return recommendations
}

function prioritizeInterventions(assessments: any[], riskLevel: string): string[] {
  const priorities: string[] = []

  if (riskLevel === 'crisis' || riskLevel === 'high') {
    priorities.push('Crisis stabilization')
    priorities.push('Safety planning')
  }

  const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9')
  const gad7 = assessments.find(a => a.assessment_type === 'GAD-7')

  if (phq9 && phq9.total_score >= (gad7?.total_score || 0)) {
    priorities.push('Depression treatment')
    priorities.push('Anxiety management')
  } else if (gad7) {
    priorities.push('Anxiety management')
    priorities.push('Depression treatment')
  }

  priorities.push('Lifestyle improvements')
  priorities.push('Coping skills development')

  return priorities
}

function estimateTherapyDuration(assessments: any[], riskLevel: string): number {
  let baseWeeks = 12

  if (riskLevel === 'crisis') baseWeeks = 24
  else if (riskLevel === 'high') baseWeeks = 18
  else if (riskLevel === 'moderate') baseWeeks = 12
  else baseWeeks = 8

  const phq9 = assessments.find(a => a.assessment_type === 'PHQ-9')
  const gad7 = assessments.find(a => a.assessment_type === 'GAD-7')

  if (phq9 && phq9.total_score >= 15) baseWeeks += 4
  if (gad7 && gad7.total_score >= 15) baseWeeks += 4

  return Math.min(baseWeeks, 52)
}

async function generateTherapistMatches(supabaseClient: any, analysis: any, userId: string) {
  const { data: therapists } = await supabaseClient
    .from('therapist_personalities')
    .select('*')
    .eq('is_active', true)

  if (!therapists) return []

  const matches = therapists.map((therapist: any) => {
    let score = 0.5

    // Communication style match
    if (analysis.personalityProfile?.communicationStyle === therapist.communication_style) {
      score += 0.2
    }

    // Specialty match
    const userNeeds = analysis.interventionPriorities || []
    const therapistSpecialties = therapist.specialties || []
    
    const specialtyOverlap = userNeeds.filter((need: string) => 
      therapistSpecialties.some((specialty: string) => 
        specialty.toLowerCase().includes(need.toLowerCase())
      )
    ).length

    score += (specialtyOverlap / Math.max(userNeeds.length, 1)) * 0.3

    return {
      therapistId: therapist.id,
      compatibilityScore: Math.min(score, 1.0),
      matchingFactors: getMatchingFactors(analysis, therapist),
      specialtyMatch: checkSpecialtyMatch(analysis, therapist),
      communicationStyleMatch: analysis.personalityProfile?.communicationStyle === therapist.communication_style
    }
  })

  return matches.sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore).slice(0, 5)
}

function getMatchingFactors(analysis: any, therapist: any): string[] {
  const factors: string[] = []

  if (analysis.personalityProfile?.communicationStyle === therapist.communication_style) {
    factors.push('Communication style match')
  }

  const userNeeds = analysis.interventionPriorities || []
  const therapistSpecialties = therapist.specialties || []
  
  userNeeds.forEach((need: string) => {
    if (therapistSpecialties.some((specialty: string) => 
      specialty.toLowerCase().includes(need.toLowerCase())
    )) {
      factors.push(`Specialty in ${need}`)
    }
  })

  return factors
}

function checkSpecialtyMatch(analysis: any, therapist: any): boolean {
  const userNeeds = analysis.interventionPriorities || []
  const therapistSpecialties = therapist.specialties || []
  
  return userNeeds.some((need: string) => 
    therapistSpecialties.some((specialty: string) => 
      specialty.toLowerCase().includes(need.toLowerCase())
    )
  )
}
