import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard, Calendar, AlertCircle, Crown, Star } from 'lucide-react';

const Subscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchPlans();
      fetchUsage();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchUsage = async () => {
    try {
      const { data } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      
      setUsage(data || []);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'pro':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getUsagePercentage = (resourceType) => {
    const currentUsage = usage?.find(u => u.resource_type === resourceType)?.usage_count || 0;
    const limit = subscription?.subscription_plans?.limits?.[resourceType];
    
    if (!limit || limit === -1) return 0; // Unlimited
    return Math.min((currentUsage / limit) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600 mt-1">Manage your plan, billing, and usage</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {subscription && getPlanIcon(subscription.subscription_plans?.name)}
            <span>Current Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <span>{subscription.subscription_plans?.name}</span>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                    {subscription.status}
                  </Badge>
                </h3>
                <p className="text-gray-600 mt-1">{subscription.subscription_plans?.description}</p>
                <p className="text-2xl font-bold mt-2">
                  ${subscription.subscription_plans?.price}
                  <span className="text-sm font-normal text-gray-500">/{subscription.billing_cycle}</span>
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Billing</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                  {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-600">
                        Trial ends: {new Date(subscription.trial_end).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Update Payment</Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-500 mb-4">Choose a plan to unlock premium features</p>
              <Button>Browse Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['sessions', 'ai_messages', 'storage'].map((resourceType) => {
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
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{usage_count} used</span>
                        <span>{limit === -1 ? 'Unlimited' : `${limit} limit`}</span>
                      </div>
                      {limit !== -1 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              percentage > 80 ? 'bg-red-500' : 
                              percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${
                subscription?.subscription_plans?.id === plan.id ? 'ring-2 ring-therapy-500' : ''
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(plan.name)}
                      <span>{plan.name}</span>
                    </div>
                    {subscription?.subscription_plans?.id === plan.id && (
                      <Badge>Current</Badge>
                    )}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={subscription?.subscription_plans?.id === plan.id ? 'outline' : 'default'}
                    disabled={subscription?.subscription_plans?.id === plan.id}
                  >
                    {subscription?.subscription_plans?.id === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No billing history available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Subscription;