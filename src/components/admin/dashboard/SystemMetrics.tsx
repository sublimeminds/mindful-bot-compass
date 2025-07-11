
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cpu, Database, Server, Wifi, HardDrive, Activity, Zap, Clock } from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: any;
  description: string;
}

const SystemMetrics = () => {
  const { systemMetrics, isLoadingMetrics } = useAdminAnalytics();

  // Enhance system metrics with icons and additional info
  const enhancedMetrics = systemMetrics?.map(metric => ({
    ...metric,
    icon: getMetricIcon(metric.name)
  })) || [];

  function getMetricIcon(name: string) {
    switch (name.toLowerCase()) {
      case 'response time':
        return Zap;
      case 'active sessions':
        return Wifi;
      case 'database load':
        return Database;
      case 'memory usage':
        return HardDrive;
      default:
        return Activity;
    }
  }

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
        {isLoadingMetrics ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>Loading system metrics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enhancedMetrics.map((metric) => {
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
