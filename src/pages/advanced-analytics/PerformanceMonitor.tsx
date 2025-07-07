import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Activity, Server, Database, Wifi } from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: { warning: number; critical: number };
  trend: number;
  lastUpdated: string;
}

interface SystemAlert {
  id: string;
  type: 'performance' | 'error' | 'warning';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isResolved: boolean;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      id: '1',
      name: 'API Response Time',
      value: 245,
      unit: 'ms',
      status: 'healthy',
      threshold: { warning: 500, critical: 1000 },
      trend: -12,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Database Query Time',
      value: 89,
      unit: 'ms',
      status: 'healthy',
      threshold: { warning: 200, critical: 500 },
      trend: 5,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Memory Usage',
      value: 78,
      unit: '%',
      status: 'warning',
      threshold: { warning: 75, critical: 90 },
      trend: 8,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '4',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 70, critical: 85 },
      trend: -3,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 2, critical: 5 },
      trend: -15,
      lastUpdated: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Active Users',
      value: 2847,
      unit: 'users',
      status: 'healthy',
      threshold: { warning: 5000, critical: 8000 },
      trend: 22,
      lastUpdated: new Date().toISOString()
    }
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage Detected',
      description: 'Memory usage has exceeded 75% threshold on production server',
      severity: 'medium',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      isResolved: false
    },
    {
      id: '2',
      type: 'performance',
      title: 'API Response Time Spike',
      description: 'Brief spike in API response times detected at 14:32',
      severity: 'low',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      isResolved: true
    },
    {
      id: '3',
      type: 'error',
      title: 'Database Connection Pool Warning',
      description: 'Connection pool approaching maximum capacity',
      severity: 'high',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isResolved: false
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
        trend: (Math.random() - 0.5) * 20,
        lastUpdated: new Date().toISOString()
      })));
    }, parseInt(refreshInterval) * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-l-blue-500';
      case 'medium': return 'border-l-yellow-500';
      case 'high': return 'border-l-orange-500';
      case 'critical': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend < -5) return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getMetricIcon = (name: string) => {
    if (name.includes('API') || name.includes('Response')) return Server;
    if (name.includes('Database') || name.includes('Query')) return Database;
    if (name.includes('Memory') || name.includes('CPU')) return Zap;
    if (name.includes('Users') || name.includes('Active')) return Activity;
    return Wifi;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Performance Monitor</h1>
          <p className="text-muted-foreground">Real-time system performance monitoring and alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Refresh</span>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
              <SelectItem value="60">1m</SelectItem>
              <SelectItem value="300">5m</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">Operational</p>
            <p className="text-sm text-muted-foreground">System Status</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">99.97%</p>
            <p className="text-sm text-muted-foreground">Uptime (30d)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">2.3M</p>
            <p className="text-sm text-muted-foreground">Requests/24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">2</p>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Real-Time Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => {
              const MetricIcon = getMetricIcon(metric.name);
              const percentage = metric.unit === '%' ? metric.value : 
                Math.min((metric.value / metric.threshold.warning) * 50, 100);
              
              return (
                <div key={metric.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MetricIcon className="h-4 w-4 text-therapy-500" />
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <Badge className={getStatusBadge(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {typeof metric.value === 'number' ? metric.value.toFixed(metric.unit === 'ms' ? 0 : 1) : metric.value}
                      <span className="text-sm ml-1">{metric.unit}</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${metric.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {Math.abs(metric.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <Progress value={percentage} className="h-2" />
                  
                  <div className="text-xs text-muted-foreground">
                    Warning: {metric.threshold.warning}{metric.unit} | 
                    Critical: {metric.threshold.critical}{metric.unit}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              System Alerts
            </CardTitle>
            <Button variant="outline" size="sm">
              View All Alerts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border-l-4 rounded-lg bg-gray-50 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold">{alert.title}</span>
                      {alert.isResolved ? (
                        <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Type: {alert.type}</span>
                      <span>Severity: {alert.severity}</span>
                      <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  {!alert.isResolved && (
                    <Button variant="outline" size="sm" className="ml-4">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance History Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance History (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Performance Chart</p>
              <p className="text-sm text-gray-400">Real-time metrics visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;