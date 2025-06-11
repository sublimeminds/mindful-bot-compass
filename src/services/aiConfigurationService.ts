
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

export class AIConfigurationService {
  // AI Model Configuration
  static async getAIModels(): Promise<AIModelConfig[]> {
    try {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching AI models:', error);
      return [];
    }
  }

  static async updateAIModelConfig(id: string, config: Partial<AIModelConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_model_configs')
        .update({
          ...config,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating AI model config:', error);
      return false;
    }
  }

  static async createAIModelConfig(config: Omit<AIModelConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .insert({
          ...config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
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
      return data || [];
    } catch (error) {
      console.error('Error fetching therapeutic approaches:', error);
      return [];
    }
  }

  static async updateTherapeuticApproach(id: string, config: Partial<TherapeuticApproachConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapeutic_approach_configs')
        .update({
          ...config,
          updated_at: new Date().toISOString()
        })
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
      return data || [];
    } catch (error) {
      console.error('Error fetching personalization configs:', error);
      return [];
    }
  }

  static async updatePersonalizationConfig(id: string, config: Partial<PersonalizationConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('personalization_configs')
        .update({
          ...config,
          updated_at: new Date().toISOString()
        })
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
      const { error } = await supabase
        .from('ai_quality_metrics')
        .insert({
          ...metrics,
          timestamp: new Date().toISOString()
        });

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
      return data || [];
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
      const { data, error } = await supabase
        .from('ai_ab_tests')
        .insert({
          ...testConfig,
          status: 'active',
          created_at: new Date().toISOString()
        })
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
