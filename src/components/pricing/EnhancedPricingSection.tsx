
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Heart, Crown, Users, Calculator, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CurrencySelector from '@/components/ui/CurrencySelector';
import GradientButton from '@/components/ui/GradientButton';
import FamilyPlanSelector from '@/components/family/FamilyPlanSelector';

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
  const [showFamilySelector, setShowFamilySelector] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
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
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
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

  const formatPrice = async (usdPrice: number): Promise<string> => {
    try {
      await enhancedCurrencyService.updateExchangeRates();
      
      let convertedAmount = enhancedCurrencyService.convertAmount(usdPrice, 'USD', userCurrency);
      
      if (userLocation) {
        convertedAmount = await enhancedCurrencyService.getRegionalPricing(
          convertedAmount, 
          userCurrency, 
          (userLocation as any).region
        );
      }
      
      return enhancedCurrencyService.formatCurrency(convertedAmount, userCurrency);
    } catch (error) {
      console.error('Error formatting price:', error);
      return enhancedCurrencyService.formatCurrency(usdPrice, 'USD');
    }
  };

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

  const individualPlans = plans.filter(plan => !plan.name.includes('Family'));
  const familyPlans = plans.filter(plan => plan.name.includes('Family'));

  const PlanCard = ({ plan, isPopular = false }: { plan: SubscriptionPlan; isPopular?: boolean }) => {
    const [monthlyPrice, setMonthlyPrice] = useState('$0');
    const [yearlyPrice, setYearlyPrice] = useState('$0');

    useEffect(() => {
      const updatePrices = async () => {
        const monthly = await formatPrice(plan.price_monthly);
        const yearly = await formatPrice(plan.price_yearly);
        setMonthlyPrice(monthly);
        setYearlyPrice(yearly);
      };
      updatePrices();
    }, [plan, userCurrency, userLocation]);

    const currentPrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
    const savings = billingCycle === 'yearly' && plan.price_yearly > 0 
      ? Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100)
      : 0;

    const getIcon = () => {
      if (plan.name.includes('Premium')) return Crown;
      if (plan.name.includes('Pro') || plan.name.includes('Family')) return Star;
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
              {individualPlans.map((plan, index) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isPopular={plan.name === 'Pro'}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="family">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">Family Mental Health Plans</h3>
              <p className="text-lg text-gray-600 mb-8">
                Complete mental health support for your entire family with parental controls, 
                shared progress tracking, and crisis monitoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {familyPlans.map((plan) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isPopular={plan.name === 'Family Pro'}
                />
              ))}
            </div>

            <div className="text-center">
              <GradientButton
                size="lg"
                onClick={() => setShowFamilySelector(true)}
                className="px-8"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Build Custom Family Plan
              </GradientButton>
            </div>
          </TabsContent>
        </Tabs>

        {/* Family Plan Selector Modal */}
        <FamilyPlanSelector
          isOpen={showFamilySelector}
          onClose={() => setShowFamilySelector(false)}
        />
      </div>
    </div>
  );
};

export default EnhancedPricingSection;
