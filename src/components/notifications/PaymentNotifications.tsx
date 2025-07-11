import React, { useEffect, useState } from 'react';
import { AlertTriangle, CreditCard, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FailedPayment {
  id: string;
  amount: number;
  currency: string;
  failure_reason?: string;
  retry_count: number;
  next_retry_at?: string;
  created_at: string;
}

const PaymentNotifications: React.FC = () => {
  const [failedPayments, setFailedPayments] = useState<FailedPayment[]>([]);
  const [dismissedPayments, setDismissedPayments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchFailedPayments();
  }, []);

  const fetchFailedPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('failed_payments')
        .select('*')
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFailedPayments(data || []);
    } catch (error) {
      console.error('Error fetching failed payments:', error);
    }
  };

  const retryPayment = async (failedPaymentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('stripe-retry-payment', {
        body: { failedPaymentId }
      });

      if (error) throw error;

      toast({
        title: "Payment Retry Initiated",
        description: "We're attempting to process your payment again.",
      });

      // Refresh the list
      fetchFailedPayments();
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast({
        title: "Retry Failed",
        description: "Unable to retry payment. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const dismissNotification = (paymentId: string) => {
    setDismissedPayments(prev => new Set([...prev, paymentId]));
  };

  const visiblePayments = failedPayments.filter(payment => !dismissedPayments.has(payment.id));

  if (visiblePayments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visiblePayments.map((payment) => (
        <Alert key={payment.id} className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-destructive">Payment Failed</div>
              <div className="text-sm text-muted-foreground mt-1">
                ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()} payment failed.
                {payment.failure_reason && (
                  <span className="block">Reason: {payment.failure_reason}</span>
                )}
                {payment.next_retry_at && (
                  <span className="block">
                    Next retry: {new Date(payment.next_retry_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                onClick={() => retryPayment(payment.id)}
                className="bg-primary hover:bg-primary/90"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Retry
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismissNotification(payment.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default PaymentNotifications;