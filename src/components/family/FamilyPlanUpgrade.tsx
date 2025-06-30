
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Crown, 
  Users, 
  Shield, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Phone,
  CheckCircle,
  Star
} from 'lucide-react';
import { subscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

interface FamilyPlanUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
}

const FamilyPlanUpgrade: React.FC<FamilyPlanUpgradeProps> = ({
  isOpen,
  onClose,
  currentPlan
}) => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const availablePlans = await subscriptionService.getAvailablePlans();
      const familyPlans = availablePlans.filter(plan => 
        plan.name.toLowerCase().includes('family')
      );
      setPlans(familyPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      // In a real implementation, this would integrate with Stripe
      const success = await subscriptionService.changePlan('user-id', planId);
      if (success) {
        toast({
          title: "Plan Upgraded",
          description: "Your family plan has been upgraded successfully!",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPlanFeatures = (planName: string) => {
    const features: { [key: string]: Array<{ icon: any; text: string; highlight?: boolean }> } = {
      'Family Starter': [
        { icon: Users, text: 'Up to 4 family members' },
        { icon: Shield, text: 'Basic child safety features' },
        { icon: Eye, text: 'Limited progress sharing' },
        { icon: AlertTriangle, text: 'Email alerts for concerning behavior' },
        { icon: MessageSquare, text: '10 sessions per member/month' },
        { icon: TrendingUp, text: 'Basic family wellness dashboard' }
      ],
      'Family Pro': [
        { icon: Users, text: 'Up to 6 family members' },
        { icon: Shield, text: 'Advanced child safety & COPPA compliance', highlight: true },
        { icon: Eye, text: 'Full progress sharing with permissions' },
        { icon: AlertTriangle, text: 'Real-time SMS & email alerts', highlight: true },
        { icon: MessageSquare, text: '25 sessions per member/month' },
        { icon: TrendingUp, text: 'Advanced family wellness analytics' },
        { icon: Crown, text: 'Comprehensive parental dashboard', highlight: true },
        { icon: Star, text: 'Shared family wellness goals' }
      ],
      'Family Premium': [
        { icon: Users, text: 'Up to 8 family members' },
        { icon: Shield, text: 'Premium child safety with therapist escalation', highlight: true },
        { icon: Eye, text: 'Full progress sharing with granular permissions' },
        { icon: AlertTriangle, text: 'Immediate alerts with crisis intervention', highlight: true },
        { icon: MessageSquare, text: 'Unlimited sessions for all members', highlight: true },
        { icon: TrendingUp, text: 'Premium family analytics with trends' },
        { icon: Crown, text: 'Complete parental oversight dashboard' },
        { icon: Star, text: 'Advanced shared family wellness goals' },
        { icon: Phone, text: '24/7 priority family support', highlight: true },
        { icon: MessageSquare, text: 'Access to family therapy sessions', highlight: true }
      ]
    };
    
    return features[planName] || [];
  };

  const getPlanColor = (planName: string) => {
    if (planName.includes('Starter')) return 'from-blue-500 to-blue-600';
    if (planName.includes('Pro')) return 'from-purple-500 to-purple-600';
    if (planName.includes('Premium')) return 'from-gold-500 to-gold-600';
    return 'from-gray-500 to-gray-600';
  };

  const isCurrentPlan = (planName: string) => {
    return currentPlan.toLowerCase().includes(planName.toLowerCase().split(' ')[1]);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex items-center justify-center py-12">
            <Crown className="h-8 w-8 animate-pulse text-therapy-500" />
            <span className="ml-2">Loading family plans...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Crown className="h-6 w-6 text-gold-500" />
            <span>Upgrade to Family Plan</span>
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Choose the perfect plan for your family's mental health journey
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => {
            const features = getPlanFeatures(plan.name);
            const isPopular = plan.name.includes('Pro');
            const isCurrent = isCurrentPlan(plan.name);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${isPopular ? 'ring-2 ring-purple-500' : ''} ${
                  selectedPlan === plan.id ? 'ring-2 ring-therapy-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white">Current Plan</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getPlanColor(plan.name)} flex items-center justify-center`}>
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  
                  <div className="text-3xl font-bold text-gray-900">
                    ${plan.priceMonthly}
                    <span className="text-lg text-gray-500 font-normal">/month</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    or ${plan.priceYearly}/year (save ${(plan.priceMonthly * 12) - plan.priceYearly})
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <li 
                          key={index} 
                          className={`flex items-center space-x-2 text-sm ${
                            feature.highlight ? 'text-therapy-700 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <IconComponent className={`h-4 w-4 ${
                            feature.highlight ? 'text-therapy-500' : 'text-gray-400'
                          }`} />
                          <span>{feature.text}</span>
                          {feature.highlight && <Star className="h-3 w-3 text-gold-400" />}
                        </li>
                      );
                    })}
                  </ul>

                  <Button
                    className={`w-full ${
                      isCurrent 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : isPopular 
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                          : 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700'
                    }`}
                    onClick={() => !isCurrent && handleUpgrade(plan.id)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Family Safety Guarantee */}
        <div className="mt-8 p-6 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-therapy-600" />
            <h3 className="text-lg font-semibold text-therapy-900">Family Safety Guarantee</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>HIPAA compliant for all family members</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>COPPA compliant for children under 13</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 crisis intervention when needed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Granular privacy controls</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyPlanUpgrade;
