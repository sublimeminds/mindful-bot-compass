
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';

const SystemAlertsNotification = () => {
  const { alerts, overallStatus, resolveAlert } = useSystemHealth();
  
  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning');

  if (activeAlerts.length === 0) {
    return null;
  }

  const getStatusColor = () => {
    if (criticalAlerts.length > 0) return 'bg-red-500';
    if (warningAlerts.length > 0) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getStatusIcon = () => {
    if (criticalAlerts.length > 0) return <XCircle className="h-4 w-4" />;
    if (warningAlerts.length > 0) return <AlertTriangle className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getStatusColor()} text-white`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-medium text-white">
                {criticalAlerts.length > 0 ? 'Critical System Alerts' : 'System Alerts'}
              </h3>
              <p className="text-sm text-gray-400">
                {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''} 
                {criticalAlerts.length > 0 && ` (${criticalAlerts.length} critical)`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={overallStatus === 'critical' ? 'destructive' : 'default'}>
              {overallStatus}
            </Badge>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </div>
        
        {/* Quick Actions for Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-red-400 mb-2">Critical Issues Requiring Attention:</h4>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between bg-red-900/20 p-3 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                    <p className="text-xs text-gray-300">{alert.message}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolveAlert(alert.id)}
                    className="ml-3"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlertsNotification;
