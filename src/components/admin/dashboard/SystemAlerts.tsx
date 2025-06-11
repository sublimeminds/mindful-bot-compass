
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, X, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  component: string;
}

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching system alerts
    const fetchAlerts = () => {
      // In a real implementation, this would fetch from a monitoring service
      const mockAlerts: SystemAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'High Database Response Time',
          message: 'Database response time has exceeded 500ms threshold for the past 5 minutes',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          resolved: false,
          component: 'database'
        },
        {
          id: '2',
          type: 'info',
          title: 'System Backup Completed',
          message: 'Daily system backup completed successfully',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          resolved: true,
          component: 'backup'
        },
        {
          id: '3',
          type: 'error',
          title: 'API Rate Limit Exceeded',
          message: 'External API rate limits have been reached for the OpenAI service',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          resolved: false,
          component: 'api'
        }
      ];

      setAlerts(mockAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical':
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'default';
      default:
        return 'outline';
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            Loading alerts...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            System Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {activeAlerts.length}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">All Systems Operational</p>
            <p className="text-sm">No active alerts or issues detected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Active Alerts</h4>
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/50 border-l-4 border-l-red-500">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">{alert.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                              {alert.type}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {alert.component}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Recently Resolved</h4>
                <div className="space-y-3">
                  {resolvedAlerts.slice(0, 2).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30 border-l-4 border-l-green-500">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-300">{alert.title}</p>
                          <Badge variant="outline" className="text-xs text-green-400">
                            resolved
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
