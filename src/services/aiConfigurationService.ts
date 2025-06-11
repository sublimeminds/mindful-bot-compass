
import { supabase } from '@/integrations/supabase/client';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic';
  model: string;
  isActive: boolean;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  costPerToken: number;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TherapeuticApproachConfig {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  targetConditions: string[];
  effectivenessScore: number;
  isActive: boolean;
  systemPromptAddition: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalizationConfig {
  id: string;
  userId?: string;
  communicationStyle: 'supportive' | 'direct' | 'analytical' | 'encouraging';
  adaptationLevel: 'low' | 'medium' | 'high';
  culturalContext: string;
  preferredTechniques: string[];
  emotionalSensitivity: number;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QualityMetrics {
  sessionId: string;
  responseQuality: number;
  therapeuticValue: number;
  safetyScore: number;
  userSatisfaction: number;
  flaggedContent: boolean;
  reviewRequired: boolean;
  timestamp: string;
}

// Helper function to transform database fields to interface fields
const transformAIModelConfig = (dbRecord: any): AIModelConfig => ({
  id: dbRecord.id,
  name: dbRecord.name,
  provider: dbRecord.provider,
  model: dbRecord.model,
  isActive: dbRecord.is_active,
  temperature: dbRecord.temperature,
  maxTokens: dbRecord.max_tokens,
  systemPrompt: dbRecord.system_prompt,
  costPerToken: dbRecord.cost_per_token,
  capabilities: dbRecord.capabilities,
  createdAt: dbRecord.created_at,
  updatedAt: dbRecord.updated_at
});

const transformTherapeuticApproach = (dbRecord: any): TherapeuticApproachConfig => ({
  id: dbRecord.id,
  name: dbRecord.name,
  description: dbRecord.description,
  techniques: dbRecord.techniques,
  targetConditions: dbRecord.target_conditions,
  effectivenessScore: dbRecord.effectiveness_score,
  isActive: dbRecord.is_active,
  systemPromptAddition: dbRecord.system_prompt_addition,
  createdAt: dbRecord.created_at,
  updatedAt: dbRecord.updated_at
});

const transformPersonalizationConfig = (dbRecord: any): PersonalizationConfig => ({
  id: dbRecord.id,
  userId: dbRecord.user_id,
  communicationStyle: dbRecord.communication_style,
  adaptationLevel: dbRecord.adaptation_level,
  culturalContext: dbRecord.cultural_context,
  preferredTechniques: dbRecord.preferred_techniques,
  emotionalSensitivity: dbRecord.emotional_sensitivity,
  isGlobal: dbRecord.is_global,
  createdAt: dbRecord.created_at,
  updatedAt: dbRecord.updated_at
});

export class AIConfigurationService {
  // AI Model Configuration
  static async getAIModels(): Promise<AIModelConfig[]> {
    try {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformAIModelConfig);
    } catch (error) {
      console.error('Error fetching AI models:', error);
      return [];
    }
  }

  static async updateAIModelConfig(id: string, config: Partial<AIModelConfig>): Promise<boolean> {
    try {
      const updateData: any = {};
      if (config.name) updateData.name = config.name;
      if (config.provider) updateData.provider = config.provider;
      if (config.model) updateData.model = config.model;
      if (config.isActive !== undefined) updateData.is_active = config.isActive;
      if (config.temperature !== undefined) updateData.temperature = config.temperature;
      if (config.maxTokens !== undefined) updateData.max_tokens = config.maxTokens;
      if (config.systemPrompt) updateData.system_prompt = config.systemPrompt;
      if (config.costPerToken !== undefined) updateData.cost_per_token = config.costPerToken;
      if (config.capabilities) updateData.capabilities = config.capabilities;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('ai_model_configs')
        .update(updateData)
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating AI model config:', error);
      return false;
    }
  }

  static async createAIModelConfig(config: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const insertData = {
        name: config.name,
        provider: config.provider,
        model: config.model,
        is_active: config.isActive,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        system_prompt: config.systemPrompt,
        cost_per_token: config.costPerToken,
        capabilities: config.capabilities,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ai_model_configs')
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating AI model config:', error);
      return null;
    }
  }

  // Therapeutic Approach Configuration
  static async getTherapeuticApproaches(): Promise<TherapeuticApproachConfig[]> {
    try {
      const { data, error } = await supabase
        .from('therapeutic_approach_configs')
        .select('*')
        .order('effectiveness_score', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformTherapeuticApproach);
    } catch (error) {
      console.error('Error fetching therapeutic approaches:', error);
      return [];
    }
  }

  static async updateTherapeuticApproach(id: string, config: Partial<TherapeuticApproachConfig>): Promise<boolean> {
    try {
      const updateData: any = {};
      if (config.name) updateData.name = config.name;
      if (config.description) updateData.description = config.description;
      if (config.techniques) updateData.techniques = config.techniques;
      if (config.targetConditions) updateData.target_conditions = config.targetConditions;
      if (config.effectivenessScore !== undefined) updateData.effectiveness_score = config.effectivenessScore;
      if (config.isActive !== undefined) updateData.is_active = config.isActive;
      if (config.systemPromptAddition) updateData.system_prompt_addition = config.systemPromptAddition;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('therapeutic_approach_configs')
        .update(updateData)
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating therapeutic approach:', error);
      return false;
    }
  }

  // Personalization Configuration
  static async getPersonalizationConfigs(userId?: string): Promise<PersonalizationConfig[]> {
    try {
      let query = supabase
        .from('personalization_configs')
        .select('*');

      if (userId) {
        query = query.or(`user_id.eq.${userId},is_global.eq.true`);
      } else {
        query = query.eq('is_global', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformPersonalizationConfig);
    } catch (error) {
      console.error('Error fetching personalization configs:', error);
      return [];
    }
  }

  static async updatePersonalizationConfig(id: string, config: Partial<PersonalizationConfig>): Promise<boolean> {
    try {
      const updateData: any = {};
      if (config.communicationStyle) updateData.communication_style = config.communicationStyle;
      if (config.adaptationLevel) updateData.adaptation_level = config.adaptationLevel;
      if (config.culturalContext) updateData.cultural_context = config.culturalContext;
      if (config.preferredTechniques) updateData.preferred_techniques = config.preferredTechniques;
      if (config.emotionalSensitivity !== undefined) updateData.emotional_sensitivity = config.emotionalSensitivity;
      if (config.isGlobal !== undefined) updateData.is_global = config.isGlobal;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('personalization_configs')
        .update(updateData)
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating personalization config:', error);
      return false;
    }
  }

  // Quality Metrics
  static async recordQualityMetrics(metrics: Omit<QualityMetrics, 'timestamp'>): Promise<boolean> {
    try {
      const insertData = {
        session_id: metrics.sessionId,
        response_quality: metrics.responseQuality,
        therapeutic_value: metrics.therapeuticValue,
        safety_score: metrics.safetyScore,
        user_satisfaction: metrics.userSatisfaction,
        flagged_content: metrics.flaggedContent,
        review_required: metrics.reviewRequired,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ai_quality_metrics')
        .insert(insertData);

      return !error;
    } catch (error) {
      console.error('Error recording quality metrics:', error);
      return false;
    }
  }

  static async getQualityMetrics(timeRange: string = '7d'): Promise<QualityMetrics[]> {
    try {
      const days = parseInt(timeRange.replace('d', ''));
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await supabase
        .from('ai_quality_metrics')
        .select('*')
        .gte('timestamp', fromDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(record => ({
        sessionId: record.session_id,
        responseQuality: record.response_quality,
        therapeuticValue: record.therapeutic_value,
        safetyScore: record.safety_score,
        userSatisfaction: record.user_satisfaction,
        flaggedContent: record.flagged_content,
        reviewRequired: record.review_required,
        timestamp: record.timestamp
      }));
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
      return [];
    }
  }

  // Performance Analytics
  static async getModelPerformanceStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('ai_performance_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      return [];
    }
  }

  static async getTherapyEffectivenessStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('therapy_effectiveness_stats')
        .select('*')
        .order('measurement_date', { ascending: false })
        .limit(90);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching therapy effectiveness stats:', error);
      return [];
    }
  }

  // A/B Testing Support
  static async createABTest(testConfig: {
    name: string;
    description: string;
    modelAId: string;
    modelBId: string;
    userSegment: string;
    targetMetric: string;
  }): Promise<string | null> {
    try {
      const insertData = {
        name: testConfig.name,
        description: testConfig.description,
        model_a_id: testConfig.modelAId,
        model_b_id: testConfig.modelBId,
        user_segment: testConfig.userSegment,
        target_metric: testConfig.targetMetric,
        status: 'active',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ai_ab_tests')
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      return null;
    }
  }

  static async getActiveABTests(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_ab_tests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      return [];
    }
  }
}
