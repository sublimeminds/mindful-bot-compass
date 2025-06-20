import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Heart, Brain, Shield, CheckCircle } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';

interface MentalHealthScreeningStepProps {
  onNext: () => void;
  onBack: () => void;
}

const MentalHealthScreeningStep = ({ onNext, onBack }: MentalHealthScreeningStepProps) => {
  const { user } = useSimpleApp();
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [gad7Score, setGad7Score] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhq9Change = (value: string) => {
    setPhq9Score(parseInt(value, 10));
  };

  const handleGad7Change = (value: string) => {
    setGad7Score(parseInt(value, 10));
  };

  const handleSubmit = async () => {
    if (!user || phq9Score === null || gad7Score === null) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('mental_health_screening')
        .insert([
          {
            user_id: user.id,
            phq9_score: phq9Score,
            gad7_score: gad7Score,
          },
        ]);

      if (error) {
        console.error('Error submitting screening:', error);
      } else {
        onNext();
      }
    } catch (error) {
      console.error('Error submitting screening:', error);
    } finally {
      setIsLoading(false);
    }
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
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </p>
          <RadioGroup onValueChange={handlePhq9Change}>
            <div className="grid grid-cols-5 gap-2">
              <Label htmlFor="phq9-0" className="text-center">0</Label>
              <Label htmlFor="phq9-1" className="text-center">1</Label>
              <Label htmlFor="phq9-2" className="text-center">2</Label>
              <Label htmlFor="phq9-3" className="text-center">3</Label>
              <div></div>

              <Label htmlFor="phq9-1">Little interest or pleasure in doing things</Label>
              <RadioGroupItem value="0" id="phq9-0" />
              <RadioGroupItem value="1" id="phq9-1" />
              <RadioGroupItem value="2" id="phq9-2" />
              <RadioGroupItem value="3" id="phq9-3" />
              <div></div>

              <Label htmlFor="phq9-2">Feeling down, depressed, or hopeless</Label>
              <RadioGroupItem value="0" id="phq9-0" />
              <RadioGroupItem value="1" id="phq9-1" />
              <RadioGroupItem value="2" id="phq9-2" />
              <RadioGroupItem value="3" id="phq9-3" />
              <div></div>

              <Label htmlFor="phq9-3">Trouble falling or staying asleep, or sleeping too much</Label>
              <RadioGroupItem value="0" id="phq9-0" />
              <RadioGroupItem value="1" id="phq9-1" />
              <RadioGroupItem value="2" id="phq9-2" />
              <RadioGroupItem value="3" id="phq9-3" />
              <div></div>

              <Label htmlFor="phq9-4">Feeling tired or having little energy</Label>
              <RadioGroupItem value="0" id="phq9-0" />
              <RadioGroupItem value="1" id="phq9-1" />
              <RadioGroupItem value="2" id="phq9-2" />
              <RadioGroupItem value="3" id="phq9-3" />
              <div></div>
            </div>
          </RadioGroup>
          {phq9Score !== null && (
            <Badge variant="secondary">
              Interpretation: {phq9Interpretation()}
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
            Over the last 2 weeks, how often have you been bothered by the following problems?
          </p>
          <RadioGroup onValueChange={handleGad7Change}>
            <div className="grid grid-cols-5 gap-2">
              <Label htmlFor="gad7-0" className="text-center">0</Label>
              <Label htmlFor="gad7-1" className="text-center">1</Label>
              <Label htmlFor="gad7-2" className="text-center">2</Label>
              <Label htmlFor="gad7-3" className="text-center">3</Label>
              <div></div>

              <Label htmlFor="gad7-1">Feeling nervous, anxious, or on edge</Label>
              <RadioGroupItem value="0" id="gad7-0" />
              <RadioGroupItem value="1" id="gad7-1" />
              <RadioGroupItem value="2" id="gad7-2" />
              <RadioGroupItem value="3" id="gad7-3" />
              <div></div>

              <Label htmlFor="gad7-2">Not being able to stop or control worrying</Label>
              <RadioGroupItem value="0" id="gad7-0" />
              <RadioGroupItem value="1" id="gad7-1" />
              <RadioGroupItem value="2" id="gad7-2" />
              <RadioGroupItem value="3" id="gad7-3" />
              <div></div>

              <Label htmlFor="gad7-3">Worrying too much about different things</Label>
              <RadioGroupItem value="0" id="gad7-0" />
              <RadioGroupItem value="1" id="gad7-1" />
              <RadioGroupItem value="2" id="gad7-2" />
              <RadioGroupItem value="3" id="gad7-3" />
              <div></div>

              <Label htmlFor="gad7-4">Trouble relaxing</Label>
              <RadioGroupItem value="0" id="gad7-0" />
              <RadioGroupItem value="1" id="gad7-1" />
              <RadioGroupItem value="2" id="gad7-2" />
              <RadioGroupItem value="3" id="gad7-3" />
              <div></div>
            </div>
          </RadioGroup>
          {gad7Score !== null && (
            <Badge variant="secondary">
              Interpretation: {gad7Interpretation()}
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
          disabled={phq9Score === null || gad7Score === null || isLoading}
          className="bg-therapy-500 hover:bg-therapy-600"
        >
          {isLoading ? (
            <>
              Submitting...
            </>
          ) : (
            <>
              Continue
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MentalHealthScreeningStep;
