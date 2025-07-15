import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Home, Briefcase, Heart, Clock, Pill, Brain, AlertTriangle } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';

interface PersonalHistoryStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

const PersonalHistoryStep = ({ onNext, onBack, onboardingData }: PersonalHistoryStepProps) => {
  const [livingSituation, setLivingSituation] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [financialStress, setFinancialStress] = useState('');
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState('');
  const [previousTherapy, setPreviousTherapy] = useState('');
  const [therapyExperience, setTherapyExperience] = useState('');
  const [sleepPattern, setSleepPattern] = useState('');
  const [exerciseHabits, setExerciseHabits] = useState('');
  const [substanceUse, setSubstanceUse] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const livingOptions = [
    'Live alone',
    'Live with partner/spouse',
    'Live with family members',
    'Live with roommates',
    'Live with children',
    'Other arrangement'
  ];

  const employmentOptions = [
    'Employed full-time',
    'Employed part-time',
    'Self-employed',
    'Unemployed - looking for work',
    'Unemployed - not looking',
    'Student',
    'Retired',
    'Disabled/unable to work',
    'Homemaker'
  ];

  const financialStressOptions = [
    'No financial stress',
    'Mild financial concerns',
    'Moderate financial stress',
    'Significant financial difficulties',
    'Severe financial crisis'
  ];

  const medicalConditionOptions = [
    'Diabetes',
    'Heart disease',
    'High blood pressure',
    'Chronic pain',
    'Autoimmune disorder',
    'Thyroid issues',
    'Sleep disorders',
    'Neurological conditions',
    'None of the above'
  ];

  const sleepPatterns = [
    'Regular schedule, good quality sleep',
    'Regular schedule, poor quality sleep',
    'Irregular schedule, good quality sleep',
    'Irregular schedule, poor quality sleep',
    'Insomnia/difficulty falling asleep',
    'Wake up frequently during night',
    'Sleep too much',
    'Use sleep aids regularly'
  ];

  const exerciseOptions = [
    'Regular exercise (5+ times/week)',
    'Moderate exercise (3-4 times/week)',
    'Light exercise (1-2 times/week)',
    'Occasional exercise',
    'Very little exercise',
    'No exercise'
  ];

  const substanceOptions = [
    'Alcohol (occasional)',
    'Alcohol (regular)',
    'Alcohol (heavy/concerning)',
    'Tobacco/nicotine',
    'Cannabis',
    'Prescription drugs (as prescribed)',
    'Prescription drugs (not as prescribed)',
    'Illegal substances',
    'None of the above'
  ];

  const handleMedicalConditionToggle = (condition: string) => {
    setMedicalConditions(prev => {
      if (condition === 'None of the above') {
        return ['None of the above'];
      }
      const filtered = prev.filter(c => c !== 'None of the above');
      return prev.includes(condition)
        ? filtered.filter(c => c !== condition)
        : [...filtered, condition];
    });
  };

  const handleSubstanceToggle = (substance: string) => {
    setSubstanceUse(prev => {
      if (substance === 'None of the above') {
        return ['None of the above'];
      }
      const filtered = prev.filter(s => s !== 'None of the above');
      return prev.includes(substance)
        ? filtered.filter(s => s !== substance)
        : [...filtered, substance];
    });
  };

  const handleSubmit = () => {
    const personalData = {
      personalHistory: {
        livingSituation,
        employmentStatus,
        financialStress,
        medicalConditions,
        currentMedications,
        previousTherapy,
        therapyExperience,
        sleepPattern,
        exerciseHabits,
        substanceUse,
        additionalInfo
      }
    };

    onNext(personalData);
  };

  const isComplete = livingSituation && employmentStatus && financialStress && sleepPattern && exerciseHabits && previousTherapy;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Personal History & Current Situation</h2>
        <p className="text-muted-foreground">
          Understanding your current life context helps us tailor therapy to your specific needs
        </p>
      </div>

      {/* Living Situation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-blue-600" />
            <span>Current Living Situation <span className="text-red-500">*</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={livingSituation} onValueChange={setLivingSituation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {livingOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Employment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            <span>Employment Status <span className="text-red-500">*</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={employmentStatus} onValueChange={setEmploymentStatus}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {employmentOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Financial Stress */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Stress Level <span className="text-red-500">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={financialStress} onValueChange={setFinancialStress}>
            <div className="space-y-2">
              {financialStressOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>Current Medical Conditions <span className="text-gray-500">(Optional)</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {medicalConditionOptions.map((condition) => (
              <div
                key={condition}
                className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${
                  medicalConditions.includes(condition)
                    ? 'bg-harmony-50 border-harmony-300 dark:bg-harmony-950 dark:border-harmony-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                onClick={() => handleMedicalConditionToggle(condition)}
              >
                <Checkbox
                  checked={medicalConditions.includes(condition)}
                  onChange={() => handleMedicalConditionToggle(condition)}
                />
                <Label className="text-sm cursor-pointer">{condition}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5 text-purple-600" />
            <span>Current Medications (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="List any medications you're currently taking (including mental health medications, supplements, etc.)"
            value={currentMedications}
            onChange={(e) => setCurrentMedications(e.target.value)}
            rows={3}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Previous Therapy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span>Previous Therapy Experience <span className="text-red-500">*</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={previousTherapy} onValueChange={setPreviousTherapy}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Never been to therapy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="once" id="once" />
                <Label htmlFor="once">Tried therapy once or twice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short_term" id="short_term" />
                <Label htmlFor="short_term">Short-term therapy (few months)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long_term" id="long_term" />
                <Label htmlFor="long_term">Long-term therapy (6+ months)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">Multiple therapy experiences</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Therapy Experience Details */}
      {previousTherapy && previousTherapy !== 'never' && (
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your previous therapy experience</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What worked well? What didn't? What would you like to be different this time?"
              value={therapyExperience}
              onChange={(e) => setTherapyExperience(e.target.value)}
              rows={4}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}

      {/* Sleep Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span>Sleep Pattern <span className="text-red-500">*</span></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={sleepPattern} onValueChange={setSleepPattern}>
            <div className="space-y-2">
              {sleepPatterns.map((pattern) => (
                <div key={pattern} className="flex items-center space-x-2">
                  <RadioGroupItem value={pattern} id={pattern} />
                  <Label htmlFor={pattern} className="cursor-pointer text-sm">{pattern}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Exercise Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise & Physical Activity <span className="text-red-500">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={exerciseHabits} onValueChange={setExerciseHabits}>
            <div className="space-y-2">
              {exerciseOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Substance Use */}
      <Card>
        <CardHeader>
          <CardTitle>Substance Use <span className="text-gray-500">(Confidential & Optional)</span></CardTitle>
          <p className="text-sm text-muted-foreground">
            This information helps us provide safe and appropriate care
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {substanceOptions.map((substance) => (
              <div
                key={substance}
                className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${
                  substanceUse.includes(substance)
                    ? 'bg-flow-50 border-flow-300 dark:bg-flow-950 dark:border-flow-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                onClick={() => handleSubstanceToggle(substance)}
              >
                <Checkbox
                  checked={substanceUse.includes(substance)}
                  onChange={() => handleSubstanceToggle(substance)}
                />
                <Label className="text-sm cursor-pointer">{substance}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Is there anything else about your personal history that might be relevant to your therapy?"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Summary of selections */}
      {(medicalConditions.length > 0 || substanceUse.length > 0) && (
        <Card className="bg-harmony-50 dark:bg-harmony-950">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3">Summary:</h4>
            <div className="space-y-2">
              {medicalConditions.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Medical conditions: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medicalConditions.map(condition => (
                      <Badge key={condition} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {substanceUse.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Substance use: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {substanceUse.map(substance => (
                      <Badge key={substance} variant="outline" className="text-xs">
                        {substance}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!isComplete && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Please complete all required fields (marked with *) to continue
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <GradientButton variant="outline" onClick={onBack}>
          Back
        </GradientButton>
        <GradientButton 
          onClick={handleSubmit}
          disabled={!isComplete}
          className={!isComplete ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Continue
        </GradientButton>
      </div>
    </div>
  );
};

export default PersonalHistoryStep;