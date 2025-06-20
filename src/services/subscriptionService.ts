
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
      // Mock implementation - replace with actual Supabase query
      return {
        id: '1',
        userId,
        planId: 'free',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date()
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
      // Mock implementation - replace with actual usage tracking
      return {
        sessionsUsed: 5,
        sessionsLimit: 10,
        messagesUsed: 150,
        messagesLimit: 500,
        period: 'monthly'
      };
    } catch (error) {
      console.error('Error fetching usage data:', error);
      return {
        sessionsUsed: 0,
        sessionsLimit: 0,
        messagesUsed: 0,
        messagesLimit: 0,
        period: 'monthly'
      };
    }
  }
};
