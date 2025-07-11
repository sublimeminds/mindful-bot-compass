import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdvancedBillingService } from '@/services/advancedBillingService';

interface BillingOverviewProps {
  userId: string;
}

const BillingOverview: React.FC<BillingOverviewProps> = ({ userId }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [upcomingInvoice, setUpcomingInvoice] = useState<any>(null);
  const [failedPayments, setFailedPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, [userId]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      // Fetch current subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      setSubscription(subscriptionData);

      // Fetch upcoming invoice
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'open')
        .order('invoice_date', { ascending: false })
        .limit(1)
        .single();

      setUpcomingInvoice(invoiceData);

      // Fetch failed payments
      const failedPaymentsData = await AdvancedBillingService.getFailedPayments(userId);
      setFailedPayments(failedPaymentsData);

    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      const url = await AdvancedBillingService.getCustomerPortalUrl();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Billing Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Current Subscription
            </div>
            <Button variant="outline" size="sm" onClick={openCustomerPortal}>
              Manage
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant="secondary">{subscription.plan_id}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : 'destructive'}
                >
                  {subscription.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next billing</span>
                <span className="text-sm font-medium">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
              {subscription.canceled_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cancels on</span>
                  <span className="text-sm font-medium text-destructive">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No active subscription</p>
              <Button size="sm" className="mt-2">
                Subscribe Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Failed Payments Alert */}
      {failedPayments.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Payment Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {failedPayments.slice(0, 2).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      ${payment.amount} payment failed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.failure_reason}
                    </p>
                  </div>
                  <Button size="sm" variant="destructive">
                    Retry
                  </Button>
                </div>
              ))}
              {failedPayments.length > 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{failedPayments.length - 2} more payment issues
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Invoice */}
      {upcomingInvoice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Upcoming Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold">
                  ${upcomingInvoice.amount_total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due date</span>
                <span className="text-sm font-medium">
                  {new Date(upcomingInvoice.payment_due_date).toLocaleDateString()}
                </span>
              </div>
              <Button size="sm" className="w-full">
                View Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">$0</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">3</p>
              <p className="text-xs text-muted-foreground">Invoices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingOverview;