
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Heart, Brain } from 'lucide-react';

interface MentalHealthScreeningStepProps {
  onNext: () => void;
  onBack: () => void;
}

const MentalHealthScreeningStep = ({ onNext, onBack }: MentalHealthScreeningStepProps) => {
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [gad7Score, setGad7Score] = useState<number | null>(null);

  const handlePhq9Change = (value: string) => {
    setPhq9Score(parseInt(value, 10));
  };

  const handleGad7Change = (value: string) => {
    setGad7Score(parseInt(value, 10));
  };

  const handleSubmit = async () => {
    if (phq9Score === null || gad7Score === null) {
      return;
    }

    // Store data locally for now
    const screeningData = {
      phq9Score,
      gad7Score,
    };
    
    console.log('Screening data:', screeningData);
    onNext();
  };

  const phq9Interpretation = () => {
    if (phq9Score === null) return '';
    if (phq9Score < 5) return 'Minimal depression';
    if (phq9Score < 10) return 'Mild depression';
    if (phq9Score < 15) return 'Moderate depression';
    if (phq9Score < 20) return 'Moderately severe depression';
    return 'Severe depression';
  };

  const gad7Interpretation = () => {
    if (gad7Score === null) return '';
    if (gad7Score < 5) return 'Minimal anxiety';
    if (gad7Score < 10) return 'Mild anxiety';
    if (gad7Score < 15) return 'Moderate anxiety';
    return 'Severe anxiety';
  };

  const progress = (phq9Score !== null && gad7Score !== null) ? 100 : (phq9Score !== null || gad7Score !== null) ? 50 : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Mental Health Screening</h2>
        <p className="text-muted-foreground">
          Answer these questions to help us understand your mental health needs.
        </p>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            PHQ-9 Depression Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?
          </p>
          <RadioGroup onValueChange={handlePhq9Change}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="phq9-0" />
                <Label htmlFor="phq9-0">Not at all</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="phq9-1" />
                <Label htmlFor="phq9-1">Several days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="phq9-2" />
                <Label htmlFor="phq9-2">More than half the days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="phq9-3" />
                <Label htmlFor="phq9-3">Nearly every day</Label>
              </div>
            </div>
          </RadioGroup>
          {phq9Score !== null && (
            <Badge variant="secondary">
              Score: {phq9Score} - {phq9Interpretation()}
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-500" />
            GAD-7 Anxiety Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?
          </p>
          <RadioGroup onValueChange={handleGad7Change}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="gad7-0" />
                <Label htmlFor="gad7-0">Not at all</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="gad7-1" />
                <Label htmlFor="gad7-1">Several days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="gad7-2" />
                <Label htmlFor="gad7-2">More than half the days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="gad7-3" />
                <Label htmlFor="gad7-3">Nearly every day</Label>
              </div>
            </div>
          </RadioGroup>
          {gad7Score !== null && (
            <Badge variant="secondary">
              Score: {gad7Score} - {gad7Interpretation()}
            </Badge>
          )}
        </CardContent>
      </Card>

      {(phq9Score !== null && gad7Score !== null) && (
        <div className="rounded-md p-4 bg-amber-50 border border-amber-200 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 mr-2 inline-block align-middle" />
          Please note that this is not a diagnosis. Consult with a healthcare professional for a comprehensive evaluation.
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={phq9Score === null || gad7Score === null}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MentalHealthScreeningStep;
