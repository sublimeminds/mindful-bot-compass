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
    const { message, userId, sessionId, timestamp } = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Message and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze message with OpenAI
    const analysisPrompt = `
    You are a clinical AI assistant specializing in therapy session analysis. Analyze the following user message for:

    1. Emotional state and intensity (0-1 scale)
    2. Crisis indicators and risk level (0-1 scale)
    3. Breakthrough potential (0-1 scale)
    4. Key themes and concerns
    5. Recommended therapeutic techniques

    User message: "${message}"

    Respond with a JSON object containing:
    {
      "emotions": {
        "primary": "emotion_name",
        "intensity": 0.0-1.0,
        "valence": -1.0 to 1.0,
        "arousal": 0.0-1.0,
        "secondary_emotions": ["emotion1", "emotion2"]
      },
      "crisis_indicators": {
        "risk_level": 0.0-1.0,
        "indicators": ["indicator1", "indicator2"],
        "confidence": 0.0-1.0,
        "requires_escalation": boolean,
        "immediate_concerns": ["concern1", "concern2"]
      },
      "breakthrough_potential": 0.0-1.0,
      "themes": ["theme1", "theme2"],
      "recommended_techniques": ["technique1", "technique2"],
      "urgency_level": "low|medium|high|crisis"
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
          { role: 'system', content: 'You are a clinical AI assistant. Always respond with valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const analysis = JSON.parse(openAIData.choices[0].message.content);

    // Store analysis in database
    if (sessionId) {
      await supabase
        .from('real_time_session_analytics')
        .insert({
          session_id: sessionId,
          user_id: userId,
          emotion_scores: analysis.emotions,
          crisis_indicators: analysis.crisis_indicators,
          breakthrough_moments: analysis.breakthrough_potential > 0.7 ? [
            {
              timestamp: timestamp,
              description: `High breakthrough potential detected: ${analysis.breakthrough_potential}`,
              confidence: analysis.breakthrough_potential
            }
          ] : [],
          approach_recommendations: {
            techniques: analysis.recommended_techniques,
            urgency: analysis.urgency_level
          },
          engagement_metrics: {
            message_length: message.length,
            emotional_intensity: analysis.emotions.intensity,
            themes: analysis.themes
          },
          session_quality_score: Math.max(0, 1 - analysis.crisis_indicators.risk_level + analysis.breakthrough_potential) / 2,
          intervention_needed: analysis.crisis_indicators.requires_escalation
        });
    }

    // Create analytics event
    await supabase
      .from('live_analytics_events')
      .insert({
        event_type: 'message',
        session_id: sessionId,
        user_id: userId,
        event_data: {
          message_analysis: analysis,
          message_length: message.length,
          timestamp: timestamp
        },
        severity_level: analysis.urgency_level === 'crisis' ? 'crisis' : 
                      analysis.urgency_level === 'high' ? 'high' : 'normal',
        requires_intervention: analysis.crisis_indicators.requires_escalation
      });

    console.log(`Message analyzed for user ${userId}, risk level: ${analysis.crisis_indicators.risk_level}`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error analyzing therapy message:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        emotions: { primary: 'neutral', intensity: 0.5, valence: 0, arousal: 0.5 },
        crisis_indicators: { risk_level: 0, indicators: [], confidence: 0, requires_escalation: false },
        breakthrough_potential: 0
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});