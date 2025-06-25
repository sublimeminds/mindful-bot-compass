
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Cloud,
  Database,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const IntegrationStatus = () => {
  const integrations = [
    {
      id: '1',
      name: 'DigitalOcean API',
      status: 'connected',
      type: 'cloud',
      description: 'Droplets, Load Balancers, and Database management',
      lastSync: '2 minutes ago',
      icon: Cloud
    },
    {
      id: '2',
      name: 'Supabase Database',
      status: 'connected',
      type: 'database',
      description: 'Primary application database and authentication',
      lastSync: '1 minute ago',
      icon: Database
    },
    {
      id: '3',
      name: 'Security Monitoring',
      status: 'connected',
      type: 'security',
      description: 'Real-time threat detection and alerts',
      lastSync: '30 seconds ago',
      icon: Shield
    },
    {
      id: '4',
      name: 'Performance Analytics',
      status: 'connected',
      type: 'analytics',
      description: 'Application performance monitoring and metrics',
      lastSync: '5 minutes ago',
      icon: Zap
    },
    {
      id: '5',
      name: 'CDN Service',
      status: 'warning',
      type: 'network',
      description: 'Content delivery network for static assets',
      lastSync: '1 hour ago',
      icon: Globe
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cloud':
        return 'text-blue-500';
      case 'database':
        return 'text-purple-500';
      case 'security':
        return 'text-red-500';
      case 'analytics':
        return 'text-orange-500';
      case 'network':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const warningCount = integrations.filter(i => i.status === 'warning').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-therapy-900">Integration Status</h2>
        <p className="text-therapy-600 mt-1">Monitor the status of all system integrations</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">Services running normally</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Services with issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <p className="text-xs text-muted-foreground">Services offline</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration List */}
      <Card>
        <CardHeader>
          <CardTitle>System Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-gray-100 ${getTypeColor(integration.type)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {integration.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last sync: {integration.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(integration.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium">127ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Database Query Time</span>
                  <span className="text-sm font-medium">45ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CDN Cache Hit Rate</span>
                  <span className="text-sm font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">System Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Integration Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Integrations</span>
                  <span className="text-sm font-medium">{integrations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Connections</span>
                  <span className="text-sm font-medium">{connectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Data Sync Status</span>
                  <span className="text-sm font-medium text-green-600">Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Health Check</span>
                  <span className="text-sm font-medium">2 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationStatus;
