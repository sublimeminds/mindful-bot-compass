
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Plus, Minus, Heart, Star, Crown, Calculator } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FamilyPlanSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const FamilyPlanSelector = ({ isOpen, onClose }: FamilyPlanSelectorProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState(4);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'premium'>('pro');

  const tiers = {
    pro: {
      name: 'Family Pro',
      basePrice: 29.99,
      pricePerMember: 9.99,
      color: 'from-therapy-500 to-calm-500',
      icon: Star,
      features: [
        'Unlimited AI therapy sessions for all members',
        'Voice conversations in 29 languages',
        'Family dashboard with shared insights',
        'Parental controls and safety features',
        'Crisis alerts and intervention',
        'Progress sharing with permissions',
        'Mobile app for all members'
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
        'Advanced emotion detection for all',
        'Personalized treatment plans per member',
        'Dedicated family support specialist',
        '24/7 priority crisis intervention',
        'Advanced family analytics & insights',
        'Custom AI therapist training',
        'Integration with health apps'
      ]
    }
  };

  const selectedTierData = tiers[selectedTier];
  const monthlyPrice = selectedTierData.basePrice + (memberCount * selectedTierData.pricePerMember);
  const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount for yearly
  const savings = (monthlyPrice * 12) - yearlyPrice;

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    // Close modal and redirect to checkout with custom family plan
    onClose();
    navigate(`/pricing?family=true&tier=${selectedTier}&members=${memberCount}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center therapy-text-gradient">
            Build Your Custom Family Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Count Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>How many family members?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                  disabled={memberCount <= 2}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <div className="text-3xl font-bold therapy-text-gradient">{memberCount}</div>
                  <div className="text-sm text-gray-500">family members</div>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMemberCount(Math.min(12, memberCount + 1))}
                  disabled={memberCount >= 12}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center mt-4 text-sm text-gray-600">
                Includes parents, children, teens, and extended family
              </div>
            </CardContent>
          </Card>

          {/* Tier Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Your Plan Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tier.name}</CardTitle>
                            <div className="text-sm text-gray-500">
                              ${tier.basePrice} base + ${tier.pricePerMember}/member
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge className="bg-therapy-500 text-white">Selected</Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <selectedTierData.icon className="h-5 w-5" />
                <span>{selectedTierData.name} Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTierData.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Heart className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Your Custom Plan Pricing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Monthly Total:</span>
                <span className="font-bold">${monthlyPrice.toFixed(2)}/month</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Yearly Total:</span>
                  <span className="font-bold">${yearlyPrice.toFixed(2)}/year</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Annual Savings:</span>
                  <span className="font-bold">-${savings.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center pt-4">
                <GradientButton 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="w-full"
                >
                  Get Started with {selectedTierData.name}
                </GradientButton>
                <div className="text-sm text-gray-500 mt-2">
                  7-day free trial • Cancel anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyPlanSelector;
