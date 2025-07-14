import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Check, Crown, Zap, Star, Users, Globe, MapPin } from 'lucide-react';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import GradientLogo from '@/components/ui/GradientLogo';
import AdaptivePlanBuilder from '@/components/family/AdaptivePlanBuilder';
import CurrencySelector from './CurrencySelector';
import TaxInformation from './TaxInformation';
import { AdvancedBillingService } from '@/services/advancedBillingService';

const EnhancedPricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currency, 
    formatPrice, 
    convertPrice, 
    changeCurrency, 
    supportedCurrencies, 
    userLocation,
    suggestCurrencyFromLocation,
    loadingCurrencies
  } = useEnhancedCurrency();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showFamilyPlans, setShowFamilyPlans] = useState(false);
  const [taxInfo, setTaxInfo] = useState<any>(null);
  const [loadingTax, setLoadingTax] = useState(false);

  const suggestion = suggestCurrencyFromLocation();

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
        'Personalized insights',
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
        'API access (1,000 calls/month)',
        'Claude 4 Opus AI model',
        'Phone support',
        'Data export',
        'Premium content',
        'White-label options',
        'Compliance reporting'
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

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return formatPrice(0);
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
    const convertedPrice = convertPrice(price);
    return formatPrice(convertedPrice);
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlySavings = monthlyCost - plan.yearlyPrice;
    return Math.round((yearlySavings / monthlyCost) * 100);
  };

  // Calculate tax information for the most popular plan
  useEffect(() => {
    const calculateTax = async () => {
      if (!userLocation || loadingCurrencies) return;
      
      setLoadingTax(true);
      try {
        const popularPlan = plans.find(p => p.popular);
        if (popularPlan) {
          const basePrice = billingCycle === 'monthly' ? popularPlan.monthlyPrice : popularPlan.yearlyPrice;
          const convertedPrice = convertPrice(basePrice);
          
          const tax = await AdvancedBillingService.calculateTax(
            convertedPrice, 
            userLocation.countryCode, 
            userLocation.region
          );
          
          setTaxInfo({
            ...tax,
            country: userLocation.country,
            countryCode: userLocation.countryCode,
            amount: convertedPrice
          });
        }
      } catch (error) {
        console.error('Failed to calculate tax:', error);
      } finally {
        setLoadingTax(false);
      }
    };

    calculateTax();
  }, [userLocation, currency, billingCycle, convertPrice, loadingCurrencies]);

  if (loadingCurrencies) {
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

          {/* Location & Currency Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200">
                <MapPin className="h-4 w-4" />
                <span>Detected location: {userLocation.country}</span>
              </div>
            )}
            
            <CurrencySelector
              currencies={supportedCurrencies}
              selectedCurrency={currency.code}
              onCurrencyChange={changeCurrency}
              autoDetectedCurrency={suggestion.suggested ? suggestion.currency : undefined}
              className="min-w-[140px]"
            />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => {
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl ${plan.popular ? 'animate-pulse' : ''}`}>
                    <IconComponent className={`${plan.popular ? 'h-8 w-8' : 'h-6 w-6'} text-white`} />
                  </div>
                  
                  <CardTitle className={`${plan.popular ? 'text-2xl' : 'text-2xl'} font-bold text-slate-900 mb-2`}>
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className={`${plan.popular ? 'text-4xl' : 'text-4xl'} font-bold text-slate-800`}>{getPrice(plan)}</span>
                    <span className="text-slate-600">
                      {plan.monthlyPrice === 0 ? '' : `/${billingCycle === 'monthly' ? 'month' : 'month'}`}
                    </span>
                    {billingCycle === 'yearly' && savings && (
                      <div className="text-sm text-therapy-600 font-medium mt-1">
                        Save {savings}% yearly
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-slate-600 ${plan.popular ? 'text-sm' : 'text-sm'} mb-2`}>
                    {plan.description}
                  </p>

                  <div className="text-xs text-slate-500 font-medium">
                    {plan.trialInfo}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className={`${plan.popular ? 'h-5 w-5 text-therapy-500' : 'h-5 w-5 text-therapy-500'} flex-shrink-0 mt-0.5`} />
                        <span className={`text-slate-700 ${plan.popular ? 'text-sm' : 'text-sm'}`}>{feature}</span>
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
                        ? 'bg-gradient-to-r from-therapy-500 via-calm-500 to-therapy-600 hover:from-therapy-600 hover:via-calm-600 hover:to-therapy-700 text-white shadow-lg hover:shadow-xl hover:scale-105 ring-2 ring-therapy-300' 
                        : plan.id === 'professional'
                        ? 'bg-gradient-to-r from-harmony-500 to-harmony-600 hover:from-harmony-600 hover:to-harmony-700 text-white shadow-lg hover:shadow-lg hover:scale-105'
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

        {/* Tax Information */}
        {taxInfo && !loadingTax && (
          <div className="max-w-2xl mx-auto mb-12">
            <TaxInformation
              country={taxInfo.country}
              countryCode={taxInfo.countryCode}
              taxRate={taxInfo.rate}
              taxType={taxInfo.type}
              amount={taxInfo.amount}
              currency={currency.code}
            />
          </div>
        )}

        {/* Family Plans Section */}
        <div className="text-center mb-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-harmony-50 to-balance-50 border-harmony-200">
            <CardContent className="p-8">
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
                Configure Family Plan
              </Button>
            </CardContent>
          </Card>
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

      <AdaptivePlanBuilder
        isOpen={showFamilyPlans}
        onClose={() => setShowFamilyPlans(false)}
        onPlanSelect={handleFamilyPlanSelect}
      />
    </section>
  );
};

export default EnhancedPricingPage;