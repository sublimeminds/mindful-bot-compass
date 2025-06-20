import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('free');

  const pricingPlans = [
    {
      id: 'free',
      name: 'Basic',
      description: 'Get started with the essentials.',
      price: 'Free',
      features: [
        'Access to core therapy tools',
        'Limited session history',
        'Community support',
      ],
      cta: 'Get Started',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Unlock advanced features for deeper insights.',
      price: '$19/month',
      features: [
        'All Basic features',
        'Unlimited session history',
        'Personalized insights',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Comprehensive support for optimal wellness.',
      price: '$49/month',
      features: [
        'All Pro features',
        'AI-powered analysis',
        'Dedicated therapist access',
        '24/7 emergency support',
      ],
      cta: 'Go Premium',
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId as 'free' | 'pro' | 'premium');
    if (!user) {
      navigate('/auth');
    } else {
      // Implement subscription logic here
      alert(`You selected the ${planId} plan! (Subscription logic to be implemented)`);
    }
  };

  return (
    <section id="pricing" className="bg-gradient-to-br from-therapy-50 to-calm-50 py-16">
      <div className="container mx-auto text-center">
        <Sparkles className="h-8 w-8 mx-auto mb-4 text-calm-500 animate-pulse" />
        <h2 className="text-3xl font-bold mb-4">Choose Your TherapySync Plan</h2>
        <p className="text-muted-foreground mb-8">
          Find the perfect plan to support your mental wellness journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "shadow-md hover:shadow-lg transition-shadow duration-300",
                selectedPlan === plan.id && "border-2 border-therapy-500"
              )}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-therapy-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
