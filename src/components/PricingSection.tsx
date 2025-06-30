
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';

const PricingSection = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useEnhancedLanguage();
  const [userCurrency, setUserCurrency] = React.useState('USD');

  React.useEffect(() => {
    const detectCurrency = async () => {
      try {
        const location = await enhancedCurrencyService.detectUserLocation();
        if (location) {
          setUserCurrency(location.currency);
        }
      } catch (error) {
        console.warn('Could not detect currency');
      }
    };
    detectCurrency();
  }, []);

  const formatPrice = (price: number) => {
    return enhancedCurrencyService.formatCurrency(price, userCurrency, currentLanguage.code);
  };

  const pricingPlans = [
    {
      name: 'Basic',
      price: 9,
      period: 'month',
      description: 'Perfect for getting started with AI therapy',
      popular: false,
      features: [
        'AI Therapy Sessions (Unlimited)',
        'Basic Mood Tracking', 
        'Text-based Conversations',
        'Crisis Support Access',
        'Progress Analytics'
      ],
      color: 'from-therapy-500 to-calm-500',
      icon: Heart
    },
    {
      name: 'Pro',
      price: 19,
      period: 'month',
      description: 'Advanced features for serious improvement',
      popular: true,
      hasTrial: true,
      features: [
        'Everything in Basic',
        'Voice Conversations (29 Languages)',
        'Advanced Emotion Detection',
        'Personalized AI Therapist Selection',
        'Advanced Analytics & Insights',
        'Priority Crisis Support'
      ],
      color: 'from-therapy-600 to-calm-600',
      icon: Star
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Choose the perfect plan for your mental health journey. All plans include crisis support and satisfaction guarantee.
        </p>
        
        <Button
          onClick={() => navigate('/pricing')}
          className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-therapy-500/25 transition-all duration-300 hover:scale-105 border-0 mb-8"
        >
          View Complete Pricing Details
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
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
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-slate-500">/{plan.period}</span>
                </div>
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
    </div>
  );
};

export default PricingSection;
