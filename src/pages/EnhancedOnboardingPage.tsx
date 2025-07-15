
import React, { useState } from 'react';
import EnhancedSmartOnboardingFlow from '@/components/onboarding/EnhancedSmartOnboardingFlow';
import TherapyPlanCreationStep from '@/components/onboarding/TherapyPlanCreationStep';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedCulturalContextService, UserCulturalProfile } from '@/services/enhancedCulturalContextService';

const EnhancedOnboardingPage = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();
  const [showPlanCreation, setShowPlanCreation] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  const handleOnboardingComplete = async (data: any) => {
    try {
      console.log('Onboarding completed with data:', data);
      
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      // Save the cultural profile first
      if (data.culturalPreferences) {
        const culturalProfile: UserCulturalProfile = {
          userId: user.id,
          primaryLanguage: data.culturalPreferences.primaryLanguage || 'en',
          culturalBackground: data.culturalPreferences.culturalBackground || '',
          familyStructure: data.culturalPreferences.familyStructure || 'individual',
          communicationStyle: data.culturalPreferences.communicationStyle || 'direct',
          religiousConsiderations: data.culturalPreferences.religiousConsiderations || false,
          religiousDetails: data.culturalPreferences.religiousDetails,
          therapyApproachPreferences: data.culturalPreferences.therapyApproachPreferences || [],
          culturalSensitivities: data.culturalPreferences.culturalSensitivities || []
        };

        const { success, error: culturalError } = await EnhancedCulturalContextService.saveCulturalProfile(culturalProfile);
        
        if (!success) {
          console.error('Error saving cultural profile:', culturalError);
          toast.error('Failed to save cultural preferences. Please try again.');
          return;
        }

        console.log('Cultural profile saved successfully');
      }

      // Mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating onboarding status:', profileError);
      }

      // Store data and show plan creation step
      setOnboardingData(data);
      setShowPlanCreation(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('An error occurred during onboarding completion');
    }
  };

  const handlePlanCreationComplete = (success: boolean, planData?: any) => {
    if (success) {
      console.log('Therapy plan created successfully:', planData);
      navigate('/dashboard');
    } else {
      // Go back to onboarding or show error
      setShowPlanCreation(false);
      toast.error('Failed to create therapy plan. Please try again.');
    }
  };

  console.log("🚀 EnhancedOnboardingPage: Using EnhancedSmartOnboardingFlow (14 steps)");
  
  if (showPlanCreation && onboardingData) {
    return (
      <TherapyPlanCreationStep
        onboardingData={onboardingData}
        onComplete={handlePlanCreationComplete}
      />
    );
  }
  
  return <EnhancedSmartOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default EnhancedOnboardingPage;
