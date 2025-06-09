
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's onboarding data for personalization
    const { data: onboardingData } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Build personalized system prompt
    let systemPrompt = `You are a compassionate AI therapy assistant. You provide supportive, empathetic responses while following ethical therapy principles. Always maintain professional boundaries and encourage users to seek professional help for serious mental health concerns.`;

    if (onboardingData) {
      systemPrompt += `\n\nUser's therapy context:`;
      
      if (onboardingData.goals?.length > 0) {
        systemPrompt += `\nGoals: ${onboardingData.goals.join(', ')}`;
      }
      
      if (onboardingData.concerns?.length > 0) {
        systemPrompt += `\nConcerns: ${onboardingData.concerns.join(', ')}`;
      }
      
      if (onboardingData.experience) {
        systemPrompt += `\nTherapy experience: ${onboardingData.experience}`;
      }
      
      if (onboardingData.preferences?.length > 0) {
        systemPrompt += `\nPreferred approaches: ${onboardingData.preferences.join(', ')}`;
      }

      systemPrompt += `\n\nUse this context to provide personalized, relevant responses that align with their goals and preferred therapeutic approaches.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-therapy-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
