
import { supabase } from '@/integrations/supabase/client';

export interface AdaptivePlan {
  id: string;
  name: string;
  basePrice: number;
  pricePerSeat: number;
  minSeats: number;
  maxSeats: number;
  features: string[];
  tier: 'pro' | 'premium';
}

export interface PricingCalculation {
  plan: AdaptivePlan;
  seats: number;
  monthlyPrice: number;
  yearlyPrice: number;
  savingsAmount: number;
  savingsPercent: number;
}

export const adaptivePricingService = {
  getAdaptivePlans(): AdaptivePlan[] {
    return [
      {
        id: 'family-pro',
        name: 'Family Pro',
        basePrice: 39,
        pricePerSeat: 15,
        minSeats: 2,
        maxSeats: 10,
        tier: 'pro',
        features: [
          'Advanced child safety & COPPA compliance',
          'Full progress sharing with permissions',
          'Real-time SMS & email alerts',
          '25 sessions per member per month',
          'Advanced family wellness analytics',
          'Comprehensive parental dashboard',
          'Shared family wellness goals'
        ]
      },
      {
        id: 'family-premium',
        name: 'Family Premium', 
        basePrice: 59,
        pricePerSeat: 20,
        minSeats: 2,
        maxSeats: 15,
        tier: 'premium',
        features: [
          'Premium child safety with therapist escalation',
          'Full progress sharing with granular permissions',
          'Immediate alerts with crisis intervention',
          'Unlimited sessions for all members',
          'Premium family analytics with trends',
          'Complete parental oversight dashboard',
          'Advanced shared family wellness goals',
          '24/7 priority family support',
          'Access to family therapy sessions',
          'Dedicated family coordinator'
        ]
      }
    ];
  },

  calculatePricing(plan: AdaptivePlan, seats: number): PricingCalculation {
    const effectiveSeats = Math.max(seats, plan.minSeats);
    const monthlyPrice = plan.basePrice + (plan.pricePerSeat * (effectiveSeats - 1));
    const yearlyPrice = monthlyPrice * 10; // 2 months free
    const savingsAmount = monthlyPrice * 2;
    const savingsPercent = Math.round((savingsAmount / (monthlyPrice * 12)) * 100);

    return {
      plan,
      seats: effectiveSeats,
      monthlyPrice,
      yearlyPrice,
      savingsAmount,
      savingsPercent
    };
  },

  getRecommendedPlan(familySize: number, needsAssessment: {
    hasChildren: boolean;
    needsCrisisSupport: boolean;
    wantsUnlimitedSessions: boolean;
    needs24x7Support: boolean;
  }): 'pro' | 'premium' {
    const { hasChildren, needsCrisisSupport, wantsUnlimitedSessions, needs24x7Support } = needsAssessment;
    
    // Premium if they need advanced features
    if (needs24x7Support || wantsUnlimitedSessions || (hasChildren && needsCrisisSupport)) {
      return 'premium';
    }
    
    // Pro for most families
    return 'pro';
  },

  async createAdaptiveSubscription(planId: string, seats: number, billingCycle: 'monthly' | 'yearly'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const plan = this.getAdaptivePlans().find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      const pricing = this.calculatePricing(plan, seats);
      const amount = billingCycle === 'yearly' ? pricing.yearlyPrice : pricing.monthlyPrice;

      // Store subscription intent
      const { error } = await supabase
        .from('adaptive_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          seats: pricing.seats,
          billing_cycle: billingCycle,
          monthly_price: pricing.monthlyPrice,
          yearly_price: pricing.yearlyPrice,
          total_amount: amount,
          status: 'pending'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating adaptive subscription:', error);
      return false;
    }
  }
};
