import React from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import PlanSelector from '@/components/subscription/PlanSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, Zap, Volume2, Headphones, Brain, Podcast, Activity, Heart } from 'lucide-react';

const Plans = () => {
  useSEO({
    title: 'Pricing Plans - TherapySync',
    description: 'Choose the perfect TherapySync plan for your mental wellness journey. Free and premium options available.',
    keywords: 'therapy pricing, mental health plans, AI therapy cost, wellness subscription'
  });

  const handleSelectPlan = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    console.log('Selected plan:', planId, 'Billing:', billingCycle);
    // Navigate to checkout or handle plan selection
  };

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started with AI therapy',
      features: [
        '5 AI therapy sessions per month',
        'Basic mood tracking',
        'Standard text-based chat',
        'Community support access',
        'Basic meditation library (5 sessions)',
        'Email support'
      ],
      popular: false,
      voiceFeatures: []
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 29, yearly: 290 },
      description: 'Full access to advanced AI therapy features',
      features: [
        'Unlimited AI therapy sessions',
        'Advanced mood analytics',
        'Voice-enabled conversations',
        'Personalized therapist matching',
        'Complete guided session library (50+ sessions)',
        'Podcast library access (100+ episodes)',
        'Real-time voice analytics',
        'Crisis intervention support',
        'Priority support'
      ],
      popular: true,
      voiceFeatures: [
        'ElevenLabs premium voices',
        'Therapist voice matching',
        'Emotion-aware speech',
        'Multi-language support (29 languages)',
        'Voice stress analysis',
        'Personalized audio content'
      ]
    },
    {
      id: 'enterprise',
      name: 'Professional',
      price: { monthly: 79, yearly: 790 },
      description: 'Advanced features for healthcare professionals',
      features: [
        'Everything in Premium',
        'Voice cloning & customization',
        'Advanced voice analytics dashboard',
        'Custom podcast creation tools',
        'Multi-therapist voice library',
        'Real-time conversation AI',
        'Clinical-grade voice reports',
        'API access for integrations',
        'White-label options',
        'Dedicated account manager'
      ],
      popular: false,
      voiceFeatures: [
        'Custom voice cloning',
        'Conversational AI integration',
        'Advanced emotion detection',
        'Voice-based crisis alerts',
        'Clinical voice assessments',
        'Batch audio content generation'
      ]
    }
  ];

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent mb-6">
              Choose Your Wellness Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of mental health with AI-powered therapy, premium voice features, 
              and personalized audio content designed for your unique needs.
            </p>
          </div>

          {/* Voice Technology Highlight */}
          <Card className="mb-12 border-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">Powered by ElevenLabs AI Voice Technology</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <Headphones className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Premium Voices</div>
                  <div className="text-sm opacity-90">Therapist-matched voices</div>
                </div>
                <div>
                  <Brain className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Emotion Detection</div>
                  <div className="text-sm opacity-90">Real-time voice analysis</div>
                </div>
                <div>
                  <Podcast className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Audio Library</div>
                  <div className="text-sm opacity-90">Guided sessions & podcasts</div>
                </div>
                <div>
                  <Activity className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Voice Analytics</div>
                  <div className="text-sm opacity-90">Progress tracking</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-harmony-500 shadow-lg scale-105' 
                    : 'border hover:border-harmony-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-harmony-500 text-white px-4 py-1 text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price.monthly}</span>
                    {plan.price.monthly > 0 && <span className="text-muted-foreground">/month</span>}
                  </div>
                  {plan.price.monthly > 0 && (
                    <div className="text-sm text-muted-foreground">
                      or ${plan.price.yearly}/year (save ${(plan.price.monthly * 12) - plan.price.yearly})
                    </div>
                  )}
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Core Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Core Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Voice Features */}
                  {plan.voiceFeatures.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center text-therapy-600">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Voice Technology
                      </h4>
                      <ul className="space-y-2">
                        {plan.voiceFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Zap className="h-4 w-4 text-therapy-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={() => handleSelectPlan(plan.id, 'monthly')}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-harmony-600 hover:bg-harmony-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price.monthly === 0 ? 'Get Started Free' : 'Start Monthly Plan'}
                    </Button>
                    
                    {plan.price.monthly > 0 && (
                      <Button 
                        onClick={() => handleSelectPlan(plan.id, 'yearly')}
                        variant="outline" 
                        className="w-full"
                      >
                        Save with Annual Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security & Compliance */}
          <Card className="border-0 bg-gray-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <Shield className="h-12 w-12 text-harmony-600 mb-4" />
                  <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
                  <p className="text-sm text-muted-foreground">
                    Your voice data and conversations are encrypted and secure
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Check className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="font-semibold mb-2">No Commitments</h3>
                  <p className="text-sm text-muted-foreground">
                    Cancel anytime. No hidden fees or long-term contracts
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="h-12 w-12 text-therapy-600 mb-4" />
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Crisis support and technical help whenever you need it
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default Plans;
