
import React, { useState, useEffect } from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  goals: string[];
  preferences: string[];
  therapist_personality?: string;
}

export const useOnboardingData = () => {
  // Add error boundary for React context issues
  try {
    const { user } = useSimpleApp();
    const [onboardingData, setOnboardingData] = React.useState<OnboardingData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_onboarding')
          .select('goals, preferences')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching onboarding data:', error);
        } else if (data) {
          setOnboardingData({
            goals: data.goals || [],
            preferences: data.preferences || [],
            therapist_personality: undefined // Will be added later when we create the proper table
          });
        }
      } catch (error) {
        console.error('Error in fetchOnboardingData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnboardingData();
  }, [user]);

  return { onboardingData, isLoading };
  } catch (error) {
    console.error('useOnboardingData hook error:', error);
    return { 
      onboardingData: null, 
      isLoading: false 
    };
  }
};
