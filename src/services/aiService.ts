import { Message } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const sendMessage = async (
  message: string, 
  conversationHistory: Message[] = [],
  therapistPrompt?: string
): Promise<string> => {
  const messages = [
    {
      role: "system",
      content: therapistPrompt || `You are MindfulAI, a compassionate and professional AI therapist. Your role is to provide supportive, evidence-based mental health guidance while maintaining appropriate boundaries.

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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
        n: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    return aiMessage;

  } catch (error: any) {
    console.error("Error sending message to OpenAI:", error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
};
