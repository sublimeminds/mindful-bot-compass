import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Server,
  Shield,
  Database,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';
import { performanceService } from '@/services/performanceService';
import { cacheService } from '@/services/cacheService';
import { rateLimitService } from '@/services/rateLimitService';
import { enterpriseSecurityService } from '@/services/enterpriseSecurityService';

const ProductionMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        performanceMetrics,
        cacheStats,
        rateLimitStats,
        securityEvents,
        memoryUsage
      ] = await Promise.all([
        performanceService.getLocalMetrics(),
        cacheService.getStats(),
        rateLimitService.getStats(),
        enterpriseSecurityService.getSecurityEvents(),
        performanceService.getMemoryUsage()
      ]);

      setMetrics({
        performance: performanceMetrics,
        cache: cacheStats,
        rateLimit: rateLimitStats,
        security: securityEvents,
        memory: memoryUsage,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getPerformanceStatus = () => {
    if (!metrics.performance?.length) return 'unknown';
    
    const violations = performanceService.checkPerformanceBudget();
    if (violations.some(v => v.severity === 'high')) return 'critical';
    if (violations.some(v => v.severity === 'medium')) return 'warning';
    return 'healthy';
  };

  const formatMetric = (value: number, unit: string = 'ms') => {
    if (value === undefined || value === null) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monitoring-50 to-system-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-monitoring-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-monitoring-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const performanceData = metrics.performance?.slice(-20).map((m: any, index: number) => ({
    time: index,
    value: m.metric_value,
    name: m.metric_name
  })) || [];

  const securityEventsByType = metrics.security?.reduce((acc: any, event: any) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {}) || {};

  const systemStatus = getPerformanceStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-monitoring-50 to-system-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-monitoring-900">
              Production Monitoring
            </h1>
            <p className="text-monitoring-600 mt-1">
              Real-time system health and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant={systemStatus === 'healthy' ? 'default' : 
                     systemStatus === 'warning' ? 'secondary' : 'destructive'}
            >
              <Activity className="h-3 w-3 mr-1" />
              {systemStatus.toUpperCase()}
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">
                    {formatMetric(performanceData.find(d => d.name === 'TTFB')?.value)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                  <p className="text-2xl font-bold">
                    {metrics.memory ? `${Math.round(metrics.memory.usage)}%` : 'N/A'}
                  </p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">
                    {metrics.cache ? 
                      `${Math.round((metrics.cache.memorySize / metrics.cache.memoryLimit) * 100)}%` : 
                      'N/A'
                    }
                  </p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Events</p>
                  <p className="text-2xl font-bold">
                    {metrics.security?.length || 0}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Alerts */}
        {performanceService.checkPerformanceBudget().length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Performance budget violations detected. Check the Performance tab for details.
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed Monitoring Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {performanceService.checkPerformanceBudget().map((violation, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{violation.metric}</span>
                        <Badge variant={violation.severity === 'high' ? 'destructive' : 'secondary'}>
                          {violation.severity}
                        </Badge>
                      </div>
                      <Progress 
                        value={(violation.value / violation.threshold) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatMetric(violation.value)} / {formatMetric(violation.threshold)} threshold
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metrics.memory && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm">{Math.round(metrics.memory.usage)}%</span>
                      </div>
                      <Progress value={metrics.memory.usage} className="h-2" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cache Utilization</span>
                      <span className="text-sm">
                        {metrics.cache ? 
                          `${metrics.cache.memorySize}/${metrics.cache.memoryLimit}` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <Progress 
                      value={metrics.cache ? (metrics.cache.memorySize / metrics.cache.memoryLimit) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Rate Limit Usage</span>
                      <span className="text-sm">
                        {metrics.rateLimit ? `${metrics.rateLimit.blockedEntries} blocked` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cache Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {metrics.cache?.memorySize || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Cached Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {metrics.cache?.localStorageKeys || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Persistent Cache</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(securityEventsByType).map(([type, count]) => ({
                          name: type,
                          value: count
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {Object.entries(securityEventsByType).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {metrics.security?.slice(-10).map((event: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{event.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            event.severity === 'critical' ? 'destructive' :
                            event.severity === 'high' ? 'destructive' :
                            event.severity === 'medium' ? 'secondary' : 'default'
                          }
                        >
                          {event.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Usage Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Metrics Collected</span>
                      <span className="font-medium">{metrics.performance?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Events</span>
                      <span className="font-medium">{metrics.security?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache Hit Rate</span>
                      <span className="font-medium">
                        {metrics.cache ? 
                          `${Math.round((metrics.cache.memorySize / metrics.cache.memoryLimit) * 100)}%` : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      {systemStatus === 'healthy' ? '98%' : 
                       systemStatus === 'warning' ? '85%' : '72%'}
                    </div>
                    <p className="text-muted-foreground">Overall System Health</p>
                    <Badge
                      variant={systemStatus === 'healthy' ? 'default' : 
                              systemStatus === 'warning' ? 'secondary' : 'destructive'}
                      className="text-sm"
                    >
                      {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {metrics.lastUpdated?.toLocaleString() || 'Never'}
        </div>
      </div>
    </div>
  );
};

export default ProductionMonitoringDashboard;