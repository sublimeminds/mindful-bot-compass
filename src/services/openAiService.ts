
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TherapyResponse {
  message: string;
  emotion?: string;
  techniques?: string[];
  insights?: string[];
}

export class OpenAIService {
  private static async getApiKey(): Promise<string> {
    // In production, this would come from Supabase Edge Function
    // For now, we'll use a placeholder that indicates API key is needed
    throw new Error('OpenAI API key not configured. Please add it in Supabase Edge Function secrets.');
  }

  static async sendTherapyMessage(
    userMessage: string,
    conversationHistory: ChatMessage[],
    therapistPersonality?: any,
    userId?: string
  ): Promise<TherapyResponse> {
    try {
      // Call our Supabase Edge Function for AI therapy chat
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat', {
        body: {
          message: userMessage,
          userId: userId,
          therapistPersonality: therapistPersonality,
          conversationHistory: conversationHistory
        }
      });

      if (error) throw error;

      return {
        message: data.response,
        emotion: data.emotion,
        techniques: data.techniques,
        insights: data.insights
      };
    } catch (error) {
      console.error('Error calling AI therapy service:', error);
      
      // Fallback response for development
      const fallbackResponses = [
        "I understand how you're feeling. Thank you for sharing that with me.",
        "That sounds like a challenging situation. Can you tell me more about what you're experiencing?",
        "I hear you. It takes courage to talk about these feelings. What do you think might help you feel more supported?",
        "Those are valid feelings. What strategies have you found helpful in similar situations before?",
        "I appreciate you opening up about this. Let's explore some ways to work through these thoughts together."
      ];
      
      return {
        message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        emotion: 'neutral',
        techniques: ['Active Listening', 'Validation'],
        insights: ['User is expressing emotional distress', 'Opportunity for supportive response']
      };
    }
  }

  static async analyzeMoodPatterns(moodEntries: any[]): Promise<any> {
    // This would analyze mood patterns using AI
    // For now, return basic analysis
    return {
      trend: 'stable',
      insights: ['Regular mood tracking shows consistency'],
      recommendations: ['Continue daily mood tracking', 'Consider noting triggers']
    };
  }

  static async generateSessionInsights(sessionData: any): Promise<string[]> {
    // This would generate insights from session data
    return [
      'You showed good emotional awareness during this session',
      'Consider practicing the breathing techniques we discussed',
      'Your progress in managing stress is noticeable'
    ];
  }
}
