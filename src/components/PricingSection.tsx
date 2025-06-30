
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Heart, ArrowRight, Zap, Crown, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import CurrencySelector from '@/components/ui/CurrencySelector';

const PricingSection = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useEnhancedLanguage();
  const [userCurrency, setUserCurrency] = React.useState('USD');
  const [userLocation, setUserLocation] = React.useState(null);
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  React.useEffect(() => {
    const detectCurrency = async () => {
      try {
        const location = await enhancedCurrencyService.detectUserLocation();
        if (location) {
          setUserCurrency(location.currency);
          setUserLocation(location);
        }
      } catch (error) {
        console.warn('Could not detect currency');
      }
    };
    detectCurrency();
  }, []);

  const formatPrice = async (monthlyPrice: number, isYearly: boolean = false) => {
    try {
      let finalPrice = monthlyPrice;
      
      if (isYearly) {
        // Apply yearly discounts
        const yearlyDiscounts = { 9: 79, 19: 149 }; // Pro: $79/year, Premium: $149/year
        const yearlyPrice = yearlyDiscounts[monthlyPrice] || monthlyPrice * 10; // fallback
        finalPrice = yearlyPrice;
      }

      const convertedAmount = enhancedCurrencyService.convertAmount(finalPrice, 'USD', userCurrency);
      let adjustedAmount = convertedAmount;
      
      if (userLocation) {
        adjustedAmount = await enhancedCurrencyService.getRegionalPricing(finalPrice, userCurrency, userLocation.region);
      }
      
      return enhancedCurrencyService.formatCurrency(adjustedAmount, userCurrency, currentLanguage.code);
    } catch (error) {
      console.error('Error formatting price:', error);
      return enhancedCurrencyService.formatCurrency(monthlyPrice, 'USD', currentLanguage.code);
    }
  };

  const [formattedPrices, setFormattedPrices] = React.useState({
    free: 'Free',
    proMonthly: '$9',
    proYearly: '$79',
    premiumMonthly: '$19',
    premiumYearly: '$149'
  });

  React.useEffect(() => {
    const updatePrices = async () => {
      try {
        const proMonthly = await formatPrice(9, false);
        const proYearly = await formatPrice(9, true);
        const premiumMonthly = await formatPrice(19, false);
        const premiumYearly = await formatPrice(19, true);
        
        setFormattedPrices({
          free: 'Free',
          proMonthly,
          proYearly,
          premiumMonthly,
          premiumYearly
        });
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    };
    
    if (userCurrency) {
      updatePrices();
    }
  }, [userCurrency, userLocation, currentLanguage.code]);

  const getSavingsPercentage = (plan: string) => {
    if (plan === 'pro') return 26; // $108 vs $79 = 26% savings
    if (plan === 'premium') return 35; // $228 vs $149 = 35% savings
    return 0;
  };

  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: formattedPrices.free,
      yearlyPrice: formattedPrices.free,
      baseUsdPrice: 0,
      period: billingCycle,
      description: 'Get started with basic AI therapy features',
      popular: false,
      features: [
        '3 AI Therapy Sessions per month',
        'Basic Mood Tracking',
        'Text-based Conversations Only',
        'Community Access',
        'Crisis Resources Access'
      ],
      color: 'from-slate-500 to-slate-600',
      icon: Gift,
      limitations: true,
      hasTrial: false
    },
    {
      name: 'Pro',
      monthlyPrice: formattedPrices.proMonthly,
      yearlyPrice: formattedPrices.proYearly,
      baseUsdPrice: billingCycle === 'monthly' ? 9 : 79,
      period: billingCycle,
      description: 'Perfect for regular therapy and progress tracking',
      popular: true,
      hasTrial: false,
      features: [
        'Unlimited AI Therapy Sessions',
        'Voice Conversations (29 Languages)',
        'Advanced Mood Analytics',
        'Personalized AI Therapist Selection',
        'Progress Tracking & Goals',
        'Priority Crisis Support',
        'Mobile App Access'
      ],
      color: 'from-therapy-500 to-calm-500',
      icon: Star,
      savings: billingCycle === 'yearly' ? getSavingsPercentage('pro') : 0
    },
    {
      name: 'Premium',
      monthlyPrice: formattedPrices.premiumMonthly,
      yearlyPrice: formattedPrices.premiumYearly,
      baseUsdPrice: billingCycle === 'monthly' ? 19 : 149,
      period: billingCycle,
      description: 'Advanced features for comprehensive mental wellness',
      popular: false,
      features: [
        'Everything in Pro',
        'Advanced Emotion Detection',
        'Personalized Treatment Plans',
        'Advanced Analytics & Insights',
        'Priority Support (24/7)',
        'Custom AI Therapist Training',
        'Integration with Health Apps',
        'Family Account Sharing (up to 4)',
        'Exclusive Wellness Content'
      ],
      color: 'from-therapy-600 to-harmony-600',
      icon: Crown,
      hasTrial: billingCycle === 'yearly', // Only yearly Premium gets 7-day trial
      savings: billingCycle === 'yearly' ? getSavingsPercentage('premium') : 0
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          <span className="therapy-text-gradient-animated">
            Choose Your Mental Health Plan
          </span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          From free basic support to comprehensive premium care - find the perfect plan for your mental health journey.
        </p>
        
        {/* Currency Selector */}
        <div className="flex justify-center mb-6">
          <CurrencySelector
            value={userCurrency}
            onChange={setUserCurrency}
            className="max-w-sm"
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
              Save up to 35%
            </Badge>
          )}
        </div>
        
        {userLocation && userCurrency !== 'USD' && (
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-6">
            <span className="text-sm text-slate-600">
              Prices shown in {userCurrency} for {userLocation.country} • Base pricing from USD
            </span>
          </div>
        )}
        
        <Button
          onClick={() => navigate('/pricing')}
          className="therapy-gradient-bg text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-therapy-500/25 transition-all duration-300 hover:scale-105 border-0 mb-8"
        >
          View Complete Pricing Details
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => {
          const IconComponent = plan.icon;
          const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          
          return (
            <Card key={index} className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-2 border-therapy-500 shadow-xl scale-105' : 'border-0 shadow-lg'} bg-white/90 backdrop-blur-sm`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 therapy-gradient-bg text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className={`text-4xl font-bold ${plan.name === 'Free' ? 'text-slate-600' : 'therapy-text-gradient'}`}>
                    {currentPrice}
                  </span>
                  {plan.name !== 'Free' && (
                    <div className="flex flex-col items-start">
                      <span className="text-slate-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      {billingCycle === 'yearly' && plan.savings > 0 && (
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                          Save {plan.savings}%
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                {userCurrency !== 'USD' && plan.baseUsdPrice > 0 && (
                  <div className="text-xs text-slate-500 mb-2">
                    Base price: ${plan.baseUsdPrice} USD {billingCycle === 'yearly' ? '/year' : '/month'}
                  </div>
                )}
                <p className="text-slate-600">{plan.description}</p>
                {plan.hasTrial && (
                  <Badge className="mt-2 therapy-gradient-bg text-white">
                    7-Day Free Trial
                  </Badge>
                )}
                {plan.limitations && (
                  <Badge variant="outline" className="mt-2 border-slate-300 text-slate-600">
                    Limited Features
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.name === 'Free' ? 'text-slate-500' : 'text-therapy-500'}`} />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 text-lg font-semibold rounded-xl shadow-xl transition-all duration-300 hover:scale-105 ${
                    plan.popular || plan.name === 'Premium'
                      ? 'therapy-gradient-bg text-white border-0' 
                      : plan.name === 'Free'
                      ? 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'
                      : 'border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 bg-white'
                  }`}
                  onClick={() => navigate('/auth')}
                >
                  {plan.name === 'Free' ? 'Get Started Free' : plan.hasTrial ? 'Start Free Trial' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PricingSection;
