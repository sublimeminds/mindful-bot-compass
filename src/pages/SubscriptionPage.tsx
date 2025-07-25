
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedSubscriptionManager } from '@/components/subscription/AdvancedSubscriptionManager';
import EnhancedBillingHistory from '@/components/billing/EnhancedBillingHistory';
import PaymentMethodManager from '@/components/billing/PaymentMethodManager';
import PlanSelector from '@/components/subscription/PlanSelector';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';

const SubscriptionPage = () => {
  const handleSelectPlan = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    console.log('Selected plan:', planId, billingCycle);
  };

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-therapy-600 mb-8">Subscription</h1>
        
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedSubscriptionManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <PlanSelector onSelectPlan={handleSelectPlan} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentMethodManager />
          </TabsContent>
          
          <TabsContent value="billing">
            <EnhancedBillingHistory />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default SubscriptionPage;
