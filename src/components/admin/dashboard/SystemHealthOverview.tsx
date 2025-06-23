
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Monitor, Database, Cpu, HardDrive, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';

const SystemHealthOverview = () => {
  const systemMetrics = [
    {
      name: 'API Response Time',
      value: 98.7,
      threshold: 95,
      unit: '%',
      icon: Wifi,
      status: 'healthy'
    },
    {
      name: 'Database Performance',
      value: 94.2,
      threshold: 90,
      unit: '%',
      icon: Database,
      status: 'healthy'
    },
    {
      name: 'CPU Usage',
      value: 67.5,
      threshold: 80,
      unit: '%',
      icon: Cpu,
      status: 'healthy'
    },
    {
      name: 'Memory Usage',
      value: 82.1,
      threshold: 85,
      unit: '%',
      icon: HardDrive,
      status: 'warning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getProgressColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'bg-green-500';
    if (value >= threshold - 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Monitor className="h-5 w-5 text-green-400" />
          <span>System Health Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <metric.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{metric.name}</div>
                  <div className="text-xs text-gray-400">
                    Threshold: {metric.threshold}{metric.unit}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {metric.value}{metric.unit}
                  </div>
                  <Badge 
                    variant={metric.status === 'healthy' ? 'default' : 'secondary'}
                    className={`text-xs ${getStatusColor(metric.status)}`}
                  >
                    {metric.status === 'healthy' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {metric.status}
                  </Badge>
                </div>
                <div className="w-24">
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthOverview;
