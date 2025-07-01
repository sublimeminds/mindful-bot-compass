
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Check, Users, Plus, Minus, Heart, Star, Crown, Calculator, Zap } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import CurrencySelector from '@/components/ui/CurrencySelector';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import { supabase } from '@/integrations/supabase/client';

interface FamilyPlanTier {
  name: string;
  basePrice: number;
  pricePerMember: number;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
}

const EnhancedPricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [memberCount, setMemberCount] = useState(4);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'premium'>('pro');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    selectedCurrency,
    setSelectedCurrency,
    convertPrice,
    formatPrice,
    isLoadingRates
  } = useEnhancedCurrency();

  // Family plan tiers with proper typing
  const familyTiers: Record<'pro' | 'premium', FamilyPlanTier> = {
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
      icon: Crown,
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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data: supabasePlans } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly');

        if (supabasePlans) {
          // Add default properties and ensure proper structure
          const enhancedPlans = supabasePlans.map(plan => ({
            ...plan,
            trial_days: (plan as any).trial_days || 0,
            popular: plan.name === 'Premium',
            icon: plan.name === 'Free' ? Star : plan.name === 'Premium' ? Zap : Crown,
            gradient: plan.name === 'Free' 
              ? 'from-slate-500 to-slate-600'
              : plan.name === 'Premium'
              ? 'from-therapy-500 to-therapy-600'
              : 'from-harmony-500 to-harmony-600'
          }));
          setPlans(enhancedPlans);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback to static plans if needed
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleGetStarted = (plan: string) => {
    if (user) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  const getConvertedPrice = (price: number) => {
    if (isLoadingRates) return `${price} USD`;
    const converted = convertPrice(price, 'USD', selectedCurrency);
    return formatPrice(converted, selectedCurrency);
  };

  const selectedTierData = familyTiers[selectedTier];
  const monthlyPrice = selectedTierData.basePrice + (memberCount * selectedTierData.pricePerMember);
  const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount for yearly
  const savings = (monthlyPrice * 12) - yearlyPrice;

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-500"></div>
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
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-600">Currency:</span>
              <CurrencySelector
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                className="w-48"
              />
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:ring-offset-2 ${
                billingCycle === 'yearly' ? 'bg-therapy-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-therapy-100 text-therapy-700 border-therapy-200">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="individual">Individual Plans</TabsTrigger>
            <TabsTrigger value="family">Family Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => {
                const IconComponent = plan.icon;
                const monthlyPrice = billingCycle === 'monthly' ? plan.price_monthly : Math.floor(plan.price_yearly / 12);
                const yearlyPrice = plan.price_yearly;
                const savings = billingCycle === 'yearly' && plan.price_monthly > 0 
                  ? Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100)
                  : 0;
                
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
                        ⭐ MOST POPULAR ⭐
                      </div>
                    )}
                    
                    {plan.trial_days > 0 && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-harmony-500 to-balance-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {plan.trial_days} Days FREE
                      </div>
                    )}
                    
                    <CardHeader className={`text-center ${plan.popular ? 'pt-16 pb-6' : 'pb-8'}`}>
                      <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                        {plan.name}
                      </CardTitle>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-slate-800">
                          {getConvertedPrice(monthlyPrice)}
                        </span>
                        <span className="text-slate-600">
                          {plan.price_monthly === 0 ? '' : '/month'}
                        </span>
                        {billingCycle === 'yearly' && savings > 0 && (
                          <div className="text-sm text-therapy-600 font-medium mt-1">
                            Save {savings}% yearly
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 px-6 pb-8">
                      <ul className="space-y-3 mb-8">
                        {plan.features && (plan.features as string[]).map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className={`w-full font-semibold text-base py-3 transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-500 hover:from-harmony-600 hover:via-balance-600 hover:to-flow-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                            : 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                        }`}
                        onClick={() => handleGetStarted(plan.name)}
                      >
                        {plan.trial_days > 0 ? `Start ${plan.trial_days}-Day Free Trial` : `Get Started with ${plan.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="family">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center therapy-text-gradient">
                  Build Your Custom Family Plan
                </CardTitle>
                <p className="text-center text-gray-600 mt-2">
                  Customize your family therapy plan based on your needs
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Member Count Selector */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>How many family members?</span>
                  </h3>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                      disabled={memberCount <= 2}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold therapy-text-gradient">{memberCount}</div>
                      <div className="text-sm text-gray-500">family members</div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setMemberCount(Math.min(12, memberCount + 1))}
                      disabled={memberCount >= 12}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tier Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Your Plan Level</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(familyTiers).map(([key, tier]) => {
                      const TierIcon = tier.icon;
                      const isSelected = selectedTier === key;
                      
                      return (
                        <Card 
                          key={key}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-therapy-500 shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedTier(key as 'pro' | 'premium')}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                                  <TierIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                                  <div className="text-sm text-gray-500">
                                    {getConvertedPrice(tier.basePrice)} base + {getConvertedPrice(tier.pricePerMember)}/member
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

                {/* Features Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <selectedTierData.icon className="h-5 w-5" />
                      <span>{selectedTierData.name} Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedTierData.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Heart className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

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
                      <span className="font-bold">{getConvertedPrice(monthlyPrice)}/month</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Yearly Total:</span>
                        <span className="font-bold">{getConvertedPrice(yearlyPrice)}/year</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Annual Savings:</span>
                        <span className="font-bold">-{getConvertedPrice(savings)}</span>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <Button 
                        size="lg" 
                        onClick={() => handleGetStarted(selectedTierData.name)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            No credit card required for Free plan. All paid plans include free trial periods.
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
