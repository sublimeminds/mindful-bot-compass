
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Heart, Star, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PlanSelectionStepProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  onboardingData?: any;
  showAsOptionalUpsell?: boolean;
}

const PlanSelectionStep = ({ onNext, onBack, onboardingData, showAsOptionalUpsell = false }: PlanSelectionStepProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const subscriptionAccess = useSubscriptionAccess();
  const [selectedPlan, setSelectedPlan] = useState<string>(''); // No pre-selection
  
  // Get current therapy plan count
  const { data: therapyPlanCount = 0 } = useQuery({
    queryKey: ['therapy-plan-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count } = await supabase
        .from('therapy_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const isAtLimit = therapyPlanCount >= subscriptionAccess.therapyPlanLimit;
  const showMandatoryUpgrade = subscriptionAccess.tier === 'free' && isAtLimit;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic mood tracking',
        '3 therapy sessions per month',
        'Community support',
        'Basic insights'
      ],
      icon: Heart,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29',
      period: '/month',
      features: [
        'Advanced mood analytics',
        'Unlimited therapy sessions',
        'Personalized insights',
        'Priority support',
        'Goal tracking',
        'Progress reports'
      ],
      icon: Star,
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Premium',
        'AI-powered recommendations',
        'Custom therapy plans',
        'Family sharing',
        'Expert consultations',
        'Advanced analytics'
      ],
      icon: Crown,
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {showMandatoryUpgrade ? 'Upgrade Required' : showAsOptionalUpsell ? 'Upgrade Your Experience' : 'Choose Your Plan'}
        </h2>
        <p className="text-muted-foreground">
          {showMandatoryUpgrade 
            ? `You've reached your therapy plan limit (${therapyPlanCount}/${subscriptionAccess.therapyPlanLimit}). Upgrade to create unlimited therapy plans.`
            : showAsOptionalUpsell 
            ? 'You can create your therapy plan now, or upgrade for premium features and unlimited access.'
            : 'Select the plan that best fits your mental health journey'
          }
        </p>
      </div>

      {showMandatoryUpgrade && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Therapy Plan Limit Reached</h3>
            <p className="text-sm text-amber-700 mt-1">
              You currently have {therapyPlanCount} therapy plan(s) out of your {subscriptionAccess.therapyPlanLimit} plan limit. 
              Upgrade to Professional to create unlimited personalized therapy plans.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-therapy-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-therapy-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <IconComponent className="h-12 w-12 mx-auto text-therapy-500" />
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={selectedPlan === plan.id ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Previous
        </Button>
        <div className="flex space-x-3">
          {showAsOptionalUpsell && !selectedPlan && (
            <Button 
              variant="outline"
              onClick={() => onNext({ skipPlanSelection: true })}
            >
              Skip for now
            </Button>
          )}
          <Button 
            onClick={() => onNext({ selectedPlan, planData: plans.find(p => p.id === selectedPlan) })} 
            className="bg-therapy-500 hover:bg-therapy-600"
            disabled={!selectedPlan}
          >
            {selectedPlan 
              ? `Continue with ${plans.find(p => p.id === selectedPlan)?.name}`
              : showMandatoryUpgrade 
              ? 'Select a plan to continue'
              : 'Select a plan'
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionStep;
