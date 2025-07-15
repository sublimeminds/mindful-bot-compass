
import React from 'react';
import EnhancedSmartOnboardingFlow from '@/components/onboarding/EnhancedSmartOnboardingFlow';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedCulturalContextService, UserCulturalProfile } from '@/services/enhancedCulturalContextService';

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

      toast.loading('Saving your profile and creating personalized therapy plan...');

      // First, save the cultural profile to database if cultural preferences exist
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

      // Create therapy plan using the adaptive therapy planner with all comprehensive data
      const { data: planData, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId: user.id,
          onboardingData: data,
          culturalProfile: data.culturalPreferences,
          traumaHistory: data.traumaHistory,
          therapistSelection: data.therapistSelection,
          assessmentResults: data.assessmentResults || {},
          // Include all mental health standard compliance data
          mentalHealthAssessments: data.mentalHealthAssessments || {},
          clinicalData: data.clinicalData || {},
          riskAssessment: data.riskAssessment || {},
          preferences: {
            cultural: data.culturalPreferences,
            therapy: data.therapyPreferences,
            communication: data.communicationPreferences
          }
        }
      });

      if (error) {
        console.error('Error creating therapy plan:', error);
        toast.error('Failed to create therapy plan. Please try again.');
        return;
      }

      // Mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating onboarding status:', profileError);
      }

      toast.success('Your personalized therapy plan has been created successfully!');
      console.log('Comprehensive therapy plan created with cultural AI integration:', planData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('An error occurred during onboarding completion');
    }
  };

  console.log("🚀 EnhancedOnboardingPage: Using EnhancedSmartOnboardingFlow (14 steps)");
  return <EnhancedSmartOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default EnhancedOnboardingPage;
