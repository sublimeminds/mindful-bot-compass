import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Heart, Crown, Users, Calculator, Sparkles, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CurrencySelector from '@/components/ui/CurrencySelector';
import GradientButton from '@/components/ui/GradientButton';

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, string>;
  limits: Record<string, any>;
  trial_days: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

const EnhancedPricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [userCurrency, setUserCurrency] = useState('USD');
  const [userLocation, setUserLocation] = useState(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState('individual');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  
  // Family plan customization state
  const [familyMemberCount, setFamilyMemberCount] = useState(4);
  const [familyTier, setFamilyTier] = useState<'pro' | 'premium'>('pro');

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        await enhancedCurrencyService.ensureExchangeRatesLoaded();
        const location = await enhancedCurrencyService.detectUserLocation();
        if (location) {
          setUserCurrency(location.currency);
          setUserLocation(location as any);
        }
      } catch (error) {
        console.warn('Could not detect currency:', error);
      }
    };
    
    initializeCurrency();
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .not('name', 'like', '%Family%') // Exclude family plans from regular display
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      
      const transformedPlans = (data || []).map(plan => ({
        ...plan,
        trial_days: (plan as any).trial_days || 0,
        features: plan.features as Record<string, string>,
        limits: plan.limits as Record<string, any>
      }));
      
      setPlans(transformedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPriceSync = (usdPrice: number): string => {
    try {
      const convertedAmount = enhancedCurrencyService.convertAmount(usdPrice, 'USD', userCurrency);
      return enhancedCurrencyService.formatCurrency(convertedAmount, userCurrency);
    } catch (error) {
      console.error('Error formatting price:', error);
      return enhancedCurrencyService.formatCurrency(usdPrice, 'USD');
    }
  };

  // Family plan pricing logic
  const familyTiers = {
    pro: {
      name: 'Family Pro',
      basePrice: 29.99,
      pricePerMember: 9.99,
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

  const selectedFamilyTier = familyTiers[familyTier];
  const familyMonthlyPrice = selectedFamilyTier.basePrice + (familyMemberCount * selectedFamilyTier.pricePerMember);
  const familyYearlyPrice = familyMonthlyPrice * 12 * 0.8; // 20% discount

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    if (plan.name === 'Free') {
      navigate('/onboarding');
      return;
    }

    setProcessingPlan(plan.id);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: plan.id,
          billingCycle,
          redirectUrl: `${window.location.origin}/onboarding?success=true&plan=${plan.name}`
        }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const PlanCard = ({ plan, isPopular = false }: { plan: SubscriptionPlan; isPopular?: boolean }) => {
    const currentPrice = billingCycle === 'yearly' 
      ? formatPriceSync(plan.price_yearly) 
      : formatPriceSync(plan.price_monthly);
    
    const savings = billingCycle === 'yearly' && plan.price_yearly > 0 
      ? Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100)
      : 0;

    const getIcon = () => {
      if (plan.name.includes('Premium')) return Crown;
      if (plan.name.includes('Pro')) return Star;
      return Heart;
    };

    const IconComponent = getIcon();

    return (
      <Card 
        className={`relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
          isPopular ? 'ring-2 ring-therapy-500 shadow-xl scale-105' : 'shadow-lg'
        }`}
      >
        {isPopular && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white text-center py-2 text-sm font-medium">
            Most Popular
          </div>
        )}
        
        <CardHeader className={isPopular ? 'pt-12' : ''}>
          <div className={`w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          
          <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
          
          <div className="text-center">
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-4xl font-bold therapy-text-gradient">
                {currentPrice}
              </span>
              {plan.name !== 'Free' && (
                <span className="text-gray-500">/{billingCycle}</span>
              )}
            </div>
            
            {savings > 0 && (
              <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                Save {savings}%
              </Badge>
            )}

            {plan.trial_days > 0 && (
              <Badge variant="outline" className="mt-2 border-therapy-200 text-therapy-600">
                {plan.trial_days}-day free trial
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <ul className="space-y-3 mb-8">
            {Object.entries(plan.features).map(([key, feature]) => (
              <li key={key} className="flex items-start space-x-2">
                <Check className="h-4 w-4 text-therapy-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <GradientButton 
            className="w-full"
            onClick={() => handlePlanSelection(plan)}
            disabled={processingPlan === plan.id}
          >
            {processingPlan === plan.id ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : plan.name === 'Free' ? (
              'Get Started Free'
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Choose {plan.name}
              </>
            )}
          </GradientButton>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  return (
    <div className="py-20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="therapy-text-gradient-animated">
              Choose Your Mental Health Plan
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            From free basic support to comprehensive family care - find the perfect plan for your mental health journey.
          </p>
          
          <div className="flex justify-center mb-8">
            <CurrencySelector
              value={userCurrency}
              onChange={setUserCurrency}
              className="max-w-sm"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="individual" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Individual</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Family Plans</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:ring-offset-2 ${
                  billingCycle === 'yearly' ? 'bg-therapy-500' : 'bg-gray-200'
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
                <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                  Save up to 35%
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isPopular={plan.name === 'Pro'}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="family">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">Build Your Custom Family Plan</h3>
                <p className="text-lg text-gray-600">
                  Complete mental health support for your entire family with parental controls, 
                  shared progress tracking, and crisis monitoring.
                </p>
              </div>

              {/* Family Plan Builder */}
              <div className="space-y-8">
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
                      const IconComponent = key === 'premium' ? Crown : Star;
                      const isSelected = familyTier === key;
                      
                      return (
                        <Card 
                          key={key}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-therapy-500 shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setFamilyTier(key as 'pro' | 'premium')}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${key === 'premium' ? 'from-therapy-600 to-harmony-600' : 'from-therapy-500 to-calm-500'} rounded-lg flex items-center justify-center`}>
                                  <IconComponent className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                                  <div className="text-sm text-gray-500">
                                    {formatPriceSync(tier.basePrice)} base + {formatPriceSync(tier.pricePerMember)}/member
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
                      <span className="font-bold">{formatPriceSync(familyMonthlyPrice)}/month</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Yearly Total:</span>
                        <span className="font-bold">{formatPriceSync(familyYearlyPrice)}/year</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Annual Savings:</span>
                        <span className="font-bold">-{formatPriceSync(familyMonthlyPrice * 12 - familyYearlyPrice)}</span>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <GradientButton 
                        size="lg" 
                        onClick={() => {
                          // Handle family plan selection
                          console.log('Selected family plan:', { tier: familyTier, members: familyMemberCount });
                        }}
                        className="w-full"
                      >
                        Get Started with {selectedFamilyTier.name}
                      </GradientButton>
                      <div className="text-sm text-gray-500 mt-2">
                        7-day free trial • Cancel anytime
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <selectedFamilyTier.icon className="h-5 w-5" />
                      <span>{selectedFamilyTier.name} Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedFamilyTier.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Heart className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedPricingSection;
