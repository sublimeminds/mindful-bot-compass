
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';

const PricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = (plan: string) => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with your mental wellness journey',
      features: [
        '3 AI therapy sessions per month',
        'Basic mood tracking',
        'Community access',
        'Essential wellness tools',
        'Email support'
      ],
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'month',
      description: 'For dedicated users seeking comprehensive mental health support',
      features: [
        'Unlimited AI therapy sessions',
        'Advanced mood analytics',
        'Personalized insights',
        'Goal tracking & recommendations',
        'Crisis support resources',
        'Priority email support',
        'Export your data'
      ],
      buttonText: 'Start Premium',
      popular: true
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'month',
      description: 'Advanced features for mental health professionals and coaches',
      features: [
        'Everything in Premium',
        'Client management tools',
        'Advanced analytics dashboard',
        'Custom therapy protocols',
        'API access',
        'Phone support',
        'White-label options'
      ],
      buttonText: 'Go Professional',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-therapy-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
          </h2>
          <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
            Start free and upgrade as your mental wellness journey evolves. All plans include our core AI therapy features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              plan.popular 
                ? 'ring-2 ring-therapy-500 shadow-therapy-500/20 scale-105' 
                : 'hover:shadow-therapy-500/10'
            }`}>
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-therapy-500 to-therapy-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-therapy-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-therapy-800">{plan.price}</span>
                  <span className="text-therapy-600">/{plan.period}</span>
                </div>
                <p className="text-therapy-600 text-sm">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                      <span className="text-therapy-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white' 
                      : 'bg-therapy-100 text-therapy-800 hover:bg-therapy-200'
                  } transition-all duration-300`}
                  onClick={() => handleGetStarted(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-therapy-600 mb-4">
            All plans include a 7-day free trial. No credit card required.
          </p>
          <p className="text-sm text-therapy-500">
            Questions about our pricing? <Button variant="link" className="p-0 h-auto text-therapy-600 hover:text-therapy-700">Contact our support team</Button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
