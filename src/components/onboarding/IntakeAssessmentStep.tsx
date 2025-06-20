import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Shield, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';

interface IntakeAssessmentStepProps {
  onNext: () => void;
  onBack: () => void;
}

const IntakeAssessmentStep = ({ onNext, onBack }: IntakeAssessmentStepProps) => {
  const { user } = useSimpleApp();
  const [stressLevel, setStressLevel] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState('average');
  const [copingMechanisms, setCopingMechanisms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopingMechanismToggle = (mechanism: string) => {
    setCopingMechanisms((prev) =>
      prev.includes(mechanism) ? prev.filter((m) => m !== mechanism) : [...prev, mechanism]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('intake_assessments')
        .insert({
          user_id: user.id,
          stress_level: stressLevel,
          anxiety_level: anxietyLevel,
          sleep_quality: sleepQuality,
          coping_mechanisms: copingMechanisms,
          additional_notes: additionalNotes,
        });

      if (error) {
        console.error('Error submitting intake assessment:', error);
        // Handle error (e.g., show a toast notification)
      } else {
        onNext();
      }
    } catch (error) {
      console.error('Error during submission:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Initial Mental Health Assessment</h2>
        <p className="text-muted-foreground">
          Help us understand your current mental health state.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Stress Level (1-10)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            defaultValue={[stressLevel]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setStressLevel(value[0])}
          />
          <div className="text-sm text-muted-foreground text-center mt-2">
            Current: {stressLevel}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-yellow-500" />
            <span>Anxiety Level (1-10)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            defaultValue={[anxietyLevel]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setAnxietyLevel(value[0])}
          />
          <div className="text-sm text-muted-foreground text-center mt-2">
            Current: {anxietyLevel}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>Sleep Quality</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue={sleepQuality} onValueChange={setSleepQuality}>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="sleep-average" />
                <Label htmlFor="sleep-average">Average</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span>Coping Mechanisms</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coping-exercise"
                checked={copingMechanisms.includes('exercise')}
                onCheckedChange={() => handleCopingMechanismToggle('exercise')}
              />
              <Label htmlFor="coping-exercise">Exercise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coping-meditation"
                checked={copingMechanisms.includes('meditation')}
                onCheckedChange={() => handleCopingMechanismToggle('meditation')}
              />
              <Label htmlFor="coping-meditation">Meditation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coping-hobbies"
                checked={copingMechanisms.includes('hobbies')}
                onCheckedChange={() => handleCopingMechanismToggle('hobbies')}
              />
              <Label htmlFor="coping-hobbies">Hobbies</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coping-socialize"
                checked={copingMechanisms.includes('socialize')}
                onCheckedChange={() => handleCopingMechanismToggle('socialize')}
              />
              <Label htmlFor="coping-socialize">Socialize</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coping-therapy"
                checked={copingMechanisms.includes('therapy')}
                onCheckedChange={() => handleCopingMechanismToggle('therapy')}
              />
              <Label htmlFor="coping-therapy">Therapy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coping-journaling"
                checked={copingMechanisms.includes('journaling')}
                onCheckedChange={() => handleCopingMechanismToggle('journaling')}
              />
              <Label htmlFor="coping-journaling">Journaling</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Additional Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Anything else you'd like to share?"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Submitting...
              <Progress className="w-6 inline-block ml-2" value={null} />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default IntakeAssessmentStep;
