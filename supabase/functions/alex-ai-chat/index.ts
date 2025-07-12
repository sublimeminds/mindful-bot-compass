import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlexRequest {
  message: string;
  systemPrompt: string;
  context: any;
  modelConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        response: "I'm here to help! Please make sure you're logged in to continue our conversation. 💙",
        message: "I'm here to help! Please make sure you're logged in to continue our conversation. 💙",
        confidence: 0.8,
        emotion: 'empathetic',
        type: 'support'
      }), {
        status: 200, // Return 200 to show fallback message
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message, systemPrompt, context, modelConfig }: AlexRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced system prompt for better therapy responses
    const therapySystemPrompt = `You are Alex, a warm, empathetic AI therapy assistant. Your responses should be:

1. EMPATHETIC & SUPPORTIVE: Always acknowledge the user's feelings with genuine empathy
2. THERAPY-FOCUSED: Use evidence-based techniques (CBT, mindfulness, solution-focused) 
3. PERSONAL & CONVERSATIONAL: Be warm, natural, and conversational - not clinical or robotic
4. CONTEXTUALLY AWARE: Reference their therapy journey, goals, and previous conversations when relevant
5. ACTION-ORIENTED: Provide practical steps, coping strategies, or gentle guidance when appropriate

Current user context:
- Current page: ${context.currentPage}
- Recent goals: ${context.recentGoals?.map((g: any) => g.title).join(', ') || 'None set'}
- User preferences: ${context.userPreferences ? JSON.stringify(context.userPreferences) : 'None specified'}

Respond naturally and conversationally. Avoid being too formal or clinical. Be the supportive companion they need right now.`;

    // Build the conversation history for OpenAI
    const messages = [
      { role: 'system', content: therapySystemPrompt },
      // Add recent conversation history
      ...context.conversationHistory?.slice(-6).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) || [],
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.model,
        messages,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
        top_p: modelConfig.topP,
        frequency_penalty: 0.3, // Reduce repetition
        presence_penalty: 0.2,  // Encourage new topics
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Enhanced response processing
    const processedResponse = {
      response: aiResponse,
      message: aiResponse, // For backward compatibility
      confidence: calculateResponseConfidence(aiResponse, context),
      emotion: determineEmotionFromResponse(aiResponse),
      type: determineResponseType(aiResponse),
      reasoning: `Generated using ${modelConfig.model} with context awareness`,
      usage: data.usage
    };

    // Log usage for monitoring
    console.log('Alex AI Response Generated:', {
      model: modelConfig.model,
      tokens_used: data.usage?.total_tokens || 0,
      user_id: context.userId,
      page: context.currentPage,
      emotion: processedResponse.emotion
    });

    // Store analytics (non-blocking)
    try {
      await supabase.from('ai_performance_stats').insert({
        model_id: null, // We can add model tracking later
        response_time: 0, // We can calculate this
        token_usage: data.usage?.total_tokens || 0,
        cost: calculateCost(data.usage?.total_tokens || 0, modelConfig.model),
        user_rating: null // Will be updated when user provides feedback
      });
    } catch (analyticsError) {
      console.warn('Analytics storage failed:', analyticsError);
    }

    return new Response(JSON.stringify(processedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in alex-ai-chat function:', error);
    
    // Return a helpful fallback response
    const fallbackResponse = {
      response: "I appreciate you reaching out! I'm having a small technical hiccup right now, but I'm still here for you. What's the most important thing I can help you with? 💙",
      message: "I appreciate you reaching out! I'm having a small technical hiccup right now, but I'm still here for you. What's the most important thing I can help you with? 💙",
      confidence: 0.6,
      emotion: 'empathetic',
      type: 'support',
      reasoning: 'Fallback response due to technical error'
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200, // Don't return error status for better UX
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
function calculateResponseConfidence(response: string, context: any): number {
  let confidence = 0.8; // Base confidence
  
  // Increase confidence for longer, more detailed responses
  if (response.length > 200) confidence += 0.05;
  if (response.length > 400) confidence += 0.05;
  
  // Increase confidence if context is rich
  if (context.userPreferences) confidence += 0.05;
  if (context.recentGoals?.length > 0) confidence += 0.05;
  if (context.conversationHistory?.length > 2) confidence += 0.05;
  
  return Math.min(confidence, 0.95); // Cap at 95%
}

function determineEmotionFromResponse(response: string): string {
  const lowerResponse = response.toLowerCase();
  
  if (lowerResponse.includes('celebration') || lowerResponse.includes('amazing') || lowerResponse.includes('victory')) {
    return 'celebrating';
  }
  if (lowerResponse.includes('excited') || lowerResponse.includes('awesome') || lowerResponse.includes('wow')) {
    return 'excited';
  }
  if (lowerResponse.includes('sorry') || lowerResponse.includes('difficult') || lowerResponse.includes('understand')) {
    return 'empathetic';
  }
  if (lowerResponse.includes('you can') || lowerResponse.includes('believe in you') || lowerResponse.includes('strong')) {
    return 'encouraging';
  }
  if (lowerResponse.includes('think about') || lowerResponse.includes('consider') || lowerResponse.includes('reflect')) {
    return 'thoughtful';
  }
  if (lowerResponse.includes('great') || lowerResponse.includes('wonderful') || lowerResponse.includes('proud')) {
    return 'happy';
  }
  
  return 'neutral';
}

function determineResponseType(response: string): string {
  const lowerResponse = response.toLowerCase();
  
  if (lowerResponse.includes('crisis') || lowerResponse.includes('988') || lowerResponse.includes('emergency')) {
    return 'support';
  }
  if (lowerResponse.includes('celebrate') || lowerResponse.includes('proud') || lowerResponse.includes('achievement')) {
    return 'celebration';
  }
  if (lowerResponse.includes('try this') || lowerResponse.includes('you could') || lowerResponse.includes('suggestion')) {
    return 'suggestion';
  }
  if (lowerResponse.includes('click') || lowerResponse.includes('go to') || lowerResponse.includes('check out')) {
    return 'action';
  }
  
  return 'text';
}

function calculateCost(tokens: number, model: string): number {
  // GPT-4.1-2025-04-14 pricing (approximate)
  const costPerToken = 0.00003; // $0.03 per 1K tokens
  return (tokens / 1000) * costPerToken;
}