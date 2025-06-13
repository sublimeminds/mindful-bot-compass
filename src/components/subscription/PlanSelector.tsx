
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Crown, Star, Zap, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlanSelectorProps {
  onPlanSelect?: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  showCurrentPlan?: boolean;
}

const PlanSelector = ({ onPlanSelect, showCurrentPlan = false }: PlanSelectorProps) => {
  const { plans, getCurrentPlan, loading } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentPlan = getCurrentPlan();

  const handleSelectPlan = async (plan: any) => {
    console.log('Selecting plan:', plan.name, 'with billing:', billingCycle);
    
    if (plan.name === 'Free') {
      // Handle free plan selection if needed
      if (onPlanSelect) {
        onPlanSelect(plan.id, billingCycle);
      }
      return;
    }

    setProcessingPlan(plan.id);

    if (onPlanSelect) {
      onPlanSelect(plan.id, billingCycle);
    } else {
      // Create checkout session directly
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { 
            planId: plan.id, 
            billingCycle: billingCycle 
          }
        });

        if (error) throw error;

        if (data.url) {
          window.open(data.url, '_blank');
          toast({
            title: "Payment window opened",
            description: "Complete your payment in the new tab to activate your subscription.",
          });
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Error",
          description: "Failed to start checkout. Please try again.",
          variant: "destructive",
        });
      }
    }

    setProcessingPlan(null);
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
    if (!monthly || !yearly) return 0;
    const yearlyMonthly = yearly / 12;
    const discount = ((monthly - yearlyMonthly) / monthly) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No plans available at the moment.</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

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
          const isProcessing = processingPlan === plan.id;
          
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
                  {plan.name === 'Premium' && billingCycle === 'yearly' && (
                    <div className="text-sm text-therapy-600 font-medium">
                      🎉 Includes 7-day free trial
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-3">
                  {Object.entries(plan.features).slice(0, 4).map(([key, value]) => (
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
                  {Object.entries(plan.limits).slice(0, 2).map(([key, value]) => {
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
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan || isProcessing}
                  className={`w-full mt-6 ${
                    plan.name === 'Premium' 
                      ? 'bg-therapy-500 hover:bg-therapy-600' 
                      : plan.name === 'Basic'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : ''
                  }`}
                  variant={plan.name === 'Free' ? 'outline' : 'default'}
                >
                  {isProcessing ? 'Processing...' :
                   isCurrentPlan ? 'Current Plan' : 
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
