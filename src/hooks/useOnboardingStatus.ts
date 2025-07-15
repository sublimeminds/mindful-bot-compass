import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingStatus {
  isComplete: boolean;
  hasActiveTherapyPlan: boolean;
  isLoading: boolean;
  planCreationInProgress: boolean;
}

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<OnboardingStatus>({
    isComplete: false,
    hasActiveTherapyPlan: false,
    isLoading: true,
    planCreationInProgress: false
  });

  useEffect(() => {
    if (!user) {
      setStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        setStatus(prev => ({ ...prev, isLoading: true }));

        // Check if user has completed onboarding
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setStatus(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const onboardingComplete = profile?.onboarding_complete || false;

        // Check if user has at least one active therapy plan
        const { data: therapyPlans, error: plansError } = await supabase
          .from('adaptive_therapy_plans')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (plansError) {
          console.error('Error fetching therapy plans:', plansError);
        }

        const hasActiveTherapyPlan = therapyPlans && therapyPlans.length > 0;

        // Check if therapy plan creation is in progress (created within last 5 minutes)
        const planCreationInProgress = therapyPlans && therapyPlans.length > 0 
          ? new Date().getTime() - new Date(therapyPlans[0].created_at).getTime() < 5 * 60 * 1000
          : false;

        setStatus({
          isComplete: onboardingComplete,
          hasActiveTherapyPlan: hasActiveTherapyPlan || false,
          isLoading: false,
          planCreationInProgress: planCreationInProgress || false
        });

      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkOnboardingStatus();

    // Set up real-time listener for therapy plans
    const subscription = supabase
      .channel('therapy_plans_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'adaptive_therapy_plans',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          checkOnboardingStatus();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return status;
};