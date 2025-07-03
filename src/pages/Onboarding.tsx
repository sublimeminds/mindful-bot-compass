
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import GoalsStep from '@/components/onboarding/GoalsStep';
import PreferencesStep from '@/components/onboarding/PreferencesStep';
import PlanSelectionStep from '@/components/onboarding/PlanSelectionStep';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prevGoals) =>
      prevGoals.includes(goal) ? prevGoals.filter((g) => g !== goal) : [...prevGoals, goal]
    );
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prevPreferences) =>
      prevPreferences.includes(preference) ? prevPreferences.filter((p) => p !== preference) : [...prevPreferences, preference]
    );
  };

  const handleNext = async () => {
    if (step === 3) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('user_onboarding')
          .upsert({
            user_id: user?.id,
            goals: selectedGoals,
            preferences: selectedPreferences,
          }, { onConflict: 'user_id' });

        if (error) {
          console.error('Error saving onboarding data:', error);
        } else {
          // After completing onboarding, redirect to dashboard
          navigate('/dashboard');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <GoalsStep
            selectedGoals={selectedGoals}
            onGoalToggle={handleGoalToggle}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <PreferencesStep
            selectedPreferences={selectedPreferences}
            onPreferenceToggle={handlePreferenceToggle}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PlanSelectionStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-10">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              Welcome to TherapySync!
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Let's personalize your mental wellness journey
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Progress value={(step / 3) * 100} className="mt-4" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {step} of 3
              </p>
            </div>

            {renderStepContent()}

            {isLoading && (
              <div className="flex justify-center">
                <Button disabled className="bg-therapy-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completing setup...
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
