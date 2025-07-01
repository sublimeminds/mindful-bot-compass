
import React, { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, Shield, Zap, Volume2, Headphones, Brain, Podcast, Activity, Heart, Users, Plus, Minus, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import { Separator } from '@/components/ui/separator';
import CurrencySelector from '@/components/ui/CurrencySelector';

const Plans = () => {
  const navigate = useNavigate();
  const { formatPrice, currency, changeCurrency } = useEnhancedCurrency();
  const [showFamilyBuilder, setShowFamilyBuilder] = useState(false);
  const [familyMemberCount, setFamilyMemberCount] = useState(4);
  const [selectedFamilyTier, setSelectedFamilyTier] = useState<'pro' | 'premium'>('pro');

  useSEO({
    title: 'Pricing Plans - TherapySync',
    description: 'Choose the perfect TherapySync plan for your mental wellness journey. Free and premium options available.',
    keywords: 'therapy pricing, mental health plans, AI therapy cost, wellness subscription'
  });

  const handleSelectPlan = (planId: string, planData?: any) => {
    // Store plan selection for onboarding
    const planSelection = {
      name: planId,
      data: planData,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    
    // Always go to onboarding first
    navigate('/onboarding');
  };

  const familyTiers = {
    pro: {
      name: 'Family Pro',
      basePrice: 29.99,
      pricePerMember: 9.99,
      color: 'from-therapy-500 to-calm-500',
      icon: Star,
      features: [
        'Unlimited AI therapy sessions for all members',
        'Voice conversations in 29 languages',
        'Family dashboard with shared insights',
        'Parental controls and safety features',
        'Crisis alerts and intervention',
        'Progress sharing with permissions',
        'Mobile app for all members'
      ]
    },
    premium: {
      name: 'Family Premium',
      basePrice: 49.99,
      pricePerMember: 14.99,
      color: 'from-therapy-600 to-harmony-600',
      icon: Heart,
      features: [
        'Everything in Family Pro',
        'Advanced emotion detection for all',
        'Personalized treatment plans per member',
        'Dedicated family support specialist',
        '24/7 priority crisis intervention',
        'Advanced family analytics & insights',
        'Custom AI therapist training',
        'Integration with health apps'
      ]
    }
  };

  const selectedTierData = familyTiers[selectedFamilyTier];
  const familyMonthlyPrice = selectedTierData.basePrice + (familyMemberCount * selectedTierData.pricePerMember);
  const familyYearlyPrice = familyMonthlyPrice * 12 * 0.8; // 20% discount for yearly
  const familySavings = (familyMonthlyPrice * 12) - familyYearlyPrice;

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
            
            {/* Currency Selector */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <span className="text-sm font-medium text-slate-600">Currency:</span>
              <CurrencySelector 
                value={currency.code}
                onChange={changeCurrency}
                className="w-48"
              />
            </div>
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
                    <span className="text-4xl font-bold">{formatPrice(plan.price.monthly)}</span>
                    {plan.price.monthly > 0 && <span className="text-muted-foreground">/month</span>}
                  </div>
                  {plan.price.monthly > 0 && (
                    <div className="text-sm text-muted-foreground">
                      or {formatPrice(plan.price.yearly)}/year (save {formatPrice((plan.price.monthly * 12) - plan.price.yearly)})
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
                      onClick={() => handleSelectPlan(plan.id, plan)}
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
                        onClick={() => handleSelectPlan(plan.id, { ...plan, billingCycle: 'yearly' })}
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

          {/* Family Plans Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <Card className="bg-gradient-to-r from-harmony-50 via-balance-50 to-flow-50 border-2 border-harmony-200">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-harmony-600 mr-3" />
                  <CardTitle className="text-3xl font-bold text-harmony-700">
                    Family Plans
                  </CardTitle>
                </div>
                <p className="text-lg text-harmony-600 max-w-2xl mx-auto">
                  Support your entire family's mental wellness journey with customizable plans that grow with your needs.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {!showFamilyBuilder ? (
                  <div className="text-center">
                    <Button 
                      onClick={() => setShowFamilyBuilder(true)}
                      className="bg-gradient-to-r from-harmony-500 to-balance-500 hover:from-harmony-600 hover:to-balance-600 text-white px-8 py-4 text-lg font-semibold"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Build Your Custom Family Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Member Count Selector */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>How many family members?</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setFamilyMemberCount(Math.max(2, familyMemberCount - 1))}
                            disabled={familyMemberCount <= 2}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <div className="text-center">
                            <div className="text-3xl font-bold therapy-text-gradient">{familyMemberCount}</div>
                            <div className="text-sm text-gray-500">family members</div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setFamilyMemberCount(Math.min(12, familyMemberCount + 1))}
                            disabled={familyMemberCount >= 12}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tier Selection */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Choose Your Plan Level</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(familyTiers).map(([key, tier]) => {
                          const IconComponent = tier.icon;
                          const isSelected = selectedFamilyTier === key;
                          
                          return (
                            <Card 
                              key={key}
                              className={`cursor-pointer transition-all duration-200 ${
                                isSelected 
                                  ? 'ring-2 ring-therapy-500 shadow-lg' 
                                  : 'hover:shadow-md'
                              }`}
                              onClick={() => setSelectedFamilyTier(key as 'pro' | 'premium')}
                            >
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                                      <IconComponent className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                                      <div className="text-sm text-gray-500">
                                        {formatPrice(tier.basePrice)} base + {formatPrice(tier.pricePerMember)}/member
                                      </div>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <Badge className="bg-therapy-500 text-white">Selected</Badge>
                                  )}
                                </div>
                              </CardHeader>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calculator className="h-5 w-5" />
                          <span>Your Custom Plan Pricing</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-lg">
                          <span>Monthly Total:</span>
                          <span className="font-bold">{formatPrice(familyMonthlyPrice)}/month</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Yearly Total:</span>
                            <span className="font-bold">{formatPrice(familyYearlyPrice)}/year</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Annual Savings:</span>
                            <span className="font-bold">-{formatPrice(familySavings)}</span>
                          </div>
                        </div>

                        <div className="text-center pt-4">
                          <Button 
                            onClick={() => handleSelectPlan(selectedTierData.name, {
                              ...selectedTierData,
                              memberCount: familyMemberCount,
                              monthlyPrice: familyMonthlyPrice,
                              yearlyPrice: familyYearlyPrice
                            })}
                            className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white"
                          >
                            Get Started with {selectedTierData.name}
                          </Button>
                          <div className="text-sm text-gray-500 mt-2">
                            7-day free trial • Cancel anytime
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
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
