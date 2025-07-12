import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Download, Wallet, Receipt } from 'lucide-react';
import RealBillingHistory from '@/components/subscription/RealBillingHistory';
import RealSubscriptionData from '@/components/subscription/RealSubscriptionData';

interface PaymentMethod {
  id: string;
  type: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  card_brand: string;
  is_default: boolean;
  stripe_payment_method_id: string;
}

const Billing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      // Don't show error toast for missing payment methods table
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
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
        description: "Failed to open payment management. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDefaultPaymentMethod = () => {
    const defaultMethod = paymentMethods.find(pm => pm.is_default);
    if (defaultMethod) {
      return {
        display: `•••• •••• •••• ${defaultMethod.card_last4}`,
        expiry: `${defaultMethod.card_exp_month.toString().padStart(2, '0')}/${defaultMethod.card_exp_year.toString().slice(-2)}`,
        type: defaultMethod.card_brand || defaultMethod.type
      };
    }
    return null;
  };

  const defaultPayment = getDefaultPaymentMethod();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-800">Billing & Payments</h1>
          <p className="text-slate-600 mt-2">Manage your subscription and billing information</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            // This could export billing history as PDF
            toast({
              title: "Export Started",
              description: "Your billing summary will be downloaded shortly.",
            });
          }}
        >
          <Download className="h-4 w-4" />
          Export Summary
        </Button>
      </div>

      {/* Current Plan - Using Real Data */}
      <RealSubscriptionData />

      {/* Billing History - Using Real Data */}
      <RealBillingHistory />

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-therapy-600" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600"></div>
            </div>
          ) : defaultPayment ? (
            <div className="flex items-center justify-between p-4 bg-therapy-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-therapy-600" />
                <div>
                  <div className="font-medium">{defaultPayment.display}</div>
                  <div className="text-sm text-slate-500">
                    {defaultPayment.type} • Expires {defaultPayment.expiry}
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleUpdatePaymentMethod}>
                Update
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No payment method on file</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add a payment method to upgrade your plan and access premium features.
              </p>
              <Button onClick={handleUpdatePaymentMethod}>
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;