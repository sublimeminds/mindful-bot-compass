import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AnimatedOnboardingIntro from './AnimatedOnboardingIntro';
import WelcomeStep from './WelcomeStep';
import EmbeddedAuthStep from './EmbeddedAuthStep';
import ComprehensiveMentalHealthStep from './ComprehensiveMentalHealthStep';
import CulturalPreferencesStep from './CulturalPreferencesStep';
import InternationalizedEnhancedSmartAnalysisStep from './InternationalizedEnhancedSmartAnalysisStep';
import TherapistPersonalityStep from './TherapistPersonalityStep';
import EnhancedPlanSelectionStep from './EnhancedPlanSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import CurrencySelector from '@/components/ui/CurrencySelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useSafeSEO } from '@/hooks/useSafeSEO';

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

  useSafeSEO({
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

  // Create a stable steps array that doesn't change based on auth status
  const allSteps = [
    { component: WelcomeStep, titleKey: 'onboarding.steps.welcome', shouldShow: () => true },
    { component: EmbeddedAuthStep, titleKey: 'Create Your Account', shouldShow: () => !user },
    { component: ComprehensiveMentalHealthStep, titleKey: 'Mental Health Assessment', shouldShow: () => true },
    { component: CulturalPreferencesStep, titleKey: 'onboarding.steps.cultural', shouldShow: () => true },
    { component: InternationalizedEnhancedSmartAnalysisStep, titleKey: 'onboarding.steps.analysis', shouldShow: () => true },
    { component: TherapistPersonalityStep, titleKey: 'onboarding.steps.therapist', shouldShow: () => true },
    { component: EnhancedPlanSelectionStep, titleKey: 'Choose Your Plan', shouldShow: () => !selectedPlan },
    { component: NotificationPreferencesStep, titleKey: 'onboarding.steps.notifications', shouldShow: () => true }
  ];

  // Get the visible steps for progress calculation
  const visibleSteps = allSteps.filter(step => step.shouldShow());

  const handleGetStarted = () => {
    setShowIntro(false);
  };

  const findNextValidStep = (fromIndex: number) => {
    for (let i = fromIndex + 1; i < allSteps.length; i++) {
      if (allSteps[i].shouldShow()) {
        return i;
      }
    }
    return -1; // No more valid steps
  };

  const handleNext = (stepData?: any) => {
    console.log('handleNext called with stepData:', stepData, 'currentStep:', currentStep);
    
    if (stepData) {
      setOnboardingData(prev => ({ ...prev, ...stepData }));
    }

    const nextStepIndex = findNextValidStep(currentStep);
    console.log('Next valid step index:', nextStepIndex);
    
    if (nextStepIndex !== -1) {
      setCurrentStep(nextStepIndex);
    } else {
      // No more steps, complete onboarding
      console.log('Completing onboarding with data:', { ...onboardingData, ...stepData });
      localStorage.removeItem('selectedPlan');
      onComplete({ ...onboardingData, ...stepData });
    }
  };

  const findPreviousValidStep = (fromIndex: number) => {
    for (let i = fromIndex - 1; i >= 0; i--) {
      if (allSteps[i].shouldShow()) {
        return i;
      }
    }
    return -1; // No previous valid steps
  };

  const handleBack = () => {
    const prevStepIndex = findPreviousValidStep(currentStep);
    console.log('Previous valid step index:', prevStepIndex);
    
    if (prevStepIndex !== -1) {
      setCurrentStep(prevStepIndex);
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

  // Auto-advance from auth step when user becomes authenticated
  useEffect(() => {
    console.log('Auth state changed. User:', user ? 'authenticated' : 'not authenticated', 'currentStep:', currentStep);
    
    // If user just authenticated and we're on the auth step, move to next step
    if (user && allSteps[currentStep]?.component === EmbeddedAuthStep) {
      console.log('User authenticated, advancing from auth step');
      const nextStepIndex = findNextValidStep(currentStep);
      if (nextStepIndex !== -1) {
        setCurrentStep(nextStepIndex);
      }
    }
  }, [user, currentStep]);

  if (showIntro) {
    return <AnimatedOnboardingIntro onGetStarted={handleGetStarted} />;
  }

  // Ensure we have a valid current step
  const currentStepConfig = allSteps[currentStep];
  if (!currentStepConfig || !currentStepConfig.shouldShow()) {
    console.log('Current step invalid, finding next valid step');
    const nextValidStep = findNextValidStep(currentStep - 1);
    if (nextValidStep !== -1) {
      setCurrentStep(nextValidStep);
      return null; // Will re-render with valid step
    }
  }

  if (!currentStepConfig) {
    console.error('No valid step found, this should not happen');
    return <div>Error: No valid step found</div>;
  }

  const CurrentStepComponent = currentStepConfig.component;

  const getStepProps = () => {
    const baseProps = {
      onNext: handleNext,
      onBack: handleBack,
      onboardingData
    };

    // Add selected plan for auth step
    if (currentStepConfig.component === EmbeddedAuthStep) {
      return {
        ...baseProps,
        selectedPlan
      };
    }

    // Add specific props for Cultural Preferences step
    if (currentStepConfig.component === CulturalPreferencesStep) {
      return {
        ...baseProps,
        preferences: onboardingData.culturalPreferences,
        onPreferencesChange: handleCulturalPreferencesChange
      };
    }

    // Add pre-selected plan and assessment data for Plan Selection step
    if (currentStepConfig.component === EnhancedPlanSelectionStep) {
      return {
        ...baseProps,
        preSelectedPlan: selectedPlan,
        onboardingData
      };
    }

    return baseProps;
  };

  // Calculate progress based on visible steps
  const currentVisibleStepIndex = visibleSteps.findIndex(step => step.component === currentStepConfig.component);
  const progressPercentage = ((currentVisibleStepIndex + 1) / visibleSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 dark:from-harmony-950 dark:to-flow-950 p-4 transition-colors duration-300">
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
              Step {currentVisibleStepIndex + 1} of {visibleSteps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-harmony-500 via-therapy-500 to-flow-500 h-2 rounded-full transition-all duration-500 ease-out animate-pulse-glow"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-harmony-600 dark:text-harmony-400 mt-2">
            {typeof currentStepConfig.titleKey === 'string' && currentStepConfig.titleKey.startsWith('onboarding.') 
              ? t(currentStepConfig.titleKey) 
              : currentStepConfig.titleKey}
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
