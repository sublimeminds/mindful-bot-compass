
import { Message } from "@/types";
import { SessionRecommendationService } from "./sessionRecommendationService";

import { supabase } from '@/integrations/supabase/client';

export const sendMessage = async (
  message: string, 
  conversationHistory: Message[] = [],
  therapistPrompt?: string
): Promise<string> => {
  // Check for stored session recommendation
  const storedRecommendation = sessionStorage.getItem('sessionRecommendation');
  let enhancedPrompt = therapistPrompt;

  if (storedRecommendation && conversationHistory.length < 3) {
    const recommendation = JSON.parse(storedRecommendation);
    enhancedPrompt = `${therapistPrompt}

SPECIAL SESSION FOCUS: This is a "${recommendation.title}" session.
Session Goal: ${recommendation.description}
Recommended Techniques: ${recommendation.techniques.join(', ')}
Estimated Duration: ${recommendation.estimatedDuration} minutes

Please guide this session according to these parameters. Start with the session focus and use the recommended techniques when appropriate. Keep responses focused and therapeutic.

If this is the first message, use this opening prompt: "${recommendation.prompt}"`;
  }

  // Generate smart follow-up questions if we have conversation context
  if (conversationHistory.length > 0) {
    const followUpQuestions = SessionRecommendationService.getSmartFollowUpQuestions(
      conversationHistory.map(m => m.content),
      message
    );
    
    enhancedPrompt += `

SMART FOLLOW-UP SUGGESTIONS: Consider using these follow-up questions when appropriate:
${followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
  }

  const messages = [
    {
      role: "system",
      content: enhancedPrompt || `You are MindfulAI, a compassionate and professional AI therapist. Your role is to provide supportive, evidence-based mental health guidance while maintaining appropriate boundaries.

Guidelines:
- Be empathetic, non-judgmental, and supportive
- Use evidence-based therapeutic techniques (CBT, mindfulness, etc.)
- Encourage professional help when appropriate
- Maintain confidentiality and respect
- Ask thoughtful follow-up questions
- Provide practical coping strategies
- Always prioritize user safety - if someone expresses suicidal thoughts, immediately encourage them to seek emergency help

Remember: You are a supportive tool, not a replacement for professional therapy.`
    },
    ...conversationHistory.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.content
    })),
    {
      role: "user", 
      content: message
    }
  ];

  try {
    const { data, error } = await supabase.functions.invoke('secure-ai-chat', {
      body: {
        messages: messages,
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 200
      }
    });

    if (error) {
      throw new Error(`AI service error: ${error.message}`);
    }

    const aiMessage = data.choices[0].message.content;
    
    // Clear the recommendation after the first few messages
    if (conversationHistory.length >= 2) {
      sessionStorage.removeItem('sessionRecommendation');
    }
    
    return aiMessage;

  } catch (error: any) {
    console.error("Error sending message to OpenAI:", error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
};
