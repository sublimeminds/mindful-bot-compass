
import React from 'react';
import SmartOnboardingFlow from '@/components/onboarding/SmartOnboardingFlow';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleOnboardingComplete = async (data: any) => {
    try {
      await updateUser({ onboarding_completed: true, ...data });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return <SmartOnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default OnboardingPage;
