
import { Message } from "@/types";
import { AIConfigurationService, AIModelConfig, TherapeuticApproachConfig } from "./aiConfigurationService";
import { supabase } from '@/integrations/supabase/client';

interface SessionContext {
  userId: string;
  sessionId: string;
  userPreferences?: any;
  therapeuticGoals?: string[];
  currentMood?: string;
  sessionHistory?: Message[];
}

interface AIResponse {
  message: string;
  confidence: number;
  technique: string;
  emotion: string;
  qualityScore: number;
  reasoning?: string;
}

export class ConfiguredAIService {
  private static activeModelConfig: AIModelConfig | null = null;
  private static therapeuticApproaches: TherapeuticApproachConfig[] = [];

  // Initialize the service with current configurations
  static async initialize(): Promise<void> {
    try {
      // Load active AI model configuration
      const models = await AIConfigurationService.getAIModels();
      this.activeModelConfig = models.find(m => m.isActive) || models[0] || null;

      // Load therapeutic approaches
      this.therapeuticApproaches = await AIConfigurationService.getTherapeuticApproaches();
      
      console.log('ConfiguredAIService initialized with:', {
        activeModel: this.activeModelConfig?.name,
        approaches: this.therapeuticApproaches.length
      });
    } catch (error) {
      console.error('Error initializing ConfiguredAIService:', error);
    }
  }

  // Get the optimal model configuration for a user/session
  static async getOptimalModelConfig(context: SessionContext): Promise<AIModelConfig | null> {
    if (!this.activeModelConfig) {
      await this.initialize();
    }

    // TODO: Implement user-specific model selection based on:
    // - User preferences
    // - Session context
    // - A/B test assignments
    // - Performance metrics

    return this.activeModelConfig;
  }

  // Get the best therapeutic approach for the context
  static async getOptimalTherapeuticApproach(context: SessionContext): Promise<TherapeuticApproachConfig | null> {
    if (this.therapeuticApproaches.length === 0) {
      await this.initialize();
    }

    // Simple approach selection based on user preferences
    if (context.userPreferences?.preferred_approaches?.length > 0) {
      const preferredApproach = this.therapeuticApproaches.find(approach => 
        context.userPreferences.preferred_approaches.includes(approach.name)
      );
      if (preferredApproach) return preferredApproach;
    }

    // Default to highest effectiveness score
    return this.therapeuticApproaches.find(a => a.isActive) || null;
  }

  // Enhanced message sending with configuration support
  static async sendConfiguredMessage(
    message: string,
    context: SessionContext
  ): Promise<AIResponse> {
    try {
      const modelConfig = await this.getOptimalModelConfig(context);
      const therapeuticApproach = await this.getOptimalTherapeuticApproach(context);

      if (!modelConfig) {
        throw new Error('No AI model configuration available');
      }

      // Build enhanced system prompt
      let systemPrompt = modelConfig.systemPrompt;

      if (therapeuticApproach) {
        systemPrompt += `\n\n${therapeuticApproach.systemPromptAddition}`;
        systemPrompt += `\nPreferred techniques: ${therapeuticApproach.techniques.join(', ')}`;
        systemPrompt += `\nTarget conditions: ${therapeuticApproach.targetConditions.join(', ')}`;
      }

      // Add user context
      if (context.userPreferences) {
        systemPrompt += `\n\nUser preferences:`;
        systemPrompt += `\nCommunication style: ${context.userPreferences.communication_style}`;
        if (context.userPreferences.preferred_approaches) {
          systemPrompt += `\nPreferred approaches: ${context.userPreferences.preferred_approaches.join(', ')}`;
        }
      }

      if (context.therapeuticGoals?.length) {
        systemPrompt += `\nTherapeutic goals: ${context.therapeuticGoals.join(', ')}`;
      }

      // Call the AI service (using Supabase Edge Function)
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat', {
        body: {
          message,
          userId: context.userId,
          sessionId: context.sessionId,
          modelConfig: {
            model: modelConfig.model,
            temperature: modelConfig.temperature,
            maxTokens: modelConfig.maxTokens,
            systemPrompt
          },
          therapeuticApproach: therapeuticApproach?.name,
          conversationHistory: context.sessionHistory || []
        }
      });

      if (error) throw error;

      const response: AIResponse = {
        message: data.response,
        confidence: data.confidence || 0.85,
        technique: therapeuticApproach?.name || 'General Support',
        emotion: data.emotion || 'neutral',
        qualityScore: 0.8, // Will be calculated later
        reasoning: data.reasoning
      };

      // Record quality metrics asynchronously
      this.recordSessionMetrics(context.sessionId, response);

      return response;

    } catch (error) {
      console.error('Error in sendConfiguredMessage:', error);
      
      // Fallback response
      return {
        message: "I understand you're sharing something important with me. Could you tell me more about what you're experiencing right now?",
        confidence: 0.5,
        technique: 'Active Listening',
        emotion: 'neutral',
        qualityScore: 0.6
      };
    }
  }

  // Record metrics for continuous improvement
  private static async recordSessionMetrics(sessionId: string, response: AIResponse): Promise<void> {
    try {
      await AIConfigurationService.recordQualityMetrics({
        sessionId,
        responseQuality: response.qualityScore,
        therapeuticValue: response.confidence,
        safetyScore: 0.95, // Will be calculated by safety checks
        userSatisfaction: 0, // Will be updated when user provides feedback
        flaggedContent: false,
        reviewRequired: response.qualityScore < 0.7
      });
    } catch (error) {
      console.error('Error recording session metrics:', error);
    }
  }

  // Get personalized recommendations for a user
  static async getPersonalizedRecommendations(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('personalized_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('priority_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      return [];
    }
  }

  // Update model performance metrics
  static async updateModelPerformance(modelId: string, metrics: {
    responseTime: number;
    tokenUsage: number;
    cost: number;
    userRating?: number;
  }): Promise<void> {
    try {
      await supabase
        .from('ai_performance_stats')
        .insert({
          model_id: modelId,
          response_time: metrics.responseTime,
          token_usage: metrics.tokenUsage,
          cost: metrics.cost,
          user_rating: metrics.userRating,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating model performance:', error);
    }
  }
}
