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
    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return new Response(
        JSON.stringify({ error: 'SessionId and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get session messages and analytics events
    const { data: events, error: eventsError } = await supabase
      .from('live_analytics_events')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (eventsError) throw eventsError;

    // Get technique tracking data
    const { data: techniques, error: techniquesError } = await supabase
      .from('session_technique_tracking')
      .select('*')
      .eq('session_id', sessionId);

    if (techniquesError) throw techniquesError;

    // Generate comprehensive analysis with AI
    const analysisPrompt = `
    You are a clinical AI assistant specializing in therapy session analysis. Analyze the following session data and provide a comprehensive assessment:

    Session Events: ${JSON.stringify(events, null, 2)}
    
    Techniques Used: ${JSON.stringify(techniques, null, 2)}

    Generate a comprehensive session analysis with the following JSON structure:
    {
      "emotion_scores": {
        "current_emotion": "primary_emotion",
        "intensity": 0.0-1.0,
        "valence": -1.0 to 1.0,
        "arousal": 0.0-1.0,
        "emotion_progression": ["emotion1", "emotion2", "emotion3"]
      },
      "technique_effectiveness": {
        "technique_name": effectiveness_score_0_to_1,
        "most_effective": "technique_name",
        "least_effective": "technique_name"
      },
      "crisis_indicators": {
        "overall_risk_level": 0.0-1.0,
        "risk_progression": "increasing|stable|decreasing",
        "key_indicators": ["indicator1", "indicator2"],
        "protective_factors": ["factor1", "factor2"]
      },
      "breakthrough_moments": [
        {
          "timestamp": "ISO_timestamp",
          "description": "description",
          "confidence": 0.0-1.0,
          "impact_level": "low|medium|high"
        }
      ],
      "approach_recommendations": {
        "primary": "approach_name",
        "secondary": "approach_name",
        "reasoning": "detailed_explanation",
        "adjustments_needed": ["adjustment1", "adjustment2"]
      },
      "engagement_metrics": {
        "overall_engagement": 0.0-1.0,
        "response_quality": 0.0-1.0,
        "therapeutic_alliance": 0.0-1.0,
        "session_flow": "excellent|good|fair|poor"
      },
      "session_quality_score": 0.0-1.0,
      "intervention_needed": boolean,
      "next_session_recommendations": ["recommendation1", "recommendation2"],
      "key_insights": ["insight1", "insight2"]
    }
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
          { role: 'system', content: 'You are a clinical AI assistant. Always respond with valid JSON. Be thorough and evidence-based in your analysis.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const analysis = JSON.parse(openAIData.choices[0].message.content);

    // Check if intervention is needed
    if (analysis.intervention_needed) {
      // Create professional oversight record
      await supabase
        .from('professional_oversight')
        .insert({
          user_id: userId,
          oversight_type: 'ai_recommendation',
          priority_level: analysis.crisis_indicators.overall_risk_level > 0.7 ? 'urgent' : 'routine',
          reason: 'AI analysis indicates intervention needed',
          context_data: {
            session_id: sessionId,
            analysis_summary: analysis,
            key_concerns: analysis.crisis_indicators.key_indicators
          },
          recommendations: {
            immediate_actions: analysis.next_session_recommendations,
            follow_up_needed: true
          }
        });
    }

    console.log(`Session analysis completed for ${sessionId}, quality score: ${analysis.session_quality_score}`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating session analysis:', error);
    return new Response(
      JSON.stringify({ error: 'Analysis generation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});