
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BillingRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  billing_period_start: string;
  billing_period_end: string;
  paid_at: string;
  created_at: string;
}

const BillingHistory = () => {
  const { user } = useAuth();
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBillingHistory();
    }
  }, [user]);

  const fetchBillingHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('billing_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching billing history:', error);
    } else {
      setBillingHistory(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  if (billingHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No billing history yet</h3>
            <p className="text-muted-foreground mt-2">
              Your payment history will appear here once you upgrade to a paid plan.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Billing History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billingHistory.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="font-medium">
                    {formatCurrency(record.amount, record.currency)}
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {record.billing_period_start && record.billing_period_end ? (
                    <>
                      Billing period: {formatDate(record.billing_period_start)} - {formatDate(record.billing_period_end)}
                    </>
                  ) : (
                    <>Charged on {formatDate(record.paid_at || record.created_at)}</>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm text-muted-foreground">
                  {formatDate(record.paid_at || record.created_at)}
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
