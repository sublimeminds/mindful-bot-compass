
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';

interface IntegrationStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  syncSuccess: number;
  responseTime: number;
  uptime: number;
  errorCount: number;
}

const IntegrationStatusDashboard = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      status: 'connected',
      lastSync: '2 minutes ago',
      syncSuccess: 98.5,
      responseTime: 245,
      uptime: 99.8,
      errorCount: 2
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      status: 'connected',
      lastSync: '5 minutes ago',
      syncSuccess: 99.9,
      responseTime: 120,
      uptime: 99.9,
      errorCount: 0
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      status: 'syncing',
      lastSync: '1 minute ago',
      syncSuccess: 97.2,
      responseTime: 890,
      uptime: 98.5,
      errorCount: 5
    },
    {
      id: 'ehr-system',
      name: 'EHR Integration',
      status: 'error',
      lastSync: '30 minutes ago',
      syncSuccess: 85.3,
      responseTime: 1200,
      uptime: 95.2,
      errorCount: 15
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <WifiOff className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const overallHealth = integrations.reduce((acc, int) => acc + int.uptime, 0) / integrations.length;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-therapy-600" />
            <span>Integration Health Overview</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshStatus} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(overallHealth)}%</div>
              <div className="text-sm text-muted-foreground">Overall Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <div className="text-sm text-muted-foreground">Active Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {integrations.filter(i => i.status === 'syncing').length}
              </div>
              <div className="text-sm text-muted-foreground">Syncing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(integration.status)}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last sync</div>
                  <div className="text-sm font-medium">{integration.lastSync}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium">{integration.syncSuccess}%</span>
                  </div>
                  <Progress value={integration.syncSuccess} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">{integration.uptime}%</span>
                  </div>
                  <Progress value={integration.uptime} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Response: {integration.responseTime}ms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span>Errors: {integration.errorCount}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  View Logs
                </Button>
                <Button size="sm" variant="outline">
                  Test Connection
                </Button>
                <Button size="sm" variant="outline">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationStatusDashboard;
