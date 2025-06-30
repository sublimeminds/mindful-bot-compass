
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Heart, Crown, Users, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import CurrencySelector from '@/components/ui/CurrencySelector';
import GradientButton from '@/components/ui/GradientButton';
import FamilyPlanSelector from '@/components/family/FamilyPlanSelector';

const EnhancedPricingSection = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useEnhancedLanguage();
  const [userCurrency, setUserCurrency] = useState('USD');
  const [userLocation, setUserLocation] = useState(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState('individual');
  const [showFamilySelector, setShowFamilySelector] = useState(false);

  useEffect(() => {
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

  const formatPrice = async (usdPrice: number, isYearly: boolean = false) => {
    try {
      let finalPrice = usdPrice;
      
      if (isYearly) {
        const yearlyDiscounts = { 9: 79, 19: 149 };
        finalPrice = yearlyDiscounts[usdPrice] || usdPrice * 10;
      }

      const convertedAmount = enhancedCurrencyService.convertAmount(finalPrice, 'USD', userCurrency);
      let adjustedAmount = convertedAmount;
      
      if (userLocation) {
        adjustedAmount = await enhancedCurrencyService.getRegionalPricing(finalPrice, userCurrency, userLocation.region);
      }
      
      return enhancedCurrencyService.formatCurrency(adjustedAmount, userCurrency, currentLanguage.code);
    } catch (error) {
      return enhancedCurrencyService.formatCurrency(usdPrice, 'USD', currentLanguage.code);
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
        const prices = {
          free: 'Free',
          proMonthly: await formatPrice(9, false),
          proYearly: await formatPrice(9, true),
          premiumMonthly: await formatPrice(19, false),
          premiumYearly: await formatPrice(19, true)
        };
        setFormattedPrices(prices);
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    };
    
    if (userCurrency) {
      updatePrices();
    }
  }, [userCurrency, userLocation, currentLanguage.code, billingCycle]);

  const individualPlans = [
    {
      name: 'Free',
      price: formattedPrices.free,
      period: 'forever',
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
      icon: Heart
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? formattedPrices.proMonthly : formattedPrices.proYearly,
      period: billingCycle,
      description: 'Perfect for regular therapy and progress tracking',
      popular: true,
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
      savings: billingCycle === 'yearly' ? 26 : 0
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? formattedPrices.premiumMonthly : formattedPrices.premiumYearly,
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
        'Exclusive Wellness Content'
      ],
      color: 'from-therapy-600 to-harmony-600',
      icon: Crown,
      savings: billingCycle === 'yearly' ? 35 : 0
    }
  ];

  return (
    <div className="py-20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="therapy-text-gradient-animated">
              Choose Your Mental Health Plan
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            From free basic support to comprehensive family care - find the perfect plan for your mental health journey.
          </p>
          
          <div className="flex justify-center mb-8">
            <CurrencySelector
              value={userCurrency}
              onChange={setUserCurrency}
              className="max-w-sm"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="individual" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Individual</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Family Plans</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:ring-offset-2 ${
                  billingCycle === 'yearly' ? 'bg-therapy-500' : 'bg-gray-200'
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
                <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                  Save up to 35%
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {individualPlans.map((plan, index) => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.name}
                    className={`relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                      plan.popular ? 'ring-2 ring-therapy-500 shadow-xl scale-105' : 'shadow-lg'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white text-center py-2 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    
                    <CardHeader className={plan.popular ? 'pt-12' : ''}>
                      <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
                      
                      <div className="text-center">
                        <div className="flex items-baseline justify-center space-x-2">
                          <span className="text-4xl font-bold therapy-text-gradient">
                            {plan.price}
                          </span>
                          {plan.name !== 'Free' && (
                            <span className="text-gray-500">/{plan.period}</span>
                          )}
                        </div>
                        
                        {plan.savings > 0 && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                            Save {plan.savings}%
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-center text-gray-600 mt-4">{plan.description}</p>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <GradientButton 
                        className="w-full"
                        onClick={() => navigate('/auth')}
                      >
                        {plan.name === 'Free' ? 'Get Started Free' : `Choose ${plan.name}`}
                      </GradientButton>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="family">
            <div className="text-center mb-12">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Adaptive Family Plans</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Perfect for families who want flexible pricing that scales with their needs. 
                  Pay only for active family members with our intelligent seat-based pricing.
                </p>
                
                <Card className="max-w-2xl mx-auto mb-8">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-therapy-500 to-calm-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Family Pro</h4>
                        <p className="text-2xl font-bold text-therapy-600 mb-1">$39 base + $15/seat</p>
                        <p className="text-sm text-gray-600">Perfect for most families</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Family Premium</h4>
                        <p className="text-2xl font-bold text-purple-600 mb-1">$59 base + $20/seat</p>
                        <p className="text-sm text-gray-600">Ultimate family support</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <GradientButton
                  size="lg"
                  onClick={() => setShowFamilySelector(true)}
                  className="px-8"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Build Your Family Plan
                </GradientButton>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <FamilyPlanSelector
          isOpen={showFamilySelector}
          onClose={() => setShowFamilySelector(false)}
        />
      </div>
    </div>
  );
};

export default EnhancedPricingSection;
