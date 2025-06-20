import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import GoalsStep from '@/components/onboarding/GoalsStep';
import PreferencesStep from '@/components/onboarding/PreferencesStep';
import PlanSelectionStep from '@/components/onboarding/PlanSelectionStep';

const Onboarding = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
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
          navigate('/chat');
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

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to TherapySync!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p>
              Let's set up your profile to personalize your therapy experience.
            </p>
            <Progress value={(step / 3) * 100} className="mt-4" />
            <p className="text-sm text-muted-foreground">
              Step {step} of 3
            </p>
          </div>

          {renderStepContent()}

          {isLoading && (
            <div className="flex justify-center">
              <Button disabled>Loading...</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
