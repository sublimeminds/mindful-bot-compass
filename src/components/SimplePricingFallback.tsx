import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Star } from 'lucide-react';

const SimplePricingFallback = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleGetStarted = (plan: string) => {
    const planSelection = {
      name: plan,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    navigate('/onboarding');
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '3 AI therapy sessions per month',
        'Basic mood tracking',
        'Community access'
      ],
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      monthlyPrice: 9.90,
      yearlyPrice: 99,
      description: 'Comprehensive mental health support',
      features: [
        'Unlimited AI therapy sessions',
        'Advanced mood analytics',
        'Voice interaction capabilities',
        'Priority support'
      ],
      buttonText: 'Start Premium',
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Crown,
      monthlyPrice: 24.90,
      yearlyPrice: 249,
      description: 'Advanced features for professionals',
      features: [
        'Everything in Premium',
        'Client management tools',
        'Advanced analytics',
        'API access'
      ],
      buttonText: 'Start Trial',
      popular: false
    }
  ];

  const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return formatPrice(0);
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
    return formatPrice(price);
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as your mental wellness journey evolves.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-therapy-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-therapy-100 text-therapy-700 border-therapy-200">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-4 ring-therapy-400 shadow-therapy-500/30 scale-105 bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200' 
                    : 'hover:shadow-therapy-500/10 bg-white/80 backdrop-blur-sm border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-therapy-500 via-calm-500 to-therapy-600 text-white text-center py-3 text-sm font-bold tracking-wide">
                    ⭐ MOST POPULAR ⭐
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-16 pb-6' : 'pb-8'}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-800">{getPrice(plan)}</span>
                    <span className="text-slate-600">
                      {plan.monthlyPrice === 0 ? '' : '/month'}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full font-semibold text-base py-3 transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-therapy-500 via-calm-500 to-therapy-600 hover:from-therapy-600 hover:via-calm-600 hover:to-therapy-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md hover:shadow-lg hover:scale-105'
                    }`}
                    onClick={() => handleGetStarted(plan.name)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            No credit card required for Free plan.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>🔒 HIPAA Compliant</span>
            <span>🌍 Available Worldwide</span>
            <span>💬 24/7 AI Support</span>
            <span>📱 Mobile & Web Access</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimplePricingFallback;