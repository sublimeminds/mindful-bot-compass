
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <GradientLogo size="lg" className="drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-bold therapy-text-gradient">Welcome to TherapySync</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered mental wellness companion. We use advanced artificial intelligence 
          and evidence-based therapeutic approaches to provide personalized support on your 
          healing journey, available 24/7 in your preferred language and cultural context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-3 p-6 bg-therapy-50 rounded-lg border border-therapy-100">
          <Brain className="h-8 w-8 text-therapy-600" />
          <h3 className="font-semibold">Personalized AI Therapy</h3>
          <p className="text-sm text-muted-foreground text-center">
            Advanced AI therapists trained in evidence-based approaches, adapted to your cultural background
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3 p-6 bg-calm-50 rounded-lg border border-calm-100">
          <Target className="h-8 w-8 text-calm-600" />
          <h3 className="font-semibold">Targeted Treatment</h3>
          <p className="text-sm text-muted-foreground text-center">
            Custom therapy plans based on your specific needs, trauma history, and goals
          </p>
        </div>

        <div className="flex flex-col items-center space-y-3 p-6 bg-balance-50 rounded-lg border border-balance-100">
          <TrendingUp className="h-8 w-8 text-balance-600" />
          <h3 className="font-semibold">Progress Tracking</h3>
          <p className="text-sm text-muted-foreground text-center">
            Monitor your healing journey with advanced analytics and mood insights
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This comprehensive assessment will take about 10-15 minutes and helps us understand your 
          unique needs, cultural background, and therapy goals to create the most effective personalized plan.
        </p>
        <Button 
          onClick={onNext} 
          size="lg" 
          className="w-full max-w-md bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Begin Your Journey
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
