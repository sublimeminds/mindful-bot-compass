
import React from 'react';
import EnhancedOnboardingFlow from '@/components/onboarding/EnhancedOnboardingFlow';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EnhancedOnboardingPage = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();

  const handleOnboardingComplete = async (data: any) => {
    try {
      console.log('Onboarding completed with data:', data);
      
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      // Create therapy plan using the adaptive therapy planner
      toast.loading('Creating your personalized therapy plan...');
      
      const { data: planData, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId: user.id,
          onboardingData: data,
          culturalProfile: data.culturalPreferences,
          traumaHistory: data.traumaHistory,
          therapistSelection: data.therapistSelection,
          assessmentResults: data.assessmentResults || {}
        }
      });

      if (error) {
        console.error('Error creating therapy plan:', error);
        toast.error('Failed to create therapy plan. Please try again.');
        return;
      }

      toast.success('Therapy plan created successfully!');
      console.log('Therapy plan created:', planData);
      
      // Navigate to therapy session or dashboard
      navigate('/therapy-session');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('An error occurred during onboarding completion');
    }
  };

  return <EnhancedOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default EnhancedOnboardingPage;
