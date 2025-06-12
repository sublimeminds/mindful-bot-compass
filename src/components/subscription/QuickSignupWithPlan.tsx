
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Star, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

interface QuickSignupWithPlanProps {
  children: React.ReactNode;
}

const QuickSignupWithPlan = ({ children }: QuickSignupWithPlanProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { plans } = useSubscription();
  const navigate = useNavigate();

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free': return <Zap className="h-5 w-5" />;
      case 'basic': return <Star className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const handlePlanSelect = (planId: string) => {
    if (isAuthenticated) {
      // If user is already logged in, go to onboarding with plan preselected
      navigate('/onboarding', { state: { selectedPlanId: planId, billingCycle } });
    } else {
      // If user is not logged in, go to auth page with plan info
      navigate('/auth', { state: { selectedPlanId: planId, billingCycle, redirectTo: '/onboarding' } });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Choose Your Plan & Get Started
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Select a plan and we'll guide you through the setup process
          </p>
        </DialogHeader>

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
              const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
              const monthlyPrice = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    plan.name === 'Premium' ? 'ring-2 ring-therapy-500 scale-105' : ''
                  } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.name === 'Premium' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-therapy-500 text-white px-4 py-1">
                        Most Popular
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

                  <CardContent className="space-y-4">
                    {/* Features List */}
                    <div className="space-y-2">
                      {Object.entries(plan.features).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full mt-4 ${
                        plan.name === 'Premium' 
                          ? 'bg-therapy-500 hover:bg-therapy-600' 
                          : plan.name === 'Basic'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : ''
                      }`}
                      variant={plan.name === 'Free' ? 'outline' : 'default'}
                    >
                      Get Started with {plan.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {isAuthenticated 
              ? "You'll be taken to complete your onboarding process"
              : "You'll be asked to create an account first, then complete onboarding"
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSignupWithPlan;
