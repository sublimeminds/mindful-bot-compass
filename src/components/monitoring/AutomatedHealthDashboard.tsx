
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Activity, 
  Clock, 
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { automatedHealthService } from '@/services/automatedHealthService';

const AutomatedHealthDashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState(automatedHealthService.getMetrics());
  const [lastHealthCheck, setLastHealthCheck] = useState<any>(null);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(automatedHealthService.getMetrics());
      setIsMonitoring(automatedHealthService.isActive());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

    // Listen for automated recovery events
    const handleRecovery = (event: CustomEvent) => {
      console.log('Automated recovery triggered:', event.detail);
      setLastHealthCheck(event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('automated-recovery', handleRecovery as EventListener);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('automated-recovery', handleRecovery as EventListener);
      }
    };
  }, []);

  const handleToggleMonitoring = async () => {
    if (isMonitoring) {
      automatedHealthService.stopMonitoring();
    } else {
      await automatedHealthService.startMonitoring();
    }
    setIsMonitoring(automatedHealthService.isActive());
  };

  const handleManualCheck = async () => {
    // Trigger a manual health check
    try {
      const response = await fetch('/functions/v1/automated-health-check', {
        method: 'POST'
      });
      const result = await response.json();
      setLastHealthCheck(result);
    } catch (error) {
      console.error('Manual health check failed:', error);
    }
  };

  const getHealthStatus = () => {
    if (metrics.errorRate > 0.5) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-100' };
    if (metrics.errorRate > 0.2) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'healthy', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const healthStatus = getHealthStatus();
  const uptimePercentage = Math.max(0, Math.min(100, (1 - metrics.errorRate) * 100));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Automated Health Monitoring
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={healthStatus.bg + ' ' + healthStatus.color}>
              {healthStatus.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMonitoring}
            >
              {isMonitoring ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold">
            System Health: {Math.round(uptimePercentage)}%
          </div>
          <Progress value={uptimePercentage} className="h-3" />
          <p className="text-xs text-muted-foreground">
            Last check: {metrics.lastCheckTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uptime</span>
              <Activity className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-bold">
              {Math.round(metrics.uptime / 1000 / 60)}m
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Avg Response</span>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold">
              {Math.round(metrics.avgResponseTime)}ms
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Error Rate</span>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-lg font-bold">
              {(metrics.errorRate * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Memory Usage</span>
              <Zap className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-lg font-bold">
              {(metrics.memoryUsage * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Monitoring Status */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Monitoring Status</h3>
            <div className="flex items-center space-x-2">
              {isMonitoring ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-sm">
                {isMonitoring ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Automated health checks run every minute when active
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualCheck}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Run Manual Check
          </Button>
        </div>

        {/* Last Health Check Results */}
        {lastHealthCheck && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-3">Latest Health Check</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Status:</span>
                <Badge className={
                  lastHealthCheck.overall === 'healthy' ? 'bg-green-100 text-green-800' :
                  lastHealthCheck.overall === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {lastHealthCheck.overall}
                </Badge>
              </div>
              {lastHealthCheck.recommendations && lastHealthCheck.recommendations.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <strong>Recommendations:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {lastHealthCheck.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedHealthDashboard;
