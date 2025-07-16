import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from '@/components/ui/button';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { Brain, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isComplete, hasActiveTherapyPlan, isLoading, planCreationInProgress } = useOnboardingStatus();
  
  // Allow access to essential pages without therapy plan requirement
  const currentPath = window.location.pathname;
  const allowedPaths = [
    '/notifications',
    '/settings', 
    '/voice-settings',
    '/profile',
    '/account-billing',
    '/billing',
    '/subscription',
    '/integrations'
  ];
  
  if (allowedPaths.some(path => currentPath.startsWith(path))) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show therapy plan creation in progress
  if (isComplete && planCreationInProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
        {/* Blurred background */}
        <div className="absolute inset-0 blur-sm opacity-50">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-therapy-600 animate-bounce" />
                  </div>
                </div>
                <Sparkles className="h-6 w-6 text-therapy-500 mx-auto mb-2 animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold text-therapy-900 mb-3">
                Creating Your Therapy Plan
              </h2>
              <p className="text-muted-foreground mb-6">
                Our AI is analyzing your onboarding data and creating a personalized therapy plan tailored to your needs. This usually takes 1-2 minutes.
              </p>
              
              <div className="flex items-center justify-center text-sm text-therapy-600 mb-6">
                <Clock className="h-4 w-4 mr-2" />
                <span>Estimated time: 2 minutes</span>
              </div>
              
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center text-therapy-700">
                  <div className="w-2 h-2 bg-therapy-500 rounded-full mr-3 animate-pulse"></div>
                  Analyzing your preferences and goals
                </div>
                <div className="flex items-center text-therapy-700">
                  <div className="w-2 h-2 bg-therapy-500 rounded-full mr-3 animate-pulse"></div>
                  Matching with optimal AI therapists
                </div>
                <div className="flex items-center text-therapy-700">
                  <div className="w-2 h-2 bg-therapy-500 rounded-full mr-3 animate-pulse"></div>
                  Customizing therapy techniques
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show onboarding incomplete overlay
  if (!isComplete || !hasActiveTherapyPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
        {/* Blurred background */}
        <div className="absolute inset-0 blur-sm opacity-30">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-therapy-900 mb-3">
                Complete Your Setup
              </h2>
              <p className="text-muted-foreground mb-6">
                {!isComplete 
                  ? "Complete your onboarding to unlock your personalized dashboard and access AI-powered therapy sessions."
                  : "Create your first therapy plan to access your personalized dashboard."
                }
              </p>
              
              <div className="space-y-3 mb-6">
                <GradientButton 
                  onClick={() => navigate('/onboarding')}
                  className="w-full"
                  size="lg"
                >
                  {!isComplete ? 'Complete Onboarding' : 'Create Therapy Plan'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </GradientButton>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                This ensures the best possible personalized experience for your mental wellness journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show full dashboard if everything is complete
  return <>{children}</>;
};

export default OnboardingGuard;