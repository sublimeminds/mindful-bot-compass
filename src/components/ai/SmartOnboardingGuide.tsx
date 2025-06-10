
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Brain, Target, MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTherapist } from '@/contexts/TherapistContext';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import TherapistMatcher from '@/components/therapist/TherapistMatcher';

const SmartOnboardingGuide = () => {
  const { user } = useAuth();
  const { currentTherapist } = useTherapist();
  const { onboardingData, isLoading } = useOnboardingData();
  const [showTherapistMatcher, setShowTherapistMatcher] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Determine onboarding status
  const hasBasicInfo = onboardingData?.goals && onboardingData.goals.length > 0;
  const hasTherapist = !!currentTherapist;
  const isOnboardingComplete = hasBasicInfo && hasTherapist;

  useEffect(() => {
    // Show guide if user is authenticated but hasn't completed onboarding
    if (user && !isLoading && !isOnboardingComplete) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user, isLoading, isOnboardingComplete]);

  const handleTherapistSelected = () => {
    setShowTherapistMatcher(false);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || isLoading) {
    return null;
  }

  if (showTherapistMatcher) {
    return (
      <div className="mb-8">
        <TherapistMatcher 
          onTherapistSelected={handleTherapistSelected}
          onClose={() => setShowTherapistMatcher(false)}
        />
      </div>
    );
  }

  const progress = hasBasicInfo && hasTherapist ? 100 : hasBasicInfo ? 50 : 0;

  return (
    <Card className="mb-8 border-therapy-200 bg-gradient-to-r from-therapy-50 to-calm-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <CardTitle className="text-lg">Complete Your Personalized Setup</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {/* Basic Onboarding Step */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50">
            {hasBasicInfo ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Target className="h-5 w-5 text-therapy-600" />
            )}
            <div className="flex-1">
              <h4 className="font-medium">Set Your Goals & Preferences</h4>
              <p className="text-sm text-muted-foreground">
                {hasBasicInfo 
                  ? "✓ Goals and preferences configured" 
                  : "Define what you want to achieve in therapy"
                }
              </p>
            </div>
            {hasBasicInfo && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            )}
          </div>

          {/* Therapist Matching Step */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50">
            {hasTherapist ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <MessageCircle className="h-5 w-5 text-therapy-600" />
            )}
            <div className="flex-1">
              <h4 className="font-medium">Find Your AI Therapist</h4>
              <p className="text-sm text-muted-foreground">
                {hasTherapist 
                  ? `✓ Matched with ${currentTherapist.name}` 
                  : "Take our assessment to find your perfect therapeutic match"
                }
              </p>
            </div>
            {hasTherapist ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            ) : (
              <Button 
                size="sm" 
                onClick={() => setShowTherapistMatcher(true)}
                className="bg-therapy-600 hover:bg-therapy-700"
              >
                Start Assessment
              </Button>
            )}
          </div>
        </div>

        {!hasTherapist && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Ready to find your therapist?</p>
                <p className="text-xs text-muted-foreground">
                  Takes 2-3 minutes • Get personalized recommendations
                </p>
              </div>
              <Button 
                onClick={() => setShowTherapistMatcher(true)}
                className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
              >
                Find My Therapist
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartOnboardingGuide;
