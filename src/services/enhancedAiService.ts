import { Message } from "@/types";
import { SessionRecommendationService } from "./sessionRecommendationService";
import { CulturallyAwareAIService, CulturalContext } from "./culturallyAwareAiService";
import { MultiLanguageAIService } from "./multiLanguageAiService";
import { CrisisDetectionService } from "./crisisDetectionService";

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
  culturalContext?: string;
  culturalNuances?: string[];
}

interface EnhancedUserPreferences {
  communicationStyle?: string;
  preferredApproaches?: string[];
  emotionalState?: string;
  culturalContext?: CulturalContext;
  language?: string;
  crisisProtocol?: boolean;
}

export const analyzeEmotion = async (text: string, culturalContext?: CulturalContext): Promise<EmotionAnalysis> => {
  try {
    if (culturalContext) {
      const culturalEmotion = await CulturallyAwareAIService.analyzeEmotionWithCulture(text, culturalContext);
      return {
        dominant_emotion: culturalEmotion.primary,
        confidence: 0.9,
        emotions: {
          joy: culturalEmotion.primary === 'joy' ? 0.8 : 0.2,
          sadness: culturalEmotion.primary === 'sadness' ? 0.8 : 0.2,
          anger: culturalEmotion.primary === 'anger' ? 0.8 : 0.2,
          fear: culturalEmotion.primary === 'fear' ? 0.8 : 0.2,
          surprise: culturalEmotion.primary === 'surprise' ? 0.8 : 0.2,
          neutral: culturalEmotion.primary === 'neutral' ? 0.8 : 0.2
        },
        culturalContext: culturalEmotion.culturalContext,
        culturalNuances: culturalEmotion.culturalNuances
      };
    }

    // Fallback to basic emotion analysis
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
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
  userPreferences?: EnhancedUserPreferences
): Promise<{ response: string; emotion: EmotionAnalysis }> => {
  try {
    // First, check for crisis indicators
    const crisisIndicator = CrisisDetectionService.analyzeCrisisLevel(message);
    if (crisisIndicator && crisisIndicator.type === 'severe') {
      const crisisResponse = await handleCrisisResponse(message, userPreferences?.culturalContext);
      const emotion = await analyzeEmotion(message, userPreferences?.culturalContext);
      return { response: crisisResponse, emotion };
    }

    // Detect language if not provided
    let targetLanguage = userPreferences?.language || 'en';
    if (!userPreferences?.language) {
      const detection = await MultiLanguageAIService.detectLanguage(message);
      targetLanguage = detection.language;
    }

    // Analyze emotion with cultural context
    const emotion = await analyzeEmotion(message, userPreferences?.culturalContext);
    
    // Generate culturally-aware response
    if (userPreferences?.culturalContext) {
      const culturalResponse = await CulturallyAwareAIService.generateCulturallyAdaptedResponse(
        message,
        userPreferences.culturalContext,
        {
          primary: emotion.dominant_emotion,
          secondary: [],
          intensity: emotion.confidence,
          culturalContext: emotion.culturalContext || 'unknown',
          culturalNuances: emotion.culturalNuances || []
        },
        conversationHistory
      );
      
      return { response: culturalResponse, emotion };
    }

    // Multi-language response generation
    if (targetLanguage !== 'en') {
      const multiLangResponse = await MultiLanguageAIService.generateMultiLanguageResponse(
        message,
        targetLanguage,
        userPreferences?.culturalContext || { language: targetLanguage, region: 'unknown' }
      );
      
      return { response: multiLangResponse, emotion };
    }

    // Fallback to original enhanced logic
    return await generateStandardResponse(message, conversationHistory, therapistPrompt, userPreferences, emotion);

  } catch (error: any) {
    console.error("Error in enhanced message processing:", error);
    const fallbackEmotion = await analyzeEmotion(message);
    return { 
      response: "I'm having trouble processing your request right now. Please try again later.",
      emotion: fallbackEmotion
    };
  }
};

async function handleCrisisResponse(message: string, culturalContext?: CulturalContext): Promise<string> {
  const crisisIndicator = CrisisDetectionService.analyzeCrisisLevel(message);
  if (!crisisIndicator) return "I'm here to support you.";

  let response = CrisisDetectionService.generateCrisisResponse(crisisIndicator);
  
  // Add cultural adaptations for crisis response
  if (culturalContext) {
    if (culturalContext.familyStructure === 'collective') {
      response += "\n\nPlease also consider reaching out to trusted family members or community leaders who care about you.";
    }
    
    if (culturalContext.religiousBeliefs) {
      response += "\n\nYour spiritual community and religious leaders may also provide comfort and guidance during this difficult time.";
    }
  }
  
  // Add crisis resources
  const resources = CrisisDetectionService.getCrisisResources(crisisIndicator.type);
  response += "\n\nImmediate help is available:";
  resources.forEach(resource => {
    response += `\n• ${resource.name}: ${resource.phone} (${resource.availability})`;
  });
  
  return response;
}

async function generateStandardResponse(
  message: string,
  conversationHistory: Message[],
  therapistPrompt?: string,
  userPreferences?: EnhancedUserPreferences,
  emotion?: EmotionAnalysis
): Promise<{ response: string; emotion: EmotionAnalysis }> {
  const finalEmotion = emotion || await analyzeEmotion(message);
  
  // Build enhanced prompt based on emotion and preferences
  let enhancedPrompt = therapistPrompt || `You are MindfulAI, an advanced AI therapist with emotional intelligence and cultural awareness.`;

  if (userPreferences) {
    enhancedPrompt += `\n\nUser Preferences:
    - Communication Style: ${userPreferences.communicationStyle || 'supportive'}
    - Preferred Approaches: ${userPreferences.preferredApproaches?.join(', ') || 'CBT, mindfulness'}
    - Current Emotional State: ${finalEmotion.dominant_emotion} (confidence: ${finalEmotion.confidence})`;
    
    if (userPreferences.culturalContext) {
      enhancedPrompt += `\n- Cultural Background: ${userPreferences.culturalContext.culturalBackground}
      - Family Structure: ${userPreferences.culturalContext.familyStructure}
      - Communication Style: ${userPreferences.culturalContext.communicationStyle}`;
    }
  }

  enhancedPrompt += `\n\nCurrent User Emotion Analysis:
  - Dominant Emotion: ${finalEmotion.dominant_emotion}
  - Confidence: ${(finalEmotion.confidence * 100).toFixed(1)}%`;
  
  if (finalEmotion.culturalContext) {
    enhancedPrompt += `\n- Cultural Context: ${finalEmotion.culturalContext}
    - Cultural Nuances: ${finalEmotion.culturalNuances?.join(', ')}`;
  }
  
  enhancedPrompt += `\n\nPlease respond with empathy and adjust your therapeutic approach accordingly.`;

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
        model: "gpt-4-turbo-preview",
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
    
    return { response: aiMessage, emotion: finalEmotion };

  } catch (error: any) {
    console.error("Error in standard response generation:", error);
    return { 
      response: "I'm having trouble processing your request right now. Please try again later.",
      emotion: finalEmotion
    };
  }
}

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
        model: "gpt-4-turbo-preview",
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
