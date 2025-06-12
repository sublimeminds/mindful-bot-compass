import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TherapistMatcher from '@/components/therapist/TherapistMatcher';
import GoalsStep from './GoalsStep';
import PreferencesStep from './PreferencesStep';
import WelcomeStep from './WelcomeStep';
import MoodBaselineStep from './MoodBaselineStep';

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', component: 'WelcomeStep' },
  { id: 'goals', title: 'Goals & Challenges', component: 'GoalsStep' },
  { id: 'preferences', title: 'Therapy Preferences', component: 'PreferencesStep' },
  { id: 'mood-baseline', title: 'Mood Baseline', component: 'MoodBaselineStep' },
  { id: 'therapist-matching', title: 'Find Your Therapist', component: 'TherapistMatcher' },
  { id: 'complete', title: 'Complete Setup', component: 'CompleteStep' }
];

const SmartOnboardingFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    goals: [],
    preferences: [],
    moodBaseline: null,
    selectedTherapist: null
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepData = (stepId: string, data: any) => {
    setOnboardingData(prev => ({ ...prev, [stepId]: data }));
  };

  const handleComplete = async () => {
    // Save onboarding data and redirect to dashboard
    toast({
      title: "Welcome to MindfulAI!",
      description: "Your personalized therapy experience is ready.",
    });
    navigate('/');
  };

  const renderCurrentStep = () => {
    switch (currentStep.component) {
      case 'WelcomeStep':
        return <WelcomeStep onNext={handleNext} />;
      case 'GoalsStep':
        return (
          <GoalsStep
            selectedGoals={onboardingData.goals}
            onGoalToggle={(goal) => {
              const newGoals = onboardingData.goals.includes(goal)
                ? onboardingData.goals.filter(g => g !== goal)
                : [...onboardingData.goals, goal];
              handleStepData('goals', newGoals);
            }}
            onNext={handleNext}
            onBack={handlePrevious}
          />
        );
      case 'PreferencesStep':
        return (
          <PreferencesStep
            selectedPreferences={onboardingData.preferences}
            selectedGoals={onboardingData.goals}
            onPreferenceToggle={(pref) => {
              const newPrefs = onboardingData.preferences.includes(pref)
                ? onboardingData.preferences.filter(p => p !== pref)
                : [...onboardingData.preferences, pref];
              handleStepData('preferences', newPrefs);
            }}
            onNext={handleNext}
            onBack={handlePrevious}
          />
        );
      case 'MoodBaselineStep':
        return (
          <MoodBaselineStep
            onMoodSet={(mood) => {
              handleStepData('moodBaseline', mood);
              handleNext();
            }}
            onBack={handlePrevious}
          />
        );
      case 'TherapistMatcher':
        return (
          <TherapistMatcher
            onTherapistSelected={(therapistId) => {
              handleStepData('selectedTherapist', therapistId);
              handleNext();
            }}
            onClose={() => navigate('/')}
          />
        );
      case 'CompleteStep':
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
              <p className="text-muted-foreground mb-6">
                Your personalized therapy experience is ready. Let's start your journey toward better mental health.
              </p>
            </div>
            <Button onClick={handleComplete} size="lg" className="w-full">
              Start Your Journey
            </Button>
          </div>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Setup Your Therapy Experience</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm font-medium text-therapy-600 mt-2">
            {currentStep.title}
          </p>
        </div>

        {/* Step Content */}
        <Card className="min-h-[500px]">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStepIndex > 0 && currentStepIndex < ONBOARDING_STEPS.length - 1 && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartOnboardingFlow;
