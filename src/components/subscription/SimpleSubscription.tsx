
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const SimpleSubscription = () => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['Basic mood tracking', 'Limited sessions', 'Community access']
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      features: ['Unlimited sessions', 'Advanced analytics', 'Crisis support', 'Email support']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 59,
      features: ['All Basic features', 'AI personalization', 'Priority support', 'Advanced insights']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.id === 'basic' ? 'border-primary shadow-lg' : ''}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {plan.name}
                {plan.id === 'basic' && <Badge variant="secondary">Popular</Badge>}
              </CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.id === 'basic' ? 'default' : 'outline'}
              >
                {plan.id === 'free' ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimpleSubscription;
