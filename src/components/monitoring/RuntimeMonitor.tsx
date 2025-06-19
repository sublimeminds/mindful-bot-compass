import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe
} from 'lucide-react';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

// Extend Performance interface to include memory property
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

const RuntimeMonitor = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const collectMetrics = async (): Promise<MetricData[]> => {
    const newMetrics: MetricData[] = [];

    // Performance metrics
    const performance = window.performance as PerformanceWithMemory;
    if (performance.memory) {
      const memory = performance.memory;
      newMetrics.push({
        name: 'Memory Usage',
        value: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
        unit: '%',
        status: memory.usedJSHeapSize / memory.totalJSHeapSize > 0.8 ? 'critical' : 'good',
        trend: 'stable'
      });
    }

    // Network status
    const connection = (navigator as any).connection;
    if (connection) {
      newMetrics.push({
        name: 'Connection Speed',
        value: connection.downlink || 0,
        unit: 'Mbps',
        status: connection.downlink < 1 ? 'warning' : 'good',
        trend: 'stable'
      });
    }

    // Error count (simulated)
    const errorCount = Math.floor(Math.random() * 5);
    newMetrics.push({
      name: 'Error Count',
      value: errorCount,
      unit: 'errors/min',
      status: errorCount > 2 ? 'critical' : errorCount > 0 ? 'warning' : 'good',
      trend: errorCount > 2 ? 'up' : 'stable'
    });

    // API Response Time (simulated)
    const responseTime = 100 + Math.random() * 200;
    newMetrics.push({
      name: 'API Response',
      value: Math.round(responseTime),
      unit: 'ms',
      status: responseTime > 200 ? 'warning' : 'good',
      trend: responseTime > 200 ? 'up' : 'stable'
    });

    return newMetrics;
  };

  useEffect(() => {
    const updateMetrics = async () => {
      if (isMonitoring) {
        const newMetrics = await collectMetrics();
        setMetrics(newMetrics);
        setLastUpdate(new Date());
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const overallHealth = metrics.length > 0 
    ? metrics.filter(m => m.status === 'good').length / metrics.length * 100 
    : 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Runtime Monitor
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? 'Live' : 'Paused'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Health */}
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">
            System Health: {Math.round(overallHealth)}%
          </div>
          <Progress value={overallHealth} className="h-3" />
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{metric.name}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {metric.value}{metric.unit}
                </span>
                <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Monitoring every 10 seconds
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh App
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RuntimeMonitor;
