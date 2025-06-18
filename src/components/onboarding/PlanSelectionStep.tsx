
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import GradientLogo from '@/components/ui/GradientLogo';

interface PlanSelectionStepProps {
  selectedPlan?: { planId: string; billingCycle: 'monthly' | 'yearly' } | null;
  onPlanSelect: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  onNext: () => void;
  onBack: () => void;
}

const PlanSelectionStep = ({ selectedPlan, onPlanSelect, onNext, onBack }: PlanSelectionStepProps) => {
  const { plans } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free': return <Zap className="h-6 w-6" />;
      case 'basic': return <Star className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const handlePlanSelect = (planId: string) => {
    onPlanSelect(planId, billingCycle);
  };

  const isSelected = (planId: string) => {
    return selectedPlan?.planId === planId && selectedPlan?.billingCycle === billingCycle;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <GradientLogo 
            size="md"
            className="drop-shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select the plan that best fits your mental health journey
        </p>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
          const monthlyPrice = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
          const selected = isSelected(plan.id);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                plan.name === 'Premium' ? 'ring-2 ring-harmony-500 scale-105' : ''
              } ${selected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.name === 'Premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-harmony-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              {selected && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Selected
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-3 rounded-full ${
                    plan.name === 'Free' ? 'bg-gray-100 text-gray-600' :
                    plan.name === 'Basic' ? 'bg-blue-100 text-blue-600' :
                    'bg-harmony-100 text-harmony-600'
                  }`}>
                    {getPlanIcon(plan.name)}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold">
                  {plan.name}
                </CardTitle>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    ${monthlyPrice.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  {billingCycle === 'yearly' && plan.price_yearly > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Billed annually (${plan.price_yearly}/year)
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Key Features */}
                <div className="space-y-2">
                  {Object.entries(plan.features).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedPlan}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PlanSelectionStep;
