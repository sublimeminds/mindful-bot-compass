
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, ArrowRight, Brain, Heart, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SmartOnboardingGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to TherapySync',
      description: 'Your AI-powered wellness companion is here to support your mental wellness journey.',
      icon: Brain,
      action: 'Get Started',
      path: null
    },
    {
      id: 'first-session',
      title: 'Start Your First Session',
      description: 'Begin with a conversation to help our AI understand your needs.',
      icon: Heart,
      action: 'Start Session',
      path: '/chat'
    },
    {
      id: 'set-goals',
      title: 'Set Your Goals',
      description: 'Define what you want to achieve in your wellness journey.',
      icon: Target,
      action: 'Set Goals',
      path: '/goals'
    }
  ];

  useEffect(() => {
    // Check if user is new (you could check this from user profile or localStorage)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && user) {
      setIsVisible(true);
    }
  },
[user]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleActionClick = () => {
    const step = onboardingSteps[currentStep];
    if (step.path) {
      navigate(step.path);
      handleComplete();
    } else {
      handleNext();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
  };

  if (!isVisible || !user) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Icon className="h-5 w-5 mr-2 text-harmony-600" />
              {currentStepData.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{currentStepData.description}</p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleActionClick}
              className="flex-1"
            >
              {currentStepData.action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComplete}
            className="w-full text-muted-foreground"
          >
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartOnboardingGuide;
