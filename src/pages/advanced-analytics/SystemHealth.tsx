import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';

interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  lastCheck: string;
  responseTime: number;
  details: string;
}

interface ResourceUsage {
  name: string;
  current: number;
  limit: number;
  unit: string;
  trend: number;
  icon: any;
}

const SystemHealth = () => {
  const [healthChecks] = useState<HealthCheck[]>([
    {
      id: '1',
      name: 'API Gateway',
      status: 'healthy',
      uptime: 99.97,
      lastCheck: new Date().toISOString(),
      responseTime: 156,
      details: 'All endpoints responding normally'
    },
    {
      id: '2',
      name: 'Authentication Service',
      status: 'healthy',
      uptime: 99.95,
      lastCheck: new Date().toISOString(),
      responseTime: 89,
      details: 'Login and token validation operational'
    },
    {
      id: '3',
      name: 'Database Primary',
      status: 'warning',
      uptime: 99.89,
      lastCheck: new Date().toISOString(),
      responseTime: 234,
      details: 'High connection count detected'
    },
    {
      id: '4',
      name: 'Database Replica',
      status: 'healthy',
      uptime: 99.92,
      lastCheck: new Date().toISOString(),
      responseTime: 178,
      details: 'Read queries performing well'
    },
    {
      id: '5',
      name: 'File Storage',
      status: 'healthy',
      uptime: 99.98,
      lastCheck: new Date().toISOString(),
      responseTime: 298,
      details: 'Upload and download services active'
    },
    {
      id: '6',
      name: 'WebSocket Server',
      status: 'critical',
      uptime: 98.45,
      lastCheck: new Date(Date.now() - 120000).toISOString(),
      responseTime: 0,
      details: 'Connection timeouts detected'
    },
    {
      id: '7',
      name: 'Email Service',
      status: 'healthy',
      uptime: 99.94,
      lastCheck: new Date().toISOString(),
      responseTime: 456,
      details: 'Notification delivery operational'
    },
    {
      id: '8',
      name: 'CDN',
      status: 'healthy',
      uptime: 99.99,
      lastCheck: new Date().toISOString(),
      responseTime: 67,
      details: 'Global edge locations responding'
    }
  ]);

  const [resourceUsage] = useState<ResourceUsage[]>([
    {
      name: 'CPU Usage',
      current: 45,
      limit: 100,
      unit: '%',
      trend: -3,
      icon: Cpu
    },
    {
      name: 'Memory Usage',
      current: 6.8,
      limit: 16,
      unit: 'GB',
      trend: 8,
      icon: MemoryStick
    },
    {
      name: 'Disk Usage',
      current: 234,
      limit: 500,
      unit: 'GB',
      trend: 12,
      icon: HardDrive
    },
    {
      name: 'Network I/O',
      current: 89,
      limit: 1000,
      unit: 'Mbps',
      trend: 15,
      icon: Wifi
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'offline': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getOverallHealth = () => {
    const healthyCount = healthChecks.filter(check => check.status === 'healthy').length;
    const warningCount = healthChecks.filter(check => check.status === 'warning').length;
    const criticalCount = healthChecks.filter(check => check.status === 'critical').length;
    
    if (criticalCount > 0) return { status: 'critical', score: 60 };
    if (warningCount > 0) return { status: 'warning', score: 80 };
    return { status: 'healthy', score: 95 };
  };

  const overallHealth = getOverallHealth();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">System Health Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive system health monitoring and diagnostics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure Checks
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Run Full Scan
          </Button>
        </div>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall System Health</h2>
              <div className="flex items-center space-x-4">
                {getStatusIcon(overallHealth.status)}
                <Badge className={getStatusBadge(overallHealth.status)}>
                  {overallHealth.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold therapy-text-gradient mb-2">
                {overallHealth.score}%
              </div>
              <p className="text-sm text-muted-foreground">Health Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Services Health */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthChecks.map((check) => (
              <Card key={check.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      {check.name}
                    </CardTitle>
                    {getStatusIcon(check.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={getStatusBadge(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm font-mono">{check.uptime.toFixed(2)}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm font-mono">{check.responseTime}ms</span>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">{check.details}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last Check</span>
                    <span>{new Date(check.lastCheck).toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resource Usage */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourceUsage.map((resource, index) => {
              const ResourceIcon = resource.icon;
              const usagePercentage = (resource.current / resource.limit) * 100;
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ResourceIcon className="h-5 w-5 mr-2 text-therapy-500" />
                      {resource.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {resource.current}{resource.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of {resource.limit}{resource.unit}
                      </span>
                    </div>
                    
                    <Progress value={usagePercentage} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Usage: {usagePercentage.toFixed(1)}%</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className={`h-4 w-4 ${resource.trend > 0 ? 'text-red-500' : 'text-green-500'} ${resource.trend < 0 ? 'rotate-180' : ''}`} />
                        <span className={`text-sm ${Math.abs(resource.trend) > 10 ? 'font-semibold' : ''} ${resource.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {resource.trend > 0 ? '+' : ''}{resource.trend}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Database Optimization</h3>
                      <p className="text-sm text-muted-foreground">Scheduled maintenance window for database performance tuning</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Jan 15, 2024 02:00 UTC</p>
                      <p className="text-xs text-muted-foreground">Expected: 30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Security Patches</h3>
                      <p className="text-sm text-muted-foreground">Apply latest security updates to all services</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Jan 20, 2024 03:00 UTC</p>
                      <p className="text-xs text-muted-foreground">Expected: 45 minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Memory Usage Alert</h4>
                      <p className="text-sm text-yellow-700">Consider scaling up memory allocation or optimizing queries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Backup Verification</h4>
                      <p className="text-sm text-blue-700">Last backup verification completed successfully</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Performance Optimization</h4>
                      <p className="text-sm text-green-700">Recent optimizations improved response times by 15%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                System Health History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Health History Chart</p>
                  <p className="text-sm text-gray-400">30-day system health trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealth;