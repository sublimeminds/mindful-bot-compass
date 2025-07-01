
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AnimatedOnboardingIntro from './AnimatedOnboardingIntro';
import WelcomeStep from './WelcomeStep';
import EmbeddedAuthStep from './EmbeddedAuthStep';
import IntakeAssessmentStep from './IntakeAssessmentStep';
import MentalHealthScreeningStep from './MentalHealthScreeningStep';
import CulturalPreferencesStep from './CulturalPreferencesStep';
import InternationalizedEnhancedSmartAnalysisStep from './InternationalizedEnhancedSmartAnalysisStep';
import TherapistPersonalityStep from './TherapistPersonalityStep';
import PlanSelectionStep from './PlanSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import CurrencySelector from '@/components/ui/CurrencySelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useSEO } from '@/hooks/useSEO';

interface EnhancedOnboardingFlowProps {
  onComplete: (data: any) => void;
}

const EnhancedOnboardingFlow = ({ onComplete }: EnhancedOnboardingFlowProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

  // Check for pre-selected plan from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      try {
        const planData = JSON.parse(savedPlan);
        setSelectedPlan(planData);
        setOnboardingData(prev => ({
          ...prev,
          selectedPlan: planData
        }));
      } catch (error) {
        console.error('Error parsing saved plan:', error);
      }
    }
  }, []);

  // Determine which steps to show based on auth status
  const getSteps = () => {
    const baseSteps = [
      { component: WelcomeStep, titleKey: 'onboarding.steps.welcome' }
    ];

    // If user is not authenticated, show auth step early
    if (!user) {
      baseSteps.push({ component: EmbeddedAuthStep, titleKey: 'Create Your Account' });
    }

    // Add the rest of the steps
    baseSteps.push(
      { component: IntakeAssessmentStep, titleKey: 'onboarding.steps.goals' },
      { component: MentalHealthScreeningStep, titleKey: 'onboarding.steps.preferences' },
      { component: CulturalPreferencesStep, titleKey: 'onboarding.steps.cultural' },
      { component: InternationalizedEnhancedSmartAnalysisStep, titleKey: 'onboarding.steps.analysis' },
      { component: TherapistPersonalityStep, titleKey: 'onboarding.steps.therapist' }
    );

    // Only show plan selection if no plan was pre-selected
    if (!selectedPlan) {
      baseSteps.push({ component: PlanSelectionStep, titleKey: 'onboarding.steps.plan' });
    }

    baseSteps.push({ component: NotificationPreferencesStep, titleKey: 'onboarding.steps.notifications' });

    return baseSteps;
  };

  const steps = getSteps();

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
      // Clear saved plan from localStorage and complete onboarding
      localStorage.removeItem('selectedPlan');
      onComplete({ ...onboardingData, ...stepData });
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

    // Add selected plan for auth step
    if (steps[currentStep].component === EmbeddedAuthStep) {
      return {
        ...baseProps,
        selectedPlan
      };
    }

    // Add specific props for Cultural Preferences step
    if (steps[currentStep].component === CulturalPreferencesStep) {
      return {
        ...baseProps,
        preferences: onboardingData.culturalPreferences,
        onPreferencesChange: handleCulturalPreferencesChange
      };
    }

    // Add pre-selected plan for Plan Selection step (if we reach it)
    if (steps[currentStep].component === PlanSelectionStep && selectedPlan) {
      return {
        ...baseProps,
        preSelectedPlan: selectedPlan
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
            <EnhancedLanguageSelector />
            <CurrencySelector 
              value={selectedCurrency}
              onChange={setSelectedCurrency}
            />
            <ThemeToggle />
          </div>
          {selectedPlan && (
            <div className="text-sm text-therapy-600 font-medium bg-therapy-50 px-3 py-1 rounded-full">
              Selected: {selectedPlan.name}
            </div>
          )}
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
            {typeof steps[currentStep].titleKey === 'string' && steps[currentStep].titleKey.startsWith('onboarding.') 
              ? t(steps[currentStep].titleKey) 
              : steps[currentStep].titleKey}
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

export default EnhancedOnboardingFlow;
