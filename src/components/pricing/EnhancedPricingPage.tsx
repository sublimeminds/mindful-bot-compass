import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Zap, Star, Users, ChevronDown, ChevronUp } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import RestyledFamilyPlanSelector from '@/components/family/RestyledFamilyPlanSelector';
import RegionalPricingContainer from './RegionalPricingContainer';
import { useRegionalPreferences } from '@/hooks/useRegionalPreferences';
import UnifiedRegionalSelector from '@/components/regional/UnifiedRegionalSelector';

const EnhancedPricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { regionalPreferences, isLoading } = useRegionalPreferences();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showFamilyPlans, setShowFamilyPlans] = useState(false);
  const [showExtendedFeatures, setShowExtendedFeatures] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started with your mental wellness journey',
      features: [
        '1 therapy plan',
        '8 AI therapy sessions per month',
        '100 AI messages per day',
        '2 AI therapist personalities',
        'Basic mood tracking',
        'Community access',
        'GPT-4o Mini AI model',
        'Email support'
      ],
      limitations: ['Limited session history', 'Basic analytics only'],
      buttonText: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600',
      trialInfo: 'No trial needed'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      monthlyPrice: 14.90,
      yearlyPrice: 149,
      description: 'For dedicated users seeking comprehensive mental health support',
      features: [
        'Everything in Free',
        '3 therapy plans',
        'Unlimited AI therapy sessions',
        'Unlimited AI messages',
        '8 specialized AI therapists',
        'Advanced mood analytics',
        'Real-time AI insights',
        'Personalized reports (anytime access)',
        'Voice interaction',
        'Cultural adaptation (30+ cultures)',
        'Claude 4 Opus AI model',
        'Priority support',
        'Podcasts & meditation library'
      ],
      limitations: [],
      buttonText: 'Start Premium',
      popular: true,
      gradient: 'from-therapy-500 to-therapy-600',
      trialInfo: billingCycle === 'yearly' ? '7-day free trial included' : 'No trial'
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
        '10 therapy plans',
        'Unlimited AI messages',
        '12+ expert AI therapists',
        'Advanced dashboard',
        'Real-time AI insights',
        'Personalized reports (anytime access)',
        'API access (1,000 calls/month)',
        'Claude 4 Opus AI model',
        'Phone support',
        'Data export',
        'Premium content'
      ],
      limitations: [],
      buttonText: 'Start 7-Day Free Trial',
      popular: false,
      gradient: 'from-harmony-500 to-harmony-600',
      trialInfo: '7-day free trial'
    }
  ];

  const handleGetStarted = (plan: string) => {
    const planSelection = {
      name: plan,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    navigate('/onboarding');
  };

  const handleFamilyPlanSelect = (planId: string, seats: number, billingCycle: 'monthly' | 'yearly') => {
    localStorage.setItem('selectedPlan', JSON.stringify({
      name: `Family ${planId}`,
      seats,
      billingCycle,
      selectedAt: new Date().toISOString()
    }));
    navigate('/onboarding');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-therapy-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading pricing information...</p>
        </div>
      </div>
    );
  }

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

          {/* Regional Selector */}
          <div className="flex justify-center mb-8">
            <UnifiedRegionalSelector />
          </div>

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

        {/* Regional Pricing Container */}
        <RegionalPricingContainer
          plans={plans}
          billingCycle={billingCycle}
          onPlanSelect={handleGetStarted}
          className="mb-12"
        />

        {/* Family Plans Section */}
        <div className="text-center mb-12">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-harmony-50 to-balance-50 border border-harmony-200 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-harmony-600 mr-3" />
              <h3 className="text-2xl font-bold text-harmony-700">Family Plans Available</h3>
            </div>
            <p className="text-harmony-600 mb-6">
              Get comprehensive mental health support for your entire family with custom pricing based on your needs. Save more with larger families!
            </p>
            <Button
              onClick={() => setShowFamilyPlans(true)}
              className="bg-gradient-to-r from-harmony-500 to-balance-500 hover:from-harmony-600 hover:to-balance-600 text-white px-8 py-3 font-semibold"
            >
              <Users className="h-5 w-5 mr-2" />
              Customize Family Plan
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            No credit card required for Free plan. Professional plan includes 7-day free trial.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>🔒 HIPAA Compliant</span>
            <span>🌍 Available Worldwide</span>
            <span>💬 24/7 AI Support</span>
            <span>📱 Mobile & Web Access</span>
          </div>
        </div>
      </div>

      <RestyledFamilyPlanSelector
        isOpen={showFamilyPlans}
        onClose={() => setShowFamilyPlans(false)}
      />
    </section>
  );
};

export default EnhancedPricingPage;