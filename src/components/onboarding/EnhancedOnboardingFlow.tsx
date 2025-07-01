
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

  // Create a stable steps array that doesn't change based on auth status
  const allSteps = [
    { component: WelcomeStep, titleKey: 'onboarding.steps.welcome', shouldShow: () => true },
    { component: EmbeddedAuthStep, titleKey: 'Create Your Account', shouldShow: () => !user },
    { component: IntakeAssessmentStep, titleKey: 'onboarding.steps.goals', shouldShow: () => true },
    { component: MentalHealthScreeningStep, titleKey: 'onboarding.steps.preferences', shouldShow: () => true },
    { component: CulturalPreferencesStep, titleKey: 'onboarding.steps.cultural', shouldShow: () => true },
    { component: InternationalizedEnhancedSmartAnalysisStep, titleKey: 'onboarding.steps.analysis', shouldShow: () => true },
    { component: TherapistPersonalityStep, titleKey: 'onboarding.steps.therapist', shouldShow: () => true },
    { component: PlanSelectionStep, titleKey: 'onboarding.steps.plan', shouldShow: () => !selectedPlan },
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

    // Add pre-selected plan for Plan Selection step (if we reach it)
    if (currentStepConfig.component === PlanSelectionStep && selectedPlan) {
      return {
        ...baseProps,
        preSelectedPlan: selectedPlan
      };
    }

    return baseProps;
  };

  // Calculate progress based on visible steps
  const currentVisibleStepIndex = visibleSteps.findIndex(step => step.component === currentStepConfig.component);
  const progressPercentage = ((currentVisibleStepIndex + 1) / visibleSteps.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated gradient background */}
      <div className="absolute inset-0 gradient-animated"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-harmony-50/80 via-flow-50/60 to-balance-50/80 dark:from-harmony-950/80 dark:via-flow-950/60 dark:to-balance-950/80"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-harmony-200/20 dark:bg-harmony-800/20 rounded-full animate-float opacity-60" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-flow-200/20 dark:bg-flow-800/20 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-10 w-32 h-32 bg-balance-200/20 dark:bg-balance-800/20 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 p-4 transition-colors duration-300">
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
              <div className="text-sm text-therapy-600 dark:text-therapy-400 font-medium bg-therapy-50/80 dark:bg-therapy-900/80 px-3 py-1 rounded-full backdrop-blur-sm border border-therapy-200/50 dark:border-therapy-700/50">
                Selected: {selectedPlan.name}
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold gradient-text">{t('onboarding.title')}</h1>
              <span className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-900/50 px-2 py-1 rounded-full backdrop-blur-sm">
                Step {currentVisibleStepIndex + 1} of {visibleSteps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3 backdrop-blur-sm border border-white/20 dark:border-gray-600/20">
              <div 
                className="gradient-primary h-3 rounded-full transition-all duration-500 ease-out animate-shimmer shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm font-medium gradient-text mt-2">
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
    </div>
  );
};

export default EnhancedOnboardingFlow;
