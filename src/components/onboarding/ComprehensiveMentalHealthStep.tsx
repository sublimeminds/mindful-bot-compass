
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Heart, Brain, Shield, Moon, Focus, Zap } from 'lucide-react';

interface ComprehensiveMentalHealthStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const ComprehensiveMentalHealthStep = ({ onNext, onBack }: ComprehensiveMentalHealthStepProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [assessmentData, setAssessmentData] = useState({
    // PHQ-9 Depression Screening
    phq9: {
      littleInterest: null,
      feelingDown: null,
      sleepProblems: null,
      lowEnergy: null,
      appetiteProblems: null,
      feelingBad: null,
      troubleConcentrating: null,
      movingSlowly: null,
      suicidalThoughts: null
    },
    // GAD-7 Anxiety Screening
    gad7: {
      nervousAnxious: null,
      controlWorrying: null,
      worryingTooMuch: null,
      troubleRelaxing: null,
      restlessness: null,
      easilyAnnoyed: null,
      afraidSomethingAwful: null
    },
    // Additional screenings
    trauma: {
      hasTraumaHistory: null,
      traumaType: [],
      affectsDaily: null,
      nightmares: null,
      flashbacks: null
    },
    substance: {
      alcoholFrequency: null,
      drugUse: null,
      concernsAboutUse: null
    },
    eating: {
      makeYourselfSick: null,
      loseControl: null,
      lostWeight: null,
      believeFat: null,
      foodDominatesLife: null
    },
    sleep: {
      hoursPerNight: null,
      troubleFalling: null,
      troubleStaying: null,
      earlyWaking: null,
      sleepQuality: null
    },
    adhd: {
      troubleConcentrating: null,
      easilyDistracted: null,
      restless: null,
      impulsive: null,
      forgetful: null,
      difficultOrganizing: null
    },
    bipolar: {
      periodHighEnergy: null,
      lessSleep: null,
      moreConfident: null,
      unusuallyTalkative: null,
      racingThoughts: null
    },
    support: {
      familySupport: null,
      friendSupport: null,
      professionalSupport: null,
      feelingIsolated: null
    },
    history: {
      previousTherapy: null,
      therapyHelpful: null,
      currentMedication: null,
      previousCrisis: null
    },
    stressors: {
      workStress: null,
      relationshipStress: null,
      financialStress: null,
      healthStress: null,
      otherStressors: ''
    }
  });

  const sections = [
    { title: 'Depression Assessment', icon: Heart, key: 'phq9' },
    { title: 'Anxiety Assessment', icon: Brain, key: 'gad7' },
    { title: 'Trauma Screening', icon: Shield, key: 'trauma' },
    { title: 'Sleep Assessment', icon: Moon, key: 'sleep' },
    { title: 'ADHD Screening', icon: Focus, key: 'adhd' },
    { title: 'Mood Episodes', icon: Zap, key: 'bipolar' },
    { title: 'Support System', icon: Heart, key: 'support' },
    { title: 'Treatment History', icon: Brain, key: 'history' },
    { title: 'Current Stressors', icon: AlertTriangle, key: 'stressors' }
  ];

  const updateAssessment = (section: string, field: string, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Calculate scores and pass all data
      const phq9Score = Object.values(assessmentData.phq9).reduce((sum: number, val) => sum + (val || 0), 0);
      const gad7Score = Object.values(assessmentData.gad7).reduce((sum: number, val) => sum + (val || 0), 0);
      
      onNext({
        mentalHealthAssessment: assessmentData,
        scores: {
          phq9: phq9Score,
          gad7: gad7Score,
          riskLevel: phq9Score > 14 || gad7Score > 14 ? 'high' : phq9Score > 9 || gad7Score > 9 ? 'moderate' : 'low'
        }
      });
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      onBack();
    }
  };

  const renderSection = () => {
    const section = sections[currentSection];
    const Icon = section.icon;

    switch (section.key) {
      case 'phq9':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Icon className="h-8 w-8 mx-auto mb-4 text-therapy-500" />
              <h3 className="text-xl font-semibold mb-2">Depression Assessment (PHQ-9)</h3>
              <p className="text-muted-foreground">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
            </div>
            
            {[
              { key: 'littleInterest', text: 'Little interest or pleasure in doing things' },
              { key: 'feelingDown', text: 'Feeling down, depressed, or hopeless' },
              { key: 'sleepProblems', text: 'Trouble falling or staying asleep, or sleeping too much' },
              { key: 'lowEnergy', text: 'Feeling tired or having little energy' },
              { key: 'appetiteProblems', text: 'Poor appetite or overeating' },
              { key: 'feelingBad', text: 'Feeling bad about yourself or that you are a failure' },
              { key: 'troubleConcentrating', text: 'Trouble concentrating on things' },
              { key: 'movingSlowly', text: 'Moving or speaking slowly, or being restless' },
              { key: 'suicidalThoughts', text: 'Thoughts that you would be better off dead' }
            ].map((item, index) => (
              <Card key={item.key} className="p-4">
                <p className="mb-3 font-medium">{item.text}</p>
                <RadioGroup 
                  value={assessmentData.phq9[item.key]?.toString()} 
                  onValueChange={(value) => updateAssessment('phq9', item.key, parseInt(value))}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: '0', label: 'Not at all' },
                      { value: '1', label: 'Several days' },
                      { value: '2', label: 'More than half the days' },
                      { value: '3', label: 'Nearly every day' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${item.key}-${option.value}`} />
                        <Label htmlFor={`${item.key}-${option.value}`} className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </Card>
            ))}
          </div>
        );

      case 'gad7':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Icon className="h-8 w-8 mx-auto mb-4 text-balance-500" />
              <h3 className="text-xl font-semibold mb-2">Anxiety Assessment (GAD-7)</h3>
              <p className="text-muted-foreground">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
            </div>
            
            {[
              { key: 'nervousAnxious', text: 'Feeling nervous, anxious, or on edge' },
              { key: 'controlWorrying', text: 'Not being able to stop or control worrying' },
              { key: 'worryingTooMuch', text: 'Worrying too much about different things' },
              { key: 'troubleRelaxing', text: 'Trouble relaxing' },
              { key: 'restlessness', text: 'Being so restless that it is hard to sit still' },
              { key: 'easilyAnnoyed', text: 'Becoming easily annoyed or irritable' },
              { key: 'afraidSomethingAwful', text: 'Feeling afraid, as if something awful might happen' }
            ].map((item) => (
              <Card key={item.key} className="p-4">
                <p className="mb-3 font-medium">{item.text}</p>
                <RadioGroup 
                  value={assessmentData.gad7[item.key]?.toString()} 
                  onValueChange={(value) => updateAssessment('gad7', item.key, parseInt(value))}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: '0', label: 'Not at all' },
                      { value: '1', label: 'Several days' },
                      { value: '2', label: 'More than half the days' },
                      { value: '3', label: 'Nearly every day' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${item.key}-${option.value}`} />
                        <Label htmlFor={`${item.key}-${option.value}`} className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </Card>
            ))}
          </div>
        );

      case 'stressors':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Icon className="h-8 w-8 mx-auto mb-4 text-flow-500" />
              <h3 className="text-xl font-semibold mb-2">Current Life Stressors</h3>
              <p className="text-muted-foreground">Please rate your current stress levels in these areas</p>
            </div>
            
            {[
              { key: 'workStress', text: 'Work or School Stress' },
              { key: 'relationshipStress', text: 'Relationship Stress' },
              { key: 'financialStress', text: 'Financial Stress' },
              { key: 'healthStress', text: 'Health Concerns' }
            ].map((item) => (
              <Card key={item.key} className="p-4">
                <p className="mb-3 font-medium">{item.text}</p>
                <RadioGroup 
                  value={assessmentData.stressors[item.key]?.toString()} 
                  onValueChange={(value) => updateAssessment('stressors', item.key, parseInt(value))}
                >
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.toString()} id={`${item.key}-${level}`} />
                        <Label htmlFor={`${item.key}-${level}`} className="text-sm">
                          {level === 1 ? 'None' : level === 5 ? 'Severe' : level.toString()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </Card>
            ))}
            
            <Card className="p-4">
              <Label htmlFor="otherStressors" className="text-base font-medium mb-2 block">
                Other stressors or concerns you'd like to share:
              </Label>
              <Textarea
                id="otherStressors"
                value={assessmentData.stressors.otherStressors}
                onChange={(e) => updateAssessment('stressors', 'otherStressors', e.target.value)}
                placeholder="Please describe any other stressors, concerns, or goals for therapy..."
                rows={4}
              />
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon className="h-8 w-8 mx-auto mb-4 text-harmony-500" />
            <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
            <p className="text-muted-foreground">This section is being developed for comprehensive assessment.</p>
          </div>
        );
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;
  const CurrentIcon = sections[currentSection].icon;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-therapy-600 to-balance-600 bg-clip-text text-transparent">
          Comprehensive Mental Health Assessment
        </h2>
        <p className="text-muted-foreground mt-2">
          This assessment helps us understand your mental health needs to provide personalized support.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CurrentIcon className="h-5 w-5 text-therapy-500" />
          <span className="font-medium">{sections[currentSection].title}</span>
        </div>
        <Badge variant="outline">
          Step {currentSection + 1} of {sections.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="min-h-[400px]">
        <CardContent className="p-6">
          {renderSection()}
        </CardContent>
      </Card>

      {assessmentData.phq9.suicidalThoughts === 3 && (
        <div className="rounded-md p-4 bg-red-50 border border-red-200 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 mr-2 inline-block align-middle" />
          <strong>Important:</strong> If you're having thoughts of hurting yourself, please reach out for help immediately.
          <br />
          <strong>Crisis resources:</strong> Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} className="bg-gradient-to-r from-therapy-500 to-balance-500">
          {currentSection < sections.length - 1 ? 'Next Section' : 'Complete Assessment'}
        </Button>
      </div>
    </div>
  );
};

export default ComprehensiveMentalHealthStep;
