import { supabase } from '@/integrations/supabase/client';
import { MultiModelAIRouter } from './multiModelAiRouter';

interface ModelSelectionCriteria {
  taskType: 'chat' | 'analysis' | 'crisis' | 'cultural' | 'creative';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex';
  culturalContext?: string;
  userTier: 'free' | 'premium' | 'enterprise' | 'pro';
}

export class SubscriptionBasedAiService {
  private static async getUserSubscriptionTier(userId: string): Promise<'free' | 'premium' | 'enterprise' | 'pro'> {
    try {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans!inner(name, features, limits)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (!subscription) return 'free';

      const planName = subscription.subscription_plans.name.toLowerCase();
      
      if (planName.includes('enterprise')) return 'enterprise';
      if (planName.includes('premium')) return 'premium';
      if (planName.includes('pro')) return 'pro';
      
      return 'free';
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
      return 'free';
    }
  }

  private static getModelForTier(tier: 'free' | 'premium' | 'enterprise' | 'pro'): string {
    switch (tier) {
      case 'enterprise':
      case 'premium':
        return 'claude-opus-4-20250514'; // Highest quality Claude 4 for premium
      case 'pro':
        return 'claude-sonnet-4-20250514'; // High quality Claude 4 for pro
      case 'free':
      default:
        return 'claude-sonnet-4-20250514'; // Claude Sonnet for free (upgraded from GPT)
    }
  }

  static async generateResponse(
    message: string,
    context: any,
    userId: string,
    taskType: 'chat' | 'analysis' | 'crisis' | 'cultural' | 'creative' = 'chat',
    urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    // Get user's subscription tier
    const userTier = await this.getUserSubscriptionTier(userId);
    
    // Configure model selection criteria based on subscription
    const criteria = {
      taskType,
      urgency,
      complexity: userTier === 'free' ? 'simple' as const : 'complex' as const,
      culturalContext: context.culturalContext,
      userTier
    };

    // Route to appropriate model based on subscription
    const response = await MultiModelAIRouter.routeMessage(message, {
      ...context,
      userId,
      subscriptionTier: userTier
    }, criteria);

    // Add subscription-specific features
    if (userTier !== 'free') {
      response.premiumFeatures = {
        detailedAnalysis: true,
        personalizedInsights: true,
        culturalAdaptation: true,
        advancedTechniques: true
      };
    }

    // Track usage for billing/limits
    await this.trackUsage(userId, userTier, taskType);

    return response;
  }

  private static async trackUsage(userId: string, tier: string, taskType: string) {
    try {
      // Track usage in performance_metrics table instead
      await supabase.from('performance_metrics').insert({
        user_id: userId,
        metric_type: 'ai_usage',
        metric_value: 1,
        metadata: { tier, taskType, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }

  static async checkUsageLimits(userId: string): Promise<{
    withinLimits: boolean;
    usage: number;
    limit: number;
    tier: string;
  }> {
    const tier = await this.getUserSubscriptionTier(userId);
    
    // Get current month usage from performance_metrics
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const { data: usage } = await supabase
      .from('performance_metrics')
      .select('metric_value')
      .eq('user_id', userId)
      .eq('metric_type', 'ai_usage')
      .gte('recorded_at', startOfMonth.toISOString());

    const currentUsage = usage?.reduce((sum, record) => sum + record.metric_value, 0) || 0;
    
    // Define limits based on tier
    const limits = {
      free: 50,
      pro: 200,
      premium: 500,
      enterprise: -1 // unlimited
    };

    const limit = limits[tier];
    const withinLimits = limit === -1 || currentUsage < limit;

    return {
      withinLimits,
      usage: currentUsage,
      limit,
      tier
    };
  }
}