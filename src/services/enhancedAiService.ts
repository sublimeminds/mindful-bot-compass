
import { Message } from "@/types";
import { SessionRecommendationService } from "./sessionRecommendationService";

const API_URL = import.meta.env.VITE_OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface EmotionAnalysis {
  dominant_emotion: string;
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    neutral: number;
  };
}

export const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: `You are an emotion analysis AI. Analyze the emotional content of the user's text and return a JSON object with:
            - dominant_emotion: the primary emotion detected
            - confidence: confidence score (0-1)
            - emotions: object with scores for joy, sadness, anger, fear, surprise, neutral (0-1 each)`
          },
          {
            role: "user",
            content: `Analyze the emotions in this text: "${text}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return {
      dominant_emotion: "neutral",
      confidence: 0.5,
      emotions: { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0, neutral: 1 }
    };
  }
};

export const sendEnhancedMessage = async (
  message: string, 
  conversationHistory: Message[] = [],
  therapistPrompt?: string,
  userPreferences?: {
    communicationStyle?: string;
    preferredApproaches?: string[];
    emotionalState?: string;
  }
): Promise<{ response: string; emotion: EmotionAnalysis }> => {
  // Analyze user's emotion
  const emotion = await analyzeEmotion(message);
  
  // Build enhanced prompt based on emotion and preferences
  let enhancedPrompt = therapistPrompt || `You are MindfulAI, an advanced AI therapist with emotional intelligence. Adapt your communication style based on the user's emotional state and preferences.`;

  if (userPreferences) {
    enhancedPrompt += `\n\nUser Preferences:
    - Communication Style: ${userPreferences.communicationStyle || 'supportive'}
    - Preferred Approaches: ${userPreferences.preferredApproaches?.join(', ') || 'CBT, mindfulness'}
    - Current Emotional State: ${emotion.dominant_emotion} (confidence: ${emotion.confidence})`;
  }

  enhancedPrompt += `\n\nCurrent User Emotion Analysis:
  - Dominant Emotion: ${emotion.dominant_emotion}
  - Confidence: ${(emotion.confidence * 100).toFixed(1)}%
  
  Please respond with empathy and adjust your therapeutic approach accordingly. If the user seems distressed (sadness, anger, fear), provide more supportive and validating responses. If they seem positive, encourage continued progress.`;

  // Check for stored session recommendation
  const storedRecommendation = sessionStorage.getItem('sessionRecommendation');
  if (storedRecommendation && conversationHistory.length < 3) {
    const recommendation = JSON.parse(storedRecommendation);
    enhancedPrompt += `\n\nSPECIAL SESSION FOCUS: "${recommendation.title}"
    Goal: ${recommendation.description}
    Techniques: ${recommendation.techniques.join(', ')}
    Duration: ${recommendation.estimatedDuration} minutes`;
  }

  const messages = [
    {
      role: "system",
      content: enhancedPrompt
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
        model: "gpt-4.1-2025-04-14",
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        n: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    // Clear recommendation after first few messages
    if (conversationHistory.length >= 2) {
      sessionStorage.removeItem('sessionRecommendation');
    }
    
    return { response: aiMessage, emotion };

  } catch (error: any) {
    console.error("Error sending enhanced message:", error);
    return { 
      response: "I'm having trouble processing your request right now. Please try again later.",
      emotion
    };
  }
};

export const generatePersonalizedInsight = async (
  userHistory: Message[],
  moodData: any[],
  goals: string[]
): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: `You are an AI therapist that generates personalized insights based on user data. Analyze patterns in conversation history, mood trends, and goals to provide actionable insights.`
          },
          {
            role: "user",
            content: `Based on this data, generate a personalized insight:
            
            Recent conversations: ${userHistory.slice(-5).map(m => m.content).join('; ')}
            Goals: ${goals.join(', ')}
            
            Provide a brief, actionable insight that helps the user understand their patterns and suggests next steps.`
          }
        ],
        max_tokens: 200,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Keep focusing on your goals and maintaining consistent self-care practices.";
  }
};
