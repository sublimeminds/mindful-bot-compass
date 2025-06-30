
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedOnboardingIntro from './AnimatedOnboardingIntro';
import WelcomeStep from './WelcomeStep';
import IntakeAssessmentStep from './IntakeAssessmentStep';
import MentalHealthScreeningStep from './MentalHealthScreeningStep';
import CulturalPreferencesStep from './CulturalPreferencesStep';
import InternationalizedEnhancedSmartAnalysisStep from './InternationalizedEnhancedSmartAnalysisStep';
import TherapistPersonalityStep from './TherapistPersonalityStep';
import PlanSelectionStep from './PlanSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import LanguageSelector from '@/components/ui/LanguageSelector';
import CurrencySelector from '@/components/ui/CurrencySelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useSEO } from '@/hooks/useSEO';

interface EnhancedSmartOnboardingFlowProps {
  onComplete: (data: any) => void;
}

const EnhancedSmartOnboardingFlow = ({ onComplete }: EnhancedSmartOnboardingFlowProps) => {
  const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [onboardingData, setOnboardingData] = useState<any>({
    culturalPreferences: {
      primaryLanguage: 'en',
      culturalBackground: '',
      familyStructure: 'individual',
      communicationStyle: 'direct',
      religiousConsiderations: false,
      therapyApproachPreferences: [],
      culturalSensitivities: []
    }
  });

  useSEO({
    title: 'Get Started - TherapySync',
    description: 'Begin your personalized mental wellness journey with TherapySync\'s guided onboarding process.',
    keywords: 'mental health assessment, therapy onboarding, wellness setup'
  });

  const steps = [
    { component: WelcomeStep, titleKey: 'onboarding.steps.welcome' },
    { component: IntakeAssessmentStep, titleKey: 'onboarding.steps.goals' },
    { component: MentalHealthScreeningStep, titleKey: 'onboarding.steps.preferences' },
    { component: CulturalPreferencesStep, titleKey: 'onboarding.steps.cultural' },
    { component: InternationalizedEnhancedSmartAnalysisStep, titleKey: 'onboarding.steps.analysis' },
    { component: TherapistPersonalityStep, titleKey: 'onboarding.steps.therapist' },
    { component: PlanSelectionStep, titleKey: 'onboarding.steps.plan' },
    { component: NotificationPreferencesStep, titleKey: 'onboarding.steps.notifications' }
  ];

  const handleGetStarted = () => {
    setShowIntro(false);
  };

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
    } else {
      setShowIntro(true);
    }
  };

  const handleCulturalPreferencesChange = (preferences: any) => {
    setOnboardingData(prev => ({
      ...prev,
      culturalPreferences: preferences
    }));
  };

  if (showIntro) {
    return <AnimatedOnboardingIntro onGetStarted={handleGetStarted} />;
  }

  const CurrentStepComponent = steps[currentStep].component;

  const getStepProps = () => {
    const baseProps = {
      onNext: handleNext,
      onBack: handleBack,
      onboardingData
    };

    // Add specific props for Cultural Preferences step
    if (currentStep === 3) { // Cultural Preferences step
      return {
        ...baseProps,
        preferences: onboardingData.culturalPreferences,
        onPreferencesChange: handleCulturalPreferencesChange
      };
    }

    return baseProps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 dark:from-harmony-950 dark:to-flow-950 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header with Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <CurrencySelector 
              value={selectedCurrency}
              onChange={setSelectedCurrency}
            />
            <ThemeToggle />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-harmony-600 dark:text-harmony-400">{t('onboarding.title')}</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-harmony-500 to-flow-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-harmony-600 dark:text-harmony-400 mt-2">
            {t(steps[currentStep].titleKey)}
          </p>
        </div>

        {/* Step Content */}
        <div className="animate-fade-in">
          <CurrentStepComponent {...getStepProps()} />
        </div>
      </div>
    </div>
  );
};

export default EnhancedSmartOnboardingFlow;
