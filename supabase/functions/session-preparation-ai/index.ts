import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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

    // Generate AI-powered session preparation recommendations
    const sessionPrepPrompt = `
    You are an AI therapy session preparation system. Analyze the user's data and generate optimal session configuration.

    Current Therapy Plan: ${JSON.stringify(currentPlan, null, 2)}
    
    Recent Sessions: ${JSON.stringify(recentSessions, null, 2)}
    
    Mood Trends: ${JSON.stringify(moodEntries, null, 2)}
    
    Active Goals: ${JSON.stringify(activeGoals, null, 2)}

    Based on this data, generate session preparation recommendations with the following JSON structure:
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
        "conversation_guidance": "how_to_guide_conversation"
      }
    }

    Prioritize user safety, evidence-based interventions, and personalized care. Be specific and actionable.
    `;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert AI therapy session preparation system. Always respond with valid JSON. Focus on user safety and evidence-based therapeutic interventions.' },
          { role: 'user', content: sessionPrepPrompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const sessionPreparation = JSON.parse(openAIData.choices[0].message.content);

    // Store session preparation data
    await supabase
      .from('session_preparations')
      .insert({
        session_id: sessionId,
        user_id: userId,
        preparation_data: sessionPreparation,
        ai_config: sessionPreparation.ai_configuration,
        risk_assessment: sessionPreparation.risk_assessment,
        created_at: new Date().toISOString()
      });

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

    console.log(`Session preparation completed for user ${userId}, session ${sessionId}, risk level: ${sessionPreparation.risk_assessment?.current_risk_level}`);

    return new Response(JSON.stringify({
      sessionPreparation,
      sessionId,
      preparedAt: new Date().toISOString()
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