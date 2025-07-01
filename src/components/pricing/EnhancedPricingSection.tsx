
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Check, Crown, Zap, Star, Users, Plus, Minus, Calculator } from 'lucide-react';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import CurrencySelector from '@/components/ui/CurrencySelector';
import { Separator } from '@/components/ui/separator';
import GradientLogo from '@/components/ui/GradientLogo';

interface FamilyPlanTier {
  name: string;
  basePrice: number;
  pricePerMember: number;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const EnhancedPricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currency,
    supportedCurrencies,
    loading: currencyLoading,
    isLoadingRates,
    changeCurrency,
    formatPrice
  } = useEnhancedCurrency();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showFamilyBuilder, setShowFamilyBuilder] = useState(false);
  const [familyMemberCount, setFamilyMemberCount] = useState(4);
  const [selectedFamilyTier, setSelectedFamilyTier] = useState<'pro' | 'premium'>('pro');

  const handleGetStarted = (plan: string, planData?: any) => {
    // Store plan selection for onboarding
    const planSelection = {
      name: plan,
      data: planData,
      billingCycle,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    
    // Always go to onboarding first
    navigate('/onboarding');
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started with your mental wellness journey',
      features: [
        '3 AI therapy sessions per month',
        'Basic mood tracking',
        'Community access',
        'Essential wellness tools',
        'Email support',
        'Basic goal setting'
      ],
      limitations: ['Limited session history', 'Basic analytics only'],
      buttonText: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600',
      trialDays: null
    },
    {
      id: 'premium',  
      name: 'Premium',
      icon: Zap,
      monthlyPrice: 9.90,
      yearlyPrice: 99,
      description: 'For dedicated users seeking comprehensive mental health support',
      features: [
        'Unlimited AI therapy sessions',
        'Advanced mood analytics',
        'Personalized insights & recommendations',
        'Goal tracking with progress reports',
        'Crisis support resources',
        'Voice interaction capabilities',
        'Priority email support',
        'Export your data',
        'Cultural awareness features',
        'Offline mode access'
      ],
      limitations: [],
      buttonText: 'Start Premium',
      popular: false,
      gradient: 'from-therapy-500 to-therapy-600',
      trialDays: null
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Crown,
      monthlyPrice: 24.90,
      yearlyPrice: 249,
      description: 'Advanced features for mental health professionals and coaches',
      features: [
        'Everything in Premium',
        '7-day free trial included',
        'Client management tools',
        'Advanced analytics dashboard',
        'Custom therapy protocols',
        'White-label options',
        'API access',
        'Phone support',
        'Compliance reporting',
        'Team collaboration features',
        'Advanced security controls'
      ],
      limitations: [],
      buttonText: 'Start 7-Day Free Trial',
      popular: true,
      gradient: 'from-harmony-500 to-harmony-600',
      trialDays: 7
    }
  ];

  const familyTiers: Record<'pro' | 'premium', FamilyPlanTier> = {
    pro: {
      name: 'Family Pro',
      basePrice: 29.99,
      pricePerMember: 9.99,
      icon: Star,
      color: 'from-therapy-500 to-calm-500',
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
      icon: Crown,
      color: 'from-therapy-600 to-harmony-600',
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

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return formatPrice(0);
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
    return formatPrice(price);
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlySavings = monthlyCost - plan.yearlyPrice;
    return Math.round((yearlySavings / monthlyCost) * 100);
  };

  const selectedTierData = familyTiers[selectedFamilyTier];
  const familyMonthlyPrice = selectedTierData.basePrice + (familyMemberCount * selectedTierData.pricePerMember);
  const familyYearlyPrice = familyMonthlyPrice * 12 * 0.8; // 20% discount for yearly
  const familySavings = (familyMonthlyPrice * 12) - familyYearlyPrice;

  if (currencyLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GradientLogo 
              size="xl"
              className="drop-shadow-sm"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as your mental wellness journey evolves. All plans include our core AI therapy features with enterprise-grade security.
          </p>

          {/* Currency Selector */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className="text-sm font-medium text-slate-600">Currency:</span>
            <CurrencySelector 
              value={currency.code}
              onChange={changeCurrency}
              className="w-48"
            />
            {isLoadingRates && (
              <div className="text-sm text-slate-500">Updating rates...</div>
            )}
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-therapy-100 text-therapy-700 border-therapy-200">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-4 ring-harmony-400 shadow-harmony-500/30 scale-105 bg-gradient-to-br from-harmony-50 to-balance-50 border-harmony-200' 
                    : 'hover:shadow-therapy-500/10 bg-white/80 backdrop-blur-sm border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-500 text-white text-center py-3 text-sm font-bold tracking-wide">
                    ⭐ MOST POPULAR - START FREE TRIAL ⭐
                  </div>
                )}
                
                {plan.trialDays && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-harmony-500 to-balance-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.trialDays} Days FREE
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-16 pb-6' : 'pb-8'}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl ${plan.popular ? 'animate-pulse' : ''}`}>
                    <IconComponent className={`${plan.popular ? 'h-8 w-8' : 'h-6 w-6'} text-white`} />
                  </div>
                  
                  <CardTitle className={`${plan.popular ? 'text-2xl' : 'text-2xl'} font-bold text-slate-900 mb-2`}>
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className={`${plan.popular ? 'text-4xl' : 'text-4xl'} font-bold text-slate-800`}>{getPrice(plan)}</span>
                    <span className="text-slate-600">
                      {plan.monthlyPrice === 0 ? '' : `/${billingCycle === 'monthly' ? 'month' : 'month'}`}
                    </span>
                    {billingCycle === 'yearly' && savings && (
                      <div className="text-sm text-therapy-600 font-medium mt-1">
                        Save {savings}% yearly
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-slate-600 ${plan.popular ? 'text-sm' : 'text-sm'}`}>
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className={`${plan.popular ? 'h-5 w-5 text-harmony-500' : 'h-5 w-5 text-therapy-500'} flex-shrink-0 mt-0.5`} />
                        <span className={`text-slate-700 ${plan.popular ? 'text-sm' : 'text-sm'}`}>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <span className="h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        </span>
                        <span className="text-slate-600 text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full font-semibold text-base py-3 transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-500 hover:from-harmony-600 hover:via-balance-600 hover:to-flow-600 text-white shadow-lg hover:shadow-xl hover:scale-105 ring-2 ring-harmony-300' 
                        : plan.id === 'premium'
                        ? 'bg-gradient-to-r from-therapy-500 via-harmony-500 to-balance-500 hover:from-therapy-600 hover:via-harmony-600 hover:to-balance-600 text-white shadow-lg hover:shadow-lg hover:scale-105'
                        : 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                    }`}
                    onClick={() => handleGetStarted(plan.name, plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
                          onClick={() => handleGetStarted(selectedTierData.name, {
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

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            No credit card required for Free plan. Professional plan includes 7-day free trial.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>🔒 HIPAA Compliant</span>
            <span>🌍 Available Worldwide</span>
            <span>💬 24/7 AI Support</span>
            <span>📱 Mobile & Web Access</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedPricingSection;
