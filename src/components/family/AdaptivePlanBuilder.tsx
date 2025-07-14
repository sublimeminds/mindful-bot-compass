
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  Shield, 
  Clock, 
  Phone, 
  CheckCircle, 
  Star,
  TrendingUp,
  Calculator,
  X
} from 'lucide-react';
import { adaptivePricingService, type AdaptivePlan, type PricingCalculation } from '@/services/adaptivePricingService';
import { useToast } from '@/hooks/use-toast';

interface AdaptivePlanBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (planId: string, seats: number, billingCycle: 'monthly' | 'yearly') => void;
}

const AdaptivePlanBuilder: React.FC<AdaptivePlanBuilderProps> = ({ isOpen, onClose, onPlanSelect }) => {
  const { toast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState(3);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('family-pro');
  const [calculations, setCalculations] = useState<PricingCalculation[]>([]);
  
  const plans = adaptivePricingService.getAdaptivePlans();

  useEffect(() => {
    const newCalculations = plans.map(plan => 
      adaptivePricingService.calculatePricing(plan, selectedSeats)
    );
    setCalculations(newCalculations);
  }, [selectedSeats, plans]);

  const handlePlanSelect = async (planId: string) => {
    try {
      await onPlanSelect(planId, selectedSeats, billingCycle);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRecommendedBadge = (planTier: 'pro' | 'premium') => {
    const recommendation = adaptivePricingService.getRecommendedPlan(selectedSeats, {
      hasChildren: selectedSeats > 2,
      needsCrisisSupport: true,
      wantsUnlimitedSessions: false,
      needs24x7Support: false
    });
    
    return recommendation === planTier ? (
      <Badge className="bg-green-500 text-white mb-2">
        <Star className="h-3 w-3 mr-1" />
        Recommended
      </Badge>
    ) : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-harmony-600 mr-3" />
              <DialogTitle className="text-3xl font-bold text-harmony-700">Family Plan Builder</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-lg text-harmony-600">
            Customize your family's mental health support plan. Pricing automatically adjusts based on your family size.
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
      {/* Family Size Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Family Size</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Number of family members</span>
            <Badge variant="outline" className="text-lg font-bold px-3 py-1">
              {selectedSeats}
            </Badge>
          </div>
          
          <Slider
            value={[selectedSeats]}
            onValueChange={(value) => setSelectedSeats(value[0])}
            min={2}
            max={15}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>2 members</span>
            <span>15 members</span>
          </div>
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Billing Cycle</p>
              <p className="text-xs text-gray-500">
                {billingCycle === 'yearly' ? 'Save 2 months with yearly billing' : 'Pay monthly'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-gray-500'}`}>
                Yearly
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculations.map((calc) => (
          <Card 
            key={calc.plan.id}
            className={`relative ${selectedPlan === calc.plan.id ? 'ring-2 ring-therapy-500' : ''}`}
          >
            <CardHeader>
              {getRecommendedBadge(calc.plan.tier)}
              
              <CardTitle className="text-xl">{calc.plan.name}</CardTitle>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    ${billingCycle === 'yearly' ? calc.yearlyPrice : calc.monthlyPrice}
                  </span>
                  <span className="text-gray-500">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600">
                    Save ${calc.savingsAmount} ({calc.savingsPercent}% off)
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  ${calc.plan.basePrice} base + ${calc.plan.pricePerSeat} × {calc.seats - 1} additional members
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {calc.plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  calc.plan.tier === 'premium' 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700'
                }`}
                onClick={() => handlePlanSelect(calc.plan.id)}
                onMouseEnter={() => setSelectedPlan(calc.plan.id)}
              >
                Select {calc.plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Pricing Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calculations.map((calc) => (
            <div key={calc.plan.id} className="mb-4 last:mb-0">
              <h4 className="font-medium mb-2">{calc.plan.name}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Base price:</span>
                  <span>${calc.plan.basePrice}/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional members ({calc.seats - 1}):</span>
                  <span>${calc.plan.pricePerSeat} × {calc.seats - 1} = ${calc.plan.pricePerSeat * (calc.seats - 1)}/month</span>
                </div>
                <div className="flex justify-between font-medium pt-1 border-t">
                  <span>Total monthly:</span>
                  <span>${calc.monthlyPrice}/month</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total yearly:</span>
                  <span>${calc.yearlyPrice}/year</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdaptivePlanBuilder;
