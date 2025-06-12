
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Crown, Star, Zap } from 'lucide-react';
import StripeCheckout from './StripeCheckout';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: 'Basic' | 'Premium';
  planPrice: number;
}

const PlanUpgradeModal = ({ isOpen, onClose, planName, planPrice }: PlanUpgradeModalProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);

  const getPlanIcon = () => {
    switch (planName) {
      case 'Basic': return <Star className="h-6 w-6" />;
      case 'Premium': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getPlanFeatures = () => {
    if (planName === 'Basic') {
      return [
        '15 AI therapy sessions per month',
        'Advanced mood tracking with insights',
        'Unlimited goals with basic templates',
        'Email support',
        'Weekly progress reports',
        'Basic crisis detection'
      ];
    }
    
    return [
      'Unlimited AI therapy sessions',
      'Advanced therapeutic techniques (CBT, DBT, mindfulness)',
      'Personalized treatment plans',
      'Priority AI responses',
      'Advanced analytics and insights',
      'Crisis intervention protocols',
      'Export session transcripts',
      'Priority support'
    ];
  };

  const calculatePrice = () => {
    if (billingCycle === 'yearly') {
      return planPrice * 12 * 0.8; // 20% discount for yearly
    }
    return planPrice;
  };

  const calculateSavings = () => {
    if (billingCycle === 'yearly') {
      return planPrice * 12 * 0.2;
    }
    return 0;
  };

  if (showCheckout) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <StripeCheckout
            planName={planName}
            planPrice={calculatePrice()}
            billingCycle={billingCycle}
            onSuccess={() => {
              setShowCheckout(false);
              onClose();
            }}
            onCancel={() => setShowCheckout(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              planName === 'Basic' ? 'bg-blue-100 text-blue-600' : 'bg-therapy-100 text-therapy-600'
            }`}>
              {getPlanIcon()}
            </div>
            <span>Upgrade to {planName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                Save 20%
              </Badge>
            )}
          </div>

          {/* Pricing */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">
              ${calculatePrice().toFixed(2)}
              <span className="text-lg font-normal text-muted-foreground">
                /{billingCycle === 'yearly' ? 'year' : 'month'}
              </span>
            </div>
            {billingCycle === 'yearly' && (
              <div className="text-sm text-green-600 font-medium">
                Save ${calculateSavings().toFixed(2)} per year
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-medium">What's included:</h4>
            <ul className="space-y-2">
              {getPlanFeatures().map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-therapy-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => setShowCheckout(true)}
              className={`flex-1 ${
                planName === 'Premium' 
                  ? 'bg-therapy-500 hover:bg-therapy-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeModal;
