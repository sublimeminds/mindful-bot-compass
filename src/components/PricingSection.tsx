
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Heart, Star } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic AI therapy support",
    features: [
      "5 AI therapy sessions per month",
      "Basic mood tracking",
      "Crisis resources access",
      "Community support",
      "Mobile app access"
    ],
    cta: "Get Started Free",
    popular: false,
    color: "border-gray-200"
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Comprehensive AI therapy with advanced features",
    features: [
      "Unlimited AI therapy sessions",
      "Advanced mood analytics",
      "Personalized insights",
      "Priority crisis support",
      "Voice interaction",
      "Custom therapy approaches",
      "Progress tracking",
      "Smart scheduling"
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "border-therapy-500"
  },
  {
    name: "Premium",
    price: "$79",
    period: "per month",
    description: "Everything in Pro plus human therapist access",
    features: [
      "Everything in Pro",
      "Monthly human therapist sessions",
      "24/7 crisis intervention",
      "Family therapy tools",
      "Advanced AI personality matching",
      "White-glove onboarding",
      "Priority support",
      "Custom reports"
    ],
    cta: "Contact Sales",
    popular: false,
    color: "border-purple-500"
  }
];

const PricingSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Validate React before allowing modal interactions
  const isReactReady = React && 
    typeof React === 'object' && 
    React.useState && 
    React.useRef &&
    React.createElement;

  const handleGetStarted = () => {
    if (!isReactReady) {
      console.warn('PricingSection: React not ready, cannot open modal');
      return;
    }
    setShowAuthModal(true);
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-therapy-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-therapy-100 text-therapy-700">
            <Crown className="h-3 w-3 mr-1" />
            Flexible Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Mental Health Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your journey to better mental health with our flexible plans. 
            All plans include HIPAA-compliant security and 24/7 access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-all duration-300 ${plan.color} ${
                plan.popular ? 'scale-105 border-2 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-therapy-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-therapy-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-6 ${
                    plan.popular 
                      ? 'bg-therapy-600 hover:bg-therapy-700 text-white' 
                      : 'border border-therapy-600 text-therapy-600 hover:bg-therapy-600 hover:text-white'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={handleGetStarted}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All plans include a 7-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              HIPAA Compliant
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-500" />
              256-bit Encryption
            </div>
            <div className="flex items-center">
              <Crown className="h-4 w-4 mr-1 text-yellow-500" />
              Money-back Guarantee
            </div>
          </div>
        </div>
      </div>

      {isReactReady && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </section>
  );
};

export default PricingSection;
