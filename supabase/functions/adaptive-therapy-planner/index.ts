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

    // Generate AI-powered therapy plan adaptation
    const adaptationPrompt = `
    You are an advanced AI therapy planning system. Analyze the user's progress data and generate adaptive therapy plan recommendations.

    Current Plan: ${JSON.stringify(currentPlan, null, 2)}
    
    Progress Patterns: ${JSON.stringify(progressPattern, null, 2)}
    
    Recent Analytics: ${JSON.stringify(recentAnalytics, null, 2)}

    Based on this data, generate therapy plan adaptations with the following JSON structure:
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
        "engagement_improvements": ["improvement1", "improvement2"]
      }
    }

    Focus on evidence-based recommendations, user safety, and measurable improvements. Be specific and actionable.
    `;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert AI therapy planning system. Always respond with valid JSON. Be thorough, evidence-based, and prioritize user safety.' },
          { role: 'user', content: adaptationPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const planAdaptation = JSON.parse(openAIData.choices[0].message.content);

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

    // Create adaptation record for tracking
    if (planAdaptation.adaptations_needed) {
      await supabase
        .from('therapy_plan_adaptations')
        .insert({
          user_id: userId,
          adaptation_type: 'ai_recommendation',
          recommendations: planAdaptation.recommendations,
          severity_level: planAdaptation.severity_level,
          implementation_status: 'pending',
          created_by: 'adaptive_therapy_planner',
          metadata: {
            progress_patterns: progressPattern,
            analytics_summary: recentAnalytics,
            ai_confidence: planAdaptation.recommendations.reduce((avg, r) => avg + r.confidence, 0) / planAdaptation.recommendations.length
          }
        });
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