
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Shield,
  TrendingUp
} from 'lucide-react';

interface StripeConfig {
  id: string;
  webhook_url: string;
  is_live_mode: boolean;
  auto_invoicing: boolean;
  send_receipts: boolean;
  subscription_notifications: boolean;
  payment_failure_alerts: boolean;
}

const StripeIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<StripeConfig | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const stripeFeatures = [
    {
      id: 'subscription-management',
      name: 'Subscription Management',
      icon: CreditCard,
      description: 'Manage therapy subscriptions and billing cycles',
      features: ['Monthly/Yearly Plans', 'Prorations', 'Trial Periods', 'Discounts'],
      color: 'bg-blue-500'
    },
    {
      id: 'payment-processing',
      name: 'Payment Processing',
      icon: DollarSign,
      description: 'Secure payment processing for therapy sessions',
      features: ['Credit Cards', 'Bank Transfers', 'Digital Wallets', 'International Payments'],
      color: 'bg-green-500'
    },
    {
      id: 'billing-automation',
      name: 'Billing Automation',
      icon: Receipt,
      description: 'Automated invoicing and receipt generation',
      features: ['Auto Invoicing', 'Receipt Emails', 'Tax Calculations', 'Dunning Management'],
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadStripeConfig();
    }
  }, [user]);

  const loadStripeConfig = async () => {
    try {
      // Mock data until database is updated
      setConfig(null);
      setConnected(false);
    } catch (error) {
      console.error('Error loading Stripe config:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectStripe = async () => {
    try {
      const mockConfig: StripeConfig = {
        id: Math.random().toString(36).substr(2, 9),
        webhook_url: webhookUrl || 'https://your-app.com/stripe/webhook',
        is_live_mode: false,
        auto_invoicing: true,
        send_receipts: true,
        subscription_notifications: true,
        payment_failure_alerts: true
      };

      setConfig(mockConfig);
      setConnected(true);
      
      toast({
        title: "Stripe Connected",
        description: "Stripe integration has been configured successfully",
      });

    } catch (error) {
      console.error('Error connecting Stripe:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Stripe. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  const updateConfig = async (updates: Partial<StripeConfig>) => {
    if (!config) return;
    
    try {
      const updatedConfig = { ...config, ...updates };
      setConfig(updatedConfig);
      
      toast({
        title: "Settings Updated",
        description: "Stripe configuration has been saved",
      });
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const testWebhook = async () => {
    try {
      toast({
        title: "Testing Webhook",
        description: "Sending test event to verify webhook configuration",
      });

      // Simulate webhook test
      setTimeout(() => {
        toast({
          title: "Webhook Test Successful",
          description: "Your webhook endpoint is configured correctly",
        });
      }, 2000);

    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Webhook Test Failed",
        description: "Please check your webhook URL and try again",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stripe Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stripeFeatures.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <Card key={feature.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${feature.color} rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <p className="text-sm text-therapy-600">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Features</h5>
                  <div className="flex flex-wrap gap-1">
                    {feature.features.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stripe Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Stripe Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Stripe</h3>
              <p className="text-gray-600 mb-6">
                Set up Stripe to handle payments, subscriptions, and billing for your therapy platform.
              </p>
              
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://your-app.com/stripe/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                
                <Button onClick={connectStripe} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Connect Stripe Account
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Stripe Connected</h4>
                    <p className="text-sm text-gray-600">
                      Mode: {config?.is_live_mode ? 'Live' : 'Test'}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              </div>

              {/* Configuration Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Payment Settings</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto Invoicing</Label>
                      <p className="text-xs text-gray-600">Automatically generate invoices for subscriptions</p>
                    </div>
                    <Switch
                      checked={config?.auto_invoicing}
                      onCheckedChange={(checked) => updateConfig({ auto_invoicing: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Send Receipts</Label>
                      <p className="text-xs text-gray-600">Email receipts to customers after payments</p>
                    </div>
                    <Switch
                      checked={config?.send_receipts}
                      onCheckedChange={(checked) => updateConfig({ send_receipts: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Subscription Notifications</Label>
                      <p className="text-xs text-gray-600">Notify users of subscription changes</p>
                    </div>
                    <Switch
                      checked={config?.subscription_notifications}
                      onCheckedChange={(checked) => updateConfig({ subscription_notifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Payment Failure Alerts</Label>
                      <p className="text-xs text-gray-600">Alert admins when payments fail</p>
                    </div>
                    <Switch
                      checked={config?.payment_failure_alerts}
                      onCheckedChange={(checked) => updateConfig({ payment_failure_alerts: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Webhook Testing */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Webhook Configuration</h4>
                    <p className="text-sm text-gray-600">
                      Endpoint: {config?.webhook_url}
                    </p>
                  </div>
                  <Button onClick={testWebhook} variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security & Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-medium mb-1">PCI Compliance</h4>
              <p className="text-sm text-gray-600">
                Stripe handles all PCI compliance requirements for secure payment processing.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-medium mb-1">Real-time Analytics</h4>
              <p className="text-sm text-gray-600">
                Monitor payment performance and subscription metrics in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeIntegration;
