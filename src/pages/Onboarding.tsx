import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import GoalsStep from "@/components/onboarding/GoalsStep";
import PreferencesStep from "@/components/onboarding/PreferencesStep";
import TherapistPersonalityStep from "@/components/onboarding/TherapistPersonalityStep";
import PlanSelectionStep from "@/components/onboarding/PlanSelectionStep";
import StripeCheckout from "@/components/subscription/StripeCheckout";
import { useSubscription } from "@/hooks/useSubscription";

const STEPS = [
  'Goals & Challenges',
  'Therapy Preferences', 
  'Choose Your Therapist',
  'Select Your Plan',
  'Payment',
  'Complete Setup'
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{planId: string, billingCycle: 'monthly' | 'yearly'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plans } = useSubscription();

  // Auto-select therapist based on previous choices
  const autoSelectTherapist = () => {
    if (goals.includes('Reduce anxiety') || goals.includes('Manage stress')) {
      return 'mindfulness-coach';
    } else if (goals.includes('Manage depression') || goals.includes('Build confidence')) {
      return 'cbt-specialist';
    } else if (goals.includes('Work through trauma')) {
      return 'trauma-informed';
    } else if (goals.includes('Improve relationships') || goals.includes('Improve communication')) {
      return 'relationship-counselor';
    } else if (goals.includes('Find life purpose') || goals.includes('Develop coping skills')) {
      return 'solution-focused';
    }
    return 'holistic-wellness';
  };

  const handlePlanSelect = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    setSelectedPlan({ planId, billingCycle });
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(5);
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: user.id,
          goals,
          preferences,
          therapist_personality: selectedPersonality
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Welcome to MindfulAI!",
        description: "Your profile has been set up successfully. Let's begin your therapy journey.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "There was an issue completing your setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 2 && !selectedPersonality) {
      const autoSelected = autoSelectTherapist();
      setSelectedPersonality(autoSelected);
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipPayment = () => {
    setCurrentStep(5);
  };

  // Get selected plan details
  const getSelectedPlanDetails = () => {
    if (!selectedPlan) return null;
    const plan = plans.find(p => p.id === selectedPlan.planId);
    if (!plan) return null;
    
    const price = selectedPlan.billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
    return {
      name: plan.name,
      price: price,
      billingCycle: selectedPlan.billingCycle
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to MindfulAI</h1>
          <p className="text-muted-foreground">Let's personalize your therapy experience</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}% complete</span>
          </div>
          <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2" />
          <p className="text-center text-sm font-medium text-therapy-600">
            {STEPS[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <Card className="min-h-[500px]">
          <CardContent className="p-8">
            {currentStep === 0 && (
              <GoalsStep
                selectedGoals={goals}
                onGoalToggle={(goal) => {
                  setGoals(prev => 
                    prev.includes(goal) 
                      ? prev.filter(g => g !== goal)
                      : [...prev, goal]
                  );
                }}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 1 && (
              <PreferencesStep
                selectedPreferences={preferences}
                selectedGoals={goals}
                onPreferenceToggle={(preference) => {
                  setPreferences(prev => 
                    prev.includes(preference) 
                      ? prev.filter(p => p !== preference)
                      : [...prev, preference]
                  );
                }}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 2 && (
              <TherapistPersonalityStep
                selectedPersonality={selectedPersonality}
                selectedGoals={goals}
                selectedPreferences={preferences}
                onPersonalitySelect={setSelectedPersonality}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 3 && (
              <PlanSelectionStep
                selectedPlan={selectedPlan}
                onPlanSelect={handlePlanSelect}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
                  <p className="text-muted-foreground">
                    {selectedPlan?.planId ? 'Secure your subscription and start your journey' : 'You selected the free plan - no payment needed!'}
                  </p>
                </div>

                {selectedPlan?.planId && getSelectedPlanDetails() ? (
                  <StripeCheckout
                    planName={getSelectedPlanDetails()!.name}
                    planPrice={getSelectedPlanDetails()!.price}
                    billingCycle={getSelectedPlanDetails()!.billingCycle}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-lg">You're all set with the free plan!</p>
                    <Button onClick={skipPayment} size="lg">
                      Continue to Setup
                    </Button>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  {!selectedPlan?.planId && (
                    <Button onClick={skipPayment}>
                      Skip Payment
                    </Button>
                  )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your personalized therapy experience is ready. Let's start your journey toward better mental health.
                  </p>
                </div>

                <div className="bg-therapy-50 p-6 rounded-lg border border-therapy-200">
                  <h3 className="font-semibold mb-4">Your Setup Summary:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Goals:</strong> {goals.length} selected</p>
                    <p><strong>Preferences:</strong> {preferences.length} selected</p>
                    <p><strong>Therapist:</strong> {selectedPersonality ? 'Selected' : 'Default'}</p>
                    <p><strong>Plan:</strong> {selectedPlan ? 'Premium' : 'Free'}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                  >
                    {isLoading ? "Setting up..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
