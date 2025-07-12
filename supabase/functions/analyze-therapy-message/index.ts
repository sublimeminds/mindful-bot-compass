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
    const { message, userId, sessionId, timestamp } = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Message and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze message with Claude Opus for superior reasoning
    const analysisPrompt = `You are a clinical AI assistant specializing in therapy session analysis with expertise in trauma-informed care, crisis intervention, and therapeutic breakthrough identification.

    Analyze the following user message comprehensively:

    User message: "${message}"

    Provide a detailed analysis focusing on:
    1. Emotional state analysis (primary/secondary emotions, intensity, valence, arousal)
    2. Crisis risk assessment (suicide/self-harm indicators, immediate safety concerns)
    3. Therapeutic breakthrough potential (readiness for change, insight moments)
    4. Clinical themes and therapeutic technique recommendations
    5. Urgency classification and intervention needs

    Respond with a JSON object containing:
    {
      "emotions": {
        "primary": "emotion_name",
        "intensity": 0.0-1.0,
        "valence": -1.0 to 1.0,
        "arousal": 0.0-1.0,
        "secondary_emotions": ["emotion1", "emotion2"],
        "emotional_complexity": 0.0-1.0,
        "regulation_capacity": 0.0-1.0
      },
      "crisis_indicators": {
        "risk_level": 0.0-1.0,
        "indicators": ["indicator1", "indicator2"],
        "confidence": 0.0-1.0,
        "requires_escalation": boolean,
        "immediate_concerns": ["concern1", "concern2"],
        "protective_factors": ["factor1", "factor2"],
        "risk_timeline": "immediate|hours|days|weeks"
      },
      "breakthrough_potential": 0.0-1.0,
      "breakthrough_indicators": ["insight", "motivation", "readiness"],
      "themes": ["theme1", "theme2"],
      "recommended_techniques": ["technique1", "technique2"],
      "urgency_level": "low|medium|high|crisis",
      "clinical_notes": "detailed assessment notes"
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
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      }),
    });

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const analysis = JSON.parse(anthropicData.content[0].text);

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