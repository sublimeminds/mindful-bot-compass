import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Users, 
  Crown, 
  Shield, 
  Heart,
  TrendingUp,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { adaptivePricingService } from '@/services/adaptivePricingService';
import AdaptivePlanBuilder from './AdaptivePlanBuilder';

interface FamilyAccessGateProps {
  children: React.ReactNode;
}

const FamilyAccessGate: React.FC<FamilyAccessGateProps> = ({ children }) => {
  const { isFamily, tier, canAccessFeature } = useSubscriptionAccess();
  const [showUpgrade, setShowUpgrade] = React.useState(false);

  const handlePlanSelect = async (planId: string, seats: number, billingCycle: 'monthly' | 'yearly') => {
    try {
      const success = await adaptivePricingService.createAdaptiveSubscription(planId, seats, billingCycle);
      if (success) {
        setShowUpgrade(false);
        // Refresh the page or trigger a revalidation
        window.location.reload();
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
    }
  };

  if (canAccessFeature('family-dashboard')) {
    return <>{children}</>;
  }

  if (showUpgrade) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
              Upgrade to Family Plan
            </h1>
            <p className="text-muted-foreground mt-1">
              Choose the perfect family plan for your needs
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowUpgrade(false)}>
            Back
          </Button>
        </div>
        
        <AdaptivePlanBuilder onPlanSelect={handlePlanSelect} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-therapy-100 to-harmony-100 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-therapy-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
            Family Features
          </h1>
          <p className="text-muted-foreground mt-2">
            Unlock comprehensive family mental health management
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-therapy-100 text-therapy-700 border-therapy-200">
            Current Plan: {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Crown className="h-3 w-3 mr-1" />
            Family Plan Required
          </Badge>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-therapy-200 bg-gradient-to-br from-therapy-25 to-therapy-50">
          <CardHeader>
            <CardTitle className="flex items-center text-therapy-700">
              <Users className="h-5 w-5 mr-2" />
              Family Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-therapy-600 mb-4">
              Monitor your family's mental health progress in one central location.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-therapy-600">
                <Shield className="h-4 w-4 mr-2" />
                Member progress tracking
              </li>
              <li className="flex items-center text-therapy-600">
                <Heart className="h-4 w-4 mr-2" />
                Wellness score overview
              </li>
              <li className="flex items-center text-therapy-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                Family analytics
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-harmony-200 bg-gradient-to-br from-harmony-25 to-harmony-50">
          <CardHeader>
            <CardTitle className="flex items-center text-harmony-700">
              <Bell className="h-5 w-5 mr-2" />
              Smart Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-harmony-600 mb-4">
              Receive intelligent notifications about family member wellbeing.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-harmony-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Crisis intervention alerts
              </li>
              <li className="flex items-center text-harmony-600">
                <Shield className="h-4 w-4 mr-2" />
                COPPA-compliant monitoring
              </li>
              <li className="flex items-center text-harmony-600">
                <Bell className="h-4 w-4 mr-2" />
                Real-time notifications
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-flow-200 bg-gradient-to-br from-flow-25 to-flow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-flow-700">
              <Shield className="h-5 w-5 mr-2" />
              Child Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-flow-600 mb-4">
              Advanced child protection and safety features for peace of mind.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-flow-600">
                <Users className="h-4 w-4 mr-2" />
                Age-appropriate content
              </li>
              <li className="flex items-center text-flow-600">
                <Lock className="h-4 w-4 mr-2" />
                Parental controls
              </li>
              <li className="flex items-center text-flow-600">
                <Heart className="h-4 w-4 mr-2" />
                Therapist escalation
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA */}
      <Card className="border-2 border-therapy-200 bg-gradient-to-br from-therapy-50 to-harmony-50">
        <CardContent className="pt-6 text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-therapy-800 mb-2">
              Ready to protect your family?
            </h3>
            <p className="text-therapy-600 text-lg">
              Choose a family plan that grows with your needs
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setShowUpgrade(true)}
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
            >
              <Users className="h-5 w-5 mr-2" />
              Choose Family Plan
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-therapy-200 text-therapy-700 hover:bg-therapy-50"
            >
              <Heart className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyAccessGate;