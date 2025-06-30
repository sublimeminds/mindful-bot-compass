import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock,
  Heart,
  TrendingDown,
  Calendar,
  MessageSquare,
  Phone
} from 'lucide-react';
import { type FamilyAlert } from '@/services/familyService';
import { formatDistanceToNow } from 'date-fns';

interface FamilyAlertsPanelProps {
  alerts: FamilyAlert[];
  onAcknowledge: (alertId: string) => void;
}

const FamilyAlertsPanel: React.FC<FamilyAlertsPanelProps> = ({
  alerts,
  onAcknowledge
}) => {
  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical') {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    
    switch (type) {
      case 'mood_decline':
        return <TrendingDown className="h-5 w-5 text-orange-500" />;
      case 'crisis_risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'concerning_pattern':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'missed_sessions':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const severityStyles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={severityStyles[severity as keyof typeof severityStyles] || severityStyles.medium}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getAlertActions = (alert: FamilyAlert) => {
    const actions = [];

    if (alert.severity === 'critical' || alert.alert_type === 'crisis_risk') {
      actions.push(
        <Button key="emergency" variant="destructive" size="sm">
          <Phone className="h-4 w-4 mr-2" />
          Contact Emergency
        </Button>
      );
    }

    if (alert.alert_type === 'mood_decline' || alert.alert_type === 'concerning_pattern') {
      actions.push(
        <Button key="check-in" variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Schedule Check-in
        </Button>
      );
    }

    if (alert.alert_type === 'missed_sessions') {
      actions.push(
        <Button key="reschedule" variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Reschedule Session
        </Button>
      );
    }

    actions.push(
      <Button 
        key="acknowledge" 
        variant="ghost" 
        size="sm"
        onClick={() => onAcknowledge(alert.id)}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Acknowledge
      </Button>
    );

    return actions;
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600 text-center">
            No active alerts for your family members. Everyone seems to be doing well.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group alerts by severity
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  const otherAlerts = alerts.filter(alert => !['critical', 'high'].includes(alert.severity));

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-600 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Critical Alerts</span>
          </h3>
          
          {criticalAlerts.map((alert) => (
            <Alert key={alert.id} className="border-red-200 bg-red-50">
              <div className="flex items-start space-x-4">
                {getAlertIcon(alert.alert_type, alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-red-900">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  
                  <AlertDescription className="text-red-800 mb-3">
                    <strong>{alert.member_profile?.name}:</strong> {alert.description}
                  </AlertDescription>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                    
                    <div className="flex space-x-2">
                      {getAlertActions(alert)}
                    </div>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* High Priority Alerts */}
      {highAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-600 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>High Priority Alerts</span>
          </h3>
          
          {highAlerts.map((alert) => (
            <Card key={alert.id} className="border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-orange-900">
                    {getAlertIcon(alert.alert_type, alert.severity)}
                    <span>{alert.title}</span>
                  </CardTitle>
                  {getSeverityBadge(alert.severity)}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-3">
                  <strong>{alert.member_profile?.name}:</strong> {alert.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                  </span>
                  
                  <div className="flex space-x-2">
                    {getAlertActions(alert)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Other Alerts */}
      {otherAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Other Notifications</span>
          </h3>
          
          {otherAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-gray-900">
                    {getAlertIcon(alert.alert_type, alert.severity)}
                    <span>{alert.title}</span>
                  </CardTitle>
                  {getSeverityBadge(alert.severity)}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-3">
                  <strong>{alert.member_profile?.name}:</strong> {alert.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                  </span>
                  
                  <div className="flex space-x-2">
                    {getAlertActions(alert)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Emergency Contact Information */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Emergency Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-red-800">
              <p><strong>Crisis Hotline:</strong> 988 (Suicide & Crisis Lifeline)</p>
              <p><strong>Emergency:</strong> 911</p>
              <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              <p><strong>Teen Crisis:</strong> 1-800-366-8288</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyAlertsPanel;
