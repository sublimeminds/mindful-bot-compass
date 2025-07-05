
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ArrowRight, ArrowLeft, CheckCircle, Lightbulb } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: string;
  illustration?: string;
}

interface InteractiveTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
  tutorialKey: string;
}

const InteractiveTutorial = ({ steps, onComplete, onSkip, tutorialKey }: InteractiveTutorialProps) => {
  const { user } = useSimpleApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already completed this tutorial
    const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
    if (completedTutorials[tutorialKey]) {
      setIsVisible(false);
    }
  }, [tutorialKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
    completedTutorials[tutorialKey] = true;
    localStorage.setItem('completedTutorials', JSON.stringify(completedTutorials));
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
    completedTutorials[tutorialKey] = 'skipped';
    localStorage.setItem('completedTutorials', JSON.stringify(completedTutorials));
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible || !user) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-therapy-600" />
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Progress value={progress} className="mb-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            <p className="text-muted-foreground">{currentStepData.description}</p>

            {currentStepData.illustration && (
              <div className="bg-therapy-50 rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">{currentStepData.illustration}</div>
              </div>
            )}

            {currentStepData.action && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Try it:</strong> {currentStepData.action}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTutorial;
