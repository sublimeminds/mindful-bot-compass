
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Heart, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';
import FamilyPlanSelector from '@/components/family/FamilyPlanSelector';

const PricingSection = () => {
  const navigate = useNavigate();
  const [showFamilyPlans, setShowFamilyPlans] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Basic mood tracking',
        '3 therapy sessions per month',
        'Community support',
        'Basic insights'
      ],
      icon: Heart,
      popular: false,
      cta: 'Get Started Free'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29',
      period: '/month',
      description: 'Most popular choice',
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
      cta: 'Start Premium'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'For comprehensive care',
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
      cta: 'Start Pro'
    }
  ];

  const handlePlanSelect = (plan: any) => {
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    navigate('/get-started');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-therapy-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 therapy-text-gradient">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Select the perfect plan for your mental wellness journey. All plans include our core AI therapy features.
          </p>
        </div>

        {/* Individual Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                  plan.popular ? 'ring-2 ring-therapy-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${
                    plan.id === 'free' ? 'from-slate-400 to-slate-500' :
                    plan.id === 'premium' ? 'from-therapy-500 to-harmony-500' :
                    'from-therapy-600 to-harmony-600'
                  } rounded-2xl flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-slate-500 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold therapy-text-gradient">
                    {plan.price}
                    <span className="text-lg font-normal text-slate-500">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.popular ? (
                    <GradientButton 
                      className="w-full" 
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {plan.cta}
                    </GradientButton>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Family Plans CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-therapy-50 to-harmony-50 border-therapy-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-2xl mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Family Plans Available</h3>
              <p className="text-slate-600 mb-6">
                Get customized pricing for your family. Includes parental controls, family dashboard, and shared insights.
              </p>
              <GradientButton onClick={() => setShowFamilyPlans(true)}>
                Explore Family Plans
              </GradientButton>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-12">
          <p className="text-slate-500 mb-4">Trusted by thousands of users worldwide</p>
          <div className="flex justify-center space-x-8 text-sm text-slate-400">
            <span>✓ HIPAA Compliant</span>
            <span>✓ Cancel Anytime</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>

      <FamilyPlanSelector 
        isOpen={showFamilyPlans}
        onClose={() => setShowFamilyPlans(false)}
      />
    </section>
  );
};

export default PricingSection;
