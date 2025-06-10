
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Server, 
  Bell, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { SystemHealthService, SystemMetrics, SystemAlert } from '@/services/systemHealthService';

const SystemHealthMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [metricsData, alertsData] = await Promise.all([
        SystemHealthService.getSystemMetrics(),
        SystemHealthService.getSystemAlerts()
      ]);
      
      setMetrics(metricsData);
      setAlerts(alertsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  if (loading && !metrics) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-600 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const overallStatus = SystemHealthService.getHealthStatus(metrics);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-white">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              System Health Monitor
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${getStatusColor(overallStatus)}`}>
                  {getStatusIcon(overallStatus)}
                  <span className="font-medium capitalize">{overallStatus}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSystemData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </CardHeader>
      </Card>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Database Health */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm text-gray-400">
              <Database className="h-4 w-4 mr-2" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className={`${getStatusColor(metrics.database.connectionStatus)} border-0 bg-transparent`}>
                  {metrics.database.connectionStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-medium text-white">{metrics.database.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Connections</span>
                <span className="text-sm font-medium text-white">{metrics.database.activeConnections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <span className="text-sm font-medium text-white">{metrics.database.errorRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Performance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm text-gray-400">
              <Server className="h-4 w-4 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span className="text-white">{metrics.performance.cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.performance.cpuUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory</span>
                  <span className="text-white">{metrics.performance.memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.performance.memoryUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span className="text-white">{metrics.performance.diskUsage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.performance.diskUsage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Stats */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm text-gray-400">
              <Activity className="h-4 w-4 mr-2" />
              Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium text-white">{formatUptime(metrics.application.uptime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Users</span>
                <span className="text-sm font-medium text-white">{metrics.application.totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sessions</span>
                <span className="text-sm font-medium text-white">{metrics.application.activeSessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Errors (24h)</span>
                <span className="text-sm font-medium text-white">{metrics.application.errorCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm text-gray-400">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Delivery Rate</span>
                <span className="text-sm font-medium text-white">{metrics.notifications.deliveryRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Queue Size</span>
                <span className="text-sm font-medium text-white">{metrics.notifications.queueSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed</span>
                <span className="text-sm font-medium text-white">{metrics.notifications.failedDeliveries}</span>
              </div>
              <div>
                <Progress value={metrics.notifications.deliveryRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <p>No active alerts. All systems operating normally.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.resolved ? 'border-green-600 bg-green-900/20' : 
                    alert.type === 'critical' ? 'border-red-600 bg-red-900/20' :
                    alert.type === 'warning' ? 'border-yellow-600 bg-yellow-900/20' :
                    'border-blue-600 bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${
                        alert.resolved ? 'bg-green-500' :
                        alert.type === 'critical' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {alert.resolved ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{alert.title}</h4>
                        <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {alert.timestamp.toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {alert.component}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => SystemHealthService.resolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthMonitor;
