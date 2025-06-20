
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Heart, Star, Sparkles, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/hooks/useCurrency';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  description: string;
}

interface PlanSelectorProps {
  onSelectPlan: (planId: string, isYearly: boolean) => void;
  currentPlanId?: string;
  showTrialInfo?: boolean;
}

const PlanSelector = ({ onSelectPlan, currentPlanId, showTrialInfo = false }: PlanSelectorProps) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlanId || 'free');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Perfect for getting started',
      features: [
        'Basic mood tracking',
        '3 therapy sessions per month',
        'Community support',
        'Basic insights',
        'Mobile app access'
      ],
      icon: Heart
    },
    {
      id: 'premium',
      name: 'Premium',
      priceMonthly: 29,
      priceYearly: 290,
      description: 'Most popular for regular users',
      popular: true,
      features: [
        'Advanced mood analytics',
        'Unlimited therapy sessions',
        'Personalized insights',
        'Priority support',
        'Goal tracking',
        'Progress reports',
        'Custom therapy plans',
        'Export your data'
      ],
      icon: Star
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 49,
      priceYearly: 490,
      description: 'For power users and families',
      features: [
        'Everything in Premium',
        'AI-powered recommendations',
        'Advanced therapy matching',
        'Family sharing (up to 5 members)',
        'Expert consultations',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support'
      ],
      icon: Crown
    }
  ];

  const getPrice = (plan: Plan) => {
    const price = isYearly ? plan.priceYearly : plan.priceMonthly;
    return price === 0 ? 'Free' : formatPrice(price);
  };

  const getSavings = (plan: Plan) => {
    if (plan.priceYearly === 0) return null;
    const monthlyCost = plan.priceMonthly * 12;
    const savings = monthlyCost - plan.priceYearly;
    return savings;
  };

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isYearly ? 'bg-therapy-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isYearly ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
          Yearly
        </span>
        {isYearly && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save up to 20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const savings = getSavings(plan);
          
          return (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-therapy-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${plan.popular ? 'border-therapy-200' : ''}`}
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
                <IconComponent className={`h-12 w-12 mx-auto ${
                  plan.popular ? 'text-therapy-500' : 'text-gray-500'
                }`} />
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {getPrice(plan)}
                    {plan.priceMonthly > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isYearly && savings && savings > 0 && (
                    <div className="text-sm text-green-600">
                      Save {formatPrice(savings)} per year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {showTrialInfo && plan.id !== 'free' && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-blue-700">
                        7-day free trial included
                      </span>
                    </div>
                  </div>
                )}
                
                <Button
                  variant={selectedPlan === plan.id ? 'default' : 'outline'}
                  className={`w-full ${
                    plan.popular && selectedPlan === plan.id
                      ? 'bg-therapy-500 hover:bg-therapy-600'
                      : ''
                  }`}
                  onClick={() => onSelectPlan(plan.id, isYearly)}
                >
                  {currentPlanId === plan.id
                    ? 'Current Plan'
                    : selectedPlan === plan.id
                    ? 'Selected'
                    : plan.priceMonthly === 0
                    ? 'Get Started'
                    : 'Select Plan'
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelector;
