
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import GradientLogo from '@/components/ui/GradientLogo';

const ComprehensivePricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleGetStarted = (plan: string) => {
    if (user) {
      navigate('/onboarding');
    } else {
      // For premium/professional plans, go to register first, then onboarding
      if (plan === 'Premium' || plan === 'Professional') {
        navigate('/register');
      } else {
        // For free plan, can go directly to auth (login or register)
        navigate('/auth');
      }
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started with your mental wellness journey',
      features: [
        '3 AI therapy sessions per month',
        'Basic mood tracking',
        'Community access',
        'Essential wellness tools',
        'Email support',
        'Basic goal setting'
      ],
      limitations: ['Limited session history', 'Basic analytics only'],
      buttonText: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600',
      trialDays: null
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      monthlyPrice: 9.90,
      yearlyPrice: 99,
      description: 'For dedicated users seeking comprehensive mental health support',
      features: [
        'Unlimited AI therapy sessions',
        'Advanced mood analytics',
        'Personalized insights & recommendations',
        'Goal tracking with progress reports',
        'Crisis support resources',
        'Voice interaction capabilities',
        'Priority email support',
        'Export your data',
        'Cultural awareness features',
        'Offline mode access'
      ],
      limitations: [],
      buttonText: 'Start Premium',
      popular: false,
      gradient: 'from-therapy-500 to-therapy-600',
      trialDays: null
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Crown,
      monthlyPrice: 24.90,
      yearlyPrice: 249,
      description: 'Advanced features for mental health professionals and coaches',
      features: [
        'Everything in Premium',
        '7-day free trial included',
        'Client management tools',
        'Advanced analytics dashboard',
        'Custom therapy protocols',
        'White-label options',
        'API access',
        'Phone support',
        'Compliance reporting',
        'Team collaboration features',
        'Advanced security controls'
      ],
      limitations: [],
      buttonText: 'Start 7-Day Free Trial',
      popular: true,
      gradient: 'from-harmony-500 to-harmony-600',
      trialDays: 7
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return '$0';
    return billingCycle === 'monthly' ? `$${plan.monthlyPrice}` : `$${Math.floor(plan.yearlyPrice / 12)}`;
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
            <GradientLogo 
              size="xl"
              className="drop-shadow-sm"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as your mental wellness journey evolves. All plans include our core AI therapy features with enterprise-grade security.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-4 ring-harmony-400 shadow-harmony-500/30 scale-110 bg-gradient-to-br from-harmony-50 to-balance-50 border-harmony-200' 
                    : 'hover:shadow-therapy-500/10 bg-white/80 backdrop-blur-sm border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-500 text-white text-center py-3 text-sm font-bold tracking-wide">
                    ⭐ MOST POPULAR - START FREE TRIAL ⭐
                  </div>
                )}
                
                {plan.trialDays && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-harmony-500 to-balance-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.trialDays} Days FREE
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-16 pb-8' : 'pb-8'}`}>
                  <div className={`w-20 h-20 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ${plan.popular ? 'animate-pulse' : ''}`}>
                    <IconComponent className={`${plan.popular ? 'h-10 w-10' : 'h-8 w-8'} text-white`} />
                  </div>
                  
                  <CardTitle className={`${plan.popular ? 'text-3xl' : 'text-2xl'} font-bold text-slate-900 mb-2`}>
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className={`${plan.popular ? 'text-5xl' : 'text-4xl'} font-bold text-slate-800`}>{getPrice(plan)}</span>
                    <span className="text-slate-600">
                      {plan.monthlyPrice === 0 ? '' : `/${billingCycle === 'monthly' ? 'month' : 'month'}`}
                    </span>
                    {billingCycle === 'yearly' && savings && (
                      <div className="text-sm text-therapy-600 font-medium mt-1">
                        Save {savings}% yearly
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-slate-600 ${plan.popular ? 'text-base font-medium' : 'text-sm'}`}>
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className={`${plan.popular ? 'h-6 w-6 text-harmony-500' : 'h-5 w-5 text-therapy-500'} flex-shrink-0 mt-0.5`} />
                        <span className={`text-slate-700 ${plan.popular ? 'text-base font-medium' : 'text-sm'}`}>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <span className="h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        </span>
                        <span className="text-slate-600 text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full font-semibold text-base py-3 transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-500 hover:from-harmony-600 hover:via-balance-600 hover:to-flow-600 text-white shadow-lg hover:shadow-xl hover:scale-105 ring-2 ring-harmony-300' 
                        : plan.id === 'free'
                        ? 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                        : 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white shadow-md hover:shadow-lg hover:scale-105'
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
            ✨ Professional plan includes a 7-day free trial. No credit card required for Free plan.
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

export default ComprehensivePricingSection;
