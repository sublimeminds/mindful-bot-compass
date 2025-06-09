
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
          .from('onboarding_data')
          .select('goals, preferences, therapist_personality')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching onboarding data:', error);
        } else if (data) {
          setOnboardingData({
            goals: data.goals || [],
            preferences: data.preferences || [],
            therapist_personality: data.therapist_personality
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
