
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ScreeningResponse {
  [key: string]: number;
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  questions: {
    id: string;
    text: string;
    options: { value: number; label: string }[];
  }[];
  interpretation: (score: number) => {
    level: string;
    description: string;
    recommendations: string[];
  };
}

interface MentalHealthScreeningStepProps {
  onNext: () => void;
  onBack: () => void;
}

const MentalHealthScreeningStep = ({ onNext, onBack }: MentalHealthScreeningStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(0);
  const [responses, setResponses] = useState<{ [assessmentId: string]: ScreeningResponse }>({});
  const [scores, setScores] = useState<{ [assessmentId: string]: number }>({});

  // PHQ-9 Depression Screening
  const phq9: Assessment = {
    id: 'PHQ-9',
    name: 'Depression Screening (PHQ-9)',
    description: 'This questionnaire helps identify symptoms of depression.',
    questions: [
      {
        id: 'phq9_1',
        text: 'Little interest or pleasure in doing things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'phq9_2',
        text: 'Feeling down, depressed, or hopeless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'phq9_3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'phq9_4',
        text: 'Feeling tired or having little energy',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'phq9_5',
        text: 'Poor appetite or overeating',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ],
    interpretation: (score: number) => {
      if (score <= 4) return {
        level: 'Minimal',
        description: 'Minimal or no depression symptoms',
        recommendations: ['Continue with regular self-care', 'Monitor mood changes']
      };
      if (score <= 9) return {
        level: 'Mild',
        description: 'Mild depression symptoms',
        recommendations: ['Regular therapy sessions', 'Mood tracking', 'Exercise and lifestyle changes']
      };
      if (score <= 14) return {
        level: 'Moderate',
        description: 'Moderate depression symptoms',
        recommendations: ['Regular therapy sessions', 'Consider medication evaluation', 'Strong support system']
      };
      return {
        level: 'Severe',
        description: 'Severe depression symptoms',
        recommendations: ['Immediate professional help', 'Medication evaluation', 'Intensive therapy', 'Crisis support plan']
      };
    }
  };

  // GAD-7 Anxiety Screening
  const gad7: Assessment = {
    id: 'GAD-7',
    name: 'Anxiety Screening (GAD-7)',
    description: 'This questionnaire helps identify symptoms of anxiety.',
    questions: [
      {
        id: 'gad7_1',
        text: 'Feeling nervous, anxious, or on edge',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'gad7_2',
        text: 'Not being able to stop or control worrying',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'gad7_3',
        text: 'Worrying too much about different things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'gad7_4',
        text: 'Trouble relaxing',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 'gad7_5',
        text: 'Being so restless that it is hard to sit still',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ],
    interpretation: (score: number) => {
      if (score <= 4) return {
        level: 'Minimal',
        description: 'Minimal or no anxiety symptoms',
        recommendations: ['Continue with regular self-care', 'Practice relaxation techniques']
      };
      if (score <= 9) return {
        level: 'Mild',
        description: 'Mild anxiety symptoms',
        recommendations: ['Therapy sessions', 'Anxiety management techniques', 'Regular exercise']
      };
      if (score <= 14) return {
        level: 'Moderate',
        description: 'Moderate anxiety symptoms',
        recommendations: ['Regular therapy', 'Consider medication evaluation', 'Stress management programs']
      };
      return {
        level: 'Severe',
        description: 'Severe anxiety symptoms',
        recommendations: ['Immediate professional help', 'Medication evaluation', 'Intensive therapy', 'Crisis management plan']
      };
    }
  };

  const assessments = [phq9, gad7];
  const currentAssess = assessments[currentAssessment];

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [currentAssess.id]: {
        ...prev[currentAssess.id],
        [questionId]: value
      }
    }));
  };

  const calculateScore = (assessmentId: string) => {
    const assessmentResponses = responses[assessmentId] || {};
    return Object.values(assessmentResponses).reduce((sum, score) => sum + score, 0);
  };

  const handleNext = () => {
    const score = calculateScore(currentAssess.id);
    setScores(prev => ({ ...prev, [currentAssess.id]: score }));

    if (currentAssessment < assessments.length - 1) {
      setCurrentAssessment(currentAssessment + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save all assessment results
      for (const assessment of assessments) {
        const score = scores[assessment.id] || calculateScore(assessment.id);
        const interpretation = assessment.interpretation(score);

        await supabase
          .from('mental_health_assessments')
          .insert({
            user_id: user.id,
            assessment_type: assessment.id,
            responses: responses[assessment.id] || {},
            total_score: score,
            severity_level: interpretation.level,
            interpretation: interpretation.description,
            recommendations: interpretation.recommendations
          });
      }

      toast({
        title: "Mental Health Screening Complete",
        description: "Your assessments have been saved. We'll use these results to personalize your therapy.",
      });

      onNext();
    } catch (error) {
      console.error('Error saving assessment data:', error);
      toast({
        title: "Error",
        description: "Failed to save your assessment data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentResponses = responses[currentAssess.id] || {};
  const isComplete = currentAssess.questions.every(q => currentResponses[q.id] !== undefined);
  const currentScore = calculateScore(currentAssess.id);
  const interpretation = currentScore > 0 ? currentAssess.interpretation(currentScore) : null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Brain className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Mental Health Screening</h2>
        <p className="text-muted-foreground">
          Please answer these questions about how you've been feeling over the past 2 weeks
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {assessments.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index <= currentAssessment ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>{currentAssess.name}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{currentAssess.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentAssess.questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">
                {index + 1}. {question.text}
              </Label>
              <RadioGroup
                value={currentResponses[question.id]?.toString()}
                onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`${question.id}_${option.value}`} />
                    <Label htmlFor={`${question.id}_${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {interpretation && (
            <Alert className={`${
              interpretation.level === 'Severe' ? 'border-red-200 bg-red-50' :
              interpretation.level === 'Moderate' ? 'border-orange-200 bg-orange-50' :
              interpretation.level === 'Mild' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Score: {currentScore} ({interpretation.level})</strong>
                <br />
                {interpretation.description}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentAssessment > 0 ? () => setCurrentAssessment(currentAssessment - 1) : onBack}
        >
          Back
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!isComplete || isLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {isLoading ? 'Saving...' : currentAssessment < assessments.length - 1 ? 'Next Assessment' : 'Complete Screening'}
        </Button>
      </div>
    </div>
  );
};

export default MentalHealthScreeningStep;
