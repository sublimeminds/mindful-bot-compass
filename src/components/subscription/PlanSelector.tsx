
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface PlanSelectorProps {
  onPlanSelect?: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  showCurrentPlan?: boolean;
}

const PlanSelector = ({ onPlanSelect, showCurrentPlan = false }: PlanSelectorProps) => {
  const { plans, getCurrentPlan, createCheckoutSession } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const currentPlan = getCurrentPlan();

  const handleSelectPlan = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId, billingCycle);
    } else {
      createCheckoutSession(planId, billingCycle);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free': return <Zap className="h-6 w-6" />;
      case 'basic': return <Star className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getYearlyDiscount = (monthly: number, yearly: number) => {
    const yearlyMonthly = yearly / 12;
    const discount = ((monthly - yearlyMonthly) / monthly) * 100;
    return Math.round(discount);
  };

  return (
    <div className="space-y-6">
      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={`font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save 20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = showCurrentPlan && currentPlan?.id === plan.id;
          const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
          const monthlyPrice = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.name === 'Premium' ? 'ring-2 ring-therapy-500 scale-105' : ''
              } ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.name === 'Premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-therapy-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-3 rounded-full ${
                    plan.name === 'Free' ? 'bg-gray-100 text-gray-600' :
                    plan.name === 'Basic' ? 'bg-blue-100 text-blue-600' :
                    'bg-therapy-100 text-therapy-600'
                  }`}>
                    {getPlanIcon(plan.name)}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    ${monthlyPrice.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  {billingCycle === 'yearly' && plan.price_yearly > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Billed annually (${plan.price_yearly}/year)
                    </div>
                  )}
                  {billingCycle === 'yearly' && plan.price_yearly > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {getYearlyDiscount(plan.price_monthly, plan.price_yearly)}% with yearly billing
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-3">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Limits Display */}
                <div className="pt-4 border-t space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Usage Limits
                  </div>
                  {Object.entries(plan.limits).map(([key, value]) => {
                    const displayValue = value === -1 ? 'Unlimited' : value.toString();
                    const displayKey = key.replace(/_/g, ' ').replace(/per month|per day|max/, '').trim();
                    
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="capitalize">{displayKey}:</span>
                        <span className="font-medium">{displayValue}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || (plan.name === 'Free' && !onPlanSelect)}
                  className={`w-full mt-6 ${
                    plan.name === 'Premium' 
                      ? 'bg-therapy-500 hover:bg-therapy-600' 
                      : plan.name === 'Basic'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : ''
                  }`}
                  variant={plan.name === 'Free' ? 'outline' : 'default'}
                >
                  {isCurrentPlan ? 'Current Plan' : 
                   plan.name === 'Free' ? 'Get Started' : 
                   `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="text-center text-sm text-muted-foreground">
        All plans include secure, confidential therapy sessions and 24/7 crisis resources
      </div>
    </div>
  );
};

export default PlanSelector;
