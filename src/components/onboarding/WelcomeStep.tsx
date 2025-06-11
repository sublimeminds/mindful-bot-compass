
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Target, TrendingUp } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full">
            <Heart className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Welcome to MindfulAI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personalized AI therapy companion designed to support your mental wellness journey with evidence-based approaches and compassionate care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-3 p-6 bg-therapy-50 rounded-lg">
          <Brain className="h-8 w-8 text-therapy-600" />
          <h3 className="font-semibold">AI-Powered Therapy</h3>
          <p className="text-sm text-muted-foreground text-center">
            Advanced AI therapists trained in various therapeutic approaches
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3 p-6 bg-calm-50 rounded-lg">
          <Target className="h-8 w-8 text-calm-600" />
          <h3 className="font-semibold">Personalized Goals</h3>
          <p className="text-sm text-muted-foreground text-center">
            Set and track meaningful mental health goals
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3 p-6 bg-focus-50 rounded-lg">
          <TrendingUp className="h-8 w-8 text-focus-600" />
          <h3 className="font-semibold">Progress Tracking</h3>
          <p className="text-sm text-muted-foreground text-center">
            Monitor your mood and mental health improvements
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This setup will take about 5 minutes and will help us personalize your therapy experience.
        </p>
        <Button onClick={onNext} size="lg" className="w-full max-w-md">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
