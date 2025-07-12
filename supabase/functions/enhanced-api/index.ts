
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, model, message, context, systemPrompt } = await req.json();

    let response;
    
    if (provider === 'anthropic' && anthropicApiKey) {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || 'claude-opus-4-20250514',
          max_tokens: 2048,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nUser: ${message}`
            }
          ]
        })
      });

      const data = await response.json();
      
      return new Response(JSON.stringify({
        message: data.content?.[0]?.text || "I'm here to help. Could you tell me more?",
        emotion: 'supportive',
        techniques: ['Active Listening', 'Empathetic Response'],
        insights: ['User seeking support'],
        confidence: 0.85,
        provider: 'anthropic',
        model: model
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } else if (provider === 'openai' && openAIApiKey) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-4.1-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      
      return new Response(JSON.stringify({
        message: data.choices?.[0]?.message?.content || "I'm here to support you. What's on your mind?",
        emotion: 'supportive',
        techniques: ['Cognitive Behavioral Therapy', 'Active Listening'],
        insights: ['User initiated conversation'],
        confidence: 0.80,
        provider: 'openai',
        model: model
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback response
    return new Response(JSON.stringify({
      message: "I understand you're reaching out. I'm here to listen and support you. What would you like to talk about today?",
      emotion: 'supportive',
      techniques: ['Active Listening'],
      insights: ['User seeking support'],
      confidence: 0.70,
      provider: 'fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-api function:', error);
    return new Response(JSON.stringify({
      message: "I'm experiencing some technical difficulties, but I'm still here for you. How are you feeling right now?",
      emotion: 'supportive',
      techniques: ['Technical Recovery', 'Emotional Support'],
      insights: ['Technical issue occurred'],
      confidence: 0.60,
      error: error.message
    }), {
      status: 200, // Return 200 to avoid breaking the chat flow
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
