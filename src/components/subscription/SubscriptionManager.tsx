
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CreditCard, TrendingUp, AlertCircle, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import PlanSelector from './PlanSelector';
import BillingHistory from './BillingHistory';

const SubscriptionManager = () => {
  const { 
    subscription, 
    getCurrentPlan, 
    getUsageForResource, 
    getRemainingUsage,
    isFreePlan,
    loading
  } = useSubscription();
  
  const [activeTab, setActiveTab] = useState('overview');
  const currentPlan = getCurrentPlan();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  const getUsagePercentage = (resourceType: string) => {
    if (!currentPlan) return 0;
    
    const limit = currentPlan.limits[resourceType];
    if (limit === -1) return 0; // Unlimited
    
    const usage = getUsageForResource(resourceType);
    return (usage / limit) * 100;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-therapy-100">
                <Crown className="h-5 w-5 text-therapy-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {currentPlan?.name || 'Free'} Plan
                </CardTitle>
                <p className="text-muted-foreground">
                  {subscription?.billing_cycle === 'yearly' ? 'Annual' : 'Monthly'} billing
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${subscription?.billing_cycle === 'yearly' 
                  ? (currentPlan?.price_yearly || 0) 
                  : (currentPlan?.price_monthly || 0)
                }
              </div>
              <div className="text-sm text-muted-foreground">
                {subscription?.billing_cycle === 'yearly' ? 'per year' : 'per month'}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {subscription && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                {subscription.status}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Overview for non-unlimited plans */}
      {currentPlan && Object.values(currentPlan.limits).some(limit => limit !== -1) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Usage This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(currentPlan.limits).map(([resourceType, limit]) => {
              if (limit === -1) return null; // Skip unlimited resources
              
              const usage = getUsageForResource(resourceType);
              const percentage = getUsagePercentage(resourceType);
              const remaining = getRemainingUsage(resourceType);
              
              const displayName = resourceType
                .replace(/_/g, ' ')
                .replace(/per month|per day|max/, '')
                .trim()
                .replace(/^\w/, c => c.toUpperCase());

              return (
                <div key={resourceType} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{displayName}</span>
                    <span className={`text-sm font-medium ${getStatusColor(percentage)}`}>
                      {usage} / {limit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  {percentage >= 90 && (
                    <div className="flex items-center space-x-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Only {remaining} {displayName.toLowerCase()} remaining this month
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Change Plan</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isFreePlan() && (
            <Card className="border-therapy-200 bg-therapy-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Crown className="h-8 w-8 text-therapy-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-therapy-900">
                      Upgrade to unlock more features
                    </h3>
                    <p className="text-therapy-700 mt-1">
                      Get unlimited therapy sessions, advanced analytics, and priority support
                    </p>
                    <Button 
                      className="mt-4 bg-therapy-600 hover:bg-therapy-700"
                      onClick={() => setActiveTab('plans')}
                    >
                      View Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Features included in current plan */}
          <Card>
            <CardHeader>
              <CardTitle>Included Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan && Object.entries(currentPlan.features).map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-therapy-500 rounded-full mt-2"></div>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PlanSelector showCurrentPlan />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManager;
