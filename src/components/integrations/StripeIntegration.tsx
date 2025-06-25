import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Settings, DollarSign, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const StripeIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    // Mock loading of subscription plans
    setSubscriptionPlans([
      { id: 'basic', name: 'Basic', price: 9.99, features: ['AI Therapy', 'Mood Tracking'] },
      { id: 'premium', name: 'Premium', price: 19.99, features: ['AI Therapy', 'Mood Tracking', 'Community Access'] },
      { id: 'pro', name: 'Pro', price: 29.99, features: ['AI Therapy', 'Mood Tracking', 'Community Access', 'Priority Support'] },
    ]);

    // Mock check if integration is enabled
    setIsIntegrationEnabled(true);
  }, []);

  const handleSaveConfiguration = async () => {
    setIsLoading(true);
    try {
      // Mock saving of API key
      toast({
        title: "Configuration Saved",
        description: "Stripe integration has been configured successfully.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to save Stripe configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableIntegration = async () => {
    setIsLoading(true);
    try {
      // Mock disabling of integration
      setIsIntegrationEnabled(false);
      toast({
        title: "Integration Disabled",
        description: "Stripe integration has been disabled.",
      });
    } catch (error) {
      console.error('Error disabling integration:', error);
      toast({
        title: "Error",
        description: "Failed to disable integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Plan Selected",
      description: `You have selected the ${subscriptionPlans.find(plan => plan.id === planId)?.name} plan.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Stripe Integration</span>
          </div>
          <Badge variant={isIntegrationEnabled ? "default" : "secondary"}>
            {isIntegrationEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="configuration" className="space-y-4">
          <TabsList>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>
          <TabsContent value="configuration" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-api-key">API Key</Label>
              <Input
                id="stripe-api-key"
                type="password"
                placeholder="Enter your Stripe API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSaveConfiguration}
                disabled={isLoading}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </Button>
              {isIntegrationEnabled && (
                <Button
                  variant="outline"
                  onClick={handleDisableIntegration}
                  disabled={isLoading}
                >
                  Disable
                </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="subscriptions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={selectedPlan === plan.id ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold">
                      <DollarSign className="inline-block h-5 w-5 mr-1" />
                      {plan.price}
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className="w-full"
                      disabled={selectedPlan === plan.id}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="billing" className="space-y-4">
            <p>Here you can view your billing history.</p>
            {/* Mock billing history */}
            <div className="rounded-md border">
              <div className="grid grid-cols-[150px_1fr_100px] gap-4 py-2 px-4 font-medium">
                <div>Date</div>
                <div>Description</div>
                <div className="text-right">Amount</div>
              </div>
              <Separator />
              <div className="grid grid-cols-[150px_1fr_100px] gap-4 py-2 px-4">
                <div>05/01/2024</div>
                <div>Subscription Payment - Premium Plan</div>
                <div className="text-right">$19.99</div>
              </div>
              <Separator />
              <div className="grid grid-cols-[150px_1fr_100px] gap-4 py-2 px-4">
                <div>04/01/2024</div>
                <div>Subscription Payment - Premium Plan</div>
                <div className="text-right">$19.99</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {isIntegrationEnabled && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Secure Integration Active</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Stripe is now connected for secure and seamless payments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeIntegration;
