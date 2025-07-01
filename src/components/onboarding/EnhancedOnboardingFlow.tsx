
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
import EnhancedButton from '@/components/ui/EnhancedButton';
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
        preferences: onboardingData.culturalPreferences || {
          primaryLanguage: 'en',
          culturalBackground: '',
          familyStructure: 'individual',
          communicationStyle: 'direct',
          religiousConsiderations: false,
          therapyApproachPreferences: [],
          culturalSensitivities: []
        },
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

    // For all other steps, ensure we have the required props
    return {
      ...baseProps,
      preferences: onboardingData.culturalPreferences || {
        primaryLanguage: 'en',
        culturalBackground: '',
        familyStructure: 'individual',
        communicationStyle: 'direct',
        religiousConsiderations: false,
        therapyApproachPreferences: [],
        culturalSensitivities: []
      },
      onPreferencesChange: handleCulturalPreferencesChange
    };
  };

  // Calculate progress based on visible steps
  const currentVisibleStepIndex = visibleSteps.findIndex(step => step.component === currentStepConfig.component);
  const progressPercentage = ((currentVisibleStepIndex + 1) / visibleSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header with Controls - Enhanced Design */}
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
            <div className="text-sm text-white font-medium bg-gradient-to-r from-therapy-500 to-calm-500 px-4 py-2 rounded-full shadow-lg">
              Selected: {selectedPlan.name}
            </div>
          )}
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold therapy-text-gradient-animated">
              {t('onboarding.title')}
            </h1>
            <span className="text-sm text-muted-foreground bg-therapy-50 px-3 py-1 rounded-full">
              Step {currentVisibleStepIndex + 1} of {visibleSteps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-therapy-500 via-calm-500 to-harmony-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <p className="text-center text-lg font-semibold therapy-text-gradient mt-3">
            {typeof currentStepConfig.titleKey === 'string' && currentStepConfig.titleKey.startsWith('onboarding.') 
              ? t(currentStepConfig.titleKey) 
              : currentStepConfig.titleKey}
          </p>
        </div>

        {/* Step Content with Enhanced Styling */}
        <div className="animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-therapy-100 p-8">
            <CurrentStepComponent {...getStepProps()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingFlow;
