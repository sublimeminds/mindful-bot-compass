import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userId, 
      currentPlan, 
      progressPattern, 
      recentAnalytics, 
      generateRecommendations 
    } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'UserId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get comprehensive user data for enhanced analysis
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: culturalProfile } = await supabase
      .from('user_cultural_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: traumaHistory } = await supabase
      .from('trauma_history')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('start_time', { ascending: false });

    const { data: goalProgress } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    const { data: moodTrends } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const { data: previousAdaptations } = await supabase
      .from('therapy_plan_adaptations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Generate AI-powered comprehensive therapy plan adaptation using Claude Opus
    const adaptationPrompt = `
    You are the world's most advanced AI therapy planning system powered by Claude Opus. You provide evidence-based, culturally sensitive, trauma-informed therapeutic analysis and recommendations that exceed human clinical standards.

    COMPREHENSIVE USER DATA:
    Current Plan: ${JSON.stringify(currentPlan, null, 2)}
    Progress Patterns: ${JSON.stringify(progressPattern, null, 2)}
    Recent Analytics: ${JSON.stringify(recentAnalytics, null, 2)}
    User Profile: ${JSON.stringify(userProfile, null, 2)}
    Cultural Profile: ${JSON.stringify(culturalProfile, null, 2)}
    Trauma History: ${JSON.stringify(traumaHistory, null, 2)}
    Recent Sessions (30 days): ${JSON.stringify(recentSessions, null, 2)}
    Goal Progress: ${JSON.stringify(goalProgress, null, 2)}
    Mood Trends (30 days): ${JSON.stringify(moodTrends, null, 2)}
    Previous Adaptations: ${JSON.stringify(previousAdaptations, null, 2)}

    ANALYSIS REQUIREMENTS:
    1. Conduct deep psychological pattern analysis
    2. Apply trauma-informed care principles
    3. Consider cultural competency and sensitivity
    4. Analyze treatment resistance and engagement patterns
    5. Evaluate multi-modal therapeutic effectiveness
    6. Assess for comorbid conditions and complex presentations
    7. Predict optimal intervention timing and sequencing
    8. Generate evidence-based outcome predictions

    Generate comprehensive therapy plan adaptations with the following enhanced JSON structure:
    {
      "adaptations_needed": boolean,
      "severity_level": "low|medium|high|critical",
      "recommendations": [
        {
          "type": "technique|approach|focus|intervention",
          "priority": "low|medium|high|urgent",
          "description": "specific_recommendation",
          "reasoning": "detailed_explanation",
          "confidence": 0.0-1.0,
          "expected_impact": "description_of_expected_outcome",
          "implementation_timeline": "immediate|within_week|within_month"
        }
      ],
      "optimal_approaches": {
        "primary": {
          "name": "approach_name",
          "reasoning": "why_this_approach",
          "techniques": ["technique1", "technique2"],
          "target_conditions": ["condition1", "condition2"]
        },
        "secondary": {
          "name": "approach_name",
          "reasoning": "why_this_approach",
          "techniques": ["technique1", "technique2"]
        }
      },
      "session_modifications": {
        "frequency": "recommended_frequency",
        "duration": "recommended_duration",
        "focus_areas": ["area1", "area2"],
        "techniques_to_emphasize": ["technique1", "technique2"],
        "techniques_to_reduce": ["technique1", "technique2"]
      },
      "crisis_prevention": {
        "risk_assessment": "low|medium|high|critical",
        "early_warning_signs": ["sign1", "sign2"],
        "intervention_protocols": ["protocol1", "protocol2"],
        "safety_planning_needed": boolean
      },
      "progress_predictions": {
        "expected_timeline": "weeks_to_improvement",
        "success_probability": 0.0-1.0,
        "key_milestones": ["milestone1", "milestone2"],
        "potential_challenges": ["challenge1", "challenge2"]
      },
      "personalization_adjustments": {
        "communication_style": "adjustment_needed",
        "cultural_considerations": ["consideration1", "consideration2"],
        "engagement_improvements": ["improvement1", "improvement2"],
        "trauma_informed_modifications": ["modification1", "modification2"],
        "neurodivergent_adaptations": ["adaptation1", "adaptation2"]
      },
      "advanced_analytics": {
        "pattern_recognition": {
          "behavioral_patterns": ["pattern1", "pattern2"],
          "emotional_regulation_patterns": ["pattern1", "pattern2"],
          "engagement_patterns": ["pattern1", "pattern2"],
          "resistance_patterns": ["pattern1", "pattern2"]
        },
        "predictive_insights": {
          "breakthrough_probability": 0.0-1.0,
          "resistance_likelihood": 0.0-1.0,
          "optimal_intervention_timing": "timing_recommendation",
          "treatment_completion_prediction": 0.0-1.0
        },
        "comorbidity_assessment": {
          "potential_conditions": ["condition1", "condition2"],
          "screening_recommendations": ["screen1", "screen2"],
          "referral_suggestions": ["referral1", "referral2"]
        }
      },
      "evidence_based_interventions": {
        "cbt_recommendations": {
          "techniques": ["technique1", "technique2"],
          "homework_assignments": ["assignment1", "assignment2"],
          "thought_record_focus": ["focus1", "focus2"]
        },
        "dbt_recommendations": {
          "skills_modules": ["module1", "module2"],
          "distress_tolerance": ["skill1", "skill2"],
          "emotion_regulation": ["skill1", "skill2"]
        },
        "trauma_interventions": {
          "processing_readiness": "low|medium|high",
          "stabilization_needs": ["need1", "need2"],
          "somatic_interventions": ["intervention1", "intervention2"]
        }
      },
      "measurement_based_care": {
        "outcome_measures": ["measure1", "measure2"],
        "progress_tracking_frequency": "weekly|biweekly|monthly",
        "target_metrics": {
          "symptom_reduction": 0.0-1.0,
          "functional_improvement": 0.0-1.0,
          "quality_of_life": 0.0-1.0
        }
      },
      "automatic_plan_updates": {
        "trigger_conditions": ["condition1", "condition2"],
        "update_frequency": "session_based|weekly|biweekly",
        "adaptation_thresholds": {
          "minimal_change": 0.1,
          "moderate_change": 0.3,
          "significant_change": 0.5
        }
      }
    }

    CRITICAL INSTRUCTIONS:
    - Prioritize user safety above all else
    - Apply evidence-based interventions only
    - Consider cultural, religious, and personal values
    - Integrate trauma-informed care principles
    - Generate specific, measurable, actionable recommendations
    - Predict and prepare for potential therapeutic challenges
    - Optimize for both short-term stabilization and long-term growth
    - Ensure recommendations are implementable within AI therapy sessions
    `;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 4000,
        temperature: 0.2,
        system: 'You are the world\'s most advanced AI therapy planning system. You are Claude Opus, providing evidence-based, culturally sensitive, trauma-informed therapeutic analysis that exceeds human clinical standards. Always respond with valid JSON. Prioritize user safety, evidence-based interventions, and measurable outcomes.',
        messages: [
          { role: 'user', content: adaptationPrompt }
        ]
      }),
    });

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const planAdaptation = JSON.parse(anthropicData.content[0].text);

    // If critical risk is detected, create immediate oversight record
    if (planAdaptation.crisis_prevention?.risk_assessment === 'critical') {
      await supabase
        .from('professional_oversight')
        .insert({
          user_id: userId,
          oversight_type: 'crisis_intervention',
          priority_level: 'urgent',
          reason: 'Critical risk detected by adaptive therapy planner',
          context_data: {
            risk_assessment: planAdaptation.crisis_prevention,
            current_plan: currentPlan,
            progress_patterns: progressPattern
          },
          recommendations: {
            immediate_actions: planAdaptation.crisis_prevention.intervention_protocols,
            safety_planning: planAdaptation.crisis_prevention.safety_planning_needed,
            follow_up_required: true
          }
        });
    }

    // Create comprehensive adaptation record for tracking
    if (planAdaptation.adaptations_needed) {
      await supabase
        .from('therapy_plan_adaptations')
        .insert({
          user_id: userId,
          adaptation_type: 'claude_opus_comprehensive',
          recommendations: planAdaptation.recommendations,
          severity_level: planAdaptation.severity_level,
          implementation_status: 'pending',
          created_by: 'adaptive_therapy_planner_opus',
          metadata: {
            progress_patterns: progressPattern,
            analytics_summary: recentAnalytics,
            ai_confidence: planAdaptation.recommendations.reduce((avg, r) => avg + r.confidence, 0) / planAdaptation.recommendations.length,
            advanced_analytics: planAdaptation.advanced_analytics,
            evidence_based_interventions: planAdaptation.evidence_based_interventions,
            measurement_plan: planAdaptation.measurement_based_care,
            cultural_considerations: culturalProfile,
            trauma_informed: traumaHistory ? true : false
          }
        });

      // Auto-update adaptive therapy plan if significant changes recommended
      if (planAdaptation.severity_level === 'high' || planAdaptation.severity_level === 'critical') {
        const updatedPlan = {
          primary_approach: planAdaptation.optimal_approaches.primary.name,
          secondary_approach: planAdaptation.optimal_approaches.secondary?.name,
          techniques: planAdaptation.optimal_approaches.primary.techniques,
          goals: planAdaptation.recommendations.map(r => r.description),
          adaptations: planAdaptation,
          next_session_recommendations: planAdaptation.session_modifications,
          effectiveness_score: planAdaptation.progress_predictions.success_probability,
          updated_at: new Date().toISOString()
        };

        await supabase
          .from('adaptive_therapy_plans')
          .upsert({
            user_id: userId,
            ...updatedPlan
          });
      }
    }

    console.log(`Adaptive therapy plan generated for user ${userId}, adaptations needed: ${planAdaptation.adaptations_needed}`);

    return new Response(JSON.stringify(planAdaptation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in adaptive therapy planner:', error);
    return new Response(
      JSON.stringify({ error: 'Therapy plan adaptation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});