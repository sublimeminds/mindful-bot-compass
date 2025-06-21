
import React from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Star, 
  Shield, 
  Volume2, 
  Brain, 
  Heart,
  Users,
  Calendar,
  BarChart3,
  Headphones,
  Globe,
  Zap,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanFeature {
  category: string;
  features: {
    name: string;
    free: boolean | string;
    premium: boolean | string;
    plus: boolean | string;
    icon?: any;
  }[];
}

const ComparePlans = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'Compare Plans - TherapySync Features',
    description: 'Compare Free, Premium, and Plus plans. See which features are included in each subscription tier.',
    keywords: 'therapy plans comparison, pricing features, mental health subscription'
  });

  const planFeatures: PlanFeature[] = [
    {
      category: "AI Therapy Sessions",
      features: [
        { name: "Monthly AI therapy sessions", free: "5 sessions", premium: "Unlimited", plus: "Unlimited", icon: Brain },
        { name: "Session duration", free: "15 minutes", premium: "60 minutes", plus: "90 minutes" },
        { name: "Crisis intervention support", free: false, premium: true, plus: true, icon: Shield },
        { name: "Therapist personality matching", free: false, premium: true, plus: true },
        { name: "Advanced conversation AI", free: false, premium: true, plus: true },
      ]
    },
    {
      category: "Voice & Audio Features",
      features: [
        { name: "Text-based chat", free: true, premium: true, plus: true },
        { name: "Voice-enabled conversations", free: false, premium: true, plus: true, icon: Volume2 },
        { name: "ElevenLabs premium voices", free: false, premium: true, plus: true, icon: Headphones },
        { name: "Voice emotion analysis", free: false, premium: true, plus: true },
        { name: "Custom voice cloning", free: false, premium: false, plus: true, icon: Crown },
        { name: "Multi-language support (29 languages)", free: "English only", premium: true, plus: true, icon: Globe },
        { name: "Podcast library access", free: "5 episodes", premium: "100+ episodes", plus: "Unlimited" },
        { name: "Guided meditation sessions", free: "5 sessions", premium: "50+ sessions", plus: "Unlimited" },
      ]
    },
    {
      category: "Analytics & Tracking",
      features: [
        { name: "Basic mood tracking", free: true, premium: true, plus: true, icon: Heart },
        { name: "Advanced mood analytics", free: false, premium: true, plus: true },
        { name: "Session analytics dashboard", free: false, premium: true, plus: true, icon: BarChart3 },
        { name: "Progress insights", free: "Basic", premium: "Advanced", plus: "Comprehensive" },
        { name: "Voice analytics reports", free: false, premium: false, plus: true },
        { name: "Clinical-grade assessments", free: false, premium: false, plus: true },
      ]
    },
    {
      category: "Community & Support",
      features: [
        { name: "Community access", free: true, premium: true, plus: true, icon: Users },
        { name: "Private support groups", free: false, premium: true, plus: true },
        { name: "Peer mentorship program", free: false, premium: false, plus: true },
        { name: "Priority support", free: false, premium: true, plus: true },
        { name: "Dedicated account manager", free: false, premium: false, plus: true },
        { name: "24/7 crisis hotline", free: false, premium: true, plus: true },
      ]
    },
    {
      category: "Tools & Features",
      features: [
        { name: "Digital notebook", free: "Basic", premium: "Advanced", plus: "Unlimited" },
        { name: "Smart scheduling", free: false, premium: true, plus: true, icon: Calendar },
        { name: "Goal tracking", free: "3 goals", premium: "Unlimited", plus: "Unlimited" },
        { name: "Technique library", free: "10 techniques", premium: "50+ techniques", plus: "Full library" },
        { name: "Custom content creation", free: false, premium: false, plus: true },
        { name: "API access", free: false, premium: false, plus: true },
        { name: "White-label options", free: false, premium: false, plus: true },
      ]
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29,
      description: 'Most popular choice',
      color: 'from-harmony-500 to-flow-500',
      popular: true
    },
    {
      id: 'plus',
      name: 'Plus',
      price: 79,
      description: 'Professional features',
      color: 'from-therapy-500 to-calm-500',
      popular: false
    }
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-gray-400" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent mb-6">
              Compare Plans & Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your mental wellness journey. Compare features 
              across Free, Premium, and Plus tiers.
            </p>
          </div>

          {/* Plan Headers */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="col-span-1"></div>
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-harmony-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-harmony-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    {plan.price > 0 && <span className="text-base font-normal text-muted-foreground">/month</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} text-white mt-4`}
                    onClick={() => navigate('/plans')}
                  >
                    {plan.price === 0 ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="space-y-8">
            {planFeatures.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-harmony-700">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-2">
                          {feature.icon && <feature.icon className="h-4 w-4 text-harmony-600" />}
                          <span className="font-medium">{feature.name}</span>
                        </div>
                        <div className="text-center">
                          {renderFeatureValue(feature.free)}
                        </div>
                        <div className="text-center">
                          {renderFeatureValue(feature.premium)}
                        </div>
                        <div className="text-center">
                          {renderFeatureValue(feature.plus)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="mt-16 border-0 bg-gradient-to-r from-harmony-500 to-flow-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-harmony-100 mb-8 max-w-2xl mx-auto text-lg">
                Join thousands who have transformed their mental health journey with TherapySync's 
                AI-powered platform. Choose your plan and start today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/plans')}
                  size="lg"
                  className="bg-white text-harmony-700 hover:bg-harmony-50"
                >
                  View All Plans
                </Button>
                <Button 
                  onClick={() => navigate('/therapysync-ai')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Try TherapySync AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default ComparePlans;
