
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SimpleMentalHealthStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData: any;
}

const SimpleMentalHealthStep = ({ onNext, onBack, onboardingData }: SimpleMentalHealthStepProps) => {
  const [responses, setResponses] = useState(onboardingData?.mental_health_responses || {});

  const questions = [
    {
      id: 'mood_frequency',
      question: 'How often do you feel sad or down?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
    },
    {
      id: 'anxiety_level',
      question: 'How would you rate your anxiety levels?',
      options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    {
      id: 'sleep_quality',
      question: 'How is your sleep quality?',
      options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor']
    },
    {
      id: 'stress_level',
      question: 'How stressed do you feel on a daily basis?',
      options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
    }
  ];

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev: any) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ mental_health_responses: responses });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mental Health Screening</CardTitle>
        <p className="text-muted-foreground">
          This helps us understand your current mental health status
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">{question.question}</Label>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={responses[question.id] === option}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="text-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={questions.some(q => !responses[q.id])}
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleMentalHealthStep;
