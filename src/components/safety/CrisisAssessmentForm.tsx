
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Heart, CheckCircle } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'radio' | 'textarea' | 'scale';
  options?: string[];
  weight: number;
  category: 'suicide' | 'self_harm' | 'substance' | 'psychosis' | 'general';
}

const CrisisAssessmentForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [riskScore, setRiskScore] = useState(0);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const questions: AssessmentQuestion[] = [
    {
      id: 'suicidal_thoughts',
      question: 'In the past week, how often have you had thoughts of ending your life?',
      type: 'radio',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      weight: 25,
      category: 'suicide'
    },
    {
      id: 'suicide_plan',
      question: 'Do you have a specific plan for how you would end your life?',
      type: 'radio',
      options: ['No plan', 'Vague ideas', 'Some planning', 'Detailed plan', 'Plan with means'],
      weight: 30,
      category: 'suicide'
    },
    {
      id: 'self_harm_recent',
      question: 'Have you harmed yourself in any way in the past month?',
      type: 'radio',
      options: ['Never', 'Once', 'A few times', 'Weekly', 'Daily'],
      weight: 20,
      category: 'self_harm'
    },
    {
      id: 'substance_use',
      question: 'How often do you use alcohol or drugs to cope with problems?',
      type: 'radio',
      options: ['Never', 'Rarely', 'Weekly', 'Daily', 'Multiple times daily'],
      weight: 15,
      category: 'substance'
    },
    {
      id: 'support_system',
      question: 'How would you rate your current support system?',
      type: 'radio',
      options: ['Very strong', 'Strong', 'Moderate', 'Weak', 'No support'],
      weight: -10,
      category: 'general'
    },
    {
      id: 'crisis_description',
      question: 'Please describe what brought you to seek help today:',
      type: 'textarea',
      weight: 0,
      category: 'general'
    }
  ];

  const calculateRiskScore = (responses: Record<string, string>) => {
    let score = 0;
    questions.forEach(question => {
      const response = responses[question.id];
      if (response && question.options) {
        const optionIndex = question.options.indexOf(response);
        const normalizedScore = (optionIndex / (question.options.length - 1)) * question.weight;
        score += normalizedScore;
      }
    });
    return Math.max(0, Math.min(100, score));
  };

  const handleResponse = (questionId: string, value: string) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    setRiskScore(calculateRiskScore(newResponses));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setAssessmentComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'Critical', color: 'bg-red-600', textColor: 'text-red-600' };
    if (score >= 50) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (score >= 30) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const canProceed = responses[currentQuestion?.id];

  if (assessmentComplete) {
    const risk = getRiskLevel(riskScore);
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 border-blue-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Assessment Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${risk.color} text-white text-lg font-semibold`}>
                  Risk Level: {risk.level}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Risk Score</span>
                <Progress value={riskScore} className="h-4" />
                <span className={`text-lg font-bold ${risk.textColor}`}>{Math.round(riskScore)}/100</span>
              </div>
            </div>

            {riskScore >= 70 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Immediate attention required.</strong> Please contact emergency services or a crisis helpline immediately.
                  <div className="mt-2 space-y-1">
                    <div>🔴 Emergency: 911</div>
                    <div>🔴 Crisis Lifeline: 988</div>
                    <div>🔴 Crisis Text Line: Text HOME to 741741</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {riskScore >= 50 && riskScore < 70 && (
              <Alert className="border-orange-200 bg-orange-50">
                <Shield className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Professional support recommended.</strong> Please consider reaching out to a mental health professional or crisis support service.
                </AlertDescription>
              </Alert>
            )}

            {riskScore < 50 && (
              <Alert className="border-green-200 bg-green-50">
                <Heart className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Continue with your therapy journey. Consider implementing wellness strategies and maintaining regular check-ins.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Recommended Next Steps:</h3>
              <div className="space-y-2">
                {riskScore >= 70 && (
                  <>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>Contact emergency services immediately</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span>Develop a safety plan with a professional</span>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <span>Continue regular therapy sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Practice wellness and coping strategies</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => {
                  setCurrentStep(0);
                  setResponses({});
                  setRiskScore(0);
                  setAssessmentComplete(false);
                }}
                variant="outline"
                className="flex-1"
              >
                Take Assessment Again
              </Button>
              <Button className="flex-1">
                Continue to Safety Planning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Assessment Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {questions.length}
            </span>
          </div>
          <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Risk Score */}
      {riskScore > 0 && (
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Risk Assessment</span>
              <Badge className={getRiskLevel(riskScore).color}>
                {getRiskLevel(riskScore).level} Risk
              </Badge>
            </div>
            <Progress value={riskScore} className="mt-2 h-3" />
            <span className="text-sm text-muted-foreground mt-1 block">
              Score: {Math.round(riskScore)}/100
            </span>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentStep + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base font-medium">{currentQuestion.question}</p>

          {currentQuestion.type === 'radio' && currentQuestion.options && (
            <RadioGroup
              value={responses[currentQuestion.id] || ''}
              onValueChange={(value) => handleResponse(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'textarea' && (
            <Textarea
              placeholder="Please describe your situation..."
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              className="min-h-24"
            />
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className={isLastQuestion ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Resources Always Visible */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">Need Immediate Help?</span>
          </div>
          <div className="text-sm text-red-700 space-y-1">
            <div>🔴 Emergency: 911</div>
            <div>🔴 Crisis Lifeline: 988</div>
            <div>🔴 Crisis Chat: suicidepreventionlifeline.org/chat</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisAssessmentForm;
