
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield
} from 'lucide-react';
import { digitalOceanService } from '@/services/digitalOceanService';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface InfrastructureMetrics {
  cpu: {
    usage: number;
    trend: 'up' | 'down' | 'stable';
  };
  memory: {
    usage: number;
    total: number;
    trend: 'up' | 'down' | 'stable';
  };
  disk: {
    usage: number;
    total: number;
    trend: 'up' | 'down' | 'stable';
  };
  network: {
    inbound: number;
    outbound: number;
    trend: 'up' | 'down' | 'stable';
  };
  uptime: number;
  lastUpdated: Date;
}

interface InfrastructureAlert {
  id: string;
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'uptime';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resourceId: string;
}

const InfrastructureMonitor = () => {
  const [metrics, setMetrics] = useState<Record<string, InfrastructureMetrics>>({});
  const [alerts, setAlerts] = useState<InfrastructureAlert[]>([]);
  const [droplets, setDroplets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { alerts: securityAlerts, metrics: securityMetrics } = useSecurityMonitoring();

  useEffect(() => {
    loadInfrastructureData();
    const interval = setInterval(loadInfrastructureData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadInfrastructureData = async () => {
    setLoading(true);
    try {
      // Load droplets
      const dropletsData = await digitalOceanService.listDroplets();
      setDroplets(dropletsData);

      // Generate metrics for each droplet (simulated)
      const newMetrics: Record<string, InfrastructureMetrics> = {};
      const newAlerts: InfrastructureAlert[] = [];

      for (const droplet of dropletsData) {
        if (droplet.status === 'active') {
          const dropletMetrics = await generateMetricsForDroplet(droplet.id);
          newMetrics[droplet.id.toString()] = dropletMetrics;

          // Check for alerts - Fix: Convert droplet.id to string
          const dropletAlerts = checkMetricsForAlerts(droplet.id.toString(), dropletMetrics);
          newAlerts.push(...dropletAlerts);
        }
      }

      setMetrics(newMetrics);
      setAlerts(prev => [...newAlerts, ...prev.filter(a => a.acknowledged)].slice(0, 50));

    } catch (error) {
      console.error('Failed to load infrastructure data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMetricsForDroplet = async (dropletId: number): Promise<InfrastructureMetrics> => {
    // In production, this would fetch real metrics from DigitalOcean monitoring API
    // For now, we'll generate realistic simulated data
    
    const baseTime = Date.now();
    const noise = () => Math.random() * 20 - 10; // ±10% variation

    return {
      cpu: {
        usage: Math.max(0, Math.min(100, 25 + noise())),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      memory: {
        usage: Math.max(0, Math.min(100, 60 + noise())),
        total: 1024, // MB
        trend: Math.random() > 0.5 ? 'up' : 'stable'
      },
      disk: {
        usage: Math.max(0, Math.min(100, 35 + noise())),
        total: 25000, // MB
        trend: 'stable'
      },
      network: {
        inbound: Math.max(0, 50 + noise()),
        outbound: Math.max(0, 30 + noise()),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      uptime: 99.9,
      lastUpdated: new Date()
    };
  };

  const checkMetricsForAlerts = (dropletId: string, metrics: InfrastructureMetrics): InfrastructureAlert[] => {
    const alerts: InfrastructureAlert[] = [];

    // CPU alerts
    if (metrics.cpu.usage > 90) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'cpu',
        severity: 'critical',
        message: `CPU usage is ${metrics.cpu.usage.toFixed(1)}% on droplet ${dropletId}`,
        timestamp: new Date(),
        acknowledged: false,
        resourceId: dropletId
      });
    } else if (metrics.cpu.usage > 80) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'cpu',
        severity: 'high',
        message: `High CPU usage (${metrics.cpu.usage.toFixed(1)}%) on droplet ${dropletId}`,
        timestamp: new Date(),
        acknowledged: false,
        resourceId: dropletId
      });
    }

    // Memory alerts
    if (metrics.memory.usage > 95) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'memory',
        severity: 'critical',
        message: `Memory usage is ${metrics.memory.usage.toFixed(1)}% on droplet ${dropletId}`,
        timestamp: new Date(),
        acknowledged: false,
        resourceId: dropletId
      });
    }

    // Disk alerts
    if (metrics.disk.usage > 90) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'disk',
        severity: 'high',
        message: `Disk usage is ${metrics.disk.usage.toFixed(1)}% on droplet ${dropletId}`,
        timestamp: new Date(),
        acknowledged: false,
        resourceId: dropletId
      });
    }

    return alerts;
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage > 90) return 'text-red-600';
    if (usage > 80) return 'text-orange-600';
    if (usage > 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const activeDroplets = droplets.filter(d => d.status === 'active');
  const criticalAlerts = alerts.filter(a => !a.acknowledged && a.severity === 'critical');
  const totalCpuUsage = Object.values(metrics).reduce((sum, m) => sum + m.cpu.usage, 0) / Object.keys(metrics).length || 0;
  const totalMemoryUsage = Object.values(metrics).reduce((sum, m) => sum + m.memory.usage, 0) / Object.keys(metrics).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Infrastructure Monitor</h2>
          <p className="text-therapy-600 mt-1">Real-time monitoring of DigitalOcean infrastructure</p>
        </div>
        <Button onClick={loadInfrastructureData} disabled={loading}>
          <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Infrastructure Alert:</strong> {criticalAlerts.length} critical issues detected requiring immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Server className="h-4 w-4 mr-2 text-blue-600" />
              Active Droplets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDroplets.length}</div>
            <p className="text-xs text-muted-foreground">
              {droplets.length - activeDroplets.length} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-orange-600" />
              Avg CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUsageColor(totalCpuUsage)}`}>
              {totalCpuUsage.toFixed(1)}%
            </div>
            <Progress value={totalCpuUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-purple-600" />
              Avg Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUsageColor(totalMemoryUsage)}`}>
              {totalMemoryUsage.toFixed(1)}%
            </div>
            <Progress value={totalMemoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => !a.acknowledged).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Droplet Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Droplet Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeDroplets.map((droplet) => {
              const dropletMetrics = metrics[droplet.id.toString()];
              if (!dropletMetrics) return null;

              return (
                <div key={droplet.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{droplet.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {droplet.ip} • {droplet.region} • {droplet.size}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {dropletMetrics.uptime}% uptime
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">CPU</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{dropletMetrics.cpu.usage.toFixed(1)}%</span>
                          {getTrendIcon(dropletMetrics.cpu.trend)}
                        </div>
                      </div>
                      <Progress value={dropletMetrics.cpu.usage} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Memory</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{dropletMetrics.memory.usage.toFixed(1)}%</span>
                          {getTrendIcon(dropletMetrics.memory.trend)}
                        </div>
                      </div>
                      <Progress value={dropletMetrics.memory.usage} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Disk</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{dropletMetrics.disk.usage.toFixed(1)}%</span>
                          {getTrendIcon(dropletMetrics.disk.trend)}
                        </div>
                      </div>
                      <Progress value={dropletMetrics.disk.usage} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Network</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">
                            ↓{dropletMetrics.network.inbound.toFixed(0)} ↑{dropletMetrics.network.outbound.toFixed(0)} MB/s
                          </span>
                          {getTrendIcon(dropletMetrics.network.trend)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {dropletMetrics.lastUpdated.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeDroplets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No active droplets to monitor
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Infrastructure Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.filter(a => !a.acknowledged).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium capitalize">{alert.type} Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  Acknowledge
                </Button>
              </div>
            ))}

            {alerts.filter(a => !a.acknowledged).length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear</h3>
                <p className="text-gray-600">No active infrastructure alerts.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration with Security Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security & Infrastructure Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Security Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Threat Level:</span>
                  <Badge className={
                    securityMetrics?.threatLevel === 'critical' ? 'bg-red-100 text-red-800' :
                    securityMetrics?.threatLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    securityMetrics?.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {securityMetrics?.threatLevel || 'low'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Threats:</span>
                  <span className="font-medium">{securityMetrics?.activeThreats || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>System Health:</span>
                  <span className="font-medium">{securityMetrics?.systemHealth || 100}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Infrastructure Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Resources:</span>
                  <span className="font-medium">{activeDroplets.length} droplets</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Performance:</span>
                  <span className="font-medium">
                    CPU: {totalCpuUsage.toFixed(1)}%, RAM: {totalMemoryUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alert Status:</span>
                  <Badge className={criticalAlerts.length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {criticalAlerts.length > 0 ? `${criticalAlerts.length} critical` : 'All clear'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureMonitor;
