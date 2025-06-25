import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Download, Calendar, DollarSign } from 'lucide-react';

interface BillingRecord {
  id: string;
  amount: number;
  currency: string;
  description: string;
  invoice_url?: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

const RealBillingHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBillingHistory();
    }
  }, [user]);

  const loadBillingHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        currency: item.currency,
        description: item.description || 'Subscription Payment',
        invoice_url: item.invoice_url,
        payment_method: item.payment_method,
        status: item.status,
        created_at: item.created_at,
      }));

      setBillingHistory(transformedData);
    } catch (error) {
      console.error('Error loading billing history:', error);
      toast({
        title: "Error",
        description: "Failed to load billing history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Billing History
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No billing history available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your billing records will appear here once you make your first purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {billingHistory.map((bill) => (
              <div 
                key={bill.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{bill.description}</h4>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {formatCurrency(bill.amount, bill.currency)}
                      </div>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>{formatDate(bill.created_at)}</span>
                      {bill.payment_method && (
                        <span>• {bill.payment_method}</span>
                      )}
                    </div>
                    
                    {bill.invoice_url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(bill.invoice_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealBillingHistory;
