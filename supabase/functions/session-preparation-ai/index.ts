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
    const { userId, sessionId, prepareSession } = await req.json();

    if (!userId || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'UserId and sessionId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's current adaptive therapy plan
    const { data: currentPlan } = await supabase
      .from('adaptive_therapy_plans')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    // Get user's recent session history
    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('start_time', { ascending: false });

    // Get user's mood trends
    const { data: moodEntries } = await supabase
      .from('mood_entries')
      .select('overall, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    // Get user's current goals
    const { data: activeGoals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });

    // Get comprehensive user context for enhanced session preparation
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

    const { data: conversationMemory } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('importance_score', { ascending: false })
      .limit(10);

    const { data: recentTechniques } = await supabase
      .from('session_technique_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('effectiveness_metrics', { ascending: false });

    const { data: previousPreparations } = await supabase
      .from('session_preparations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Generate AI-powered comprehensive session preparation using Claude Opus
    const sessionPrepPrompt = `
    You are the world's most advanced AI therapy session preparation system powered by Claude Opus. You excel at creating personalized, evidence-based, culturally sensitive session configurations that optimize therapeutic outcomes and ensure user safety.

    COMPREHENSIVE USER DATA:
    Current Therapy Plan: ${JSON.stringify(currentPlan, null, 2)}
    Recent Sessions (7 days): ${JSON.stringify(recentSessions, null, 2)}
    Mood Trends (14 days): ${JSON.stringify(moodEntries, null, 2)}
    Active Goals: ${JSON.stringify(activeGoals, null, 2)}
    User Profile: ${JSON.stringify(userProfile, null, 2)}
    Cultural Profile: ${JSON.stringify(culturalProfile, null, 2)}
    Trauma History: ${JSON.stringify(traumaHistory, null, 2)}
    Conversation Memory: ${JSON.stringify(conversationMemory, null, 2)}
    Recent Technique Effectiveness: ${JSON.stringify(recentTechniques, null, 2)}
    Previous Session Preparations: ${JSON.stringify(previousPreparations, null, 2)}

    ADVANCED PREPARATION REQUIREMENTS:
    1. Analyze psychological readiness and current emotional state
    2. Apply trauma-informed session structuring
    3. Consider cultural, religious, and personal values
    4. Optimize therapeutic technique selection based on effectiveness data
    5. Prepare for potential crisis situations and safety concerns
    6. Generate personalized conversation starters and therapeutic interventions
    7. Configure AI response parameters for optimal therapeutic alliance
    8. Plan evidence-based homework and between-session activities

    Generate comprehensive session preparation with the following enhanced JSON structure:
    {
      "session_focus": {
        "primary_focus": "specific_area_to_focus_on",
        "secondary_focus": "supporting_area",
        "session_goals": ["goal1", "goal2", "goal3"],
        "expected_duration": "recommended_session_length"
      },
      "therapeutic_approach": {
        "recommended_approach": "primary_therapy_approach",
        "supporting_techniques": ["technique1", "technique2"],
        "adaptation_reason": "why_this_approach_is_optimal",
        "communication_style": "recommended_style"
      },
      "intervention_strategies": {
        "crisis_preparedness": "low|medium|high",
        "safety_considerations": ["consideration1", "consideration2"],
        "breakthrough_opportunities": ["opportunity1", "opportunity2"],
        "resistance_management": "strategy_for_potential_resistance"
      },
      "personalization": {
        "mood_based_adjustments": "adjustments_based_on_current_mood",
        "goal_integration": "how_to_integrate_user_goals",
        "progress_acknowledgment": "recent_progress_to_acknowledge",
        "engagement_optimization": "ways_to_optimize_engagement"
      },
      "session_structure": {
        "opening_approach": "how_to_start_session",
        "core_activities": ["activity1", "activity2"],
        "closing_strategy": "how_to_end_session",
        "homework_suggestions": ["suggestion1", "suggestion2"]
      },
      "risk_assessment": {
        "current_risk_level": "low|medium|high|critical",
        "warning_signs": ["sign1", "sign2"],
        "protective_factors": ["factor1", "factor2"],
        "escalation_triggers": ["trigger1", "trigger2"]
      },
      "ai_configuration": {
        "temperature": 0.0-1.0,
        "response_style": "configuration_for_ai_responses",
        "technique_emphasis": ["technique1", "technique2"],
        "conversation_guidance": "how_to_guide_conversation",
        "empathy_level": "low|medium|high",
        "directness_level": "low|medium|high",
        "cultural_adaptation": "specific_adaptations",
        "trauma_sensitivity": "low|medium|high"
      },
      "advanced_session_planning": {
        "therapeutic_alliance_building": {
          "connection_strategies": ["strategy1", "strategy2"],
          "trust_building_approaches": ["approach1", "approach2"],
          "rapport_maintenance": ["technique1", "technique2"]
        },
        "technique_optimization": {
          "primary_interventions": ["intervention1", "intervention2"],
          "backup_techniques": ["technique1", "technique2"],
          "technique_sequencing": ["order1", "order2"],
          "effectiveness_predictions": {
            "technique1": 0.0-1.0,
            "technique2": 0.0-1.0
          }
        },
        "cognitive_load_management": {
          "session_pacing": "slow|moderate|fast",
          "complexity_level": "low|medium|high",
          "processing_breaks": "frequency_and_timing",
          "information_dosing": "gradual|moderate|intensive"
        },
        "emotional_regulation_support": {
          "grounding_techniques": ["technique1", "technique2"],
          "distress_tolerance": ["skill1", "skill2"],
          "co_regulation_strategies": ["strategy1", "strategy2"],
          "safety_anchors": ["anchor1", "anchor2"]
        }
      },
      "evidence_based_interventions": {
        "cbt_focus": {
          "cognitive_targets": ["target1", "target2"],
          "behavioral_experiments": ["experiment1", "experiment2"],
          "homework_assignments": ["assignment1", "assignment2"]
        },
        "dbt_integration": {
          "skills_to_practice": ["skill1", "skill2"],
          "mindfulness_exercises": ["exercise1", "exercise2"],
          "distress_tolerance_applications": ["application1", "application2"]
        },
        "trauma_processing": {
          "readiness_assessment": "low|medium|high",
          "stabilization_focus": ["area1", "area2"],
          "processing_techniques": ["technique1", "technique2"],
          "integration_support": ["support1", "support2"]
        }
      },
      "session_outcome_predictions": {
        "therapeutic_progress_likelihood": 0.0-1.0,
        "breakthrough_potential": 0.0-1.0,
        "resistance_probability": 0.0-1.0,
        "session_satisfaction_prediction": 0.0-1.0,
        "follow_up_needs": ["need1", "need2"]
      }
    }

    CRITICAL INSTRUCTIONS:
    - Prioritize user safety and trauma-informed care
    - Apply evidence-based therapeutic interventions
    - Consider cultural, religious, and personal contexts
    - Optimize AI configuration for therapeutic alliance
    - Prepare for crisis situations and safety concerns
    - Generate specific, actionable session plans
    - Ensure recommendations are implementable in AI therapy
    - Focus on measurable therapeutic outcomes
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
        temperature: 0.1,
        system: 'You are the world\'s most advanced AI therapy session preparation system. You are Claude Opus, providing evidence-based, culturally sensitive, trauma-informed session preparation that ensures optimal therapeutic outcomes and user safety. Always respond with valid JSON.',
        messages: [
          { role: 'user', content: sessionPrepPrompt }
        ]
      }),
    });

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const sessionPreparation = JSON.parse(anthropicData.content[0].text);

    // Store comprehensive session preparation data
    await supabase
      .from('session_preparations')
      .insert({
        session_id: sessionId,
        user_id: userId,
        preparation_data: {
          ...sessionPreparation,
          preparation_model: 'claude-opus-4',
          cultural_adaptations: culturalProfile,
          trauma_considerations: traumaHistory,
          technique_effectiveness_history: recentTechniques
        },
        ai_config: sessionPreparation.ai_configuration,
        risk_assessment: sessionPreparation.risk_assessment,
        created_at: new Date().toISOString()
      });

    // Update conversation memory with preparation insights
    if (sessionPreparation.session_focus?.primary_focus) {
      await supabase
        .from('conversation_memory')
        .insert({
          user_id: userId,
          session_id: sessionId,
          memory_type: 'session_preparation',
          title: `Session Focus: ${sessionPreparation.session_focus.primary_focus}`,
          content: `Prepared session with focus on ${sessionPreparation.session_focus.primary_focus}. Recommended approach: ${sessionPreparation.therapeutic_approach.recommended_approach}`,
          importance_score: 0.8,
          emotional_context: {
            risk_level: sessionPreparation.risk_assessment.current_risk_level,
            therapeutic_approach: sessionPreparation.therapeutic_approach.recommended_approach
          },
          tags: ['session_prep', 'ai_generated', sessionPreparation.session_focus.primary_focus]
        });
    }

    // If high risk detected, create oversight record
    if (sessionPreparation.risk_assessment?.current_risk_level === 'high' || 
        sessionPreparation.risk_assessment?.current_risk_level === 'critical') {
      await supabase
        .from('professional_oversight')
        .insert({
          user_id: userId,
          oversight_type: 'session_preparation_alert',
          priority_level: sessionPreparation.risk_assessment.current_risk_level === 'critical' ? 'urgent' : 'high',
          reason: 'High risk detected during session preparation',
          context_data: {
            session_id: sessionId,
            risk_assessment: sessionPreparation.risk_assessment,
            session_focus: sessionPreparation.session_focus
          },
          recommendations: {
            immediate_actions: ['Monitor closely', 'Safety planning', 'Crisis protocols ready'],
            session_modifications: sessionPreparation.intervention_strategies.safety_considerations
          }
        });
    }

    console.log(`Advanced session preparation completed for user ${userId}, session ${sessionId}, risk level: ${sessionPreparation.risk_assessment?.current_risk_level}, model: claude-opus-4`);

    return new Response(JSON.stringify({
      sessionPreparation,
      sessionId,
      preparedAt: new Date().toISOString(),
      model: 'claude-opus-4',
      preparation_quality: 'industry_leading',
      comprehensive_analysis: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in session preparation:', error);
    return new Response(
      JSON.stringify({ error: 'Session preparation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});