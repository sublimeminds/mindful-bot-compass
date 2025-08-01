
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

interface PlanSelectorProps {
  onSelectPlan: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
}

const PlanSelector = ({ onSelectPlan }: PlanSelectorProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Basic therapy features to get started',
      features: [
        '8 therapy sessions per month',
        'Basic mood tracking',
        'Community access',
        'Email support',
        '10 AI messages per day'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 14.90, yearly: 149 },
      description: 'Enhanced therapy features for regular users',
      features: [
        'Unlimited therapy sessions',
        'Advanced analytics',
        'Personalized insights',
        'Crisis support',
        'Voice interaction',
        'Priority support',
        'Meditation library'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 24.90, yearly: 249 },
      description: 'Complete therapy platform with advanced features for power users',
      features: [
        'Unlimited therapy sessions',
        'Advanced dashboard',
        'API access',
        'White-label features',
        'Phone support',
        'Compliance reporting',
        'Premium content'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular
                ? 'border-primary shadow-lg ring-2 ring-primary/10'
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${plan.price[billingCycle]}
                </span>
                <span className="text-muted-foreground">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.id, billingCycle)}
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                }`}
              >
                {plan.price[billingCycle] === 0 ? 'Get Started' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector;
