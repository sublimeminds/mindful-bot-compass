
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
      console.log('🎯 Onboarding completed with data:', data);
      
      if (!user) {
        console.error('❌ User not authenticated');
        toast.error('User not authenticated');
        return;
      }

      // Validate required data before proceeding
      if (!data || Object.keys(data).length === 0) {
        console.error('❌ Invalid onboarding data:', data);
        toast.error('Invalid onboarding data. Please complete all steps.');
        return;
      }

      console.log('✅ User authenticated, data valid, proceeding with cultural profile save');

      // Save the cultural profile first with proper error handling
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

        console.log('💾 Saving cultural profile:', culturalProfile);
        const { success, error: culturalError } = await EnhancedCulturalContextService.saveCulturalProfile(culturalProfile);
        
        if (!success) {
          console.error('❌ Error saving cultural profile:', culturalError);
          toast.error('Failed to save cultural preferences. Please try again.');
          return;
        }

        console.log('✅ Cultural profile saved successfully');
      } else {
        console.log('⚠️ No cultural preferences to save');
      }

      // CRITICAL: Do NOT mark onboarding as complete until therapy plan is successfully created
      console.log('🚀 Onboarding data processed, proceeding to therapy plan creation');

      // Store data and show plan creation step
      setOnboardingData(data);
      setShowPlanCreation(true);
      
      console.log('✅ Therapy plan creation step initiated');
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      toast.error('An error occurred during onboarding completion');
    }
  };

  const handlePlanCreationComplete = async (success: boolean, planData?: any) => {
    if (success && user) {
      console.log('Therapy plan created successfully:', planData);
      
      try {
        // NOW mark onboarding as complete after successful therapy plan creation
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ onboarding_complete: true })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating onboarding status:', profileError);
          toast.error('Plan created but failed to update profile. Please contact support.');
        } else {
          console.log('Onboarding marked as complete successfully');
          toast.success('Welcome! Your personalized therapy journey begins now.');
        }
      } catch (error) {
        console.error('Error marking onboarding complete:', error);
      }
      
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
