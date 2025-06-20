
import React from 'react';
import SmartOnboardingFlow from '@/components/onboarding/SmartOnboardingFlow';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();

  const handleOnboardingComplete = async (data: any) => {
    try {
      console.log('Onboarding completed with data:', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return <SmartOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default OnboardingPage;
