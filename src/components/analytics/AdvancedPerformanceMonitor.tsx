
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Monitor,
  Server,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SystemHealth {
  overall: number;
  cpu: number;
  memory: number;
  network: number;
  database: number;
  uptime: string;
  activeUsers: number;
  responseTime: number;
}

const AdvancedPerformanceMonitor = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadPerformanceData();
    if (isMonitoring) {
      const interval = setInterval(loadPerformanceData, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const loadPerformanceData = () => {
    // Mock performance data
    const mockMetrics: PerformanceMetric[] = [
      {
        id: '1',
        name: 'Page Load Time',
        value: 1.2,
        unit: 's',
        status: 'good',
        trend: 'down',
        description: 'Average page load time across all routes'
      },
      {
        id: '2',
        name: 'API Response Time',
        value: 245,
        unit: 'ms',
        status: 'excellent',
        trend: 'stable',
        description: 'Average API response time'
      },
      {
        id: '3',
        name: 'Memory Usage',
        value: 68,
        unit: '%',
        status: 'warning',
        trend: 'up',
        description: 'Current memory utilization'
      },
      {
        id: '4',
        name: 'Error Rate',
        value: 0.3,
        unit: '%',
        status: 'excellent',
        trend: 'down',
        description: 'Error rate in the last hour'
      }
    ];

    const mockSystemHealth: SystemHealth = {
      overall: 92,
      cpu: 45,
      memory: 68,
      network: 95,
      database: 88,
      uptime: '15 days, 8 hours',
      activeUsers: 1247,
      responseTime: 245
    };

    setMetrics(mockMetrics);
    setSystemHealth(mockSystemHealth);

    // Check for alerts
    const newAlerts: string[] = [];
    if (mockSystemHealth.memory > 80) {
      newAlerts.push('High memory usage detected');
    }
    if (mockSystemHealth.cpu > 90) {
      newAlerts.push('CPU usage is critical');
    }
    setAlerts(newAlerts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-green-500 transform rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? "Monitoring Stopped" : "Real-time Monitoring Started",
      description: isMonitoring ? "Performance monitoring has been paused" : "Now monitoring system performance in real-time",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Monitor className="h-7 w-7 mr-2 text-therapy-600" />
            Performance Monitor
          </h2>
          <p className="text-muted-foreground">Real-time system performance and health monitoring</p>
        </div>
        <Button onClick={toggleMonitoring} variant={isMonitoring ? "destructive" : "default"}>
          {isMonitoring ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-pulse" />
              Stop Monitoring
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Start Monitoring
            </>
          )}
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center text-orange-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health Overview */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              System Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-therapy-600 mb-2">{systemHealth.overall}%</div>
                <div className="text-sm text-muted-foreground">Overall Health</div>
                <Progress value={systemHealth.overall} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold mb-2 flex items-center justify-center">
                  <Cpu className="h-5 w-5 mr-1" />
                  {systemHealth.cpu}%
                </div>
                <div className="text-sm text-muted-foreground">CPU Usage</div>
                <Progress value={systemHealth.cpu} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold mb-2 flex items-center justify-center">
                  <HardDrive className="h-5 w-5 mr-1" />
                  {systemHealth.memory}%
                </div>
                <div className="text-sm text-muted-foreground">Memory Usage</div>
                <Progress value={systemHealth.memory} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold mb-2 flex items-center justify-center">
                  <Database className="h-5 w-5 mr-1" />
                  {systemHealth.database}%
                </div>
                <div className="text-sm text-muted-foreground">Database Health</div>
                <Progress value={systemHealth.database} className="mt-2" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold">{systemHealth.uptime}</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{systemHealth.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{systemHealth.responseTime}ms</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{metric.name}</CardTitle>
                {getTrendIcon(metric.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">
                  {metric.value}{metric.unit}
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Status */}
      {isMonitoring && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Real-time monitoring active</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedPerformanceMonitor;
