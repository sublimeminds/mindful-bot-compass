
import React, { useState } from 'react';
import WelcomeStep from './WelcomeStep';
import IntakeAssessmentStep from './IntakeAssessmentStep';
import MentalHealthScreeningStep from './MentalHealthScreeningStep';
import SmartAnalysisStep from './SmartAnalysisStep';
import TherapistPersonalityStep from './TherapistPersonalityStep';
import PlanSelectionStep from './PlanSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';

interface SmartOnboardingFlowProps {
  onComplete: (data: any) => void;
}

const SmartOnboardingFlow = ({ onComplete }: SmartOnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({});

  const steps = [
    { component: WelcomeStep, title: 'Welcome' },
    { component: IntakeAssessmentStep, title: 'Intake Assessment' },
    { component: MentalHealthScreeningStep, title: 'Mental Health Screening' },
    { component: SmartAnalysisStep, title: 'AI Analysis' },
    { component: TherapistPersonalityStep, title: 'Therapist Matching' },
    { component: PlanSelectionStep, title: 'Plan Selection' },
    { component: NotificationPreferencesStep, title: 'Preferences' }
  ];

  const handleNext = (stepData?: any) => {
    if (stepData) {
      setOnboardingData(prev => ({ ...prev, ...stepData }));
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(onboardingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Create props object with common interface
  const stepProps = {
    onNext: handleNext,
    onBack: handleBack,
    onboardingData
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-harmony-600">TherapySync Setup</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-harmony-500 to-flow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <CurrentStepComponent {...stepProps} />
      </div>
    </div>
  );
};

export default SmartOnboardingFlow;
