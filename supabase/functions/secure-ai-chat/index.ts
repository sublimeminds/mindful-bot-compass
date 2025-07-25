import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Parse request body
    const { messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1000, stream = false }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages format', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Rate limiting check
    const { data: rateLimitAllowed } = await supabaseClient.rpc('check_auth_rate_limit', {
      _identifier: `ai_chat_${user.id}`,
      _max_attempts: 30,
      _window_minutes: 60
    });

    if (!rateLimitAllowed) {
      return new Response('Rate limit exceeded', { 
        status: 429, 
        headers: corsHeaders 
      });
    }

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response('Service temporarily unavailable', { 
        status: 503, 
        headers: corsHeaders 
      });
    }

    // Make request to OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response('AI service error', { 
        status: 502, 
        headers: corsHeaders 
      });
    }

    // Log usage for analytics
    if (!stream) {
      const responseData = await openAIResponse.json();
      
      // Log AI usage tracking
      await supabaseClient.from('ai_usage_tracking').insert({
        user_id: user.id,
        model_id: model,
        prompt_tokens: responseData.usage?.prompt_tokens || 0,
        completion_tokens: responseData.usage?.completion_tokens || 0,
        total_tokens: responseData.usage?.total_tokens || 0,
        total_cost: (responseData.usage?.total_tokens || 0) * 0.00001, // Approximate cost
        response_time_ms: Date.now() % 1000,
        request_metadata: {
          temperature,
          max_tokens,
          message_count: messages.length
        }
      });

      return new Response(JSON.stringify(responseData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Handle streaming response
      return new Response(openAIResponse.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
      });
    }

  } catch (error) {
    console.error('Secure AI chat error:', error);
    return new Response('Internal server error', {
      status: 500,
      headers: corsHeaders,
    });
  }
});