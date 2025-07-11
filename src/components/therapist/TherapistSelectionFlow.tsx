import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Heart, Brain, Target } from 'lucide-react';
import { TherapistSelectionService } from '@/services/therapistSelectionService';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import SimpleFavoriteButton from './SimpleFavoriteButton';

interface TherapistSelectionFlowProps {
  selectedTherapist: any;
  assessmentId?: string;
  onComplete?: () => void;
  onBack?: () => void;
}

const TherapistSelectionFlow: React.FC<TherapistSelectionFlowProps> = ({
  selectedTherapist,
  assessmentId,
  onComplete,
  onBack
}) => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectionReason, setSelectionReason] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmSelection = async () => {
    if (!user?.id || !selectedTherapist) return;

    setIsConfirming(true);

    try {
      const selectionId = await TherapistSelectionService.selectTherapist(
        user.id,
        selectedTherapist.id,
        assessmentId,
        selectionReason
      );

      if (selectionId) {
        toast({
          title: "Therapist Selected!",
          description: `You've successfully selected ${selectedTherapist.name} as your therapist.`
        });

        // Navigate to dashboard or chat
        navigate('/dashboard', { 
          state: { 
            selectedTherapist: selectedTherapist,
            justSelected: true 
          } 
        });

        onComplete?.();
      } else {
        throw new Error('Failed to save selection');
      }
    } catch (error) {
      console.error('Error confirming selection:', error);
      toast({
        title: "Selection Error",
        description: "There was an error selecting your therapist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  if (!selectedTherapist) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No therapist selected</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
            Confirm Your Therapist Selection
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Selected Therapist Overview */}
          <div className="bg-gradient-to-r from-therapy-50/50 to-calm-50/50 p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-therapy-900">{selectedTherapist.name}</h3>
                <p className="text-therapy-700 font-medium">{selectedTherapist.title}</p>
                <p className="text-muted-foreground mt-2">{selectedTherapist.description}</p>
              </div>
              <SimpleFavoriteButton 
                therapistId={selectedTherapist.id}
                therapistName={selectedTherapist.name}
                size="sm"
                variant="ghost"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-5 w-5 text-therapy-600 mr-1" />
                  <span className="font-semibold text-therapy-900">Approach</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedTherapist.approach}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-therapy-600 mr-1" />
                  <span className="font-semibold text-therapy-900">Experience</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedTherapist.yearsExperience} years</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-therapy-600 mr-1" />
                  <span className="font-semibold text-therapy-900">Rating</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedTherapist.userSatisfaction?.toFixed(1)}/5.0</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-therapy-900">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTherapist.specialties?.map((specialty: string) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Selection Reason */}
          <div className="space-y-3">
            <label htmlFor="selection-reason" className="text-sm font-medium text-foreground">
              Why did you choose this therapist? (Optional)
            </label>
            <Textarea
              id="selection-reason"
              placeholder="Share what made you choose this therapist - this helps us improve our recommendations..."
              value={selectionReason}
              onChange={(e) => setSelectionReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll be taken to your personalized dashboard</li>
              <li>• Start your first therapy chat session</li>
              <li>• Your therapist will remember all our conversations</li>
              <li>• Access 24/7 support and crisis resources</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Choose Different Therapist
            </Button>
            
            <Button 
              onClick={handleConfirmSelection}
              disabled={isConfirming}
              className="bg-therapy-600 hover:bg-therapy-700"
            >
              {isConfirming ? (
                'Confirming Selection...'
              ) : (
                <>
                  Start Therapy Journey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistSelectionFlow;