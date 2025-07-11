import React from 'react';
import { useNavigate } from 'react-router-dom';
import TherapistAssessment from '@/components/therapist/TherapistAssessment';
import { TherapistMatchingService, TherapistMatch, AssessmentResponse } from '@/services/therapistMatchingService';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const TherapistAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSimpleApp();
  const { toast } = useToast();

  const handleAssessmentComplete = async (matches: TherapistMatch[], responses: AssessmentResponse[]) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your assessment.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save the assessment
      const assessmentId = await TherapistMatchingService.saveAssessment(user.id, responses, matches);
      
      if (assessmentId) {
        toast({
          title: "Assessment Complete",
          description: "Your therapist matches have been saved successfully."
        });
        
        // Navigate to therapist selection with results
        navigate('/therapist-selection', { 
          state: { 
            assessmentCompleted: true, 
            matches,
            assessmentId 
          } 
        });
      } else {
        throw new Error('Failed to save assessment');
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Save Error",
        description: "There was an error saving your assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    navigate('/therapist-discovery');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
      <div className="container mx-auto px-4 py-8">
        <TherapistAssessment 
          onComplete={handleAssessmentComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default TherapistAssessmentPage;