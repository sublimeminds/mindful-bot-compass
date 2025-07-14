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
  created_at: Date;
  updated_at: Date;
}

export interface AIFeatureToggle {
  id: string;
  featureName: string;
  userType: 'free' | 'pro' | 'premium' | 'all';
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: any;
  created_at: Date;
  updated_at: Date;
}

export interface UserOverride {
  id: string;
  userId: string;
  overrideType: 'model' | 'feature' | 'limit';
  overrideValue: any;
  reason: string;
  expiresAt?: Date;
  created_at: Date;
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
      return data || [];
    } catch (error) {
      console.error('Error fetching routing rules:', error);
      return this.getDefaultRoutingRules();
    }
  }

  static async createRoutingRule(rule: Omit<AIRoutingRule, 'id' | 'created_at' | 'updated_at'>): Promise<AIRoutingRule> {
    try {
      const { data, error } = await supabase
        .from('ai_routing_rules')
        .insert([{
          ...rule,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating routing rule:', error);
      throw error;
    }
  }

  static async updateRoutingRule(id: string, updates: Partial<AIRoutingRule>): Promise<AIRoutingRule> {
    try {
      const { data, error } = await supabase
        .from('ai_routing_rules')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
        .order('featureName');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching feature toggles:', error);
      return this.getDefaultFeatureToggles();
    }
  }

  static async updateFeatureToggle(id: string, updates: Partial<AIFeatureToggle>): Promise<AIFeatureToggle> {
    try {
      const { data, error } = await supabase
        .from('ai_feature_toggles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      return data || [];
    } catch (error) {
      console.error('Error fetching user overrides:', error);
      return [];
    }
  }

  static async createUserOverride(override: Omit<UserOverride, 'id' | 'created_at'>): Promise<UserOverride> {
    try {
      const { data, error } = await supabase
        .from('ai_user_overrides')
        .insert([{
          ...override,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
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
          ...test,
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
        created_at: new Date(),
        updated_at: new Date()
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
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'default-premium-chat',
        userType: 'premium',
        featureType: 'chat',
        modelConfig: {
          primary: 'claude-3-sonnet-20240229',
          fallback: 'gpt-4o',
          maxTokens: 1000,
          temperature: 0.8,
          costLimit: 0.10
        },
        enabled: true,
        priority: 1,
        created_at: new Date(),
        updated_at: new Date()
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
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'adaptive-therapy',
        featureName: 'Adaptive Therapy Plans',
        userType: 'premium',
        enabled: true,
        rolloutPercentage: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cultural-ai',
        featureName: 'Cultural AI Adaptation',
        userType: 'all',
        enabled: true,
        rolloutPercentage: 75,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }
}