
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TrialSignup from './subscription/TrialSignup';
import GradientLogo from '@/components/ui/GradientLogo';

// Default plans if hook fails
const defaultPlans = [
  {
    id: 'free',
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    features: {
      'Basic AI therapy sessions': '3 sessions per month',
      'Mood tracking': 'Daily mood logging',
      'Basic goal setting': 'Up to 3 goals',
      'Crisis resources': '24/7 crisis hotline',
      'Community support': 'Access to support groups'
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price_monthly: 19,
    price_yearly: 190,
    features: {
      'Unlimited AI therapy sessions': 'Chat and voice support',
      'Advanced mood tracking': 'Detailed analytics and insights',
      'Goal management': 'Unlimited goals with progress tracking',
      'Technique library': 'Access to 50+ therapeutic techniques',
      'Session history': 'Complete session archive'
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price_monthly: 39,
    price_yearly: 390,
    features: {
      'Everything in Basic': 'All Basic plan features',
      'Priority AI responses': 'Faster response times',
      'Advanced analytics': 'Comprehensive progress reports',
      'Personal therapist matching': 'Connect with human therapists',
      'Custom technique creation': 'Personalized therapeutic approaches'
    }
  }
];

const PricingSection = () => {
  const subscriptionHook = useSubscription();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showTrialModal, setShowTrialModal] = useState(false);

  // Use hook data if available, otherwise fall back to default plans
  const plans = subscriptionHook?.plans?.length > 0 ? subscriptionHook.plans : defaultPlans;
  const loading = subscriptionHook?.loading || false;

  const handlePlanSelect = (plan: any) => {
    if (plan.name === 'Premium' && billingCycle === 'yearly' && !isAuthenticated) {
      setShowTrialModal(true);
      return;
    }

    if (isAuthenticated) {
      navigate('/plans', { state: { selectedPlanId: plan.id, billingCycle } });
    } else {
      navigate('/auth', { state: { selectedPlanId: plan.id, billingCycle, redirectTo: '/plans' } });
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
    if (!monthly || !yearly) return 0;
    const yearlyMonthly = yearly / 12;
    const discount = ((monthly - yearlyMonthly) / monthly) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <section id="pricing" className="py-20 bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmony-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="pricing" className="py-20 bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <GradientLogo 
                size="xl"
                className="drop-shadow-sm"
              />
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Choose Your Mental Health Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              From free basic support to premium unlimited access, find the perfect plan 
              to support your mental wellness goals.
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-slate-800' : 'text-slate-500'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-slate-800' : 'text-slate-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="bg-harmony-100 text-harmony-800">
                  Save up to 20%
                </Badge>
              )}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
              const monthlyPrice = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
              const isPopular = plan.name === 'Premium';
              const showTrial = plan.name === 'Premium' && billingCycle === 'yearly';
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm ${
                    isPopular ? 'ring-2 ring-harmony-500 scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-harmony-500 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-2">
                      <div className={`p-3 rounded-full ${
                        plan.name === 'Free' ? 'bg-slate-100 text-slate-600' :
                        plan.name === 'Basic' ? 'bg-balance-100 text-balance-600' :
                        'bg-harmony-100 text-harmony-600'
                      }`}>
                        {getPlanIcon(plan.name)}
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-slate-800">
                        ${monthlyPrice.toFixed(2)}
                        <span className="text-lg font-normal text-slate-600">/month</span>
                      </div>
                      {billingCycle === 'yearly' && plan.price_yearly > 0 && (
                        <>
                          <div className="text-sm text-slate-500">
                            Billed annually (${plan.price_yearly}/year)
                          </div>
                          <div className="text-sm text-harmony-600 font-medium">
                            Save {getYearlyDiscount(plan.price_monthly, plan.price_yearly)}% with yearly billing
                          </div>
                        </>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features List */}
                    <div className="space-y-3">
                      {Object.entries(plan.features).slice(0, 5).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-harmony-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{String(value)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {showTrial ? (
                        <Button
                          onClick={() => handlePlanSelect(plan)}
                          className="w-full bg-gradient-to-r from-harmony-500 to-flow-600 hover:from-harmony-600 hover:to-flow-700 text-white font-semibold py-3 text-lg"
                        >
                          Start 7-Day Free Trial
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePlanSelect(plan)}
                          className={`w-full ${
                            isPopular 
                              ? 'bg-gradient-to-r from-harmony-500 to-flow-600 hover:from-harmony-600 hover:to-flow-700 text-white' 
                              : plan.name === 'Basic'
                              ? 'bg-gradient-to-r from-balance-500 to-balance-600 hover:from-balance-600 hover:to-balance-700 text-white'
                              : 'border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                          variant={plan.name === 'Free' ? 'outline' : 'default'}
                        >
                          {plan.name === 'Free' ? 'Get Started' : `Choose ${plan.name}`}
                        </Button>
                      )}
                    </div>

                    {showTrial && (
                      <p className="text-xs text-center text-slate-500">
                        No credit card required for trial
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-slate-500">
              All plans include secure, confidential therapy sessions and 24/7 crisis resources
            </p>
          </div>
        </div>
      </section>

      {/* Trial Signup Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <TrialSignup onClose={() => setShowTrialModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default PricingSection;
