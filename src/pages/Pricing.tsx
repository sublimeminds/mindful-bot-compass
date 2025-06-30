
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Heart, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pricing = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useEnhancedLanguage();
  const [userCurrency, setUserCurrency] = React.useState('USD');
  const [userLocation, setUserLocation] = React.useState(null);

  useSafeSEO({
    title: 'Pricing Plans - TherapySync AI Platform',
    description: 'Choose the perfect plan for your mental health journey. Affordable pricing with AI therapy, crisis support, and personalized care.',
    keywords: 'AI therapy pricing, mental health plans, therapy subscription, crisis support'
  });

  React.useEffect(() => {
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

  const formatPrice = async (baseUsdPrice: number) => {
    try {
      // Convert from USD to user's currency
      const convertedAmount = enhancedCurrencyService.convertAmount(baseUsdPrice, 'USD', userCurrency);
      
      // Apply regional pricing if location is available
      let finalAmount = convertedAmount;
      if (userLocation) {
        finalAmount = await enhancedCurrencyService.getRegionalPricing(baseUsdPrice, userCurrency, userLocation.region);
      }
      
      return enhancedCurrencyService.formatCurrency(finalAmount, userCurrency, currentLanguage.code);
    } catch (error) {
      console.error('Error formatting price:', error);
      return enhancedCurrencyService.formatCurrency(baseUsdPrice, 'USD', currentLanguage.code);
    }
  };

  const [formattedPrices, setFormattedPrices] = React.useState({
    basic: '$9',
    pro: '$19'
  });

  React.useEffect(() => {
    const updatePrices = async () => {
      try {
        const basicPrice = await formatPrice(9);
        const proPrice = await formatPrice(19);
        setFormattedPrices({
          basic: basicPrice,
          pro: proPrice
        });
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    };
    
    if (userCurrency) {
      updatePrices();
    }
  }, [userCurrency, userLocation, currentLanguage.code]);

  const pricingPlans = [
    {
      name: 'Basic',
      price: formattedPrices.basic,
      baseUsdPrice: 9,
      period: 'month',
      description: 'Perfect for getting started with AI therapy',
      popular: false,
      features: [
        'AI Therapy Sessions (Unlimited)',
        'Basic Mood Tracking',
        'Text-based Conversations',
        'Crisis Support Access',
        'Progress Analytics',
        'Mobile App Access'
      ],
      color: 'from-therapy-500 to-calm-500',
      icon: Heart
    },
    {
      name: 'Pro',
      price: formattedPrices.pro,
      baseUsdPrice: 19,
      period: 'month',
      description: 'Advanced features for serious mental health improvement',
      popular: true,
      hasTrial: true,
      features: [
        'Everything in Basic',
        'Voice Conversations (29 Languages)',
        'Advanced Emotion Detection',
        'Personalized AI Therapist Selection',
        'Advanced Analytics & Insights',
        'Priority Crisis Support',
        'Guided Meditation Library',
        'Goal Setting & Tracking'
      ],
      color: 'from-therapy-600 to-calm-600',
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Shield className="h-4 w-4 mr-2" />
              Simple & Affordable Pricing
              <Zap className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Choose Your Perfect Plan
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Start your mental health journey with affordable pricing designed for everyone. 
              All plans include crisis support and are backed by our satisfaction guarantee.
            </p>

            {userLocation && (
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-4">
                <span className="text-sm text-slate-600">
                  Pricing for {userLocation.country} in {userCurrency}
                  {userCurrency !== 'USD' && ' • Converted from USD base pricing'}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card key={index} className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-2 border-therapy-500 shadow-xl' : 'border-0 shadow-lg'} bg-white/90 backdrop-blur-sm`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-slate-500">/{plan.period}</span>
                    </div>
                    {userCurrency !== 'USD' && (
                      <div className="text-xs text-slate-500 mb-2">
                        Base price: ${plan.baseUsdPrice} USD
                      </div>
                    )}
                    <p className="text-slate-600">{plan.description}</p>
                    {plan.hasTrial && (
                      <Badge className="mt-2 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                        7-Day Free Trial
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full py-3 text-lg font-semibold rounded-xl shadow-xl transition-all duration-300 hover:scale-105 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white border-0' 
                          : 'border-2 border-therapy-300 text-therapy-700 hover:bg-gradient-to-r hover:from-therapy-50 hover:to-calm-50 bg-white'
                      }`}
                      onClick={() => navigate('/auth')}
                    >
                      {plan.hasTrial ? 'Start Free Trial' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-16">
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
