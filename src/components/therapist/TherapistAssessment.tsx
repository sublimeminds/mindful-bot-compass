
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { 
  TherapistMatchingService, 
  assessmentQuestions, 
  AssessmentResponse,
  TherapistMatch
} from '@/services/therapistMatchingService';

interface TherapistAssessmentProps {
  onComplete: (matches: TherapistMatch[], responses: AssessmentResponse[]) => void;
  onBack?: () => void;
}

const TherapistAssessment: React.FC<TherapistAssessmentProps> = ({ onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const getCurrentResponse = () => {
    return responses.find(r => r.questionId === currentQuestion.id);
  };

  const updateResponse = (value: number | string | string[]) => {
    setResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== currentQuestion.id);
      return [...filtered, { questionId: currentQuestion.id, value }];
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate matches
      setIsCalculating(true);
      try {
        const matches = await TherapistMatchingService.calculateMatches(responses);
        onComplete(matches, responses);
      } catch (error) {
        console.error('Error calculating matches:', error);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const canProceed = () => {
    const response = getCurrentResponse();
    return response && response.value !== undefined && response.value !== '';
  };

  const renderQuestionInput = () => {
    const currentResponse = getCurrentResponse();

    switch (currentQuestion.type) {
      case 'scale':
        const scaleValue = (currentResponse?.value as number) || 5;
        return (
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={[scaleValue]}
                onValueChange={(value) => updateResponse(value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-4">
              <span>1 - Very Low</span>
              <span className="font-medium">Current: {scaleValue}</span>
              <span>10 - Very High</span>
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={currentResponse?.value as string || ''}
            onValueChange={updateResponse}
          >
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multi_select':
        const selectedValues = (currentResponse?.value as string[]) || [];
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateResponse([...selectedValues, option]);
                    } else {
                      updateResponse(selectedValues.filter(v => v !== option));
                    }
                  }}
                />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handlePrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentQuestionIndex === 0 ? 'Back' : 'Previous'}
            </Button>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
            </span>
          </div>
          
          <Progress value={progress} className="mb-4" />
          
          <CardTitle className="text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderQuestionInput()}

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || isCalculating}
              className="min-w-[120px]"
            >
              {isCalculating ? (
                'Calculating...'
              ) : currentQuestionIndex === assessmentQuestions.length - 1 ? (
                'Find My Match'
              ) : (
                <>
                  Next
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

export default TherapistAssessment;
