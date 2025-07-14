import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice, convertPrice } = useEnhancedCurrency();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get selected plan from localStorage
    const stored = localStorage.getItem('selectedPlan');
    if (stored) {
      setSelectedPlan(JSON.parse(stored));
    } else {
      // No plan selected, redirect to pricing
      navigate('/pricing');
    }

    // Redirect if not authenticated
    if (!user) {
      navigate('/auth?redirect=billing');
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated.",
      });

      // Clear selected plan and navigate to onboarding
      localStorage.removeItem('selectedPlan');
      navigate('/onboarding');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-therapy-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const planPrice = selectedPlan.price || 0;
  const formattedPrice = formatPrice(convertPrice(planPrice));

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/pricing')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-slate-600">
            You're just one step away from starting your wellness journey
          </p>
        </div>

        <div className="grid gap-6">
          {/* Plan Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border border-therapy-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Plan Summary</span>
                <Badge className="bg-therapy-100 text-therapy-700">
                  {selectedPlan.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">
                  {selectedPlan.name} Plan - Monthly
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {formattedPrice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-white/80 backdrop-blur-sm border border-therapy-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-sm text-slate-600 mb-2">Demo Mode</p>
                  <p className="text-slate-800">
                    This is a demo. In production, Stripe payment form would appear here.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="bg-white/80 backdrop-blur-sm border border-therapy-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-slate-700">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-slate-700">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-slate-700">7-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-slate-700">Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Purchase Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white py-4 text-lg font-semibold"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Complete Purchase - {formattedPrice}
              </>
            )}
          </Button>

          <p className="text-center text-sm text-slate-600">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;