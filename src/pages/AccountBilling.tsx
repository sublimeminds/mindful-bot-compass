import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, Users, Crown, Star, Check, Calendar, 
  TrendingUp, AlertCircle, Download, Wallet, Receipt,
  ArrowUpCircle, Zap, Shield, Home
} from 'lucide-react';
import RealBillingHistory from '@/components/subscription/RealBillingHistory';

interface UserSubscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  billing_cycle: string;
  plan_id: string;
  stripe_subscription_id?: string;
  subscription_plans?: {
    id: string;
    name: string;
    price_monthly: number;
    price_yearly: number;
    description?: string;
    features?: any;
    limits?: any;
    is_family_plan?: boolean;
  };
}

interface PaymentMethod {
  id: string;
  type: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  card_brand: string;
  is_default: boolean;
  stripe_payment_method_id: string;
}

interface UsageData {
  resource_type: string;
  usage_count: number;
  period_start: string;
  period_end: string;
}

const AccountBilling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSubscription(),
        loadPaymentMethods(),
        loadPlans(),
        loadUsage()
      ]);
    } catch (error) {
      console.error('Error loading account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) {
        throw error;
      }

      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user?.id)
        .gte('period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUsage(data || []);
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  const handleUpgradePlan = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId,
          billingCycle,
          redirectUrl: `${window.location.origin}/account-billing?success=true`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManagePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open payment management. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUsagePercentage = (resourceType: string) => {
    const currentUsage = usage?.find(u => u.resource_type === resourceType)?.usage_count || 0;
    const limit = subscription?.subscription_plans?.limits?.[resourceType];
    
    if (!limit || limit === -1) return 0;
    return Math.min((currentUsage / limit) * 100, 100);
  };

  const getPlanIcon = (planName: string, isFamilyPlan: boolean = false) => {
    if (isFamilyPlan) return <Home className="w-5 h-5 text-blue-500" />;
    
    switch (planName?.toLowerCase()) {
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'pro':
      case 'enterprise':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDefaultPaymentMethod = () => {
    const defaultMethod = paymentMethods.find(pm => pm.is_default);
    if (defaultMethod) {
      return {
        display: `•••• •••• •••• ${defaultMethod.card_last4}`,
        expiry: `${defaultMethod.card_exp_month.toString().padStart(2, '0')}/${defaultMethod.card_exp_year.toString().slice(-2)}`,
        type: defaultMethod.card_brand || defaultMethod.type
      };
    }
    return null;
  };

  const individualPlans = plans.filter((plan: any) => !plan.is_family_plan);
  const familyPlans = plans.filter((plan: any) => plan.is_family_plan);
  const defaultPayment = getDefaultPaymentMethod();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-800">Account & Billing</h1>
          <p className="text-slate-600 mt-2">Manage your subscription, billing, and account settings</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            toast({
              title: "Export Started",
              description: "Your account summary will be downloaded shortly.",
            });
          }}
        >
          <Download className="h-4 w-4" />
          Export Summary
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans & Upgrades</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {subscription && getPlanIcon(subscription.subscription_plans?.name, subscription.subscription_plans?.is_family_plan)}
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{subscription.subscription_plans?.name}</h3>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                        {subscription.status}
                      </Badge>
                      {subscription.subscription_plans?.is_family_plan && (
                        <Badge variant="secondary">Family Plan</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{subscription.subscription_plans?.description}</p>
                    <p className="text-2xl font-bold">
                      ${subscription.billing_cycle === 'yearly' 
                        ? subscription.subscription_plans?.price_yearly 
                        : subscription.subscription_plans?.price_monthly}
                      <span className="text-sm font-normal text-gray-500">/{subscription.billing_cycle}</span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Billing Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                      {defaultPayment && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{defaultPayment.display}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="default" 
                      className="flex items-center gap-2"
                      onClick={() => setActiveTab('plans')}
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      Upgrade Plan
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleManagePayment}
                    >
                      Manage Billing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-500 mb-4">Choose a plan to unlock premium features</p>
                  <Button onClick={() => setActiveTab('plans')}>Browse Plans</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-therapy-600" />
                Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['sessions', 'ai_messages', 'storage'].map((resourceType) => {
                  const usage_count = usage?.find(u => u.resource_type === resourceType)?.usage_count || 0;
                  const limit = subscription?.subscription_plans?.limits?.[resourceType];
                  const percentage = getUsagePercentage(resourceType);
                  
                  return (
                    <div key={resourceType} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{resourceType.replace('_', ' ')}</span>
                        <span className="text-gray-500">
                          {usage_count} / {limit === -1 ? '∞' : limit}
                        </span>
                      </div>
                      {limit !== -1 && (
                        <Progress 
                          value={percentage} 
                          className={`h-2 ${
                            percentage > 80 ? 'text-red-500' : 
                            percentage > 60 ? 'text-yellow-500' : 'text-green-500'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('usage')}
              >
                View Detailed Usage
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans & Upgrades Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Individual Plans */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Individual Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {individualPlans.map((plan) => (
                <Card key={plan.id} className={`relative ${
                  subscription?.subscription_plans?.id === plan.id ? 'ring-2 ring-therapy-500' : ''
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlanIcon(plan.name)}
                        <span>{plan.name}</span>
                      </div>
                      {subscription?.subscription_plans?.id === plan.id && (
                        <Badge>Current</Badge>
                      )}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        ${plan.price_monthly}
                        <span className="text-lg font-normal text-gray-500">/month</span>
                      </div>
                      <div className="text-lg text-gray-600">
                        ${plan.price_yearly}
                        <span className="text-sm font-normal text-gray-500">/year</span>
                        <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <ul className="space-y-2 mb-6">
                      {Array.isArray(plan.features) ? plan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      )) : null}
                    </ul>
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        variant={subscription?.subscription_plans?.id === plan.id ? 'outline' : 'default'}
                        disabled={subscription?.subscription_plans?.id === plan.id}
                        onClick={() => subscription?.subscription_plans?.id !== plan.id && handleUpgradePlan(plan.id, 'monthly')}
                      >
                        {subscription?.subscription_plans?.id === plan.id ? 'Current Plan' : 'Select Monthly'}
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        disabled={subscription?.subscription_plans?.id === plan.id}
                        onClick={() => subscription?.subscription_plans?.id !== plan.id && handleUpgradePlan(plan.id, 'yearly')}
                      >
                        Select Yearly
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Family Plans */}
          {familyPlans.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Family Plans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {familyPlans.map((plan) => (
                  <Card key={plan.id} className={`relative ${
                    subscription?.subscription_plans?.id === plan.id ? 'ring-2 ring-therapy-500' : ''
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPlanIcon(plan.name, true)}
                          <span>{plan.name}</span>
                        </div>
                        {subscription?.subscription_plans?.id === plan.id && (
                          <Badge>Current</Badge>
                        )}
                      </CardTitle>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">
                          ${plan.price_monthly}
                          <span className="text-lg font-normal text-gray-500">/month</span>
                        </div>
                        <div className="text-lg text-gray-600">
                          ${plan.price_yearly}
                          <span className="text-sm font-normal text-gray-500">/year</span>
                          <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      <ul className="space-y-2 mb-6">
                        {Array.isArray(plan.features) ? plan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        )) : null}
                      </ul>
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          variant={subscription?.subscription_plans?.id === plan.id ? 'outline' : 'default'}
                          disabled={subscription?.subscription_plans?.id === plan.id}
                          onClick={() => subscription?.subscription_plans?.id !== plan.id && handleUpgradePlan(plan.id, 'monthly')}
                        >
                          {subscription?.subscription_plans?.id === plan.id ? 'Current Plan' : 'Select Monthly'}
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          disabled={subscription?.subscription_plans?.id === plan.id}
                          onClick={() => subscription?.subscription_plans?.id !== plan.id && handleUpgradePlan(plan.id, 'yearly')}
                        >
                          Select Yearly
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Billing History Tab */}
        <TabsContent value="billing">
          <RealBillingHistory />
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-therapy-600" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              {defaultPayment ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-therapy-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-therapy-600" />
                      <div>
                        <div className="font-medium">{defaultPayment.display}</div>
                        <div className="text-sm text-slate-500">
                          {defaultPayment.type} • Expires {defaultPayment.expiry}
                        </div>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleManagePayment}>
                      Update Payment Method
                    </Button>
                    <Button variant="outline" onClick={handleManagePayment}>
                      Add New Method
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No payment method on file</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a payment method to upgrade your plan and access premium features.
                  </p>
                  <Button onClick={handleManagePayment}>
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage & Limits Tab */}
        <TabsContent value="usage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-therapy-600" />
                  Current Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['sessions', 'ai_messages', 'storage', 'assessments', 'group_sessions'].map((resourceType) => {
                    const usage_count = usage?.find(u => u.resource_type === resourceType)?.usage_count || 0;
                    const limit = subscription?.subscription_plans?.limits?.[resourceType];
                    const percentage = getUsagePercentage(resourceType);
                    
                    return (
                      <Card key={resourceType}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium capitalize">
                            {resourceType.replace('_', ' ')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>{usage_count} used</span>
                              <span>{limit === -1 ? 'Unlimited' : `${limit} limit`}</span>
                            </div>
                            {limit !== -1 && (
                              <Progress 
                                value={percentage} 
                                className={`h-2 ${
                                  percentage > 80 ? 'text-red-500' : 
                                  percentage > 60 ? 'text-yellow-500' : 'text-green-500'
                                }`}
                              />
                            )}
                            {percentage > 80 && limit !== -1 && (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                Approaching limit
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Usage approaching limits warning */}
            {usage.some(u => {
              const limit = subscription?.subscription_plans?.limits?.[u.resource_type];
              return limit && limit !== -1 && (u.usage_count / limit) > 0.8;
            }) && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-5 h-5" />
                    Usage Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 mb-4">
                    You're approaching your usage limits. Consider upgrading your plan to avoid service interruptions.
                  </p>
                  <Button 
                    variant="default" 
                    className="bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => setActiveTab('plans')}
                  >
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountBilling;