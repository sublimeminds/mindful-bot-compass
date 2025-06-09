
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  goals: string[];
  concerns: string[];
  experience: string;
  preferences: string[];
}

export const useOnboardingData = () => {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOnboardingData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching onboarding data:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setOnboardingData({
          goals: data.goals || [],
          concerns: data.concerns || [],
          experience: data.experience || '',
          preferences: data.preferences || []
        });
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardingData();
  }, [user]);

  return { onboardingData, isLoading, refetch: fetchOnboardingData };
};
