
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Heart, Brain, Shield } from 'lucide-react';

interface EnhancedPlanSelectionStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  preSelectedPlan?: any;
  onboardingData?: any;
}

const EnhancedPlanSelectionStep = ({ onNext, onBack, preSelectedPlan, onboardingData }: EnhancedPlanSelectionStepProps) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(preSelectedPlan || null);
  const [recommendedPlan, setRecommendedPlan] = useState<string>('premium');

  // Determine recommended plan based on mental health assessment
  useEffect(() => {
    if (onboardingData?.mentalHealthAssessment) {
      const { scores } = onboardingData;
      
      if (scores?.riskLevel === 'high' || scores?.phq9 > 14 || scores?.gad7 > 14) {
        setRecommendedPlan('pro');
      } else if (scores?.riskLevel === 'moderate' || scores?.phq9 > 9 || scores?.gad7 > 9) {
        setRecommendedPlan('premium');
      } else {
        setRecommendedPlan('free');
      }
    }
  }, [onboardingData]);

  const plans = [
    {
      id: 'free',
      name: 'Essential Care',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic mental health support',
      icon: Heart,
      color: 'from-harmony-400 to-balance-400',
      features: [
        'Basic AI therapy sessions (5/month)',
        'Mood tracking & insights',
        'Guided meditation library',
        'Crisis resource access',
        'Community support groups',
        'Mobile app access'
      ],
      limitations: [
        'Limited session history',
        'Basic customization',
        'Email support only'
      ]
    },
    {
      id: 'premium',
      name: 'Complete Wellness',
      price: '$29',
      period: 'per month',
      description: 'Comprehensive support for active mental health management',
      icon: Brain,
      color: 'from-therapy-500 to-flow-500',
      popular: true,
      features: [
        'Unlimited AI therapy sessions',
        'Advanced mood analytics',
        'Personalized therapy programs',
        'Voice interaction & analysis',
        'Family member integration',
        'Priority crisis support',
        'Weekly progress reports',
        'Custom goal tracking',
        'Advanced meditation library',
        'Live chat support'
      ],
      limitations: []
    },
    {
      id: 'pro',
      name: 'Professional Care',
      price: '$79',
      period: 'per month',
      description: 'Enterprise-level care with human therapist network access',
      icon: Crown,
      color: 'from-flow-600 to-harmony-600',
      features: [
        'Everything in Complete Wellness',
        'Licensed therapist matching',
        'Video therapy sessions (4/month)',
        'Psychiatric medication support',
        'Crisis intervention team',
        'Family therapy sessions',
        'Advanced trauma-informed care',
        'Real-time crisis monitoring',
        'Custom treatment plans',
        'Insurance integration support',
        'Phone & video support'
      ],
      limitations: []
    }
  ];

  const getRecommendationReason = () => {
    if (!onboardingData?.scores) return '';
    
    const { phq9, gad7, riskLevel } = onboardingData.scores;
    
    if (riskLevel === 'high') {
      return 'Based on your assessment, we recommend professional care with access to licensed therapists and crisis support.';
    } else if (riskLevel === 'moderate') {
      return 'Your assessment suggests you would benefit from comprehensive wellness features and personalized therapy programs.';
    } else {
      return 'You\'re doing well! Essential care provides great foundational support for maintaining mental wellness.';
    }
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    onNext({
      selectedPlan,
      planRecommendation: {
        recommended: recommendedPlan,
        reason: getRecommendationReason()
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-therapy-600 to-flow-600 bg-clip-text text-transparent">
          Choose Your Care Plan
        </h2>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your mental health journey
        </p>
        {onboardingData?.scores && (
          <div className="mt-4 p-4 bg-therapy-50 rounded-lg border border-therapy-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-therapy-600" />
              <span className="font-medium text-therapy-700">Personalized Recommendation</span>
            </div>
            <p className="text-sm text-therapy-600">{getRecommendationReason()}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isRecommended = plan.id === recommendedPlan;
          const isSelected = selectedPlan?.id === plan.id;
          
          return (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isSelected 
                  ? 'ring-2 ring-therapy-500 shadow-lg' 
                  : 'hover:shadow-lg'
              } ${isRecommended ? 'border-therapy-300 bg-therapy-50/30' : ''}`}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-therapy-500 to-flow-500 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isRecommended && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="outline" className="bg-therapy-500 text-white border-therapy-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4 animate-pulse-glow`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-therapy-600">
                    {plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.period}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-green-700 mb-2 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    What's Included
                  </h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-sm text-amber-700 mb-2">
                      Limitations
                    </h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <span className="text-amber-500">•</span>
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full mt-4 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-therapy-500 to-flow-500 hover:from-therapy-600 hover:to-flow-600' 
                      : ''
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="text-center p-4 bg-gradient-to-r from-therapy-50 to-flow-50 rounded-lg">
          <p className="text-sm text-therapy-700 mb-2">
            You've selected <strong>{selectedPlan.name}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            You can change your plan anytime after completing setup
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="bg-gradient-to-r from-therapy-500 to-flow-500 hover:from-therapy-600 hover:to-flow-600"
        >
          Continue Setup
        </Button>
      </div>
    </div>
  );
};

export default EnhancedPlanSelectionStep;
