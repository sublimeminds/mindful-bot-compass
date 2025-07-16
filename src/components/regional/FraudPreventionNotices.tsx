import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

interface FraudPreventionNoticesProps {
  trustLevel: string;
  confidenceScore: number;
  availableDiscount: number;
  alerts: Array<{
    id: string;
    alert_type: string;
    severity: string;
    description: string;
    created_at: string;
  }>;
  onDismissAlert: (alertId: string) => void;
}

const FraudPreventionNotices: React.FC<FraudPreventionNoticesProps> = ({
  trustLevel,
  confidenceScore,
  availableDiscount,
  alerts,
  onDismissAlert
}) => {
  const getTrustIcon = () => {
    switch (trustLevel) {
      case 'trusted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'building':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrustMessage = () => {
    switch (trustLevel) {
      case 'trusted':
        return {
          title: 'Verified Location',
          message: `You're getting the full regional discount of ${availableDiscount}%! Your location has been verified through multiple methods.`,
          variant: 'default' as const
        };
      case 'building':
        return {
          title: 'Building Trust',
          message: `You're currently getting ${availableDiscount}% discount. Complete more activities to unlock the full regional pricing.`,
          variant: 'default' as const
        };
      case 'suspicious':
        return {
          title: 'Location Verification Needed',
          message: 'We detected some inconsistencies with your location. Please contact support if you believe this is an error.',
          variant: 'destructive' as const
        };
      default:
        return {
          title: 'Welcome! Getting Started',
          message: `You're currently getting ${availableDiscount}% discount. Your discount will increase as we verify your location through normal usage.`,
          variant: 'default' as const
        };
    }
  };

  const trustMessage = getTrustMessage();

  return (
    <div className="space-y-4">
      {/* Trust Level Notice */}
      <Alert variant={trustMessage.variant}>
        <div className="flex items-start space-x-3">
          {getTrustIcon()}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{trustMessage.title}</h4>
              <Badge variant="outline">
                {Math.round(confidenceScore * 100)}% confidence
              </Badge>
            </div>
            <AlertDescription className="mt-1">
              {trustMessage.message}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Progressive Discount Explanation */}
      {trustLevel !== 'trusted' && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">How to unlock more savings:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Continue using the platform normally</li>
                <li>• Complete subscription and payment setup</li>
                <li>• Use consistent devices and locations</li>
                <li>• Allow time for verification (usually 1-2 weeks)</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Active Alerts */}
      {alerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <div className="flex items-start justify-between">
            <div>
              <AlertDescription className="font-medium">
                Location Verification Alert
              </AlertDescription>
              <AlertDescription className="mt-1">
                {alert.description}
              </AlertDescription>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(alert.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismissAlert(alert.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}

      {/* Transparency Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Why we use progressive pricing:</p>
            <p className="text-sm">
              To offer fair regional pricing while preventing abuse, we gradually increase discounts 
              as we verify your location through normal platform usage. This ensures everyone gets 
              appropriate pricing for their region while maintaining fairness for all users.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FraudPreventionNotices;