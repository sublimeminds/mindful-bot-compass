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
    const { userId, currentConditions, sessionContext, timestamp } = await req.json();

    if (!userId || !currentConditions) {
      return new Response(
        JSON.stringify({ error: 'UserId and currentConditions are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get available approaches
    const { data: approaches, error: approachesError } = await supabase
      .from('therapeutic_approach_configs')
      .select('*')
      .eq('is_active', true);

    if (approachesError) throw approachesError;

    // Get approach combinations
    const { data: combinations, error: combinationsError } = await supabase
      .from('therapy_approach_combinations')
      .select(`
        *,
        primary_approach:primary_approach_id(*),
        secondary_approach:secondary_approach_id(*)
      `)
      .eq('is_active', true);

    if (combinationsError) throw combinationsError;

    // Get user preferences
    const { data: userPrefs } = await supabase
      .from('user_therapy_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Use AI to analyze and recommend approaches
    const recommendationPrompt = `
    You are a clinical AI assistant specializing in therapy approach selection. Based on the following information, recommend the most suitable therapy approaches:

    User Conditions: ${currentConditions.join(', ')}
    
    ${sessionContext ? `Session Context:
    - Mood: ${sessionContext.mood || 'Unknown'}
    - Recent Topics: ${sessionContext.recentTopics?.join(', ') || 'None'}
    - Crisis Risk: ${sessionContext.crisisIndicators?.risk_level || 0}
    - Previous Approaches: ${sessionContext.previousApproaches?.join(', ') || 'None'}` : ''}

    ${userPrefs ? `User Preferences:
    - Preferred Approaches: ${userPrefs.preferred_approaches?.join(', ') || 'None'}
    - Communication Style: ${userPrefs.communication_style || 'balanced'}` : ''}

    Available Approaches: ${approaches.map(a => `${a.name} (effectiveness: ${a.effectiveness_score})`).join(', ')}

    Respond with a JSON object containing:
    {
      "primary": {
        "approach_name": "name",
        "confidence": 0.0-1.0,
        "reasoning": "detailed explanation",
        "suitability_factors": ["factor1", "factor2"]
      },
      "secondary": {
        "approach_name": "name", 
        "confidence": 0.0-1.0,
        "reasoning": "detailed explanation",
        "suitability_factors": ["factor1", "factor2"]
      },
      "dual_approach_strategy": "how to integrate both approaches",
      "session_structure": {
        "opening": "approach to use",
        "middle": "approach to use", 
        "closing": "approach to use"
      }
    }
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
          { role: 'system', content: 'You are a clinical AI assistant. Always respond with valid JSON.' },
          { role: 'user', content: recommendationPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const recommendations = JSON.parse(openAIData.choices[0].message.content);

    // Find the actual approach objects
    const primaryApproach = approaches.find(a => a.name === recommendations.primary.approach_name);
    const secondaryApproach = approaches.find(a => a.name === recommendations.secondary?.approach_name);

    // Find matching combination if exists
    const matchingCombination = combinations.find(combo => {
      return (combo.primary_approach?.name === recommendations.primary.approach_name ||
              combo.secondary_approach?.name === recommendations.primary.approach_name) &&
             (combo.primary_approach?.name === recommendations.secondary?.approach_name ||
              combo.secondary_approach?.name === recommendations.secondary?.approach_name);
    });

    const result = {
      primary: primaryApproach ? {
        approach: primaryApproach,
        confidence: recommendations.primary.confidence,
        reasoning: recommendations.primary.reasoning,
        suitability_factors: recommendations.primary.suitability_factors
      } : null,
      secondary: secondaryApproach ? {
        approach: secondaryApproach,
        confidence: recommendations.secondary?.confidence || 0,
        reasoning: recommendations.secondary?.reasoning || '',
        suitability_factors: recommendations.secondary?.suitability_factors || []
      } : null,
      combination: matchingCombination,
      dual_approach_strategy: recommendations.dual_approach_strategy,
      session_structure: recommendations.session_structure
    };

    console.log(`Recommended approaches for user ${userId}: ${recommendations.primary.approach_name}${secondaryApproach ? ` + ${recommendations.secondary.approach_name}` : ''}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error recommending therapy approaches:', error);
    return new Response(
      JSON.stringify({ error: 'Recommendation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});