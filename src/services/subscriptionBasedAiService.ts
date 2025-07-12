import { supabase } from '@/integrations/supabase/client';
import { MultiModelAIRouter } from './multiModelAiRouter';

interface UserSubscription {
  planId: string;
  status: string;
  plan?: {
    name: string;
    features: Record<string, any>;
    limits: Record<string, any>;
  };
}

export class SubscriptionBasedAiService {
  private static async getUserSubscriptionTier(userId: string): Promise<'free' | 'premium' | 'pro' | 'enterprise'> {
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
      if (planName.includes('pro')) return 'pro';  
      if (planName.includes('premium')) return 'premium';
      
      return 'free';
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
      return 'free';
    }
  }

  private static getModelForTier(tier: 'free' | 'premium' | 'pro' | 'enterprise'): string {
    switch (tier) {
      case 'enterprise':
        return 'claude-opus-4-20250514'; // Highest quality
      case 'pro':
      case 'premium':
        return 'claude-sonnet-4-20250514'; // High quality, efficient
      case 'free':
      default:
        return 'gpt-4.1-2025-04-14'; // Cost-effective
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
      // Insert usage tracking record
      await supabase.from('user_usage').insert({
        user_id: userId,
        resource_type: 'ai_message',
        usage_count: 1,
        period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        metadata: { tier, taskType }
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
    
    // Get current month usage
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const { data: usage } = await supabase
      .from('user_usage')
      .select('usage_count')
      .eq('user_id', userId)
      .eq('resource_type', 'ai_message')
      .gte('period_start', startOfMonth.toISOString())
      .single();

    const currentUsage = usage?.usage_count || 0;
    
    // Define limits based on tier
    const limits = {
      free: 50,
      premium: 500,
      pro: 1000,
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