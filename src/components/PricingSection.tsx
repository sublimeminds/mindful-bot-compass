
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Star, Users } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleGetStarted = (planName: string, planPrice?: number) => {
    const planSelection = {
      name: planName,
      price: planPrice,
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
      description: 'Basic therapy features to get started',
      features: [
        '1 therapy plan',
        '8 therapy sessions per month',
        '100 AI messages per day',
        'Basic mood tracking',
        'Community access',
        'GPT-4o AI model',
        'Email support'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      monthlyPrice: 14.90,
      yearlyPrice: 149,
      description: 'Enhanced therapy features for regular users',
      features: [
        '3 therapy plans',
        'Unlimited AI messages',
        'Unlimited therapy sessions',
        'Claude 4 Opus AI model',
        'Advanced analytics',
        'Personalized insights',
        'Crisis support',
        'Voice interaction',
        'Priority support',
        'Podcasts & meditation library'
      ],
      buttonText: 'Start Premium',
      popular: true,
      gradient: 'from-therapy-500 to-therapy-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Crown,
      monthlyPrice: 24.90,
      yearlyPrice: 249,
      description: 'Complete therapy platform with advanced features for power users',
      features: [
        'Everything in Premium',
        '10 therapy plans',
        'Unlimited AI messages',
        'Advanced dashboard',
        'API access (1,000 calls/month)',
        'Claude 4 Sonnet AI model',
        'Phone support',
        'Data export',
        'Premium content'
      ],
      buttonText: 'Start Professional',
      popular: false,
      gradient: 'from-harmony-500 to-balance-500'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return '$0';
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
    return `$${price}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlySavings = monthlyCost - plan.yearlyPrice;
    return Math.round((yearlySavings / monthlyCost) * 100);
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GradientLogo size="xl" className="drop-shadow-sm" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as your mental wellness journey evolves. All plans include our core AI therapy features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:ring-offset-2 ${
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const savings = getSavings(plan);
            
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-800">{getPrice(plan)}</span>
                    <span className="text-slate-600">
                      {plan.monthlyPrice === 0 ? '' : `/${billingCycle === 'monthly' ? 'month' : 'month'}`}
                    </span>
                    {billingCycle === 'yearly' && savings && (
                      <div className="text-sm text-therapy-600 font-medium mt-1">
                        Save {savings}% yearly
                      </div>
                    )}
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
                        : plan.id === 'family'
                        ? 'bg-gradient-to-r from-harmony-500 to-balance-500 hover:from-harmony-600 hover:to-balance-600 text-white shadow-lg hover:shadow-lg hover:scale-105'
                        : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md hover:shadow-lg hover:scale-105'
                    }`}
                    onClick={() => handleGetStarted(plan.name, plan.monthlyPrice)}
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
            No credit card required for Free plan. Start your journey today.
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

export default PricingSection;
