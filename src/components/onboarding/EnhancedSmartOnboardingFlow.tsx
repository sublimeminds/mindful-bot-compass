
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedOnboardingIntro from './AnimatedOnboardingIntro';
import WelcomeStep from './WelcomeStep';
import EmbeddedAuthStep from './EmbeddedAuthStep';
import IntakeAssessmentStep from './IntakeAssessmentStep';
import ProblemAssessmentStep from './ProblemAssessmentStep';
import IdentityDiversityStep from './IdentityDiversityStep';
import ChildhoodHistoryStep from './ChildhoodHistoryStep';
import PersonalHistoryStep from './PersonalHistoryStep';
import RelationshipHistoryStep from './RelationshipHistoryStep';
import MentalHealthScreeningStep from './MentalHealthScreeningStep';
import CulturalPreferencesStep from './CulturalPreferencesStep';
import InternationalizedEnhancedSmartAnalysisStep from './InternationalizedEnhancedSmartAnalysisStep';
import TherapistMatchStep from './TherapistMatchStep';
import PlanSelectionStep from './PlanSelectionStep';
import NotificationPreferencesStep from './NotificationPreferencesStep';
import CompletionStep from './CompletionStep';
import TherapyPlanCreationStep from './TherapyPlanCreationStep';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import CurrencySelector from '@/components/ui/CurrencySelector';

import { useSEO } from '@/hooks/useSEO';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { scrollToTop } from '@/hooks/useScrollToTop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';

interface EnhancedSmartOnboardingFlowProps {
  onComplete: (data: any) => void;
}

