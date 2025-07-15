import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Brain, Users, Globe, Target, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CompletionStepProps {
  onNext: (data?: any) => void;
  onboardingData?: any;
}

const CompletionStep = ({ onNext, onboardingData }: CompletionStepProps) => {
  const { t } = useTranslation();

  const getSummaryData = () => {
    const summary = {
      focusAreas: onboardingData?.specificProblems || [],
      culturalBackground: onboardingData?.culturalPreferences?.culturalBackground || 'Not specified',
      selectedTherapist: onboardingData?.selectedPersonality || 'AI-matched therapist',
      selectedPlan: onboardingData?.selectedPlan?.name || 'Essential Plan',
      goals: onboardingData?.therapyGoals || 'Personal growth and wellness'
    };
    return summary;
  };

  const summary = getSummaryData();

  const handleComplete = () => {
    const completionData = {
      completedAt: new Date().toISOString(),
      onboardingVersion: '2.0',
      summary
    };
    onNext(completionData);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2 therapy-text-gradient">
          {t('onboarding.completion.title', 'Welcome to TherapySync!')}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t('onboarding.completion.subtitle', 'Your personalized therapy journey is ready to begin')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Focus Areas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="h-5 w-5 text-therapy-600" />
              <span>Focus Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {summary.focusAreas.length > 0 ? (
                summary.focusAreas.map((area: string) => (
                  <Badge key={area} variant="secondary" className="capitalize">
                    {area.replace('_', ' ')}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">General wellness</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Background */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Globe className="h-5 w-5 text-harmony-600" />
              <span>Cultural Context</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {summary.culturalBackground || 'Culturally-sensitive approach'}
            </p>
          </CardContent>
        </Card>

        {/* Selected Therapist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Users className="h-5 w-5 text-flow-600" />
              <span>Your Therapist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {summary.selectedTherapist}
            </p>
          </CardContent>
        </Card>

        {/* Selected Plan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Heart className="h-5 w-5 text-therapy-600" />
              <span>Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {summary.selectedPlan}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>Your Therapy Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.goals}
          </p>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className="bg-gradient-to-r from-therapy-50 to-harmony-50 border-therapy-200">
        <CardHeader>
          <CardTitle className="text-therapy-700">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-therapy-600 mt-0.5" />
            <div>
              <p className="font-medium text-therapy-700">Your therapy plan is being created</p>
              <p className="text-sm text-therapy-600">AI is customizing your treatment approach based on your responses</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-therapy-600 mt-0.5" />
            <div>
              <p className="font-medium text-therapy-700">Dashboard access</p>
              <p className="text-sm text-therapy-600">Track your progress, schedule sessions, and access resources</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-therapy-600 mt-0.5" />
            <div>
              <p className="font-medium text-therapy-700">Start your first session</p>
              <p className="text-sm text-therapy-600">Begin your healing journey with personalized guidance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <GradientButton 
          onClick={handleComplete}
          size="lg"
          className="w-full max-w-md"
        >
          {t('onboarding.completion.completeSetup', 'Complete Setup & Continue')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </GradientButton>
        <p className="text-sm text-muted-foreground mt-3">
          You'll be redirected to your dashboard
        </p>
      </div>
    </div>
  );
};

export default CompletionStep;