
import React from 'react';
import EnhancedSmartOnboardingFlow from './EnhancedSmartOnboardingFlow';

interface SmartOnboardingFlowProps {
  onComplete: (data: any) => void;
}

const SmartOnboardingFlow = ({ onComplete }: SmartOnboardingFlowProps) => {
  return <EnhancedSmartOnboardingFlow onComplete={onComplete} />;
};

export default SmartOnboardingFlow;
