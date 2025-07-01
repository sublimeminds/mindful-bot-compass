
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from '@/components/ui/button';

const GetStarted = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic mood tracking',
        '3 therapy sessions per month',
        'Community support',
        'Basic insights'
      ],
      icon: Heart,
      popular: false,
      description: 'Perfect for getting started'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29',
      period: '/month',
      features: [
        'Advanced mood analytics',
        'Unlimited therapy sessions',
        'Personalized insights',
        'Priority support',
        'Goal tracking',
        'Progress reports'
      ],
      icon: Star,
      popular: true,
      description: 'Most popular choice'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: '/month',
      features: [
        'Everything in Premium',
        'AI-powered recommendations',
        'Custom therapy plans',
        'Family sharing',
        'Expert consultations',
        'Advanced analytics'
      ],
      icon: Crown,
      popular: false,
      description: 'For comprehensive care'
    }
  ];

  const handleGetStarted = () => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 dark:from-harmony-950 dark:via-therapy-950 dark:to-flow-950">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-3xl mb-6">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold therapy-text-gradient mb-4">
            Choose Your Mental Wellness Journey
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select the plan that best fits your needs and start your personalized path to better mental health
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm text-slate-500">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>Trusted by 50,000+ users</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>HIPAA compliant</span>
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>Available 24/7</span>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                    isSelected 
                      ? 'ring-2 ring-therapy-500 shadow-2xl scale-105' 
                      : 'hover:shadow-lg'
                  } ${plan.popular ? 'border-therapy-200' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white px-4 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${
                      plan.id === 'free' ? 'from-slate-400 to-slate-500' :
                      plan.id === 'premium' ? 'from-therapy-500 to-harmony-500' :
                      'from-therapy-600 to-harmony-600'
                    } rounded-2xl flex items-center justify-center`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold therapy-text-gradient">
                      {plan.price}
                      <span className="text-lg font-normal text-slate-500">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      className={`w-full ${isSelected ? 'bg-therapy-500 hover:bg-therapy-600' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {isSelected ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <GradientButton 
              size="lg" 
              onClick={handleGetStarted}
              className="px-12 py-4 text-lg font-semibold"
            >
              Start Your Journey with {plans.find(p => p.id === selectedPlan)?.name}
              <ArrowRight className="h-5 w-5 ml-2" />
            </GradientButton>
            <p className="text-sm text-slate-500 mt-4">
              No commitment required • Cancel anytime • HIPAA compliant
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <blockquote className="text-lg italic text-slate-600 dark:text-slate-300 mb-4">
            "TherapySync has been a game-changer for my mental health journey. The AI is incredibly supportive and the insights have helped me understand myself better."
          </blockquote>
          <cite className="text-sm font-medium text-slate-500">— Sarah M., Premium user</cite>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
