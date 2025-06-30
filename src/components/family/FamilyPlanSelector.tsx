
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Crown, 
  ArrowRight,
  CheckCircle,
  Calculator
} from 'lucide-react';
import AdaptivePlanBuilder from './AdaptivePlanBuilder';
import { adaptivePricingService } from '@/services/adaptivePricingService';
import { useToast } from '@/hooks/use-toast';

interface FamilyPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const FamilyPlanSelector: React.FC<FamilyPlanSelectorProps> = ({
  isOpen,
  onClose,
  currentPlan = 'individual'
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'overview' | 'builder'>('overview');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGetStarted = () => {
    setStep('builder');
  };

  const handlePlanSelect = async (planId: string, seats: number, billingCycle: 'monthly' | 'yearly') => {
    setIsProcessing(true);
    try {
      const success = await adaptivePricingService.createAdaptiveSubscription(planId, seats, billingCycle);
      if (success) {
        toast({
          title: "Plan Selected",
          description: `Your ${planId} plan with ${seats} seats has been configured. Redirecting to checkout...`,
        });
        // In real implementation, redirect to Stripe checkout
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setStep('overview');
  };

  if (step === 'builder') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-therapy-500" />
                <span>Build Your Perfect Family Plan</span>
              </DialogTitle>
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
            </div>
          </DialogHeader>

          <AdaptivePlanBuilder onPlanSelect={handlePlanSelect} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Crown className="h-6 w-6 text-gold-500" />
            <span>Adaptive Family Plans</span>
          </DialogTitle>
          <p className="text-gray-600">
            Pay only for what you need. Scale up or down anytime.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Current Plan Status */}
          {currentPlan !== 'individual' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <p className="text-sm text-gray-600">{currentPlan}</p>
                  </div>
                  <Badge className="bg-blue-500 text-white">Active</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5 text-therapy-500" />
                  <span>Flexible Seating</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Start with 2 members, scale to 15+</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Add or remove members anytime</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Prorated billing adjustments</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-purple-500" />
                  <span>Smart Pricing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Base price + per-seat pricing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No wasted seats or hidden fees</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Save 17% with yearly billing</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Comparison Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-therapy-600">Family Pro</h4>
                  <p className="text-sm text-gray-600">Perfect for most families</p>
                  <div className="text-2xl font-bold">$39 <span className="text-sm font-normal text-gray-500">base + $15/seat</span></div>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Advanced parental controls</li>
                    <li>• Real-time crisis alerts</li>
                    <li>• 25 sessions per member</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600">Family Premium</h4>
                  <p className="text-sm text-gray-600">Ultimate family support</p>
                  <div className="text-2xl font-bold">$59 <span className="text-sm font-normal text-gray-500">base + $20/seat</span></div>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• 24/7 priority support</li>
                    <li>• Unlimited sessions</li>
                    <li>• Dedicated coordinator</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 px-8"
              disabled={isProcessing}
            >
              Build Your Plan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyPlanSelector;
