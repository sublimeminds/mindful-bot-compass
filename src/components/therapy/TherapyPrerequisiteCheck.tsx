import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, User, Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import { TherapistSelectionService } from '@/services/therapistSelectionService';
import { supabase } from '@/integrations/supabase/client';

interface PrerequisiteStatus {
  hasOnboarding: boolean;
  hasTherapistAssessment: boolean;
  hasTherapistSelection: boolean;
  hasTherapyPlan: boolean;
  loading: boolean;
}

interface TherapyPrerequisiteCheckProps {
  onAllPrerequisitesMet: () => void;
}

const TherapyPrerequisiteCheck = ({ onAllPrerequisitesMet }: TherapyPrerequisiteCheckProps) => {
  const { user } = useSimpleApp();
  const { onboardingData, isLoading: onboardingLoading } = useOnboardingData();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<PrerequisiteStatus>({
    hasOnboarding: false,
    hasTherapistAssessment: false,
    hasTherapistSelection: false,
    hasTherapyPlan: false,
    loading: true
  });

  useEffect(() => {
    if (user && !onboardingLoading) {
      checkPrerequisites();
    }
  }, [user, onboardingLoading, onboardingData]);

  const checkPrerequisites = async () => {
    if (!user) return;

    try {
      // Check onboarding completion
      const hasOnboarding = !!onboardingData && 
        onboardingData.goals.length > 0 && 
        onboardingData.preferences.length > 0;

      // Check for therapist assessment (using assessment_matches table)
      const { data: assessmentMatches } = await supabase
        .from('assessment_matches')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasTherapistAssessment = assessmentMatches && assessmentMatches.length > 0;

      // Check for active therapist selection
      const therapistSelection = await TherapistSelectionService.getCurrentSelection(user.id);
      const hasTherapistSelection = !!therapistSelection;

      // Check for adaptive therapy plan
      const { data: therapyPlan } = await supabase
        .from('adaptive_therapy_plans')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasTherapyPlan = therapyPlan && therapyPlan.length > 0;

      const newStatus = {
        hasOnboarding,
        hasTherapistAssessment,
        hasTherapistSelection,
        hasTherapyPlan,
        loading: false
      };

      setStatus(newStatus);

      // If all prerequisites are met, notify parent
      if (hasOnboarding && hasTherapistAssessment && hasTherapistSelection && hasTherapyPlan) {
        onAllPrerequisitesMet();
      }
    } catch (error) {
      console.error('Error checking prerequisites:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleStartOnboarding = () => {
    navigate('/enhanced-onboarding');
  };

  const handleStartAssessment = () => {
    navigate('/therapist-discovery');
  };

  const handleSelectTherapist = () => {
    navigate('/therapist-selection');
  };

  const handleCreateTherapyPlan = async () => {
    if (!user || !status.hasTherapistSelection) return;
    
    try {
      // Generate therapy plan based on onboarding data and therapist selection
      const therapistSelection = await TherapistSelectionService.getCurrentSelection(user.id);
      
      const { data, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId: user.id,
          therapistId: therapistSelection?.therapist_id,
          onboardingData,
          assessmentData: {} // Will be populated from assessment results
        }
      });

      if (error) {
        console.error('Error creating therapy plan:', error);
        return;
      }

      // Refresh prerequisites check
      await checkPrerequisites();
    } catch (error) {
      console.error('Error creating therapy plan:', error);
    }
  };

  if (status.loading || onboardingLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking your therapy setup...</p>
        </div>
      </div>
    );
  }

  const allMet = status.hasOnboarding && status.hasTherapistAssessment && 
                status.hasTherapistSelection && status.hasTherapyPlan;

  if (allMet) {
    return null; // Prerequisites met, don't render
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          To start your therapy session, we need to complete your personalized setup first.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-therapy-600" />
            Therapy Setup Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Onboarding Step */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {status.hasOnboarding ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
              <div>
                <h4 className="font-medium">Personal Onboarding</h4>
                <p className="text-sm text-muted-foreground">
                  Share your goals and preferences for personalized care
                </p>
              </div>
            </div>
            {!status.hasOnboarding && (
              <Button onClick={handleStartOnboarding} variant="outline">
                Start Onboarding
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Assessment Step */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {status.hasTherapistAssessment ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
              <div>
                <h4 className="font-medium">Therapist Matching Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Complete a quick assessment to find your ideal therapist match
                </p>
              </div>
            </div>
            {!status.hasTherapistAssessment && status.hasOnboarding && (
              <Button onClick={handleStartAssessment} variant="outline">
                Take Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Therapist Selection Step */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {status.hasTherapistSelection ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
              <div>
                <h4 className="font-medium">Select Your Therapist</h4>
                <p className="text-sm text-muted-foreground">
                  Choose from your matched therapist recommendations
                </p>
              </div>
            </div>
            {!status.hasTherapistSelection && status.hasTherapistAssessment && (
              <Button onClick={handleSelectTherapist} variant="outline">
                Select Therapist
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Therapy Plan Step */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {status.hasTherapyPlan ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
              <div>
                <h4 className="font-medium">Adaptive Therapy Plan</h4>
                <p className="text-sm text-muted-foreground">
                  Generate your personalized therapy plan based on your profile
                </p>
              </div>
            </div>
            {!status.hasTherapyPlan && status.hasTherapistSelection && (
              <Button onClick={handleCreateTherapyPlan} variant="outline">
                Create Plan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>This personalized setup ensures you get the most effective therapy experience tailored to your needs.</p>
      </div>
    </div>
  );
};

export default TherapyPrerequisiteCheck;