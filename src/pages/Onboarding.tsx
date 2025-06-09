import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  goals: string[];
  concerns: string[];
  experience: string;
  preferences: string[];
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    concerns: [],
    experience: '',
    preferences: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 4;

  const goalOptions = [
    'Manage anxiety and stress',
    'Process trauma and difficult experiences',
    'Improve relationships',
    'Build self-confidence',
    'Develop coping strategies',
    'Work through depression',
    'Handle grief and loss',
    'Improve emotional regulation'
  ];

  const concernOptions = [
    'Panic attacks',
    'Sleep problems',
    'Relationship conflicts',
    'Work stress',
    'Family issues',
    'Self-esteem',
    'Anger management',
    'Social anxiety'
  ];

  const experienceOptions = [
    'This is my first time seeking therapy',
    'I\'ve tried therapy before',
    'I\'m currently seeing a therapist',
    'I prefer self-help approaches'
  ];

  const preferenceOptions = [
    'Gentle and supportive approach',
    'Direct and solution-focused',
    'Cognitive behavioral techniques',
    'Mindfulness and meditation',
    'Creative and expressive methods',
    'Goal-oriented sessions'
  ];

  const toggleSelection = (category: keyof OnboardingData, option: string) => {
    setData(prev => ({
      ...prev,
      [category]: Array.isArray(prev[category])
        ? (prev[category] as string[]).includes(option)
          ? (prev[category] as string[]).filter(item => item !== option)
          : [...(prev[category] as string[]), option]
        : option
    }));
  };

  const saveOnboardingData = async () => {
    if (!user) return false;

    try {
      // Save onboarding data to database
      const { error: onboardingError } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: user.id,
          goals: data.goals,
          concerns: data.concerns,
          experience: data.experience,
          preferences: data.preferences
        });

      if (onboardingError) {
        console.error('Error saving onboarding data:', onboardingError);
        toast({
          title: "Error",
          description: "Failed to save your preferences. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Mark onboarding as complete
      await updateProfile({ onboarding_complete: true });
      
      return true;
    } catch (error) {
      console.error('Error in saveOnboardingData:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setIsLoading(true);
      const success = await saveOnboardingData();
      
      if (success) {
        toast({
          title: "Welcome to MindfulAI!",
          description: "Your preferences have been saved. Let's start your first session.",
        });
        navigate('/');
      }
      
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.goals.length > 0;
      case 2:
        return data.concerns.length > 0;
      case 3:
        return data.experience !== '';
      case 4:
        return data.preferences.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">What are your therapy goals?</h2>
              <p className="text-muted-foreground">Select all that apply to help us personalize your experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <Button
                  key={goal}
                  variant={data.goals.includes(goal) ? "default" : "outline"}
                  className={`h-auto p-4 text-left justify-start ${
                    data.goals.includes(goal) 
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white' 
                      : 'hover:bg-therapy-50'
                  }`}
                  onClick={() => toggleSelection('goals', goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">What concerns bring you here?</h2>
              <p className="text-muted-foreground">Help us understand what you'd like to work on</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {concernOptions.map((concern) => (
                <Button
                  key={concern}
                  variant={data.concerns.includes(concern) ? "default" : "outline"}
                  className={`h-auto p-4 text-left justify-start ${
                    data.concerns.includes(concern) 
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white' 
                      : 'hover:bg-therapy-50'
                  }`}
                  onClick={() => toggleSelection('concerns', concern)}
                >
                  {concern}
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">What's your therapy experience?</h2>
              <p className="text-muted-foreground">This helps us adjust our approach for you</p>
            </div>
            <div className="space-y-3">
              {experienceOptions.map((experience) => (
                <Button
                  key={experience}
                  variant={data.experience === experience ? "default" : "outline"}
                  className={`w-full h-auto p-4 text-left justify-start ${
                    data.experience === experience 
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white' 
                      : 'hover:bg-therapy-50'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, experience }))}
                >
                  {experience}
                </Button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">How do you prefer to work?</h2>
              <p className="text-muted-foreground">Select approaches that resonate with you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {preferenceOptions.map((preference) => (
                <Button
                  key={preference}
                  variant={data.preferences.includes(preference) ? "default" : "outline"}
                  className={`h-auto p-4 text-left justify-start ${
                    data.preferences.includes(preference) 
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white' 
                      : 'hover:bg-therapy-50'
                  }`}
                  onClick={() => toggleSelection('preferences', preference)}
                >
                  {preference}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to MindfulAI</h1>
          <p className="text-muted-foreground">Let's personalize your therapy experience</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 flex items-center space-x-2"
          >
            <span>{isLoading ? 'Saving...' : currentStep === totalSteps ? 'Start Therapy' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
