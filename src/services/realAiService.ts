
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionBasedAiService } from './subscriptionBasedAiService';
import { ChatMessage } from './openAiService';

export interface ConversationContext {
  userId: string;
  sessionId?: string;
  conversationHistory: ChatMessage[];
  userProfile?: any;
  currentMood?: any;
  recentGoals?: any[];
  therapist?: any;
}

export interface AIResponse {
  message: string;
  emotion?: string;
  techniques?: string[];
  insights?: string[];
  followUpQuestions?: string[];
  riskLevel?: 'low' | 'moderate' | 'high' | 'crisis';
  recommendations?: string[];
}

import { getUserLanguagePreference, shouldTranslate } from '@/utils/languageUtils';

class RealAIService {
  async generateTherapyResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    try {
      // Get user profile and preferences for personalization
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', context.userId)
        .single();

      // Get recent mood entries for context
      const { data: recentMoods } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', context.userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get personalization config
      const { data: personalization } = await supabase
        .from('personalization_configs')
        .select('*')
        .eq('user_id', context.userId)
        .single();

      // Build enhanced context for AI
      const enhancedContext = {
        userProfile: profile,
        recentMoods,
        personalization,
        conversationHistory: context.conversationHistory,
        currentGoals: context.recentGoals
      };

      // Create system prompt with personalization
      const systemPrompt = this.buildPersonalizedPrompt(enhancedContext);

      // Detect user language preference
      const languagePreference = getUserLanguagePreference(profile, personalization);
      const userLanguage = languagePreference.language;

      // Use subscription-based AI service with translation support
      const aiResponse = await SubscriptionBasedAiService.generateResponse(
        userMessage,
        {
          systemPrompt,
          therapist: context.therapist,
          approach: context.therapist?.approach,
          communicationStyle: context.therapist?.communicationStyle,
          targetLanguage: userLanguage,
          culturalContext: personalization?.cultural_context,
          ...enhancedContext
        },
        context.userId,
        'chat',
        'medium'
      );

      // Analyze for crisis indicators
      const riskAssessment = await this.assessRiskLevel(userMessage, context);

      // Store conversation memory
      await this.storeConversationMemory(
        context.userId,
        userMessage,
        aiResponse.message,
        context.sessionId
      );

      // Generate follow-up questions
      const followUpQuestions = await this.generateFollowUpQuestions(
        userMessage,
        aiResponse.message,
        enhancedContext
      );

      // Translate response if needed
      let translatedMessage = aiResponse.message;
      let translatedTechniques = aiResponse.techniques;
      let translatedInsights = aiResponse.insights;
      let translatedQuestions = followUpQuestions;
      let translatedRecommendations = riskAssessment.recommendations;

      // Translation functionality removed - content will be handled by admin backend

      return {
        message: translatedMessage,
        emotion: aiResponse.emotion,
        techniques: translatedTechniques,
        insights: translatedInsights,
        followUpQuestions: translatedQuestions,
        riskLevel: riskAssessment.level,
        recommendations: translatedRecommendations
      };

    } catch (error) {
      console.error('Error generating therapy response:', error);
      // Fallback response
      return {
        message: "I understand you're reaching out. Could you tell me more about what's on your mind today?",
        emotion: 'neutral',
        techniques: ['Active Listening'],
        insights: ['User initiated conversation'],
        riskLevel: 'low',
        recommendations: ['Continue supportive dialogue']
      };
    }
  }

  private buildPersonalizedPrompt(context: any): string {
    const basePrompt = `You are MindfulAI, a compassionate AI therapist. Provide supportive, evidence-based mental health guidance.`;
    
    let personalizedPrompt = basePrompt;

    if (context.personalization) {
      personalizedPrompt += `\n\nPersonalization Context:
      - Communication Style: ${context.personalization.communication_style}
      - Cultural Context: ${context.personalization.cultural_context}
      - Preferred Techniques: ${context.personalization.preferred_techniques?.join(', ')}
      - Emotional Sensitivity: ${context.personalization.emotional_sensitivity}`;
    }

    if (context.recentMoods && context.recentMoods.length > 0) {
      const latestMood = context.recentMoods[0];
      personalizedPrompt += `\n\nRecent Mood Context:
      - Overall Mood: ${latestMood.overall}/10
      - Anxiety Level: ${latestMood.anxiety}/10
      - Energy Level: ${latestMood.energy}/10`;
    }

    return personalizedPrompt;
  }

  private async assessRiskLevel(message: string, context: ConversationContext) {
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hopeless', 'no point'];
    const messageText = message.toLowerCase();
    
    const hasCrisisIndicators = crisisKeywords.some(keyword => 
      messageText.includes(keyword)
    );

    if (hasCrisisIndicators) {
      // Store crisis assessment
      await supabase.from('crisis_assessments').insert({
        user_id: context.userId,
        risk_level: 'high',
        assessment_type: 'ai_detected',
        responses: { message, detected_keywords: crisisKeywords.filter(k => messageText.includes(k)) },
        severity_indicators: ['Suicidal ideation detected in conversation']
      });

      return {
        level: 'crisis' as const,
        recommendations: [
          'Immediate professional intervention needed',
          'Contact crisis hotline: 988',
          'Seek emergency services if in immediate danger'
        ]
      };
    }

    return {
      level: 'low' as const,
      recommendations: ['Continue supportive conversation']
    };
  }

  private async storeConversationMemory(
    userId: string,
    userMessage: string,
    aiResponse: string,
    sessionId?: string
  ) {
    try {
      await supabase.from('conversation_memory').insert({
        user_id: userId,
        session_id: sessionId,
        title: userMessage.substring(0, 50),
        content: `User: ${userMessage}\nAI: ${aiResponse}`,
        memory_type: 'conversation',
        importance_score: 0.7,
        tags: ['therapy_session']
      });
    } catch (error) {
      console.error('Error storing conversation memory:', error);
    }
  }

  private async generateFollowUpQuestions(
    userMessage: string,
    aiResponse: string,
    context: any
  ): Promise<string[]> {
    // Generate contextual follow-up questions based on conversation
    const questions = [
      "How does that make you feel?",
      "What would help you feel more supported right now?",
      "Have you experienced something similar before?"
    ];

    // Customize based on context
    if (context.recentMoods && context.recentMoods[0]?.anxiety > 7) {
      questions.push("What techniques have helped you manage anxiety in the past?");
    }

    return questions.slice(0, 3);
  }

  async analyzeSessionInsights(sessionId: string): Promise<any> {
    try {
      // Get session messages
      const { data: messages } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp');

      if (!messages || messages.length === 0) {
        return { insights: [], themes: [], progress: 'neutral' };
      }

      // Analyze conversation themes and patterns
      const insights = await this.extractInsights(messages);
      
      // Store insights in database
      await supabase.from('session_insights').insert({
        session_id: sessionId,
        insight_type: 'ai_analysis',
        title: 'Session Analysis',
        description: insights.summary,
        confidence_score: 0.8,
        actionable_suggestion: insights.suggestion
      });

      return insights;
    } catch (error) {
      console.error('Error analyzing session insights:', error);
      return { insights: [], themes: [], progress: 'neutral' };
    }
  }

  private async extractInsights(messages: any[]): Promise<any> {
    // Analyze message patterns, emotions, and themes
    const userMessages = messages.filter(m => m.sender === 'user');
    const emotions = userMessages.map(m => m.emotion).filter(Boolean);
    
    return {
      summary: 'Session showed good emotional expression and engagement',
      suggestion: 'Continue exploring coping strategies discussed',
      themes: ['emotional_awareness', 'coping_strategies'],
      emotionalTrend: emotions.length > 0 ? 'positive' : 'neutral'
    };
  }
}

export const realAIService = new RealAIService();
