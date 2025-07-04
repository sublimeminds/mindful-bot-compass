import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Plus, Minus, Heart, Star, Crown, Calculator } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { safeNavigate } from '@/components/SafeNavigation';

// Context-independent auth check
const checkAuthState = () => {
  try {
    const session = localStorage.getItem('sb-dbwrbjmraodegffupnx-auth-token');
    return !!session;
  } catch {
    return false;
  }
};

interface SafeFamilyPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const SafeFamilyPlanSelector = ({ isOpen, onClose, currentPlan }: SafeFamilyPlanSelectorProps) => {
  const [memberCount, setMemberCount] = useState(4);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'premium'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = {
    pro: {
      name: 'Family Pro',
      basePrice: 29.99,
      pricePerMember: 9.99,
      color: 'from-therapy-500 to-calm-500',
      icon: Star,
      features: [
        'Unlimited AI therapy sessions',
        'Voice conversations in 29 languages',
        'Family dashboard with shared insights',
        'Parental controls and safety features',
        'Crisis alerts and intervention',
        'Progress sharing with permissions'
      ]
    },
    premium: {
      name: 'Family Premium',
      basePrice: 49.99,
      pricePerMember: 14.99,
      color: 'from-therapy-600 to-harmony-600',
      icon: Crown,
      features: [
        'Everything in Family Pro',
        'Advanced emotion detection',
        'Personalized treatment plans',
        'Dedicated family support specialist',
        '24/7 priority crisis intervention',
        'Advanced family analytics & insights'
      ]
    }
  };

  const selectedTierData = tiers[selectedTier];
  const monthlyPrice = selectedTierData.basePrice + (memberCount * selectedTierData.pricePerMember);
  const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount for yearly
  const savings = (monthlyPrice * 12) - yearlyPrice;
  
  const displayPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;
  const priceLabel = billingCycle === 'monthly' ? '/month' : '/year';

  const getTrialInfo = () => {
    if (selectedTier === 'premium' && billingCycle === 'yearly') {
      return '7-day free trial • Cancel anytime';
    }
    return 'No trial • Cancel anytime';
  };

  const handleGetStarted = () => {
    // Save the family plan configuration
    const familyPlanData = {
      type: 'family',
      tier: selectedTier,
      memberCount,
      billingCycle,
      name: `Family ${selectedTierData.name}`,
      price: displayPrice,
      period: priceLabel
    };

    localStorage.setItem('selectedPlan', JSON.stringify(familyPlanData));
    
    const hasAuth = checkAuthState();
    if (!hasAuth) {
      safeNavigate('/onboarding');
    } else {
      safeNavigate('/onboarding');
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-center therapy-text-gradient">
            Build Your Custom Family Plan
          </DialogTitle>
          {currentPlan && (
            <p className="text-center text-gray-600 text-sm">
              Current plan: <span className="font-semibold">{currentPlan}</span>
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:ring-offset-2 ${
                    billingCycle === 'yearly' ? 'bg-therapy-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-gray-500'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-therapy-100 text-therapy-700 border-therapy-200 text-xs">
                    Save 20%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-2 space-y-4">
              {/* Member Count Selector */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Users className="h-4 w-4" />
                    <span>Family Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                      disabled={memberCount <= 2}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold therapy-text-gradient">{memberCount}</div>
                      <div className="text-xs text-gray-500">members</div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMemberCount(Math.min(12, memberCount + 1))}
                      disabled={memberCount >= 12}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base">Choose Your Plan Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(tiers).map(([key, tier]) => {
                    const IconComponent = tier.icon;
                    const isSelected = selectedTier === key;
                    
                    return (
                      <Card 
                        key={key}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'ring-2 ring-therapy-500 shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTier(key as 'pro' | 'premium')}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{tier.name}</div>
                              <div className="text-xs text-gray-500">
                                ${tier.basePrice} + ${tier.pricePerMember}/member
                              </div>
                            </div>
                            {isSelected && (
                              <Badge className="bg-therapy-500 text-white text-xs">Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Features Preview - Compact */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <selectedTierData.icon className="h-4 w-4" />
                    <span>{selectedTierData.name} Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {selectedTierData.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Heart className="h-3 w-3 text-therapy-500 mt-1 flex-shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pricing Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Calculator className="h-4 w-4" />
                    <span>Pricing Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Plan:</span>
                      <span>${selectedTierData.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{memberCount} Members:</span>
                      <span>${(memberCount * selectedTierData.pricePerMember).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Monthly Total:</span>
                      <span>${monthlyPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {billingCycle === 'yearly' && (
                    <>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Yearly Total:</span>
                          <span className="font-bold">${yearlyPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Annual Savings:</span>
                          <span className="font-bold">-${savings.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Final Price Display */}
                  <div className="text-center pt-2 border-t">
                    <div className="text-2xl font-bold therapy-text-gradient">
                      ${displayPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">{priceLabel}</div>
                  </div>

                  {/* Trial Info */}
                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      {getTrialInfo()}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <GradientButton 
                    size="sm" 
                    onClick={handleGetStarted}
                    className="w-full"
                  >
                    Get Started with {selectedTierData.name}
                  </GradientButton>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SafeFamilyPlanSelector;