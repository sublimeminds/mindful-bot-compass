
import { supabase } from '@/integrations/supabase/client';

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: Record<string, any>;
  limits: Record<string, any>;
  isActive: boolean;
}

export interface UsageData {
  sessionsUsed: number;
  sessionsLimit: number;
  messagesUsed: number;
  messagesLimit: number;
  period: string;
}

export const subscriptionService = {
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            features,
            limits
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching user subscription:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        status: data.status as 'active' | 'cancelled' | 'past_due' | 'trialing',
        currentPeriodStart: new Date(data.current_period_start),
        currentPeriodEnd: new Date(data.current_period_end),
        cancelAtPeriodEnd: data.canceled_at !== null,
        trialStart: data.trial_start ? new Date(data.trial_start) : undefined,
        trialEnd: data.trial_end ? new Date(data.trial_end) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  },

  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Map database fields to interface properties with proper type conversion
      return (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        priceMonthly: plan.price_monthly,
        priceYearly: plan.price_yearly,
        features: (plan.features && typeof plan.features === 'object') ? plan.features as Record<string, any> : {},
        limits: (plan.limits && typeof plan.limits === 'object') ? plan.limits as Record<string, any> : {},
        isActive: plan.is_active
      }));
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  },

  async changePlan(userId: string, planId: string): Promise<boolean> {
    try {
      // Mock implementation - replace with actual subscription logic
      console.log('Changing plan for user:', userId, 'to plan:', planId);
      return true;
    } catch (error) {
      console.error('Error changing subscription plan:', error);
      return false;
    }
  },

  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // Mock implementation - replace with actual cancellation logic
      console.log('Cancelling subscription for user:', userId);
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  },

  async getUsageData(userId: string): Promise<UsageData> {
    try {
      // Get user's subscription plan limits
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          subscription_plans (
            limits
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      // Get current month's session count
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const { data: sessions, count: sessionCount } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .gte('start_time', startOfMonth.toISOString());

      const limits = subscription?.subscription_plans?.limits as any || { sessions_per_month: 8 };
      const sessionsLimit = limits.sessions_per_month === -1 ? 99999 : limits.sessions_per_month;

      return {
        sessionsUsed: sessionCount || 0,
        sessionsLimit,
        messagesUsed: 0,
        messagesLimit: 1000,
        period: 'monthly'
      };
    } catch (error) {
      console.error('Error fetching usage data:', error);
      return {
        sessionsUsed: 0,
        sessionsLimit: 8,
        messagesUsed: 0,
        messagesLimit: 1000,
        period: 'monthly'
      };
    }
  },

  async getAIModelForUser(userId: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('user_subscriptions')
        .select(`
          subscription_plans (
            name,
            features
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      const planName = data?.subscription_plans?.name?.toLowerCase() || 'free';
      const features = data?.subscription_plans?.features as any;
      const aiModel = features?.ai_model;

      if (aiModel) return aiModel;

      // Fallback based on plan name
      if (planName.includes('premium')) return 'claude-opus-20240229';
      if (planName.includes('pro')) return 'claude-sonnet-3-5-20241022';
      return 'gpt-4.1-2025-04-14';
    } catch (error) {
      console.error('Error fetching AI model for user:', error);
      return 'gpt-4.1-2025-04-14';
    }
  }
};
