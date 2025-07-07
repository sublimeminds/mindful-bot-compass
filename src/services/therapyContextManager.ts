import { supabase } from '@/integrations/supabase/client';

export interface TherapyContextData {
  id?: string;
  userId: string;
  sessionId?: string;
  currentAiModel: string;
  currentVoiceId?: string;
  currentAvatarState?: string;
  culturalProfile: any;
  emotionalState: any;
  contextData: any;
}

export interface AIModelConfig {
  modelName: string;
  provider: string;
  taskTypes: string[];
  culturalSupport: boolean;
  costPerRequest: number;
  averageResponseTime: number;
  qualityScore: number;
}

export class TherapyContextManager {
  private static instance: TherapyContextManager;
  private currentContext: TherapyContextData | null = null;

  static getInstance(): TherapyContextManager {
    if (!TherapyContextManager.instance) {
      TherapyContextManager.instance = new TherapyContextManager();
    }
    return TherapyContextManager.instance;
  }

  async createContext(data: Omit<TherapyContextData, 'id'>): Promise<string | null> {
    try {
      const { data: context, error } = await supabase
        .from('therapy_context')
        .insert({
          user_id: data.userId,
          session_id: data.sessionId || null,
          current_ai_model: data.currentAiModel,
          current_voice_id: data.currentVoiceId || null,
          current_avatar_state: data.currentAvatarState || null,
          cultural_profile: data.culturalProfile || {},
          emotional_state: data.emotionalState || {},
          context_data: data.contextData || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      this.currentContext = {
        id: context.id,
        userId: context.user_id,
        sessionId: context.session_id,
        currentAiModel: context.current_ai_model,
        currentVoiceId: context.current_voice_id,
        currentAvatarState: context.current_avatar_state,
        culturalProfile: context.cultural_profile,
        emotionalState: context.emotional_state,
        contextData: context.context_data
      };

      return context.id;
    } catch (error) {
      console.error('Error creating therapy context:', error);
      return null;
    }
  }

  async updateContext(contextId: string, updates: Partial<TherapyContextData>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (updates.currentAiModel) updateData.current_ai_model = updates.currentAiModel;
      if (updates.currentVoiceId) updateData.current_voice_id = updates.currentVoiceId;
      if (updates.currentAvatarState) updateData.current_avatar_state = updates.currentAvatarState;
      if (updates.culturalProfile) updateData.cultural_profile = updates.culturalProfile;
      if (updates.emotionalState) updateData.emotional_state = updates.emotionalState;
      if (updates.contextData) updateData.context_data = updates.contextData;

      const { error } = await supabase
        .from('therapy_context')
        .update(updateData)
        .eq('id', contextId);

      if (error) throw error;

      // Update local context
      if (this.currentContext && this.currentContext.id === contextId) {
        this.currentContext = { ...this.currentContext, ...updates };
      }

      return true;
    } catch (error) {
      console.error('Error updating therapy context:', error);
      return false;
    }
  }

  async getContext(contextId: string): Promise<TherapyContextData | null> {
    try {
      const { data: context, error } = await supabase
        .from('therapy_context')
        .select('*')
        .eq('id', contextId)
        .single();

      if (error) throw error;

      return {
        id: context.id,
        userId: context.user_id,
        sessionId: context.session_id,
        currentAiModel: context.current_ai_model,
        currentVoiceId: context.current_voice_id,
        currentAvatarState: context.current_avatar_state,
        culturalProfile: context.cultural_profile,
        emotionalState: context.emotional_state,
        contextData: context.context_data
      };
    } catch (error) {
      console.error('Error fetching therapy context:', error);
      return null;
    }
  }

  getCurrentContext(): TherapyContextData | null {
    return this.currentContext;
  }

  async selectOptimalModel(taskType: string, culturalContext?: any, userTier?: string): Promise<string> {
    // Model selection logic based on task type and context
    const modelConfigs: AIModelConfig[] = [
      {
        modelName: 'claude-opus-4-20250514',
        provider: 'anthropic',
        taskTypes: ['crisis', 'complex-therapy', 'cultural-sensitive'],
        culturalSupport: true,
        costPerRequest: 0.015,
        averageResponseTime: 2500,
        qualityScore: 0.95
      },
      {
        modelName: 'claude-sonnet-4-20250514', 
        provider: 'anthropic',
        taskTypes: ['daily-therapy', 'mood-analysis', 'general-conversation'],
        culturalSupport: true,
        costPerRequest: 0.003,
        averageResponseTime: 1200,
        qualityScore: 0.90
      },
      {
        modelName: 'gpt-4.1-2025-04-14',
        provider: 'openai',
        taskTypes: ['creative', 'content-generation', 'voice-interaction'],
        culturalSupport: false,
        costPerRequest: 0.010,
        averageResponseTime: 1800,
        qualityScore: 0.88
      }
    ];

    // Crisis detection - always use most capable model
    if (taskType === 'crisis') {
      return 'claude-opus-4-20250514';
    }

    // User tier considerations
    if (userTier === 'free') {
      return 'claude-sonnet-4-20250514';
    }

    // Cultural sensitivity requirements
    if (culturalContext && Object.keys(culturalContext).length > 0) {
      const culturalModels = modelConfigs.filter(m => m.culturalSupport);
      return culturalModels[0]?.modelName || 'claude-sonnet-4-20250514';
    }

    // Task-specific selection
    const suitableModels = modelConfigs.filter(m => m.taskTypes.includes(taskType));
    if (suitableModels.length > 0) {
      // Select based on quality score for premium users
      suitableModels.sort((a, b) => b.qualityScore - a.qualityScore);
      return suitableModels[0].modelName;
    }

    // Default fallback
    return 'claude-sonnet-4-20250514';
  }

  async logModelPerformance(
    modelName: string,
    taskType: string, 
    responseTime: number,
    qualityScore: number,
    userSatisfaction: number,
    cost: number,
    culturalContext?: string
  ): Promise<void> {
    try {
      await supabase
        .from('ai_model_performance')
        .insert({
          model_name: modelName,
          task_type: taskType,
          response_time_ms: responseTime,
          quality_score: qualityScore,
          user_satisfaction_score: userSatisfaction,
          cost_per_request: cost,
          cultural_context: culturalContext || null,
          success_rate: qualityScore > 0.8 ? 95.0 : 75.0
        });
    } catch (error) {
      console.error('Error logging model performance:', error);
    }
  }

  async getPerformanceMetrics(modelName?: string, taskType?: string): Promise<any[]> {
    try {
      let query = supabase.from('ai_model_performance').select('*');
      
      if (modelName) {
        query = query.eq('model_name', modelName);
      }
      
      if (taskType) {
        query = query.eq('task_type', taskType);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }
}

export const therapyContextManager = TherapyContextManager.getInstance();