
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Star, 
  Target, 
  Brain,
  Heart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route?: string;
  action?: () => void;
  completed?: boolean;
  points: number;
}

const SmartOnboardingGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about yourself to personalize your experience',
      icon: Heart,
      route: '/profile',
      points: 10
    },
    {
      id: 'first-session',
      title: 'Start Your First Session',
      description: 'Begin your therapy journey with our AI therapist',
      icon: Brain,
      route: '/chat',
      points: 20
    },
    {
      id: 'mood-tracking',
      title: 'Track Your Mood',
      description: 'Log your first mood entry to start building insights',
      icon: Star,
      route: '/mood',
      points: 15
    },
    {
      id: 'set-goals',
      title: 'Set Your Goals',
      description: 'Define what you want to achieve in your mental health journey',
      icon: Target,
      route: '/goals',
      points: 15
    },
    {
      id: 'explore-techniques',
      title: 'Explore Techniques',
      description: 'Discover coping strategies and mindfulness exercises',
      icon: Sparkles,
      route: '/techniques',
      points: 10
    }
  ];

  useEffect(() => {
    // Load completed steps from localStorage
    const saved = localStorage.getItem(`onboarding_${user?.id}`);
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, [user?.id]);

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const updated = [...completedSteps, stepId];
      setCompletedSteps(updated);
      localStorage.setItem(`onboarding_${user?.id}`, JSON.stringify(updated));
    }
  };

  const handleStepClick = (step: OnboardingStep) => {
    if (step.route) {
      navigate(step.route);
    }
    if (step.action) {
      step.action();
    }
    markStepCompleted(step.id);
  };

  const totalPoints = onboardingSteps.reduce((sum, step) => sum + step.points, 0);
  const earnedPoints = onboardingSteps
    .filter(step => completedSteps.includes(step.id))
    .reduce((sum, step) => sum + step.points, 0);
  const progress = (earnedPoints / totalPoints) * 100;

  const isCompleted = completedSteps.length === onboardingSteps.length;

  if (isCompleted) {
    return null; // Hide guide when completed
  }

  return (
    <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span>Welcome to MindfulAI</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete these steps to get the most out of your therapy experience
            </p>
          </div>
          <Badge variant="secondary">
            {earnedPoints}/{totalPoints} points
          </Badge>
        </div>
        <Progress value={progress} className="mt-3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {onboardingSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStep && !isCompleted;
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  isCurrent 
                    ? 'bg-blue-100 border border-blue-300' 
                    : isCompleted
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleStepClick(step)}
              >
                <div className={`p-2 rounded-full ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${isCompleted ? 'text-green-700' : ''}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    +{step.points} pts
                  </Badge>
                  {!isCompleted && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {progress > 0 && progress < 100 && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Great progress! You're {Math.round(progress)}% through your setup.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Complete all steps to unlock advanced features and personalized recommendations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartOnboardingGuide;