const EnhancedSmartOnboardingFlow = ({ onComplete }: EnhancedSmartOnboardingFlowProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const subscriptionAccess = useSubscriptionAccess();
  const { progress, saveProgress, updateStep, clearProgress, hasProgress, isLoaded } = useOnboardingProgress();
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [hasCheckedProgress, setHasCheckedProgress] = useState(false);

  useSEO({
    title: 'Get Started - TherapySync',
    description: 'Begin your personalized mental wellness journey with TherapySync\'s guided onboarding process.',
    keywords: 'mental health assessment, therapy onboarding, wellness setup'
  });

  // Get current therapy plan count
  const { data: therapyPlanCount = 0 } = useQuery({
    queryKey: ['therapy-plan-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count } = await supabase
        .from('adaptive_therapy_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Check for pre-selected plan from pricing
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

  // Determine if plan selection should be shown
  const shouldShowPlanSelection = () => {
    if (!user) return true; // New users always see plan selection
    
    const isPremiumOrPro = subscriptionAccess.isPremium || subscriptionAccess.isProfessional;
    const isAtLimit = therapyPlanCount >= subscriptionAccess.therapyPlanLimit;
    const isFreeUnderLimit = subscriptionAccess.tier === 'free' && !isAtLimit;
    
    // Skip for premium/pro users
    if (isPremiumOrPro) return false;
    
    // Show for free users (either as upsell or mandatory upgrade)
    return subscriptionAccess.tier === 'free';
  };

  const allSteps = [
    { component: WelcomeStep, titleKey: 'Welcome' },
    { component: EmbeddedAuthStep, titleKey: 'Create Your Account' },
    { component: IntakeAssessmentStep, titleKey: 'Basic Information' },
    { component: ProblemAssessmentStep, titleKey: 'Tell Us About Your Challenges' },
    { component: IdentityDiversityStep, titleKey: 'Identity & Diversity' },
    { component: ChildhoodHistoryStep, titleKey: 'Childhood & Early Life' },
    { component: PersonalHistoryStep, titleKey: 'Personal History' },
    { component: RelationshipHistoryStep, titleKey: 'Relationships & Social Life' },
    { component: MentalHealthScreeningStep, titleKey: 'Mental Health Screening' },
    { component: CulturalPreferencesStep, titleKey: 'Cultural Preferences' },
    { component: InternationalizedEnhancedSmartAnalysisStep, titleKey: 'AI Analysis' },
    { component: TherapistMatchStep, titleKey: 'Choose Your Therapist' },
    { component: PlanSelectionStep, titleKey: 'Select Your Plan' },
    { component: NotificationPreferencesStep, titleKey: 'Notification Preferences' },
    { component: CompletionStep, titleKey: 'Setup Complete' }
  ];

  // Filter steps based on subscription status
  const steps = shouldShowPlanSelection() 
    ? allSteps 
    : allSteps.filter((_, index) => index !== 12); // Remove plan selection step (index 12)
  
  console.log("🔢 EnhancedSmartOnboardingFlow: Total steps =", steps.length, "Show plan selection =", shouldShowPlanSelection());

  const handleGetStarted = () => {
    setShowIntro(false);
  };

  const handleNext = (stepData?: any) => {
    console.log('🎯 EnhancedSmartOnboardingFlow: handleNext called with stepData:', stepData);
    console.log('🎯 Current step:', currentStep, 'Total steps:', steps.length);
    
    const newData = stepData ? { ...onboardingData, ...stepData } : onboardingData;
    
    if (stepData) {
      setOnboardingData(newData);
      // Save progress after each completed step to maintain state when navigating back
      saveProgress(newData, currentStep + 1);
    }

    console.log('🎯 Is last step?', currentStep >= steps.length - 1);
    
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      console.log('🎯 Moving to next step:', nextStep);
      setCurrentStep(nextStep);
      updateStep(nextStep);
      // Auto-scroll to top when advancing to next step
      setTimeout(() => scrollToTop(), 100);
    } else {
      console.log('🎯 Onboarding complete, calling onComplete with data:', newData);
      localStorage.removeItem('selectedPlan');
      clearProgress();
      onComplete(newData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateStep(prevStep);
      // Auto-scroll to top when going back
      setTimeout(() => scrollToTop(), 100);
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

  // Check for saved progress and show resume prompt - only once when component loads
  useEffect(() => {
    if (!isLoaded || hasCheckedProgress) return;

    // Only check progress once the hook has loaded and user exists
    if (user && hasProgress()) {
      console.log('📚 Found saved progress, showing resume prompt');
      setShowResumePrompt(true);
      setShowIntro(false);
    } else if (user) {
      // User is authenticated but no progress, skip auth step
      console.log('🔄 User authenticated, no saved progress');
      setCurrentStep(2);
      setShowIntro(false);
    } else {
      // No user, start from beginning
      console.log('👤 No user, starting fresh');
      setShowIntro(true);
    }
    
    setHasCheckedProgress(true);
  }, [user, hasProgress, isLoaded, hasCheckedProgress]);

  const handleResumeProgress = () => {
    if (progress) {
      setCurrentStep(progress.currentStep);
      setOnboardingData(progress.data || {});
    }
    setShowResumePrompt(false);
    setShowIntro(false);
  };

  const handleStartFresh = () => {
    clearProgress();
    setCurrentStep(0);
    setOnboardingData({});
    setShowResumePrompt(false);
    setShowIntro(true);
  };

  // Show resume prompt if user has progress
  if (showResumePrompt && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50 dark:from-harmony-950 dark:to-flow-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Resume Your Progress?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You have saved progress from step {(progress?.currentStep || 0) + 1} of {steps.length}. 
              Would you like to continue where you left off?
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-harmony-500 to-flow-500 h-2 rounded-full"
                style={{ width: `${((progress?.currentStep || 0) + 1) / steps.length * 100}%` }}
              />
            </div>
            <div className="flex space-x-2">
              <GradientButton onClick={handleResumeProgress} className="flex-1">
                Continue Progress
              </GradientButton>
              <GradientButton onClick={handleStartFresh} variant="outline" className="flex-1">
                Start Fresh
              </GradientButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showIntro) {
    return <AnimatedOnboardingIntro onGetStarted={handleGetStarted} />;
  }

  const CurrentStepComponent = steps[currentStep].component;

  const getStepProps = () => {
    const baseProps: any = {
      onNext: handleNext,
      onBack: handleBack,
      onboardingData,
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

    // Add selected plan for auth step
    if (currentStep === 1) {
      return {
        ...baseProps,
        selectedPlan
      };
    }

    // Add therapist step props - fix the filter error
    if (currentStep === 11) { // TherapistPersonalityStep (updated index)
      return {
        ...baseProps,
        selectedPersonality: onboardingData.selectedPersonality || null,
        selectedGoals: onboardingData.goals || [],
        selectedPreferences: onboardingData.preferences || [],
        onPersonalitySelect: (personalityId: string) => {
          setOnboardingData(prev => ({ ...prev, selectedPersonality: personalityId }));
        }
      };
    }

    // Plan selection step with conditional logic
    const planStepIndex = shouldShowPlanSelection() ? 12 : -1;
    if (currentStep === planStepIndex && planStepIndex !== -1) {
      const isAtLimit = therapyPlanCount >= subscriptionAccess.therapyPlanLimit;
      const showAsOptionalUpsell = subscriptionAccess.tier === 'free' && !isAtLimit;
      
      return {
        ...baseProps,
        showAsOptionalUpsell
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
            {steps[currentStep].titleKey}
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
