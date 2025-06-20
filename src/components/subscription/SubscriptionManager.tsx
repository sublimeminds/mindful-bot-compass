
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const SubscriptionManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Mock subscription data
      setSubscription({
        status: 'active',
        plan: 'Pro',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: 29.99
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading subscription...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{subscription.plan} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Next billing: {subscription.nextBilling.toLocaleDateString()}
                </p>
              </div>
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                {subscription.status}
              </Badge>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Monthly subscription</span>
                <span className="font-medium">${subscription.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Change Plan
              </Button>
              <Button variant="destructive" className="w-full">
                Cancel Subscription
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No active subscription</p>
            <Button>Subscribe Now</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
