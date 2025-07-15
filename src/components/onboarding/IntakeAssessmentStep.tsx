
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Shield, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { useTranslation } from 'react-i18next';

interface IntakeAssessmentStepProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

const IntakeAssessmentStep = ({ onNext, onBack, onboardingData }: IntakeAssessmentStepProps) => {
  const { t } = useTranslation();
  const [stressLevel, setStressLevel] = useState(onboardingData?.stressLevel || null);
  const [anxietyLevel, setAnxietyLevel] = useState(onboardingData?.anxietyLevel || null);
  const [sleepQuality, setSleepQuality] = useState(onboardingData?.sleepQuality || '');
  const [copingMechanisms, setCopingMechanisms] = useState<string[]>(onboardingData?.copingMechanisms || []);
  const [additionalNotes, setAdditionalNotes] = useState(onboardingData?.additionalNotes || '');

  const handleCopingMechanismToggle = (mechanism: string) => {
    setCopingMechanisms((prev) =>
      prev.includes(mechanism) ? prev.filter((m) => m !== mechanism) : [...prev, mechanism]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!sleepQuality || copingMechanisms.length === 0) {
      return;
    }

    const assessmentData = {
      stressLevel,
      anxietyLevel,
      sleepQuality,
      copingMechanisms,
      additionalNotes,
      goals: copingMechanisms, 
      preferences: [sleepQuality] 
    };
    
    console.log('Assessment data:', assessmentData);
    onNext(assessmentData);
  };

  const isComplete = stressLevel && anxietyLevel && sleepQuality && copingMechanisms.length > 0;
  const progressValue = () => {
    let progress = 0;
    if (stressLevel) progress += 20;
    if (anxietyLevel) progress += 20; 
    if (sleepQuality) progress += 30;
    if (copingMechanisms.length > 0) progress += 30;
    return progress;
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Initial Mental Health Assessment</h2>
        <p className="text-muted-foreground">
          Help us understand your current mental health state to create your personalized plan.
        </p>
        <Progress value={progressValue()} className="mt-4 h-2" />
        <p className="text-sm text-muted-foreground mt-2">{Math.round(progressValue())}% complete</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Stress Level (1-10) <span className="text-red-500">*</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            value={stressLevel ? [stressLevel] : [1]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setStressLevel(value[0])}
          />
          <div className="text-sm text-muted-foreground text-center mt-2">
            Current: {stressLevel || 'Not selected'}
          </div>
          {!stressLevel && (
            <p className="text-sm text-orange-600 mt-2 text-center">Please select your stress level to continue</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-yellow-500" />
            <span>Anxiety Level (1-10) <span className="text-red-500">*</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            value={anxietyLevel ? [anxietyLevel] : [1]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setAnxietyLevel(value[0])}
          />
          <div className="text-sm text-muted-foreground text-center mt-2">
            Current: {anxietyLevel || 'Not selected'}
          </div>
          {!anxietyLevel && (
            <p className="text-sm text-orange-600 mt-2 text-center">Please select your anxiety level to continue</p>
          )}
        </CardContent>
      </Card>

      <Card className={`transition-all ${!sleepQuality ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Sleep Quality <span className="text-red-500">*</span></span>
            </div>
            {sleepQuality && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={sleepQuality} onValueChange={setSleepQuality}>
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
          {!sleepQuality && (
            <p className="text-sm text-orange-600 mt-2">Please select your sleep quality to continue</p>
          )}
        </CardContent>
      </Card>

      <Card className={`transition-all ${copingMechanisms.length === 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span>Current Coping Mechanisms <span className="text-red-500">*</span></span>
            </div>
            {copingMechanisms.length > 0 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Select the methods you currently use (choose at least one)</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['exercise', 'meditation', 'hobbies', 'socialize', 'therapy', 'journaling'].map((mechanism) => (
              <div key={mechanism} className="flex items-center space-x-2">
                <Checkbox
                  id={`coping-${mechanism}`}
                  checked={copingMechanisms.includes(mechanism)}
                  onCheckedChange={() => handleCopingMechanismToggle(mechanism)}
                />
                <Label htmlFor={`coping-${mechanism}`} className="capitalize">{mechanism}</Label>
              </div>
            ))}
          </div>
          {copingMechanisms.length === 0 && (
            <p className="text-sm text-orange-600 mt-2">Please select at least one coping mechanism to continue</p>
          )}
        </CardContent>
      </Card>


      {!isComplete && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Please complete all required fields (marked with *) to continue
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <GradientButton variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </GradientButton>
        <GradientButton 
          onClick={handleSubmit}
          disabled={!isComplete}
          className={!isComplete ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {t('common.continue')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </GradientButton>
      </div>
    </div>
  );
};

export default IntakeAssessmentStep;
