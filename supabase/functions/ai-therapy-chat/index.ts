
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, therapistPersonality, conversationHistory } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's context
    const { data: onboardingData } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: userPreferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Build personality-based system prompt
    let systemPrompt = `You are a compassionate AI therapy assistant with expertise in mental health support. You provide empathetic, evidence-based responses while maintaining professional boundaries.`;

    if (therapistPersonality) {
      systemPrompt += `\n\nYour personality: You are ${therapistPersonality.name}, a ${therapistPersonality.title}.
      Approach: ${therapistPersonality.approach}
      Communication Style: ${therapistPersonality.communicationStyle}
      Specialties: ${therapistPersonality.specialties?.join(', ')}
      Description: ${therapistPersonality.description}
      
      Respond in character with this specific therapeutic approach and communication style.`;
    }

    if (onboardingData) {
      systemPrompt += `\n\nUser's therapy context:`;
      if (onboardingData.goals?.length > 0) {
        systemPrompt += `\nGoals: ${onboardingData.goals.join(', ')}`;
      }
      if (onboardingData.concerns?.length > 0) {
        systemPrompt += `\nConcerns: ${onboardingData.concerns.join(', ')}`;
      }
      if (onboardingData.preferences?.length > 0) {
        systemPrompt += `\nPreferred approaches: ${onboardingData.preferences.join(', ')}`;
      }
    }

    if (userPreferences) {
      systemPrompt += `\n\nUser preferences:
      Communication style: ${userPreferences.communication_style}
      Preferred approaches: ${userPreferences.preferred_approaches?.join(', ')}`;
    }

    systemPrompt += `\n\nGuidelines:
    - Provide supportive, non-judgmental responses
    - Use active listening techniques
    - Suggest practical coping strategies when appropriate
    - Maintain professional boundaries
    - Encourage professional help for serious mental health concerns
    - Keep responses concise but meaningful (2-4 sentences)`;

    // Prepare conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('OpenAI response received successfully');

    // Analyze emotion and techniques (simplified for now)
    const emotion = message.toLowerCase().includes('sad') || message.toLowerCase().includes('depressed') ? 'sad' :
                   message.toLowerCase().includes('anxious') || message.toLowerCase().includes('worried') ? 'anxious' :
                   message.toLowerCase().includes('angry') || message.toLowerCase().includes('mad') ? 'angry' :
                   message.toLowerCase().includes('happy') || message.toLowerCase().includes('good') ? 'happy' : 'neutral';

    const techniques = therapistPersonality?.approach === 'Cognitive Behavioral Therapy' ? ['CBT', 'Thought Restructuring'] :
                      therapistPersonality?.approach === 'Mindfulness-Based Therapy' ? ['Mindfulness', 'Breathing Exercises'] :
                      ['Active Listening', 'Validation'];

    return new Response(JSON.stringify({ 
      response: aiResponse,
      emotion: emotion,
      techniques: techniques,
      insights: ['User engagement detected', 'Therapeutic rapport building']
    }), {
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
