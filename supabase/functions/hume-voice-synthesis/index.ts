import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const humeApiKey = Deno.env.get('HUME_AI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotionalContext, model = 'hume-voice-v1', voice = 'professional-female' } = await req.json();

    console.log('Hume AI voice synthesis request:', { 
      textLength: text.length, 
      emotionalContext,
      model,
      voice 
    });

    if (!humeApiKey) {
      console.error('Hume AI API key is missing');
      return new Response(JSON.stringify({ 
        error: 'Hume AI API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate voice synthesis using Hume AI
    const response = await fetch('https://api.hume.ai/v0/evi/chat/sessions', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': humeApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'voice_synthesis',
        text: text,
        voice_config: {
          voice_name: voice,
          emotional_context: emotionalContext || {
            primaryEmotion: 'calm',
            intensity: 0.5,
            supportLevel: 'medium',
            crisisLevel: false
          },
          prosody: {
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8
          }
        },
        output_format: 'mp3',
        sample_rate: 22050
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hume AI API Error:', response.status, errorData);
      
      // Return error but don't fail completely
      return new Response(JSON.stringify({ 
        error: `Hume AI API Error: ${response.status}`,
        details: errorData,
        fallback: true
      }), {
        status: 200, // Return 200 so the client can handle fallback
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Hume AI voice synthesis successful');

    return new Response(JSON.stringify({ 
      audioUrl: data.audio_url || data.result_url,
      sessionId: data.session_id,
      cost_estimate: calculateCost(text),
      provider: 'hume',
      emotional_adaptation: data.emotional_adaptation
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Hume voice synthesis:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true
    }), {
      status: 200, // Return 200 so the client can handle fallback
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateCost(text: string): number {
  // Hume AI pricing: approximately $3/hour of audio
  // Estimate: 150 words per minute, 5 characters per word
  const estimatedMinutes = (text.length / (150 * 5));
  return estimatedMinutes * 0.05; // $0.05 per minute
}