
import React from 'react';
import EnhancedSmartOnboardingFlow from '@/components/onboarding/EnhancedSmartOnboardingFlow';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const { user } = useAuth();
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

  return <EnhancedSmartOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default OnboardingPage;
