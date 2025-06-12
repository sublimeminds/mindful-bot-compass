
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
    const { message, userId, therapistPersonality, conversationHistory, sessionId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Enhanced AI Therapy Chat - Processing request for user:', userId);

    // Fetch enhanced context using memory system
    const { data: recentMemories } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('importance_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: emotionalPatterns } = await supabase
      .from('emotional_patterns')
      .select('*')
      .eq('user_id', userId)
      .order('frequency_score', { ascending: false })
      .limit(5);

    const { data: sessionContext } = await supabase
      .from('session_context')
      .select('*')
      .eq('user_id', userId)
      .eq('addressed', false)
      .order('priority_level', { ascending: false })
      .limit(5);

    const { data: relationshipData } = await supabase
      .from('therapeutic_relationship')
      .select('*')
      .eq('user_id', userId)
      .single();

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

    // Build enhanced system prompt with memory
    let systemPrompt = `You are a compassionate AI therapy assistant with expertise in mental health support. You provide empathetic, evidence-based responses while maintaining professional boundaries.`;

    if (therapistPersonality) {
      systemPrompt += `\n\nYour personality: You are ${therapistPersonality.name}, a ${therapistPersonality.title}.
      Approach: ${therapistPersonality.approach}
      Communication Style: ${therapistPersonality.communicationStyle}
      Specialties: ${therapistPersonality.specialties?.join(', ')}
      Description: ${therapistPersonality.description}
      
      Respond in character with this specific therapeutic approach and communication style.`;
    }

    // Add memory context
    if (recentMemories && recentMemories.length > 0) {
      systemPrompt += '\n\n## Previous Session Insights and Memory:\n';
      recentMemories.forEach(memory => {
        systemPrompt += `- ${memory.memory_type.toUpperCase()}: ${memory.title} - ${memory.content}\n`;
        if (memory.tags && memory.tags.length > 0) {
          systemPrompt += `  Tags: ${memory.tags.join(', ')}\n`;
        }
      });
    }

    // Add emotional patterns
    if (emotionalPatterns && emotionalPatterns.length > 0) {
      systemPrompt += '\n\n## Known Emotional Patterns:\n';
      emotionalPatterns.forEach(pattern => {
        systemPrompt += `- ${pattern.pattern_type}: `;
        if (pattern.pattern_data?.description) {
          systemPrompt += pattern.pattern_data.description;
        }
        systemPrompt += ` (Frequency: ${pattern.frequency_score}, Effectiveness: ${pattern.effectiveness_score})\n`;
      });
    }

    // Add session context items
    if (sessionContext && sessionContext.length > 0) {
      systemPrompt += '\n\n## Important Items to Address This Session:\n';
      sessionContext.forEach(ctx => {
        systemPrompt += `- ${ctx.context_type.toUpperCase()} (Priority ${ctx.priority_level}/10): `;
        if (ctx.context_data?.description) {
          systemPrompt += ctx.context_data.description;
        }
        systemPrompt += '\n';
      });
    }

    // Add relationship data
    if (relationshipData) {
      systemPrompt += '\n\n## Therapeutic Relationship Context:\n';
      systemPrompt += `- Trust Level: ${(relationshipData.trust_level * 100).toFixed(0)}%\n`;
      systemPrompt += `- Rapport Score: ${(relationshipData.rapport_score * 100).toFixed(0)}%\n`;
      
      if (relationshipData.effective_techniques && relationshipData.effective_techniques.length > 0) {
        systemPrompt += `- Effective Techniques: ${relationshipData.effective_techniques.join(', ')}\n`;
      }
      
      if (relationshipData.ineffective_techniques && relationshipData.ineffective_techniques.length > 0) {
        systemPrompt += `- Avoid These Techniques: ${relationshipData.ineffective_techniques.join(', ')}\n`;
      }
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

    systemPrompt += `\n\n## Memory-Enhanced Instructions:
    - Reference previous conversations naturally when relevant
    - Ask specific follow-up questions about previously mentioned concerns
    - Check on progress of goals and techniques discussed before
    - Be aware of emotional patterns and triggers
    - Build on previous breakthroughs and insights
    - Remember the user's preferred communication style and boundaries
    - Use the memory context to provide personalized, continuous care
    
    Guidelines:
    - Provide supportive, non-judgmental responses
    - Use active listening techniques
    - Suggest practical coping strategies when appropriate
    - Maintain professional boundaries
    - Encourage professional help for serious mental health concerns
    - Keep responses concise but meaningful (2-4 sentences)`;

    // Prepare conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: message }
    ];

    console.log('Sending enhanced request to OpenAI with memory context');

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

    // Enhanced emotion analysis
    const emotion = message.toLowerCase().includes('sad') || message.toLowerCase().includes('depressed') ? 'sad' :
                   message.toLowerCase().includes('anxious') || message.toLowerCase().includes('worried') ? 'anxious' :
                   message.toLowerCase().includes('angry') || message.toLowerCase().includes('mad') ? 'angry' :
                   message.toLowerCase().includes('happy') || message.toLowerCase().includes('good') ? 'happy' : 'neutral';

    const techniques = therapistPersonality?.approach === 'Cognitive Behavioral Therapy' ? ['CBT', 'Thought Restructuring'] :
                      therapistPersonality?.approach === 'Mindfulness-Based Therapy' ? ['Mindfulness', 'Breathing Exercises'] :
                      ['Active Listening', 'Validation'];

    // Store conversation insights in memory system
    try {
      // Analyze and store insights
      const insights = extractInsights(message, aiResponse);
      
      for (const insight of insights) {
        await supabase
          .from('conversation_memory')
          .insert({
            user_id: userId,
            session_id: sessionId,
            memory_type: insight.type,
            title: insight.title,
            content: insight.content,
            emotional_context: { emotion, userMessage: message.substring(0, 100) },
            importance_score: insight.importance,
            tags: insight.tags,
            is_active: true
          });
      }

      // Update emotional patterns
      if (emotion !== 'neutral') {
        await supabase
          .from('emotional_patterns')
          .upsert({
            user_id: userId,
            pattern_type: 'emotional_regulation',
            pattern_data: {
              emotion,
              context: message.substring(0, 100)
            },
            frequency_score: 1,
            effectiveness_score: 0.5,
            last_occurred: new Date().toISOString()
          });
      }

      // Mark session context as addressed if relevant
      if (sessionContext && sessionContext.length > 0) {
        for (const ctx of sessionContext) {
          if (aiResponse.toLowerCase().includes(ctx.context_type) || 
              (ctx.context_data?.description && aiResponse.toLowerCase().includes(ctx.context_data.description.toLowerCase()))) {
            await supabase
              .from('session_context')
              .update({ addressed: true })
              .eq('id', ctx.id);
          }
        }
      }

    } catch (memoryError) {
      console.error('Error storing memory insights:', memoryError);
      // Continue with response even if memory storage fails
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      emotion: emotion,
      techniques: techniques,
      insights: ['Enhanced memory-based insights', 'Therapeutic rapport building', 'Contextual understanding']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced ai-therapy-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractInsights(userMessage: string, aiResponse: string) {
  const insights = [];
  const lowerUser = userMessage.toLowerCase();
  const lowerAi = aiResponse.toLowerCase();

  // Detect breakthroughs
  if (lowerUser.includes('realize') || lowerUser.includes('understand now') || lowerUser.includes('makes sense')) {
    insights.push({
      type: 'breakthrough',
      title: 'User Breakthrough Moment',
      content: userMessage.substring(0, 200),
      importance: 0.9,
      tags: ['breakthrough', 'insight']
    });
  }

  // Detect concerns
  if (lowerUser.includes('worried') || lowerUser.includes('anxious') || lowerUser.includes('scared')) {
    insights.push({
      type: 'concern',
      title: 'User Expressed Concern',
      content: userMessage.substring(0, 200),
      importance: 0.8,
      tags: ['concern', 'anxiety']
    });
  }

  // Detect goals
  if (lowerUser.includes('want to') || lowerUser.includes('goal') || lowerUser.includes('hope to')) {
    insights.push({
      type: 'goal',
      title: 'User Goal Mentioned',
      content: userMessage.substring(0, 200),
      importance: 0.7,
      tags: ['goal', 'intention']
    });
  }

  // Detect techniques mentioned
  if (lowerAi.includes('technique') || lowerAi.includes('exercise') || lowerAi.includes('practice')) {
    insights.push({
      type: 'technique',
      title: 'Therapeutic Technique Suggested',
      content: aiResponse.substring(0, 200),
      importance: 0.6,
      tags: ['technique', 'practice']
    });
  }

  // Detect triggers
  if (lowerUser.includes('triggered') || lowerUser.includes('upset') || lowerUser.includes('bothers me')) {
    insights.push({
      type: 'trigger',
      title: 'Potential Trigger Identified',
      content: userMessage.substring(0, 200),
      importance: 0.8,
      tags: ['trigger', 'emotional']
    });
  }

  return insights;
}
