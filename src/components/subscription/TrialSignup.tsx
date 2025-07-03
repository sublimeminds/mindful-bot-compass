
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const TrialSignup = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTrial = async () => {
    setIsLoading(true);
    // Simulate trial signup
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Trial started');
  };

  const features = [
    'Unlimited therapy sessions',
    'Advanced mood tracking',
    'Personalized insights',
    'Crisis support',
    'Progress analytics'
  ];

  if (!user) return null;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            14-Day Free Trial
          </Badge>
        </div>
        <CardTitle>Start Your Free Trial</CardTitle>
        <p className="text-muted-foreground">
          Experience premium features with no commitment
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold">$0</div>
          <div className="text-sm text-muted-foreground">for 14 days, then $29/month</div>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={handleStartTrial}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Starting Trial...' : 'Start Free Trial'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Cancel anytime. No credit card required.
        </p>
      </CardContent>
    </Card>
  );
};

export default TrialSignup;
