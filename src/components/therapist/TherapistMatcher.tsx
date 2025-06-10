
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTherapist } from '@/contexts/TherapistContext';
import { useToast } from '@/hooks/use-toast';
import TherapistAssessment from './TherapistAssessment';
import TherapistMatchResults from './TherapistMatchResults';
import { 
  TherapistMatchingService, 
  TherapistMatch, 
  AssessmentResponse 
} from '@/services/therapistMatchingService';

type MatcherStep = 'intro' | 'assessment' | 'results';

interface TherapistMatcherProps {
  onTherapistSelected?: (therapistId: string) => void;
  onClose?: () => void;
}

const TherapistMatcher: React.FC<TherapistMatcherProps> = ({ 
  onTherapistSelected,
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState<MatcherStep>('intro');
  const [matches, setMatches] = useState<TherapistMatch[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const { user } = useAuth();
  const { selectTherapist, therapists } = useTherapist();
  const { toast } = useToast();

  const handleStartAssessment = () => {
    setCurrentStep('assessment');
  };

  const handleAssessmentComplete = (calculatedMatches: TherapistMatch[], assessmentResponses: AssessmentResponse[]) => {
    setMatches(calculatedMatches);
    setResponses(assessmentResponses);
    setCurrentStep('results');
  };

  const handleTherapistSelect = async (therapistId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to select a therapist.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the therapist from the available therapists
      const selectedTherapist = therapists.find(t => t.id === therapistId);
      
      if (!selectedTherapist) {
        toast({
          title: "Error",
          description: "Selected therapist not found.",
          variant: "destructive",
        });
        return;
      }

      // Save the full assessment with selected therapist
      await TherapistMatchingService.saveAssessment(
        user.id,
        responses,
        matches,
        therapistId
      );

      // Update the therapist context with the therapist object
      selectTherapist(selectedTherapist);

      toast({
        title: "Therapist Selected",
        description: "Your therapist preference has been saved. You can now start personalized sessions!",
      });

      if (onTherapistSelected) {
        onTherapistSelected(therapistId);
      }
    } catch (error) {
      console.error('Error saving therapist selection:', error);
      toast({
        title: "Error",
        description: "Failed to save your selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetakeAssessment = () => {
    setCurrentStep('assessment');
    setMatches([]);
    setResponses([]);
  };

  const handleBack = () => {
    if (currentStep === 'assessment') {
      setCurrentStep('intro');
    } else if (currentStep === 'results') {
      setCurrentStep('assessment');
    }
  };

  if (currentStep === 'assessment') {
    return (
      <TherapistAssessment 
        onComplete={handleAssessmentComplete}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === 'results') {
    return (
      <TherapistMatchResults
        matches={matches}
        responses={responses}
        onSelectTherapist={handleTherapistSelect}
        onRetakeAssessment={handleRetakeAssessment}
      />
    );
  }

  // Intro step
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Find Your Perfect AI Therapist</CardTitle>
          <p className="text-muted-foreground">
            Take our personalized assessment to match with the AI therapist best suited for your needs
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-4 bg-therapy-50 rounded-lg">
              <Users className="h-5 w-5 text-therapy-600" />
              <div>
                <h4 className="font-medium">{therapists.length} Specialized AI Therapists</h4>
                <p className="text-sm text-muted-foreground">Each with unique approaches and specialties</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-calm-50 rounded-lg">
              <Brain className="h-5 w-5 text-calm-600" />
              <div>
                <h4 className="font-medium">Smart Matching Algorithm</h4>
                <p className="text-sm text-muted-foreground">Analyzes your needs, preferences, and goals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <ArrowRight className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium">Personalized Experience</h4>
                <p className="text-sm text-muted-foreground">Get therapy tailored to your communication style</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What to expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 7 quick questions about your needs and preferences</li>
              <li>• Personalized therapist recommendations with compatibility scores</li>
              <li>• Detailed explanations of why each therapist suits you</li>
              <li>• Option to switch therapists anytime</li>
            </ul>
          </div>

          <Button 
            onClick={handleStartAssessment}
            className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
            size="lg"
          >
            Start Assessment
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {onClose && (
            <Button variant="outline" onClick={onClose} className="w-full">
              Maybe Later
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistMatcher;
