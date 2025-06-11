
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cpu, Database, Server, Wifi, HardDrive, Activity, Zap, Clock } from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: any;
  description: string;
}

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching real system metrics
    const fetchMetrics = () => {
      const mockMetrics: SystemMetric[] = [
        {
          name: 'CPU Usage',
          value: 42,
          unit: '%',
          status: 'healthy',
          icon: Cpu,
          description: 'Server CPU utilization'
        },
        {
          name: 'Memory Usage',
          value: 68,
          unit: '%',
          status: 'warning',
          icon: HardDrive,
          description: 'RAM consumption'
        },
        {
          name: 'Database Load',
          value: 35,
          unit: '%',
          status: 'healthy',
          icon: Database,
          description: 'Database connection pool'
        },
        {
          name: 'API Response Time',
          value: 120,
          unit: 'ms',
          status: 'healthy',
          icon: Zap,
          description: 'Average API response time'
        },
        {
          name: 'Active Connections',
          value: 1247,
          unit: '',
          status: 'healthy',
          icon: Wifi,
          description: 'Current active user sessions'
        },
        {
          name: 'Uptime',
          value: 99.9,
          unit: '%',
          status: 'healthy',
          icon: Activity,
          description: 'System availability'
        },
        {
          name: 'Disk Usage',
          value: 56,
          unit: '%',
          status: 'healthy',
          icon: Server,
          description: 'Storage utilization'
        },
        {
          name: 'Queue Processing',
          value: 23,
          unit: 'jobs/min',
          status: 'healthy',
          icon: Clock,
          description: 'Background job processing rate'
        }
      ];

      setMetrics(mockMetrics);
      setLoading(false);
    };

    fetchMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-400" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>Loading system metrics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const progressValue = metric.unit === '%' ? metric.value : Math.min((metric.value / 2000) * 100, 100);
              
              return (
                <div key={metric.name} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                      <span className="text-sm font-medium text-white">{metric.name}</span>
                    </div>
                    <Badge variant={getStatusBadge(metric.status) as any} className="text-xs">
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-white">
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    
                    {metric.unit === '%' && (
                      <Progress 
                        value={progressValue} 
                        className="h-2"
                      />
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400">{metric.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemMetrics;
