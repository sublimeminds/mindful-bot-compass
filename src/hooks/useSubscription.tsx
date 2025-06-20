
import { useState, useEffect } from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { subscriptionService, UserSubscription, SubscriptionPlan, UsageData } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export const useSubscription = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [userSub, availablePlans, usageData] = await Promise.all([
        subscriptionService.getUserSubscription(user.id),
        subscriptionService.getAvailablePlans(),
        subscriptionService.getUsageData(user.id)
      ]);

      setSubscription(userSub);
      setPlans(availablePlans);
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (planId: string) => {
    if (!user) return false;

    try {
      const success = await subscriptionService.changePlan(user.id, planId);
      if (success) {
        await loadSubscriptionData();
        toast({
          title: "Plan Changed",
          description: "Your subscription plan has been updated successfully.",
        });
      }
      return success;
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: "Error",
        description: "Failed to change subscription plan.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!user) return false;

    try {
      const success = await subscriptionService.cancelSubscription(user.id);
      if (success) {
        await loadSubscriptionData();
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled successfully.",
        });
      }
      return success;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    subscription,
    plans,
    usage,
    loading,
    changePlan,
    cancelSubscription,
    refetch: loadSubscriptionData
  };
};
