
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check } from 'lucide-react';

interface UpgradePromptProps {
  subscription: any;
  plans: any[];
  usage: any;
  loading: boolean;
  changePlan: (planId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

const UpgradePrompt = ({ subscription, plans, usage, loading, changePlan }: UpgradePromptProps) => {
  const isFreePlan = subscription?.plan_name === 'Free' || !subscription;

  if (!isFreePlan) return null;

  const premiumFeatures = [
    'Unlimited therapy sessions',
    'Advanced mood analytics',
    'Crisis support priority',
    'Personalized insights',
    'Progress tracking'
  ];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Upgrade to Premium
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Most Popular
          </Badge>
        </CardTitle>
        <p className="text-muted-foreground">
          Unlock all features and get the most out of your therapy journey
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold">$29</div>
          <div className="text-sm text-muted-foreground">/month</div>
        </div>

        <ul className="space-y-3">
          {premiumFeatures.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => changePlan('premium')}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : 'Upgrade Now'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Cancel anytime. No long-term commitment.
        </p>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
