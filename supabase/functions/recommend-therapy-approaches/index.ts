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

    // Use Claude Opus for sophisticated therapy approach analysis
    const recommendationPrompt = `You are a clinical AI assistant with expertise in therapeutic modalities, trauma-informed care, and evidence-based treatment selection. 

    Analyze the following comprehensive user profile and recommend optimal therapy approaches:

    User Conditions: ${currentConditions.join(', ')}
    
    ${sessionContext ? `Current Session Context:
    - Mood State: ${sessionContext.mood || 'Unknown'}
    - Recent Topics: ${sessionContext.recentTopics?.join(', ') || 'None'}
    - Crisis Risk Level: ${sessionContext.crisisIndicators?.risk_level || 0}
    - Previous Approaches: ${sessionContext.previousApproaches?.join(', ') || 'None'}
    - Engagement Level: ${sessionContext.engagementLevel || 'Unknown'}
    - Therapeutic Alliance: ${sessionContext.therapeuticAlliance || 'Unknown'}` : ''}

    ${userPrefs ? `User Preferences & History:
    - Preferred Approaches: ${userPrefs.preferred_approaches?.join(', ') || 'None'}
    - Communication Style: ${userPrefs.communication_style || 'balanced'}
    - Cultural Considerations: ${userPrefs.cultural_background || 'None'}
    - Previous Treatment Response: ${userPrefs.treatment_history || 'Unknown'}` : ''}

    Available Therapeutic Approaches: ${approaches.map(a => `${a.name} (effectiveness: ${a.effectiveness_score}, specialties: ${a.target_conditions?.join(', ') || 'general'})`).join(', ')}

    Provide evidence-based recommendations considering:
    1. Clinical effectiveness for specific conditions
    2. User preferences and cultural factors  
    3. Trauma-informed considerations
    4. Integration potential between approaches
    5. Short-term stabilization vs long-term growth

    Respond with a JSON object containing:
    {
      "primary": {
        "approach_name": "name",
        "confidence": 0.0-1.0,
        "reasoning": "detailed clinical reasoning",
        "suitability_factors": ["factor1", "factor2"],
        "evidence_base": "research support level",
        "expected_timeline": "estimated duration"
      },
      "secondary": {
        "approach_name": "name", 
        "confidence": 0.0-1.0,
        "reasoning": "detailed clinical reasoning",
        "suitability_factors": ["factor1", "factor2"],
        "complementary_value": "how it enhances primary approach"
      },
      "dual_approach_strategy": "integration methodology and sequencing",
      "session_structure": {
        "opening": "approach and techniques to use",
        "middle": "core intervention approach", 
        "closing": "consolidation and homework approach"
      },
      "contraindications": ["potential risks or unsuitable factors"],
      "success_indicators": ["measurable outcomes to track"],
      "adaptation_triggers": ["conditions requiring approach modification"]
    }`;

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
        messages: [
          {
            role: 'user',
            content: recommendationPrompt
          }
        ]
      }),
    });

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const recommendations = JSON.parse(anthropicData.content[0].text);

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