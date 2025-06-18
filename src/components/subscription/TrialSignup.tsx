
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard, Clock, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { ToastService } from '@/services/toastService';
import { TrialService } from '@/services/trialService';
import { supabase } from '@/integrations/supabase/client';

interface TrialSignupProps {
  onClose?: () => void;
}

const TrialSignup = ({ onClose }: TrialSignupProps) => {
  const { user } = useAuth();
  const { plans } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const premiumPlan = plans.find(plan => plan.name === 'Premium');

  const handleStartTrial = async () => {
    if (!user || !premiumPlan) {
      ToastService.genericError('Please sign in to start your free trial');
      return;
    }

    setIsProcessing(true);

    try {
      // First, create a Stripe setup intent for payment method collection
      const { data, error } = await supabase.functions.invoke('create-trial-setup', {
        body: { 
          planId: premiumPlan.id,
          userId: user.id,
          userEmail: user.email
        }
      });

      if (error) throw error;

      if (data.setupUrl) {
        // Open Stripe setup in new tab for payment method collection
        window.open(data.setupUrl, '_blank');
        
        // Start the trial in the background
        const trialResult = await TrialService.startFreeTrial(user.id, premiumPlan.id);
        
        if (trialResult.success) {
          ToastService.trialStarted('Premium', 7);
          onClose?.();
        } else {
          ToastService.subscriptionError(trialResult.error);
        }
      }
    } catch (error) {
      console.error('Trial signup error:', error);
      ToastService.subscriptionError('Failed to start trial. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!premiumPlan) return null;

  return (
    <Card className="max-w-md mx-auto border-harmony-200 shadow-xl">
      <CardHeader className="text-center pb-4 relative">
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-harmony-500 to-harmony-600">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold mb-2">
          Start Your Free Trial
        </CardTitle>
        
        <Badge className="bg-green-100 text-green-800 text-sm font-semibold">
          7 Days Free • Premium Plan
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-harmony-600 mb-2">
            ${(premiumPlan.price_monthly).toFixed(2)}/month
          </div>
          <p className="text-sm text-gray-600">
            after your 7-day free trial
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm">Full access to all Premium features</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm">7 days completely free</span>
          </div>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <span className="text-sm">Payment method required (not charged during trial)</span>
          </div>
          <div className="flex items-center space-x-3">
            <X className="h-5 w-5 text-red-500" />
            <span className="text-sm">Cancel anytime before trial ends</span>
          </div>
        </div>

        <div className="bg-harmony-50 p-4 rounded-lg border border-harmony-200">
          <h4 className="font-semibold text-harmony-800 mb-2">Premium Features Include:</h4>
          <ul className="text-sm text-harmony-700 space-y-1">
            {Object.values(premiumPlan.features).slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-harmony-500 rounded-full"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={handleStartTrial}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-harmony-500 to-harmony-600 hover:from-harmony-600 hover:to-harmony-700 text-white font-semibold py-3 text-lg"
        >
          {isProcessing ? 'Starting Trial...' : 'Start Free Trial'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By starting your trial, you agree to our Terms of Service and Privacy Policy. 
          You can cancel anytime during the trial period without being charged.
        </p>
      </CardContent>
    </Card>
  );
};

export default TrialSignup;
