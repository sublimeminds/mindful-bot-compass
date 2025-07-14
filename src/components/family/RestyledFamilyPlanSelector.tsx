import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Minus, Heart, Star, Crown, Calculator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';

interface RestyledFamilyPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const RestyledFamilyPlanSelector = ({ isOpen, onClose, currentPlan }: RestyledFamilyPlanSelectorProps) => {
  const [memberCount, setMemberCount] = useState(4);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'premium'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const { formatPrice } = useEnhancedCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const tiers = {
    pro: {
      name: 'Family Premium',
      basePrice: 28.90, // Base includes 2 members
      pricePerMember: 12.90, // Additional members beyond 2
      color: 'from-therapy-500 to-calm-500',
      icon: Star,
      baseMemberCount: 2,
      features: [
        'Claude 4 Opus AI model for all members',
        'Unlimited AI messages for all members',
        '3 therapy plans per member',
        'Unlimited AI therapy sessions',
        'Family dashboard with shared insights',
        'Parental controls and safety features',
        'Crisis alerts and intervention',
        'Progress sharing with permissions'
      ]
    },
    premium: {
      name: 'Family Professional',
      basePrice: 46.90, // Base includes 2 members
      pricePerMember: 19.90, // Additional members beyond 2
      color: 'from-therapy-600 to-harmony-600',
      icon: Crown,
      baseMemberCount: 2,
      features: [
        'Claude 4 Sonnet AI model for all members',
        'Unlimited AI messages for all members',
        '10 therapy plans per member',
        'Unlimited AI therapy sessions',
        'Advanced emotion detection',
        'Personalized treatment plans',
        'Dedicated family support specialist',
        '24/7 priority crisis intervention',
        'Advanced family analytics & insights'
      ]
    }
  };

  const selectedTierData = tiers[selectedTier];
  // Calculate additional members beyond the base 2 included
  const additionalMembers = Math.max(0, memberCount - selectedTierData.baseMemberCount);
  const monthlyPrice = selectedTierData.basePrice + (additionalMembers * selectedTierData.pricePerMember);
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
    
    if (!user) {
      navigate('/get-started');
    } else {
      navigate('/onboarding');
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        <div className="p-6">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-center therapy-text-gradient">
              Build Your Custom Family Plan
            </DialogTitle>
            {currentPlan && (
              <p className="text-center text-muted-foreground">
                Current plan: <span className="font-semibold">{currentPlan}</span>
              </p>
            )}
          </DialogHeader>

          <div className="space-y-6">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:ring-offset-2 ${
                    billingCycle === 'yearly' ? 'bg-therapy-600' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Save 20%
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Member Count Selector */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Users className="h-5 w-5" />
                      <span>Family Members</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                        disabled={memberCount <= 2}
                        className="h-12 w-12"
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      
                      <div className="text-center px-8">
                        <div className="text-4xl font-bold therapy-text-gradient">{memberCount}</div>
                        <div className="text-sm text-muted-foreground mt-1">members</div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setMemberCount(Math.min(12, memberCount + 1))}
                        disabled={memberCount >= 12}
                        className="h-12 w-12"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Perfect for families of 2-12 members
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tier Selection */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Choose Your Plan Level</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(tiers).map(([key, tier]) => {
                      const IconComponent = tier.icon;
                      const isSelected = selectedTier === key;
                      const additionalTierMembers = Math.max(0, memberCount - tier.baseMemberCount);
                      const tierPrice = tier.basePrice + (additionalTierMembers * tier.pricePerMember);
                      const yearlyTierPrice = tierPrice * 12 * 0.8;
                      const displayTierPrice = billingCycle === 'monthly' ? tierPrice : yearlyTierPrice;
                      
                      return (
                        <Card 
                          key={key}
                          className={`cursor-pointer transition-all duration-200 relative ${
                            isSelected 
                              ? 'ring-2 ring-therapy-500 shadow-lg border-therapy-200' 
                              : 'hover:shadow-md hover:border-therapy-200'
                          }`}
                          onClick={() => setSelectedTier(key as 'pro' | 'premium')}
                        >
                          {key === 'premium' && (
                            <div className="absolute -top-3 left-6">
                              <Badge className="bg-gradient-to-r from-therapy-500 to-therapy-600 text-white">
                                <Crown className="h-3 w-3 mr-1" />
                                Most Popular
                              </Badge>
                            </div>
                          )}
                          
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                                  <IconComponent className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <div className="font-semibold text-lg">{tier.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ${tier.basePrice} for {tier.baseMemberCount} members + ${tier.pricePerMember}/additional
                                  </div>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-therapy-500 bg-therapy-500' : 'border-muted-foreground'
                              }`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>

                            <div className="text-center mb-4">
                              <div className="text-2xl font-bold therapy-text-gradient">
                                {formatPrice(displayTierPrice)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                /{billingCycle === 'monthly' ? 'month' : 'year'} for {memberCount} members
                              </div>
                            </div>

                            <div className="space-y-2">
                              {tier.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <Heart className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                              {tier.features.length > 3 && (
                                <div className="text-xs text-muted-foreground pl-6">
                                  +{tier.features.length - 3} more features
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Complete Features */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <selectedTierData.icon className="h-5 w-5" />
                      <span>Complete {selectedTierData.name} Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTierData.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Heart className="h-4 w-4 text-therapy-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Pricing Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <Card className="bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Calculator className="h-5 w-5" />
                        <span>Pricing Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Price Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Base ({selectedTierData.baseMemberCount} members):</span>
                          <span className="font-medium">{formatPrice(selectedTierData.basePrice)}</span>
                        </div>
                        {additionalMembers > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>{additionalMembers} Additional:</span>
                            <span className="font-medium">{formatPrice(additionalMembers * selectedTierData.pricePerMember)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Monthly Total:</span>
                            <span>{formatPrice(monthlyPrice)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Yearly Savings */}
                      {billingCycle === 'yearly' && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="text-center text-green-800">
                            <div className="font-semibold">Yearly Savings</div>
                            <div className="text-2xl font-bold">{formatPrice(savings)}</div>
                            <div className="text-sm">Save 20% with yearly billing</div>
                          </div>
                        </div>
                      )}

                      {/* Final Price */}
                      <div className="text-center">
                        <div className="text-3xl font-bold therapy-text-gradient">
                          {formatPrice(displayPrice)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {priceLabel} for {memberCount} members
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {getTrialInfo()}
                        </div>
                      </div>

                      {/* Get Started Button */}
                      <Button
                        onClick={handleGetStarted}
                        className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold py-3"
                      >
                        Get Started with {selectedTierData.name}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestyledFamilyPlanSelector;