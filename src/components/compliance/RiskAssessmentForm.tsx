import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Heart, Phone } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RiskAssessmentData {
  suicide_ideation: string;
  self_harm_history: string;
  crisis_frequency: string;
  support_system: string;
  coping_strategies: string;
  medication_compliance: string;
  substance_use: string;
  trauma_history: string;
  protective_factors: string[];
  additional_concerns: string;
}

const RiskAssessmentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<RiskAssessmentData>({
    suicide_ideation: '',
    self_harm_history: '',
    crisis_frequency: '',
    support_system: '',
    coping_strategies: '',
    medication_compliance: '',
    substance_use: '',
    trauma_history: '',
    protective_factors: [],
    additional_concerns: ''
  });

  const totalSteps = 5;

  const suicideQuestions = [
    {
      id: 'suicide_ideation',
      question: 'In the past month, have you had thoughts of ending your life?',
      options: [
        { value: 'never', label: 'Never', risk: 0 },
        { value: 'rarely', label: 'Rarely (1-2 times)', risk: 1 },
        { value: 'sometimes', label: 'Sometimes (3-5 times)', risk: 2 },
        { value: 'often', label: 'Often (6+ times)', risk: 3 },
        { value: 'daily', label: 'Daily or almost daily', risk: 4 }
      ]
    },
    {
      id: 'self_harm_history',
      question: 'Have you ever engaged in self-harm behaviors?',
      options: [
        { value: 'never', label: 'Never', risk: 0 },
        { value: 'past_distant', label: 'Yes, but more than a year ago', risk: 1 },
        { value: 'past_recent', label: 'Yes, within the past year', risk: 2 },
        { value: 'past_month', label: 'Yes, within the past month', risk: 3 },
        { value: 'current', label: 'Yes, currently', risk: 4 }
      ]
    }
  ];

  const submitAssessmentMutation = useMutation({
    mutationFn: async (data: RiskAssessmentData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Calculate risk score
      const riskScore = calculateRiskScore(data);
      const riskLevel = getRiskLevel(riskScore);

      const { data: assessment, error } = await supabase
        .from('user_risk_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'comprehensive',
          risk_level: riskLevel,
          crisis_score: riskScore,
          risk_factors: data as any,
          protective_factors: { factors: data.protective_factors } as any,
          recommendations: generateRecommendations(riskLevel, data) as any,
          next_assessment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // If high risk, create crisis intervention
      if (riskLevel === 'high' || riskLevel === 'crisis') {
        await supabase.from('crisis_interventions').insert({
          user_id: user.id,
          intervention_type: 'risk_assessment_triggered',
          status: 'pending',
          intervention_data: {
            assessment_id: assessment.id,
            risk_score: riskScore,
            immediate_risk: riskLevel === 'crisis'
          }
        });
      }

      return assessment;
    },
    onSuccess: (data) => {
      toast({
        title: "Assessment Complete",
        description: "Your risk assessment has been submitted. Thank you for your honesty.",
      });

      if (data.risk_level === 'high' || data.risk_level === 'crisis') {
        toast({
          title: "🚨 Immediate Support Available",
          description: "Based on your responses, we've connected you with crisis resources.",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateRiskScore = (data: RiskAssessmentData): number => {
    let score = 0;
    
    // Suicide ideation scoring
    const ideationRisk = suicideQuestions[0].options.find(opt => opt.value === data.suicide_ideation)?.risk || 0;
    score += ideationRisk * 3; // Weight suicide ideation heavily

    // Self-harm history scoring
    const selfHarmRisk = suicideQuestions[1].options.find(opt => opt.value === data.self_harm_history)?.risk || 0;
    score += selfHarmRisk * 2;

    // Crisis frequency
    if (data.crisis_frequency === 'weekly') score += 3;
    else if (data.crisis_frequency === 'monthly') score += 2;
    else if (data.crisis_frequency === 'rarely') score += 1;

    // Support system (reverse scoring - less support = higher risk)
    if (data.support_system === 'none') score += 3;
    else if (data.support_system === 'limited') score += 2;
    else if (data.support_system === 'moderate') score += 1;

    // Substance use
    if (data.substance_use === 'daily') score += 3;
    else if (data.substance_use === 'weekly') score += 2;
    else if (data.substance_use === 'occasional') score += 1;

    // Protective factors reduce score
    score -= data.protective_factors.length;

    return Math.max(0, score);
  };

  const getRiskLevel = (score: number): string => {
    if (score >= 15) return 'crisis';
    if (score >= 10) return 'high';
    if (score >= 5) return 'moderate';
    return 'low';
  };

  const generateRecommendations = (riskLevel: string, data: RiskAssessmentData) => {
    const recommendations = [];

    if (riskLevel === 'crisis' || riskLevel === 'high') {
      recommendations.push('Immediate professional intervention recommended');
      recommendations.push('Crisis hotline contact: 988 (Suicide & Crisis Lifeline)');
      recommendations.push('Consider emergency room visit if in immediate danger');
    }

    if (data.support_system === 'none' || data.support_system === 'limited') {
      recommendations.push('Explore building support network');
      recommendations.push('Consider joining support groups');
    }

    if (data.coping_strategies === 'poor' || data.coping_strategies === 'limited') {
      recommendations.push('Learn healthy coping strategies');
      recommendations.push('Practice mindfulness and breathing exercises');
    }

    return { recommendations, generated_at: new Date().toISOString() };
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessmentMutation.mutate(assessmentData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAssessmentData = (field: keyof RiskAssessmentData, value: any) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-therapy-900 mb-2">
                Mental Health Risk Assessment
              </h3>
              <p className="text-therapy-600 max-w-md mx-auto">
                This confidential assessment helps us understand your current mental health status 
                and provide appropriate support. Please answer honestly.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900">Your Safety Matters</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    If you're in immediate danger, please call 911 or text HOME to 741741. 
                    This assessment is not a substitute for professional help.
                  </p>
                </div>
              </div>
            </div>

            {suicideQuestions.map((q) => (
              <div key={q.id} className="space-y-3">
                <Label className="text-base font-medium">{q.question}</Label>
                <RadioGroup 
                  value={assessmentData[q.id as keyof RiskAssessmentData] as string}
                  onValueChange={(value) => updateAssessmentData(q.id as keyof RiskAssessmentData, value)}
                >
                  {q.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-therapy-900">
              Support System & Coping
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  How often do you experience mental health crises?
                </Label>
                <RadioGroup 
                  value={assessmentData.crisis_frequency}
                  onValueChange={(value) => updateAssessmentData('crisis_frequency', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="never" />
                    <Label htmlFor="never">Never</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rarely" id="rarely" />
                    <Label htmlFor="rarely">Rarely (few times per year)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly or more</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">
                  How would you describe your support system?
                </Label>
                <RadioGroup 
                  value={assessmentData.support_system}
                  onValueChange={(value) => updateAssessmentData('support_system', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strong" id="strong" />
                    <Label htmlFor="strong">Strong (family, friends, professionals)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (some support available)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limited" id="limited" />
                    <Label htmlFor="limited">Limited (minimal support)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">None (no support system)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-therapy-900">
              Protective Factors
            </h3>
            <p className="text-therapy-600">
              Select all that apply to you (these are positive factors that help protect your mental health):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Strong family relationships',
                'Close friendships',
                'Spiritual/religious beliefs',
                'Regular exercise routine',
                'Creative hobbies',
                'Stable employment',
                'Financial security',
                'Access to mental health care',
                'Positive coping skills',
                'Sense of purpose',
                'Good physical health',
                'Pet companionship'
              ].map((factor) => (
                <label key={factor} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentData.protective_factors.includes(factor)}
                    onChange={(e) => {
                      const newFactors = e.target.checked
                        ? [...assessmentData.protective_factors, factor]
                        : assessmentData.protective_factors.filter(f => f !== factor);
                      updateAssessmentData('protective_factors', newFactors);
                    }}
                    className="rounded border-therapy-300"
                  />
                  <span className="text-sm">{factor}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-therapy-900">
              Additional Information
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  How would you rate your current coping strategies?
                </Label>
                <RadioGroup 
                  value={assessmentData.coping_strategies}
                  onValueChange={(value) => updateAssessmentData('coping_strategies', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent">Excellent (very effective strategies)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">Good (mostly effective)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limited" id="limited" />
                    <Label htmlFor="limited">Limited (some strategies work)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor">Poor (few or no effective strategies)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">
                  How often do you use alcohol or substances to cope?
                </Label>
                <RadioGroup 
                  value={assessmentData.substance_use}
                  onValueChange={(value) => updateAssessmentData('substance_use', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="sub_never" />
                    <Label htmlFor="sub_never">Never</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasional" id="occasional" />
                    <Label htmlFor="occasional">Occasionally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="sub_weekly" />
                    <Label htmlFor="sub_weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Any additional concerns or information you'd like to share?
                </Label>
                <Textarea
                  value={assessmentData.additional_concerns}
                  onChange={(e) => updateAssessmentData('additional_concerns', e.target.value)}
                  placeholder="Optional: Share any other relevant information..."
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <Heart className="h-12 w-12 text-therapy-600 mx-auto" />
            <h3 className="text-xl font-semibold text-therapy-900">
              Review & Submit
            </h3>
            <p className="text-therapy-600 max-w-md mx-auto">
              Thank you for completing this assessment. Your responses will help us provide 
              you with appropriate support and resources.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-green-600 mt-1" />
                <div className="text-left">
                  <h4 className="font-medium text-green-900">Crisis Resources</h4>
                  <ul className="text-sm text-green-700 mt-1 space-y-1">
                    <li>• Crisis Text Line: Text HOME to 741741</li>
                    <li>• National Suicide Prevention Lifeline: 988</li>
                    <li>• Emergency Services: 911</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Risk Assessment</CardTitle>
          <div className="text-sm text-therapy-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="mt-2" />
      </CardHeader>

      <CardContent>
        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={submitAssessmentMutation.isPending}
            className="bg-therapy-600 hover:bg-therapy-700"
          >
            {submitAssessmentMutation.isPending 
              ? 'Submitting...' 
              : currentStep === totalSteps 
                ? 'Submit Assessment' 
                : 'Next'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentForm;