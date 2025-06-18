
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WelcomeStep from './WelcomeStep';
import IntakeAssessmentStep from './IntakeAssessmentStep';
import MentalHealthScreeningStep from './MentalHealthScreeningStep';
import CulturalContextStep from './CulturalContextStep';
import InternationalizedEnhancedSmartAnalysisStep from './InternationalizedEnhancedSmartAnalysisStep';
import TherapistPersonalityStep from './TherapistPersonalityStep';
import PlanSelectionStep from './PlanSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import LanguageSelector from '@/components/ui/LanguageSelector';
import CurrencySelector from '@/components/ui/CurrencySelector';

interface SmartOnboardingFlowProps {
  onComplete: (data: any) => void;
}

const SmartOnboardingFlow = ({ onComplete }: SmartOnboardingFlowProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({});

  const steps = [
    { component: WelcomeStep, titleKey: 'onboarding.steps.welcome' },
    { component: IntakeAssessmentStep, titleKey: 'onboarding.steps.goals' },
    { component: MentalHealthScreeningStep, titleKey: 'onboarding.steps.preferences' },
    { component: CulturalContextStep, titleKey: 'onboarding.steps.cultural' },
    { component: InternationalizedEnhancedSmartAnalysisStep, titleKey: 'onboarding.steps.analysis' },
    { component: TherapistPersonalityStep, titleKey: 'onboarding.steps.therapist' },
    { component: PlanSelectionStep, titleKey: 'onboarding.steps.plan' },
    { component: NotificationPreferencesStep, titleKey: 'onboarding.steps.notifications' }
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

  const stepProps = {
    onNext: handleNext,
    onBack: handleBack,
    onboardingData
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Language and Currency Selectors */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <CurrencySelector />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-harmony-600">{t('onboarding.title')}</h1>
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
          <p className="text-center text-sm font-medium text-harmony-600 mt-2">
            {t(steps[currentStep].titleKey)}
          </p>
        </div>

        {/* Step Content */}
        <CurrentStepComponent {...stepProps} />
      </div>
    </div>
  );
};

export default SmartOnboardingFlow;
