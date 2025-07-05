
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Heart, Shield, Zap, Crown, Gift, Users, Headphones, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import CurrencySelector from '@/components/ui/CurrencySelector';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pricing = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useEnhancedLanguage();
  const [userCurrency, setUserCurrency] = useState('USD');
  const [userLocation, setUserLocation] = useState(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useSafeSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose from Free, Pro, or Premium plans. Affordable AI therapy with voice technology, crisis support, and personalized care. Save up to 35% with yearly billing.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support, free therapy, yearly discount'
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const location = await enhancedCurrencyService.detectUserLocation();
        if (location) {
          setUserLocation(location);
          setUserCurrency(location.currency);
        }
      } catch (error) {
        console.warn('Could not detect location for pricing');
      }
    };
    detectLocation();
  }, []);

  const formatPrice = async (monthlyPrice: number, isYearly: boolean = false) => {
    try {
      let finalPrice = monthlyPrice;
      
      if (isYearly) {
        // Apply yearly discounts: Pro $79/year, Premium $149/year
        const yearlyPrices = { 9: 79, 19: 149 };
        finalPrice = yearlyPrices[monthlyPrice] || monthlyPrice * 10;
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

  const [formattedPrices, setFormattedPrices] = useState({
    free: 'Free',
    proMonthly: '$9',
    proYearly: '$79',
    premiumMonthly: '$19',
    premiumYearly: '$149'
  });

  useEffect(() => {
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
  }, [userCurrency, userLocation, currentLanguage.code, billingCycle]);

  const getSavingsInfo = (plan: string) => {
    if (plan === 'pro') return { percentage: 26, yearlyTotal: 79, monthlyTotal: 108 };
    if (plan === 'premium') return { percentage: 35, yearlyTotal: 149, monthlyTotal: 228 };
    return { percentage: 0, yearlyTotal: 0, monthlyTotal: 0 };
  };

  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: formattedPrices.free,
      yearlyPrice: formattedPrices.free,
      baseUsdMonthly: 0,
      baseUsdYearly: 0,
      period: 'forever',
      description: 'Get started with essential AI therapy features',
      popular: false,
      features: [
        '3 AI Therapy Sessions per month',
        'Basic Mood Tracking',
        'Text-based Conversations Only',
        'Community Access',
        'Crisis Resources Access',
        'Basic Progress Reports'
      ],
      color: 'from-slate-500 to-slate-600',
      icon: Gift,
      limitations: ['Limited to 3 sessions/month', 'No voice features', 'Basic support only'],
      bestFor: 'Trying AI therapy for the first time'
    },
    {
      name: 'Pro',
      monthlyPrice: formattedPrices.proMonthly,
      yearlyPrice: formattedPrices.proYearly,
      baseUsdMonthly: 9,
      baseUsdYearly: 79,
      period: billingCycle,
      description: 'Perfect for regular therapy and meaningful progress',
      popular: true,
      hasTrial: false,
      features: [
        'Unlimited AI Therapy Sessions',
        'Voice Conversations (29 Languages)',
        'Advanced Mood Analytics',
        'Personalized AI Therapist Selection',
        'Progress Tracking & Goal Setting',
        'Priority Crisis Support',
        'Mobile App Access',
        'Weekly Progress Reports',
        'Guided Meditation Library'
      ],
      color: 'from-therapy-500 to-calm-500',
      icon: Star,
      bestFor: 'Regular mental health maintenance and improvement',
      savings: getSavingsInfo('pro')
    },
    {
      name: 'Premium',
      monthlyPrice: formattedPrices.premiumMonthly,
      yearlyPrice: formattedPrices.premiumYearly,
      baseUsdMonthly: 19,
      baseUsdYearly: 149,
      period: billingCycle,
      description: 'Comprehensive mental wellness with advanced features',
      popular: false,
      features: [
        'Everything in Pro',
        'Advanced Emotion Detection',
        'Personalized Treatment Plans',
        'Advanced Analytics & Insights',
        '24/7 Priority Support',
        'Custom AI Therapist Training',
        'Health App Integrations',
        'Family Account Sharing (up to 4)',
        'Exclusive Wellness Content',
        'Monthly Expert Consultations',
        'Crisis Prevention AI'
      ],
      color: 'from-therapy-600 to-harmony-600',
      icon: Crown,
      bestFor: 'Comprehensive mental health transformation',
      hasTrial: billingCycle === 'yearly', // Only yearly Premium gets 7-day trial
      savings: getSavingsInfo('premium')
    }
  ];

  const comparisonFeatures = [
    {
      category: 'AI Therapy Sessions',
      free: '3 per month',
      pro: 'Unlimited',
      premium: 'Unlimited'
    },
    {
      category: 'Voice Conversations',
      free: '❌',
      pro: '✅ 29 Languages',
      premium: '✅ 29 Languages + Emotion Detection'
    },
    {
      category: 'Crisis Support',
      free: 'Basic Resources',
      pro: 'Priority Support',
      premium: '24/7 Priority + Prevention AI'
    },
    {
      category: 'Free Trial',
      free: '❌',
      pro: '❌',
      premium: billingCycle === 'yearly' ? '✅ 7 Days' : '❌'
    },
    {
      category: 'Support',
      free: 'Community',
      pro: 'Email Support',
      premium: '24/7 Priority Support'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Shield className="h-4 w-4 mr-2" />
              Transparent Pricing
              <Zap className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                Choose Your Mental Health Plan
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              From free basic support to comprehensive premium care. Start with our free plan 
              and upgrade as your mental health journey grows. Save up to 35% with yearly billing.
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

            {userLocation && (
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-4">
                <span className="text-sm text-slate-600">
                  Pricing for {userLocation.country} in {userCurrency}
                  {userCurrency !== 'USD' && ' • Converted from USD base pricing'}
                </span>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {pricingPlans.map((plan, index) => {
              const IconComponent = plan.icon;
              const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              const currentBasePrice = billingCycle === 'monthly' ? plan.baseUsdMonthly : plan.baseUsdYearly;
              
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
                          {billingCycle === 'yearly' && plan.savings && plan.savings.percentage > 0 && (
                            <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                              Save {plan.savings.percentage}%
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    {userCurrency !== 'USD' && currentBasePrice > 0 && (
                      <div className="text-xs text-slate-500 mb-2">
                        Base price: ${currentBasePrice} USD {billingCycle === 'yearly' ? '/year' : '/month'}
                      </div>
                    )}
                    <p className="text-slate-600 mb-4">{plan.description}</p>
                    <div className="text-sm text-therapy-600 font-medium mb-4">
                      Best for: {plan.bestFor}
                    </div>
                    {plan.hasTrial && (
                      <Badge className="mt-2 therapy-gradient-bg text-white mb-4">
                        7-Day Free Trial
                      </Badge>
                    )}
                    {billingCycle === 'yearly' && plan.savings && plan.savings.percentage > 0 && (
                      <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg mb-4">
                        Save ${plan.savings.monthlyTotal - plan.savings.yearlyTotal} compared to monthly billing
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${plan.name === 'Free' ? 'text-slate-500' : 'text-therapy-500'}`} />
                          <span className="text-slate-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations && (
                      <div className="mb-6 p-3 bg-slate-50 rounded-lg">
                        <div className="text-xs font-semibold text-slate-700 mb-2">Limitations:</div>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="text-xs text-slate-600">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    )}
                    
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

          {/* Feature Comparison Table */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-8 therapy-text-gradient">
              Plan Comparison
            </h2>
            <Card className="overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm border-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="therapy-gradient-bg text-white">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Features</th>
                      <th className="text-center py-4 px-6 font-semibold">Free</th>
                      <th className="text-center py-4 px-6 font-semibold">Pro</th>
                      <th className="text-center py-4 px-6 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-therapy-50/30' : 'bg-white'}>
                        <td className="py-4 px-6 font-medium text-slate-800">{feature.category}</td>
                        <td className="py-4 px-6 text-center text-slate-600">{feature.free}</td>
                        <td className="py-4 px-6 text-center text-slate-600">{feature.pro}</td>
                        <td className="py-4 px-6 text-center text-slate-600">{feature.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-therapy-500" />
                <span className="text-slate-600 font-medium">Cancel Anytime</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-therapy-500" />
                <span className="text-slate-600 font-medium">30-Day Money Back</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-therapy-500" />
                <span className="text-slate-600 font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="therapy-gradient-bg text-white p-12 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
              <p className="text-therapy-100 mb-8 max-w-2xl mx-auto">
                Our team is here to help you choose the right plan for your mental health journey. 
                Get personalized recommendations and answers to all your questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl"
                  onClick={() => navigate('/help')}
                >
                  <Headphones className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl backdrop-blur-sm"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Try Demo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
