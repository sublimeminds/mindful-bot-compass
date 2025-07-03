
import React from 'react';
import EnhancedOnboardingFlow from '@/components/onboarding/EnhancedOnboardingFlow';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const EnhancedOnboardingPage = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = async (data: any) => {
    try {
      console.log('Onboarding completed with data:', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return <EnhancedOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default EnhancedOnboardingPage;
