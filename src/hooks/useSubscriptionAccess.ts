import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionAccess {
  tier: 'free' | 'premium' | 'professional' | 'family-premium' | 'family-professional' | 'enterprise';
  hasFamily: boolean;
  familySeats: number;
  maxSeats: number;
  canAccessFeature: (feature: string) => boolean;
  isFamily: boolean;
  isEnterprise: boolean;
  isPremium: boolean;
  isProfessional: boolean;
  therapyPlanLimit: number;
  sessionLimit: number;
}

const FEATURE_ACCESS = {
  free: ['basic-chat', 'mood-tracking', 'basic-goals', 'crisis-intervention', 'mindfulness'],
  premium: ['advanced-chat', 'ai-insights', 'unlimited-sessions', 'progress-tracking', 'community-hub', 'breathing-exercises', 'advanced-analytics', 'priority-support', 'personalized-insights', 'meditation-library'],
  professional: ['advanced-dashboard', 'api-access', 'white-label', 'phone-support', 'compliance-reporting', 'data-export'],
  'family-premium': ['family-dashboard', 'member-monitoring', 'progress-sharing', 'alerts'],
  'family-professional': ['24-7-support', 'family-therapy'],
  enterprise: ['custom-integrations', 'dedicated-support', 'bulk-management']
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
  const isProfessional = tier === 'professional' || tier.includes('family') || tier === 'enterprise';
  const isEnterprise = tier === 'enterprise';

  // Parse family seats from subscription metadata if family plan
  let familySeats = 1;
  let maxSeats = 1;
  
  if (isFamily && subscription?.stripe_customer_id) {
    try {
      const metadata = JSON.parse(subscription.stripe_customer_id);
      familySeats = metadata.seats || 2;
      maxSeats = tier === 'family-professional' ? 15 : 10;
    } catch {
      familySeats = 2;
      maxSeats = 10;
    }
  }

  const canAccessFeature = (feature: string): boolean => {
    const baseFeatures = FEATURE_ACCESS.free;
    const premiumFeatures = isPremium ? FEATURE_ACCESS.premium : [];
    const professionalFeatures = isProfessional ? FEATURE_ACCESS.professional : [];
    const familyFeatures = isFamily ? [...FEATURE_ACCESS['family-premium'], ...(tier === 'family-professional' ? FEATURE_ACCESS['family-professional'] : [])] : [];
    const enterpriseFeatures = isEnterprise ? FEATURE_ACCESS.enterprise : [];
    
    const allFeatures = [
      ...baseFeatures,
      ...premiumFeatures,
      ...professionalFeatures,
      ...familyFeatures,
      ...enterpriseFeatures
    ];
    
    return allFeatures.includes(feature);
  };

  const getTherapyPlanLimit = (): number => {
    if (tier === 'professional' || tier === 'family-professional' || tier === 'enterprise') return 10;
    if (tier === 'premium' || tier === 'family-premium') return 3;
    return 1; // free
  };

  const getSessionLimit = (): number => {
    if (tier === 'premium' || tier === 'family-premium' || tier === 'professional' || tier === 'family-professional' || tier === 'enterprise') return -1; // unlimited
    return 8; // free - 8 per month
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
    isProfessional,
    therapyPlanLimit: getTherapyPlanLimit(),
    sessionLimit: getSessionLimit(),
  };
};