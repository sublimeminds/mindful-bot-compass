
import { supabase } from '@/integrations/supabase/client';
import { ToastService } from './toastService';

export interface TrialInfo {
  isOnTrial: boolean;
  trialEndDate: Date | null;
  daysRemaining: number;
  planName: string;
  hasPaymentMethod: boolean;
}

export class TrialService {
  static async startFreeTrial(userId: string, planId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status: 'trialing',
          trial_start: new Date().toISOString(),
          trial_end: trialEndDate.toISOString(),
          billing_cycle: 'monthly',
          current_period_start: new Date().toISOString(),
          current_period_end: trialEndDate.toISOString()
        });

      if (error) {
        console.error('Trial creation error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Trial service error:', error);
      return { success: false, error: 'Failed to start trial' };
    }
  }

  static async getTrialInfo(userId: string): Promise<TrialInfo> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(name)
        `)
        .eq('user_id', userId)
        .eq('status', 'trialing')
        .maybeSingle();

      if (error || !data) {
        return {
          isOnTrial: false,
          trialEndDate: null,
          daysRemaining: 0,
          planName: '',
          hasPaymentMethod: false
        };
      }

      const trialEndDate = new Date(data.trial_end);
      const now = new Date();
      const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isOnTrial: true,
        trialEndDate,
        daysRemaining: Math.max(0, daysRemaining),
        planName: data.plan?.name || 'Premium',
        hasPaymentMethod: !!data.stripe_payment_method_id
      };
    } catch (error) {
      console.error('Error fetching trial info:', error);
      return {
        isOnTrial: false,
        trialEndDate: null,
        daysRemaining: 0,
        planName: '',
        hasPaymentMethod: false
      };
    }
  }

  static async cancelTrial(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'trialing');

      if (error) {
        return { success: false, error: error.message };
      }

      ToastService.genericSuccess('Trial Canceled', 'Your free trial has been canceled successfully.');
      return { success: true };
    } catch (error) {
      console.error('Error canceling trial:', error);
      return { success: false, error: 'Failed to cancel trial' };
    }
  }

  static async convertToFullSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'active',
          trial_end: null
        })
        .eq('user_id', userId)
        .eq('status', 'trialing');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error converting trial:', error);
      return { success: false, error: 'Failed to convert trial' };
    }
  }

  static checkTrialExpiration(trialInfo: TrialInfo) {
    if (!trialInfo.isOnTrial) return;

    if (trialInfo.daysRemaining <= 0) {
      ToastService.custom({
        title: "Trial Expired",
        description: `Your ${trialInfo.planName} trial has expired. Please upgrade to continue using premium features.`,
        variant: "default",
        duration: 10000
      });
    } else if (trialInfo.daysRemaining <= 3) {
      ToastService.trialExpiring(trialInfo.daysRemaining);
    }
  }
}
