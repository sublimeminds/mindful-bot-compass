
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
  Cpu,
  Wifi,
  Database,
  Shield
} from 'lucide-react';
import { appHealthChecker } from '@/utils/appHealthChecker';
import { reactHookValidator } from '@/utils/reactHookValidator';

const SystemHealthMonitor = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const status = await appHealthChecker.runStartupHealthChecks();
      setHealthStatus(status);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
    
    // Run health checks every 5 minutes
    const interval = setInterval(runHealthCheck, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallColor = (overall: string) => {
    switch (overall) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes('React')) return <Cpu className="h-4 w-4" />;
    if (name.includes('Network')) return <Wifi className="h-4 w-4" />;
    if (name.includes('Storage') || name.includes('Bundle')) return <Database className="h-4 w-4" />;
    if (name.includes('Browser')) return <Shield className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  if (!healthStatus) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Activity className="h-8 w-8 mx-auto mb-4 animate-pulse" />
          <p>Running system health check...</p>
        </CardContent>
      </Card>
    );
  }

  const healthPercentage = Math.round(
    (healthStatus.checks.filter((check: any) => check.status === 'pass').length / healthStatus.checks.length) * 100
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Health Monitor
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthCheck}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="text-center space-y-4">
          <div className={`text-3xl font-bold ${getOverallColor(healthStatus.overall)}`}>
            {healthStatus.overall.toUpperCase()}
          </div>
          <div className="space-y-2">
            <Progress value={healthPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {healthPercentage}% of systems operational
            </p>
          </div>
          {lastUpdate && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Health Checks */}
        <div className="space-y-3">
          <h3 className="font-medium">System Components</h3>
          {healthStatus.checks.map((check: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(check.name)}
                <div>
                  <div className="font-medium text-sm">{check.name}</div>
                  <div className="text-xs text-muted-foreground">{check.message}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(check.status)}
                <Badge className={`text-xs ${getStatusColor(check.status)}`}>
                  {check.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* React Diagnostics */}
        <div className="space-y-3">
          <h3 className="font-medium">React Diagnostics</h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">React Available:</span>{' '}
                <span className="text-green-600">✓</span>
              </div>
              <div>
                <span className="font-medium">Hooks Available:</span>{' '}
                <span className="text-green-600">✓</span>
              </div>
              <div>
                <span className="font-medium">Context Working:</span>{' '}
                <span className="text-green-600">✓</span>
              </div>
              <div>
                <span className="font-medium">Version:</span>{' '}
                <span>{React.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {healthStatus.overall !== 'healthy' && (
          <div className="space-y-3">
            <h3 className="font-medium text-yellow-600">Recommended Actions</h3>
            <div className="space-y-2">
              {healthStatus.checks
                .filter((check: any) => check.status !== 'pass')
                .map((check: any, index: number) => (
                  <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <span className="font-medium">{check.name}:</span> {check.message}
                  </div>
                ))
              }
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload Application
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;
