import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Plus, Minus, Heart, Star, Crown, Calculator } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import CurrencySelector from '@/components/ui/CurrencySelector';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';

interface FamilyPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const FamilyPlanSelector = ({ isOpen, onClose, currentPlan }: FamilyPlanSelectorProps) => {
  // CRITICAL: Don't call ANY hooks before this check - fixes React initialization errors
  if (!isOpen) {
    return null;
  }

  // Safe hook initialization only when dialog is open
  const [isReactReady, setIsReactReady] = useState(false);
  const [memberCount, setMemberCount] = useState(4);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'premium'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Currency support
  let currency: any = null;
  let formatPrice: any = null;
  
  try {
    const enhancedCurrency = useEnhancedCurrency();
    currency = enhancedCurrency?.currency || { code: 'USD', symbol: '$' };
    formatPrice = enhancedCurrency?.formatPrice || ((price: number) => `$${price.toFixed(2)}`);
  } catch (error) {
    console.warn('useEnhancedCurrency failed in FamilyPlanSelector:', error);
    currency = { code: 'USD', symbol: '$' };
    formatPrice = (price: number) => `$${price.toFixed(2)}`;
  }
  
  // Use hooks safely with try-catch
  let user: any = null;
  let navigate: any = null;
  
  try {
    const auth = useAuth();
    user = auth?.user || null;
  } catch (error) {
    console.warn('useAuth failed in FamilyPlanSelector:', error);
  }
  
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn('useNavigate failed in FamilyPlanSelector:', error);
    navigate = () => console.warn('Navigation unavailable');
  }

  // Ensure React is fully initialized before rendering Dialog
  useEffect(() => {
    // Check if React hooks are available
    if (typeof React !== 'undefined' && React && 
        typeof React.useRef === 'function' && 
        typeof React.useState === 'function') {
      setIsReactReady(true);
    }
  }, []);

  const tiers = {
    pro: {
      name: 'Family Premium',
      basePrice: 29.99, // Base includes 2 members
      pricePerMember: 12.99, // Additional members beyond 2
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
      basePrice: 49.90, // Base includes 2 members
      pricePerMember: 24.99, // Additional members beyond 2
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

  // Don't render Dialog until React is ready
  if (!isReactReady || !isOpen) {
    return null;
  }

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
              {/* Billing Cycle & Currency Row */}
              <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                {/* Billing Cycle Toggle */}
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

                {/* Currency Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Currency:</span>
                  <CurrencySelector
                    value={currency?.code || 'USD'}
                    onChange={(newCurrency) => {
                      // Currency change would be handled by useEnhancedCurrency
                      try {
                        const enhancedCurrency = useEnhancedCurrency();
                        enhancedCurrency?.changeCurrency?.(newCurrency);
                      } catch (error) {
                        console.warn('Currency change failed:', error);
                      }
                    }}
                    className="w-32"
                  />
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
                                  {formatPrice(displayTierPrice, 'USD')}
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

                  {/* Complete Features Comparison */}
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
                            <span className="font-medium">{formatPrice(selectedTierData.basePrice, 'USD')}</span>
                          </div>
                          {additionalMembers > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>{additionalMembers} Additional:</span>
                              <span className="font-medium">{formatPrice(additionalMembers * selectedTierData.pricePerMember, 'USD')}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Monthly Total:</span>
                            <span>{formatPrice(monthlyPrice, 'USD')}</span>
                          </div>
                        </div>

                        {billingCycle === 'yearly' && (
                          <>
                            <Separator />
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>Yearly Total:</span>
                                <span className="font-bold text-lg">{formatPrice(yearlyPrice, 'USD')}</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span className="font-medium">Annual Savings:</span>
                                <span className="font-bold">-{formatPrice(savings, 'USD')}</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Final Price Display */}
                        <div className="text-center py-4 border-t border-therapy-200">
                          <div className="text-2xl font-bold therapy-text-gradient">
                            {formatPrice(displayPrice, 'USD')}
                          </div>
                          <div className="text-base text-muted-foreground">{priceLabel}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatPrice(displayPrice / memberCount, 'USD')} per member
                          </div>
                        </div>

                        {/* Trial Info */}
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">
                            {getTrialInfo()}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <GradientButton 
                          size="lg" 
                          onClick={handleGetStarted}
                          className="w-full text-base"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Start {selectedTierData.name}
                        </GradientButton>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          30-day money-back guarantee • Cancel anytime
                        </p>
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

export default FamilyPlanSelector;
