
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, Server, Zap } from 'lucide-react';

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState({
    systemHealth: 98,
    databaseLoad: 45,
    apiResponseTime: 120,
    errorRate: 0.2,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        systemHealth: Math.max(90, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        databaseLoad: Math.max(0, Math.min(100, prev.databaseLoad + (Math.random() - 0.5) * 10)),
        apiResponseTime: Math.max(50, Math.min(500, prev.apiResponseTime + (Math.random() - 0.5) * 20)),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.2)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number, inverted = false) => {
    if (inverted) {
      if (value < 30) return 'text-green-400';
      if (value < 70) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (value > 80) return 'text-green-400';
    if (value > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (value: number, inverted = false) => {
    if (inverted) {
      if (value < 30) return 'bg-green-500';
      if (value < 70) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (value > 80) return 'bg-green-500';
    if (value > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">System Health</span>
            </div>
            <span className={`text-sm font-medium ${getHealthColor(metrics.systemHealth)}`}>
              {metrics.systemHealth.toFixed(1)}%
            </span>
          </div>
          <Progress value={metrics.systemHealth} className="h-2" />
        </div>

        {/* Database Load */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Database Load</span>
            </div>
            <span className={`text-sm font-medium ${getHealthColor(metrics.databaseLoad, true)}`}>
              {metrics.databaseLoad.toFixed(1)}%
            </span>
          </div>
          <Progress value={metrics.databaseLoad} className="h-2" />
        </div>

        {/* API Response Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">API Response Time</span>
            </div>
            <span className={`text-sm font-medium ${
              metrics.apiResponseTime < 200 ? 'text-green-400' : 
              metrics.apiResponseTime < 500 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.apiResponseTime.toFixed(0)}ms
            </span>
          </div>
          <Progress 
            value={Math.min(100, (metrics.apiResponseTime / 500) * 100)} 
            className="h-2" 
          />
        </div>

        {/* Error Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Error Rate</span>
            </div>
            <span className={`text-sm font-medium ${
              metrics.errorRate < 1 ? 'text-green-400' : 
              metrics.errorRate < 3 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.errorRate.toFixed(2)}%
            </span>
          </div>
          <Progress 
            value={Math.min(100, (metrics.errorRate / 5) * 100)} 
            className="h-2" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMetrics;
