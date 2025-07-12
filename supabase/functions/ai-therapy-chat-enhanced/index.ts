import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId, therapistId } = await req.json();

    // Get user context from memories
    const { data: memories } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('importance_score', { ascending: false })
      .limit(10);

    // Get therapist personality
    const { data: therapist } = await supabase
      .from('therapist_personalities')
      .select('*')
      .eq('id', therapistId)
      .single();

    // Build context for AI
    const memoryContext = memories?.map(m => 
      `${m.title}: ${m.content} (${m.emotional_context.primary_emotion})`
    ).join('\n') || '';

    const systemPrompt = `You are ${therapist?.name || 'Dr. AI'}, a ${therapist?.title || 'therapist'} specializing in ${therapist?.specialties?.join(', ') || 'general therapy'}.

Your approach: ${therapist?.approach || 'supportive and evidence-based'}
Communication style: ${therapist?.communication_style || 'warm and professional'}

IMPORTANT CONTEXT FROM PREVIOUS SESSIONS:
${memoryContext}

Guidelines:
- Remember details from previous sessions
- Use evidence-based therapeutic techniques
- Be empathetic and supportive
- Ask thoughtful follow-up questions
- Provide practical coping strategies
- Reference past conversations when relevant
- Stay in character as this specific therapist`;

    // Call Claude Opus for superior therapeutic reasoning
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nUser: ${message}`
          }
        ]
      }),
    });

    const data = await response.json();
    const aiResponse = data.content[0].text;

    // Store memory if significant
    if (message.length > 20) {
      await supabase.from('conversation_memory').insert({
        user_id: userId,
        session_id: sessionId,
        memory_type: 'emotional_pattern',
        title: `Session discussion`,
        content: `User: ${message.substring(0, 200)}`,
        emotional_context: { primary_emotion: 'neutral', intensity: 5, context: 'therapy_session' },
        importance_score: 0.5,
        tags: ['session', 'conversation'],
        is_active: true
      });
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});