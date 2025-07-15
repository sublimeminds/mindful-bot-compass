import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import GradientButton from '@/components/ui/GradientButton';
import { AlertTriangle, Heart, Brain, Users, Briefcase, Home, CheckCircle2 } from 'lucide-react';

interface ProblemAssessmentStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

const ProblemAssessmentStep = ({ onNext, onBack, onboardingData }: ProblemAssessmentStepProps) => {
  const [specificProblems, setSpecificProblems] = useState<string[]>([]);
  const [problemDescription, setProblemDescription] = useState('');
  const [therapyGoals, setTherapyGoals] = useState('');
  const [triggersAndStressors, setTriggersAndStressors] = useState<string[]>([]);

  const problemAreas = [
    { id: 'anxiety', label: 'Anxiety & Panic', icon: AlertTriangle, color: 'text-yellow-600' },
    { id: 'depression', label: 'Depression & Mood', icon: Heart, color: 'text-red-600' },
    { id: 'stress', label: 'Stress Management', icon: Brain, color: 'text-blue-600' },
    { id: 'relationships', label: 'Relationship Issues', icon: Users, color: 'text-purple-600' },
    { id: 'work', label: 'Work/Career Stress', icon: Briefcase, color: 'text-green-600' },
    { id: 'family', label: 'Family Dynamics', icon: Home, color: 'text-orange-600' }
  ];

  const commonTriggers = [
    'Work deadlines', 'Social situations', 'Financial stress', 'Health concerns',
    'Family conflicts', 'Public speaking', 'Change/transitions', 'Perfectionism',
    'Past trauma', 'Relationship conflicts', 'Academic pressure', 'Social media'
  ];

  const handleProblemToggle = (problemId: string) => {
    setSpecificProblems(prev =>
      prev.includes(problemId)
        ? prev.filter(p => p !== problemId)
        : [...prev, problemId]
    );
  };

  const handleTriggerToggle = (trigger: string) => {
    setTriggersAndStressors(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    const assessmentData = {
      specificProblems,
      problemDescription,
      therapyGoals,
      triggersAndStressors,
      goals: [...specificProblems, 'therapy_goals'], // For therapist matching
      preferences: triggersAndStressors // For therapy approach matching
    };

    onNext(assessmentData);
  };

  const isComplete = specificProblems.length > 0 && problemDescription.trim() && therapyGoals.trim();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell Us About Your Challenges</h2>
        <p className="text-muted-foreground">
          Help us understand what you'd like to work on so we can create the best therapy plan for you
        </p>
      </div>

      {/* Specific Problem Areas */}
      <Card className={`transition-all ${specificProblems.length === 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>What areas would you like to focus on? <span className="text-red-500">*</span></span>
            {specificProblems.length > 0 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Select at least one area to continue</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {problemAreas.map((problem) => {
              const IconComponent = problem.icon;
              const isSelected = specificProblems.includes(problem.id);
              
              return (
                <div
                  key={problem.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-harmony-50 border-harmony-300 dark:bg-harmony-950 dark:border-harmony-700' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                  onClick={() => handleProblemToggle(problem.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleProblemToggle(problem.id)}
                  />
                  <IconComponent className={`h-5 w-5 ${problem.color}`} />
                  <span className="font-medium">{problem.label}</span>
                </div>
              );
            })}
          </div>
          {specificProblems.length === 0 && (
            <p className="text-sm text-orange-600 mt-2">Please select at least one focus area to continue</p>
          )}
        </CardContent>
      </Card>

      {/* Problem Description */}
      <Card className={`transition-all ${!problemDescription.trim() ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Describe your current challenges in detail <span className="text-red-500">*</span></span>
            {problemDescription.trim() && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Tell us more about what you're experiencing. What brings you to therapy? How are these challenges affecting your daily life?"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            rows={5}
            className="w-full"
          />
          {!problemDescription.trim() && (
            <p className="text-sm text-orange-600 mt-2">Please describe your challenges to continue</p>
          )}
        </CardContent>
      </Card>

      {/* Therapy Goals */}
      <Card className={`transition-all ${!therapyGoals.trim() ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>What would you like to achieve through therapy? <span className="text-red-500">*</span></span>
            {therapyGoals.trim() && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What are your goals? What would success look like for you? How would you like your life to be different?"
            value={therapyGoals}
            onChange={(e) => setTherapyGoals(e.target.value)}
            rows={4}
            className="w-full"
          />
          {!therapyGoals.trim() && (
            <p className="text-sm text-orange-600 mt-2">Please describe your therapy goals to continue</p>
          )}
        </CardContent>
      </Card>

      {/* Triggers and Stressors */}
      <Card>
        <CardHeader>
          <CardTitle>Common triggers or stressors <span className="text-gray-500">(Optional)</span></CardTitle>
          <p className="text-sm text-muted-foreground">
            Select any situations or circumstances that tend to trigger your symptoms
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonTriggers.map((trigger) => (
              <div
                key={trigger}
                className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${
                  triggersAndStressors.includes(trigger)
                    ? 'bg-flow-50 border-flow-300 dark:bg-flow-950 dark:border-flow-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
                onClick={() => handleTriggerToggle(trigger)}
              >
                <Checkbox
                  checked={triggersAndStressors.includes(trigger)}
                  onChange={() => handleTriggerToggle(trigger)}
                />
                <Label className="text-sm cursor-pointer">{trigger}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Summary */}
      {(specificProblems.length > 0 || triggersAndStressors.length > 0) && (
        <Card className="bg-harmony-50 dark:bg-harmony-950">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3">Summary of your selections:</h4>
            <div className="space-y-2">
              {specificProblems.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Focus areas: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {specificProblems.map(problemId => {
                      const problem = problemAreas.find(p => p.id === problemId);
                      return (
                        <Badge key={problemId} variant="secondary" className="text-xs">
                          {problem?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              {triggersAndStressors.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Common triggers: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {triggersAndStressors.slice(0, 5).map(trigger => (
                      <Badge key={trigger} variant="outline" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                    {triggersAndStressors.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{triggersAndStressors.length - 5} more
                      </Badge>
                    )}
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

export default ProblemAssessmentStep;