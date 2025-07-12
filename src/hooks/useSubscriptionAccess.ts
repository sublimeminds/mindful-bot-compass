import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionAccess {
  tier: 'free' | 'premium' | 'family-pro' | 'family-premium' | 'enterprise';
  hasFamily: boolean;
  familySeats: number;
  maxSeats: number;
  canAccessFeature: (feature: string) => boolean;
  isFamily: boolean;
  isEnterprise: boolean;
  isPremium: boolean;
}

const FEATURE_ACCESS = {
  free: ['basic-chat', 'mood-tracking', 'basic-goals'],
  premium: ['advanced-chat', 'ai-insights', 'unlimited-sessions', 'progress-tracking'],
  'family-pro': ['family-dashboard', 'member-monitoring', 'progress-sharing', 'alerts'],
  'family-premium': ['crisis-intervention', '24-7-support', 'family-therapy', 'advanced-analytics'],
  enterprise: ['api-access', 'custom-integrations', 'dedicated-support', 'white-label']
};

export const useSubscriptionAccess = (): SubscriptionAccess => {
  const { user } = useAuth();
  
  const { data: subscription } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
  });

  // Determine tier from subscription or profile
  const tier = subscription?.plan_id || profile?.subscription_plan || 'free';
  const isFamily = tier.includes('family');
  const isPremium = tier === 'premium' || tier.includes('family') || tier === 'enterprise';
  const isEnterprise = tier === 'enterprise';

  // Parse family seats from subscription metadata if family plan
  let familySeats = 1;
  let maxSeats = 1;
  
  if (isFamily && subscription?.stripe_customer_id) {
    try {
      const metadata = JSON.parse(subscription.stripe_customer_id);
      familySeats = metadata.seats || 2;
      maxSeats = tier === 'family-premium' ? 15 : 10;
    } catch {
      familySeats = 2;
      maxSeats = 10;
    }
  }

  const canAccessFeature = (feature: string): boolean => {
    const userFeatures = FEATURE_ACCESS[tier as keyof typeof FEATURE_ACCESS] || [];
    const premiumFeatures = isPremium ? FEATURE_ACCESS.premium : [];
    const familyFeatures = isFamily ? [...FEATURE_ACCESS['family-pro'], ...(tier === 'family-premium' ? FEATURE_ACCESS['family-premium'] : [])] : [];
    const enterpriseFeatures = isEnterprise ? FEATURE_ACCESS.enterprise : [];
    
    const allFeatures = [
      ...FEATURE_ACCESS.free,
      ...userFeatures,
      ...premiumFeatures,
      ...familyFeatures,
      ...enterpriseFeatures
    ];
    
    return allFeatures.includes(feature);
  };

  return {
    tier: tier as SubscriptionAccess['tier'],
    hasFamily: isFamily,
    familySeats,
    maxSeats,
    canAccessFeature,
    isFamily,
    isEnterprise,
    isPremium,
  };
};