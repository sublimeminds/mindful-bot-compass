
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, string>;
  limits: Record<string, number>;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  plan: SubscriptionPlan;
}

interface UsageData {
  resource_type: string;
  usage_count: number;
  period_start: string;
  period_end: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchPlans();
      fetchUsage();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return;
    }

    setSubscription(data);
  };

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly');

    if (error) {
      console.error('Error fetching plans:', error);
      return;
    }

    setPlans(data || []);
    setLoading(false);
  };

  const fetchUsage = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .gte('period_end', new Date().toISOString());

    if (error) {
      console.error('Error fetching usage:', error);
      return;
    }

    setUsage(data || []);
  };

  const getCurrentPlan = (): SubscriptionPlan | null => {
    if (subscription?.plan) {
      return subscription.plan;
    }
    
    // Return free plan if no active subscription
    return plans.find(plan => plan.name === 'Free') || null;
  };

  const getUsageForResource = (resourceType: string): number => {
    const resourceUsage = usage.find(u => u.resource_type === resourceType);
    return resourceUsage?.usage_count || 0;
  };

  const canPerformAction = (resourceType: string): boolean => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return false;

    const limit = currentPlan.limits[resourceType];
    if (limit === -1) return true; // Unlimited

    const currentUsage = getUsageForResource(resourceType);
    return currentUsage < limit;
  };

  const getRemainingUsage = (resourceType: string): number => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return 0;

    const limit = currentPlan.limits[resourceType];
    if (limit === -1) return Infinity; // Unlimited

    const currentUsage = getUsageForResource(resourceType);
    return Math.max(0, limit - currentUsage);
  };

  const createCheckoutSession = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId, billingCycle }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isFreePlan = (): boolean => {
    const currentPlan = getCurrentPlan();
    return currentPlan?.name === 'Free' || !subscription;
  };

  return {
    subscription,
    plans,
    usage,
    loading,
    getCurrentPlan,
    getUsageForResource,
    canPerformAction,
    getRemainingUsage,
    createCheckoutSession,
    isFreePlan,
    refetch: () => {
      fetchSubscription();
      fetchUsage();
    }
  };
};
