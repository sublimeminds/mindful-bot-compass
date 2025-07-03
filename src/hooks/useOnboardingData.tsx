
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  goals: string[];
  preferences: string[];
  therapist_personality?: string;
}

export const useOnboardingData = () => {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
};
