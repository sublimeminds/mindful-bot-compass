import { supabase } from '@/integrations/supabase/client';
import { adaptivePricingService } from './adaptivePricingService';

export interface ProrationCalculation {
  currentPlan: string;
  newPlan: string;
  currentSeats: number;
  newSeats: number;
  remainingDays: number;
  totalDays: number;
  creditAmount: number;
  chargeAmount: number;
  netAmount: number;
  immediate: boolean;
}

export const prorationService = {
  async calculateProration(
    newPlanId: string, 
    newSeats: number, 
    billingCycle: 'monthly' | 'yearly'
  ): Promise<ProrationCalculation | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current subscription
      const { data: currentSub } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!currentSub) {
        throw new Error('No active subscription found');
      }

      // Parse current plan details
      let currentPlanDetails: any = {};
      let currentSeats = 1;
      
      if (currentSub.stripe_customer_id) {
        try {
          currentPlanDetails = JSON.parse(currentSub.stripe_customer_id);
          currentSeats = currentPlanDetails.seats || 1;
        } catch {
          // Fallback for non-family plans
          currentSeats = 1;
        }
      }

      // Calculate remaining time in billing cycle
      const now = new Date();
      const periodEnd = new Date(currentSub.current_period_end);
      const periodStart = new Date(currentSub.current_period_start);
      
      const totalDays = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
      const remainingDays = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (remainingDays <= 0) {
        throw new Error('Current billing period has ended');
      }

      // Get new plan pricing
      const newPlan = adaptivePricingService.getAdaptivePlans().find(p => p.id === newPlanId);
      if (!newPlan) throw new Error('New plan not found');

      const newPricing = adaptivePricingService.calculatePricing(newPlan, newSeats);

      // Calculate current plan pricing for comparison
      const currentPlan = adaptivePricingService.getAdaptivePlans().find(p => p.id === currentSub.plan_id);
      let currentMonthlyPrice = 0;
      
      if (currentPlan) {
        const currentPricing = adaptivePricingService.calculatePricing(currentPlan, currentSeats);
        currentMonthlyPrice = currentPricing.monthlyPrice;
      } else {
        // Fallback for legacy plans
        currentMonthlyPrice = currentPlanDetails.monthly_price || 0;
      }

      // Calculate proration amounts
      const dailyCurrentRate = currentMonthlyPrice / 30; // Approximate monthly to daily
      const dailyNewRate = newPricing.monthlyPrice / 30;
      
      const creditAmount = dailyCurrentRate * remainingDays;
      const chargeAmount = dailyNewRate * remainingDays;
      const netAmount = chargeAmount - creditAmount;

      return {
        currentPlan: currentSub.plan_id,
        newPlan: newPlanId,
        currentSeats,
        newSeats,
        remainingDays,
        totalDays,
        creditAmount: Math.round(creditAmount * 100) / 100,
        chargeAmount: Math.round(chargeAmount * 100) / 100,
        netAmount: Math.round(netAmount * 100) / 100,
        immediate: true
      };

    } catch (error) {
      console.error('Error calculating proration:', error);
      return null;
    }
  },

  async processPlanUpgrade(
    newPlanId: string,
    newSeats: number,
    billingCycle: 'monthly' | 'yearly',
    proration: ProrationCalculation
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create new subscription record
      const newPlan = adaptivePricingService.getAdaptivePlans().find(p => p.id === newPlanId);
      if (!newPlan) throw new Error('Plan not found');

      const pricing = adaptivePricingService.calculatePricing(newPlan, newSeats);
      
      // Calculate next billing date
      const now = new Date();
      const nextBillingDate = new Date(now);
      if (billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      // Update subscription with new plan details
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_id: newPlanId,
          billing_cycle: billingCycle,
          stripe_customer_id: JSON.stringify({
            adaptive_plan: newPlanId,
            seats: pricing.seats,
            monthly_price: pricing.monthlyPrice,
            yearly_price: pricing.yearlyPrice,
            total_amount: billingCycle === 'yearly' ? pricing.yearlyPrice : pricing.monthlyPrice,
            upgrade_proration: proration
          }),
          current_period_end: nextBillingDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      // Here you would typically also:
      // 1. Process payment for the net amount (if positive)
      // 2. Apply credit (if negative)
      // 3. Update Stripe subscription if using Stripe
      // 4. Send confirmation email

      return true;

    } catch (error) {
      console.error('Error processing plan upgrade:', error);
      return false;
    }
  },

  async getMidCycleUpgradeOptions(): Promise<{
    canUpgrade: boolean;
    availablePlans: any[];
    currentPlan: any;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: currentSub } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      const allPlans = adaptivePricingService.getAdaptivePlans();
      const currentPlan = currentSub ? allPlans.find(p => p.id === currentSub.plan_id) : null;
      
      // Filter plans that are upgrades from current
      const availablePlans = allPlans.filter(plan => {
        if (!currentPlan) return true;
        return plan.basePrice > currentPlan.basePrice;
      });

      return {
        canUpgrade: !!currentSub && availablePlans.length > 0,
        availablePlans,
        currentPlan
      };

    } catch (error) {
      console.error('Error getting upgrade options:', error);
      return {
        canUpgrade: false,
        availablePlans: [],
        currentPlan: null
      };
    }
  }
};