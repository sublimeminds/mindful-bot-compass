import { supabase } from '@/integrations/supabase/client';

export interface AIRoutingRule {
  id: string;
  userType: 'free' | 'pro' | 'premium' | 'all';
  featureType: 'chat' | 'adaptive' | 'crisis' | 'cultural' | 'voice' | 'emotion' | 'background';
  modelConfig: {
    primary: string;
    fallback?: string;
    maxTokens?: number;
    temperature?: number;
    costLimit?: number;
  };
  enabled: boolean;
  priority: number;
  conditions?: {
    timeOfDay?: string[];
    region?: string[];
    language?: string[];
    customCriteria?: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIFeatureToggle {
  id: string;
  featureName: string;
  userType: 'free' | 'pro' | 'premium' | 'all';
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOverride {
  id: string;
  userId: string;
  overrideType: 'model' | 'feature' | 'limit';
  overrideValue: any;
  reason: string;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
}

export class AIRoutingConfigService {
  // Routing Rules Management
  static async getRoutingRules(): Promise<AIRoutingRule[]> {
    try {
      const { data, error } = await supabase
        .from('ai_routing_rules')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      return (data || []).map(rule => ({
        id: rule.id,
        userType: rule.user_type as AIRoutingRule['userType'],
        featureType: rule.feature_type as AIRoutingRule['featureType'],
        modelConfig: rule.model_config as AIRoutingRule['modelConfig'],
        conditions: rule.conditions as AIRoutingRule['conditions'],
        priority: rule.priority,
        enabled: rule.enabled,
        createdAt: new Date(rule.created_at),
        updatedAt: new Date(rule.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching routing rules:', error);
      return this.getDefaultRoutingRules();
    }
  }

  static async createRoutingRule(rule: Omit<AIRoutingRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIRoutingRule> {
    try {
      const { data, error } = await supabase
        .from('ai_routing_rules')
        .insert([{
          user_type: rule.userType,
          feature_type: rule.featureType,
          model_config: rule.modelConfig,
          conditions: rule.conditions,
          priority: rule.priority,
          enabled: rule.enabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        userType: data.user_type as AIRoutingRule['userType'],
        featureType: data.feature_type as AIRoutingRule['featureType'],
        modelConfig: data.model_config as AIRoutingRule['modelConfig'],
        conditions: data.conditions as AIRoutingRule['conditions'],
        priority: data.priority,
        enabled: data.enabled,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating routing rule:', error);
      throw error;
    }
  }

  static async updateRoutingRule(id: string, updates: Partial<AIRoutingRule>): Promise<AIRoutingRule> {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.userType) dbUpdates.user_type = updates.userType;
      if (updates.featureType) dbUpdates.feature_type = updates.featureType;
      if (updates.modelConfig) dbUpdates.model_config = updates.modelConfig;
      if (updates.conditions !== undefined) dbUpdates.conditions = updates.conditions;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled;

      const { data, error } = await supabase
        .from('ai_routing_rules')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        userType: data.user_type as AIRoutingRule['userType'],
        featureType: data.feature_type as AIRoutingRule['featureType'],
        modelConfig: data.model_config as AIRoutingRule['modelConfig'],
        conditions: data.conditions as AIRoutingRule['conditions'],
        priority: data.priority,
        enabled: data.enabled,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating routing rule:', error);
      throw error;
    }
  }

  static async deleteRoutingRule(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_routing_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting routing rule:', error);
      throw error;
    }
  }

  // Feature Toggles Management
  static async getFeatureToggles(): Promise<AIFeatureToggle[]> {
    try {
      const { data, error } = await supabase
        .from('ai_feature_toggles')
        .select('*')
        .order('feature_name');

      if (error) throw error;
      return (data || []).map(toggle => ({
        id: toggle.id,
        featureName: toggle.feature_name,
        userType: toggle.user_type as AIFeatureToggle['userType'],
        enabled: toggle.enabled,
        rolloutPercentage: toggle.rollout_percentage || 0,
        conditions: toggle.conditions,
        createdAt: new Date(toggle.created_at),
        updatedAt: new Date(toggle.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching feature toggles:', error);
      return this.getDefaultFeatureToggles();
    }
  }

  static async updateFeatureToggle(id: string, updates: Partial<AIFeatureToggle>): Promise<AIFeatureToggle> {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.featureName) dbUpdates.feature_name = updates.featureName;
      if (updates.userType) dbUpdates.user_type = updates.userType;
      if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled;
      if (updates.rolloutPercentage !== undefined) dbUpdates.rollout_percentage = updates.rolloutPercentage;
      if (updates.conditions !== undefined) dbUpdates.conditions = updates.conditions;

      const { data, error } = await supabase
        .from('ai_feature_toggles')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        featureName: data.feature_name,
        userType: data.user_type as AIFeatureToggle['userType'],
        enabled: data.enabled,
        rolloutPercentage: data.rollout_percentage || 0,
        conditions: data.conditions,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating feature toggle:', error);
      throw error;
    }
  }

  // User Overrides Management
  static async getUserOverrides(): Promise<UserOverride[]> {
    try {
      const { data, error } = await supabase
        .from('ai_user_overrides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(override => ({
        id: override.id,
        userId: override.user_id,
        overrideType: override.override_type as UserOverride['overrideType'],
        overrideValue: override.override_value,
        reason: override.reason,
        createdBy: override.created_by,
        createdAt: new Date(override.created_at),
        expiresAt: override.expires_at ? new Date(override.expires_at) : undefined
      }));
    } catch (error) {
      console.error('Error fetching user overrides:', error);
      return [];
    }
  }

  static async createUserOverride(override: Omit<UserOverride, 'id' | 'createdAt'>): Promise<UserOverride> {
    try {
      const { data, error } = await supabase
        .from('ai_user_overrides')
        .insert([{
          user_id: override.userId,
          override_type: override.overrideType,
          override_value: override.overrideValue,
          reason: override.reason,
          created_by: override.createdBy,
          expires_at: override.expiresAt?.toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        userId: data.user_id,
        overrideType: data.override_type as UserOverride['overrideType'],
        overrideValue: data.override_value,
        reason: data.reason,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        expiresAt: data.expires_at ? new Date(data.expires_at) : undefined
      };
    } catch (error) {
      console.error('Error creating user override:', error);
      throw error;
    }
  }

  static async deleteUserOverride(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_user_overrides')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user override:', error);
      throw error;
    }
  }

  // A/B Testing Management
  static async createABTest(test: {
    name: string;
    description: string;
    modelAId: string;
    modelBId: string;
    targetMetric: string;
    userSegment: string;
    trafficSplit: number;
  }): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('ai_ab_tests')
        .insert([{
          name: test.name,
          description: test.description,
          model_a_id: test.modelAId,
          model_b_id: test.modelBId,
          target_metric: test.targetMetric,
          user_segment: test.userSegment,
          status: 'running',
          results: {},
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      throw error;
    }
  }

  static async getActiveABTests(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_ab_tests')
        .select('*')
        .eq('status', 'running');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      return [];
    }
  }

  // Configuration Validation
  static validateRoutingRule(rule: Partial<AIRoutingRule>): string[] {
    const errors: string[] = [];

    if (!rule.userType) errors.push('User type is required');
    if (!rule.featureType) errors.push('Feature type is required');
    if (!rule.modelConfig?.primary) errors.push('Primary model is required');
    if (rule.priority !== undefined && (rule.priority < 0 || rule.priority > 100)) {
      errors.push('Priority must be between 0 and 100');
    }

    return errors;
  }

  // Export/Import Configuration
  static async exportConfiguration(): Promise<{
    routingRules: AIRoutingRule[];
    featureToggles: AIFeatureToggle[];
    userOverrides: UserOverride[];
  }> {
    const [routingRules, featureToggles, userOverrides] = await Promise.all([
      this.getRoutingRules(),
      this.getFeatureToggles(),
      this.getUserOverrides()
    ]);

    return { routingRules, featureToggles, userOverrides };
  }

  static async importConfiguration(config: {
    routingRules?: AIRoutingRule[];
    featureToggles?: AIFeatureToggle[];
  }): Promise<void> {
    try {
      if (config.routingRules) {
        for (const rule of config.routingRules) {
          await this.createRoutingRule(rule);
        }
      }

      if (config.featureToggles) {
        for (const toggle of config.featureToggles) {
          await this.updateFeatureToggle(toggle.id, toggle);
        }
      }
    } catch (error) {
      console.error('Error importing configuration:', error);
      throw error;
    }
  }

  // Default configurations
  private static getDefaultRoutingRules(): AIRoutingRule[] {
    return [
      {
        id: 'default-free-chat',
        userType: 'free',
        featureType: 'chat',
        modelConfig: {
          primary: 'gpt-4o-mini',
          maxTokens: 150,
          temperature: 0.7,
          costLimit: 0.01
        },
        enabled: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'default-pro-chat',
        userType: 'pro',
        featureType: 'chat',
        modelConfig: {
          primary: 'gpt-4o',
          fallback: 'gpt-4o-mini',
          maxTokens: 500,
          temperature: 0.7,
          costLimit: 0.05
        },
        enabled: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'default-premium-chat',
        userType: 'premium',
        featureType: 'chat',
        modelConfig: {
          primary: 'claude-sonnet-4-20250514',
          fallback: 'gpt-4o',
          maxTokens: 1000,
          temperature: 0.8,
          costLimit: 0.10
        },
        enabled: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private static getDefaultFeatureToggles(): AIFeatureToggle[] {
    return [
      {
        id: 'voice-synthesis',
        featureName: 'Voice Synthesis',
        userType: 'pro',
        enabled: true,
        rolloutPercentage: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'adaptive-therapy',
        featureName: 'Adaptive Therapy Plans',
        userType: 'premium',
        enabled: true,
        rolloutPercentage: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'cultural-ai',
        featureName: 'Cultural AI Adaptation',
        userType: 'all',
        enabled: true,
        rolloutPercentage: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}