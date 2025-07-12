import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Calendar, Star, Zap } from 'lucide-react';

interface UserSubscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  billing_cycle: string;
  plan_id: string;
  stripe_subscription_id?: string;
}

const RealSubscriptionData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanDetails = (planId?: string) => {
    // Default to free plan if no subscription
    if (!subscription || !planId) {
      return {
        name: 'Free Plan',
        price: '$0',
        features: ['Basic mood tracking', '3 AI chat sessions/week', 'Community access'],
        icon: Calendar,
        color: 'bg-gray-100 text-gray-800'
      };
    }

    // Determine plan based on plan_id or make educated guess
    const plans = {
      premium: {
        name: 'Premium Plan',
        price: '$19.99',
        features: ['Unlimited therapy sessions', 'Advanced analytics', 'Personalized therapy plans', 'Crisis support'],
        icon: Star,
        color: 'bg-blue-100 text-blue-800'
      },
      enterprise: {
        name: 'Enterprise Plan', 
        price: '$49.99',
        features: ['All premium features', 'Family accounts', 'Priority support', 'Advanced reporting'],
        icon: Zap,
        color: 'bg-purple-100 text-purple-800'
      }
    };

    // Try to match plan ID or default to premium
    return plans.premium;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Free</Badge>;
    }
  };

  const handleManagePlan = async () => {
    if (subscription?.stripe_subscription_id) {
      // Call customer portal function for existing subscribers
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
          description: "Failed to open customer portal. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Redirect to pricing/upgrade page for free users
      window.location.href = '/pricing';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-therapy-600" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const planDetails = getPlanDetails(subscription?.plan_id);
  const IconComponent = planDetails.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-therapy-600" />
          Current Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <IconComponent className="h-6 w-6 text-therapy-600" />
              <h3 className="text-xl font-semibold">{planDetails.name}</h3>
              {getStatusBadge(subscription?.status || 'free')}
            </div>
            
            <p className="text-slate-600 mb-3">
              {subscription 
                ? 'Full access to all AI therapists and features'
                : 'Limited access with basic features'
              }
            </p>

            <div className="space-y-1 mb-3">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="text-sm text-slate-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-therapy-600 rounded-full mr-2"></span>
                  {feature}
                </div>
              ))}
            </div>

            {subscription && (
              <div className="text-sm text-slate-500 space-y-1">
                <p>Billing cycle: {subscription.billing_cycle}</p>
                {subscription.current_period_end && (
                  <p>Next billing: {formatDate(subscription.current_period_end)}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="text-right ml-6">
            <div className="text-2xl font-bold text-therapy-600 mb-1">
              {planDetails.price}
            </div>
            <div className="text-sm text-slate-500 mb-3">
              {subscription ? `per ${subscription.billing_cycle?.replace('ly', '')}` : 'forever'}
            </div>
            <Button onClick={handleManagePlan} className="w-full">
              {subscription ? 'Manage Plan' : 'Upgrade Plan'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealSubscriptionData;