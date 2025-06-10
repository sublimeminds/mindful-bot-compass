
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Zap, 
  Database, 
  Wifi, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
  userSatisfactionScore: number;
}

interface MetricHistory {
  timestamp: string;
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
}

const PerformanceMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [history, setHistory] = useState<MetricHistory[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    startMonitoring();
    const interval = setInterval(collectMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    collectMetrics();
  };

  const collectMetrics = () => {
    // Get performance metrics from browser APIs
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    
    // Get memory usage (if available)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0;

    // Simulate API response time and other metrics
    const apiResponseTime = Math.random() * 500 + 100;
    const bundleSize = 2.4; // MB
    const cacheHitRate = Math.random() * 20 + 80; // 80-100%
    const errorRate = Math.random() * 2; // 0-2%
    const userSatisfactionScore = 95 - errorRate - (loadTime > 3000 ? 10 : 0);

    const newMetrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage,
      apiResponseTime,
      bundleSize,
      cacheHitRate,
      errorRate,
      userSatisfactionScore
    };

    const newHistoryEntry: MetricHistory = {
      timestamp: new Date().toLocaleTimeString(),
      loadTime,
      renderTime,
      memoryUsage,
      apiResponseTime
    };

    setMetrics(newMetrics);
    setHistory(prev => [...prev.slice(-19), newHistoryEntry]);

    // Check for performance alerts
    checkPerformanceAlerts(newMetrics);
  };

  const checkPerformanceAlerts = (metrics: PerformanceMetrics) => {
    const newAlerts: string[] = [];
    
    if (metrics.loadTime > 3000) {
      newAlerts.push('Page load time exceeds 3 seconds');
    }
    if (metrics.memoryUsage > 80) {
      newAlerts.push('High memory usage detected');
    }
    if (metrics.apiResponseTime > 1000) {
      newAlerts.push('API response time is slow');
    }
    if (metrics.errorRate > 1) {
      newAlerts.push('Error rate is above threshold');
    }
    if (metrics.cacheHitRate < 70) {
      newAlerts.push('Cache hit rate is low');
    }

    setAlerts(newAlerts);
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-100 text-green-800';
    if (value <= thresholds.warning) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Collecting performance metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-500" />
              <CardTitle>Performance Monitoring</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isMonitoring ? 'Monitoring' : 'Stopped'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={collectMetrics}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <p className={`text-2xl font-bold ${getStatusColor(metrics.loadTime, { good: 2000, warning: 3000 })}`}>
                {metrics.loadTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-muted-foreground">Load Time</p>
            </div>
            <div className="text-center space-y-1">
              <p className={`text-2xl font-bold ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 75 })}`}>
                {metrics.memoryUsage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Memory Usage</p>
            </div>
            <div className="text-center space-y-1">
              <p className={`text-2xl font-bold ${getStatusColor(metrics.apiResponseTime, { good: 500, warning: 1000 })}`}>
                {metrics.apiResponseTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-muted-foreground">API Response</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {metrics.userSatisfactionScore.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <strong>Performance Issues Detected:</strong>
              {alerts.map((alert, index) => (
                <div key={index} className="text-sm">• {alert}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Core Metrics</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Timing Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Page Load Time</span>
                    <Badge className={getStatusBadge(metrics.loadTime, { good: 2000, warning: 3000 })}>
                      {metrics.loadTime.toFixed(0)}ms
                    </Badge>
                  </div>
                  <Progress value={Math.min((metrics.loadTime / 5000) * 100, 100)} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Render Time</span>
                    <Badge className={getStatusBadge(metrics.renderTime, { good: 1000, warning: 2000 })}>
                      {metrics.renderTime.toFixed(0)}ms
                    </Badge>
                  </div>
                  <Progress value={Math.min((metrics.renderTime / 3000) * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response Time</span>
                    <Badge className={getStatusBadge(metrics.apiResponseTime, { good: 500, warning: 1000 })}>
                      {metrics.apiResponseTime.toFixed(0)}ms
                    </Badge>
                  </div>
                  <Progress value={Math.min((metrics.apiResponseTime / 2000) * 100, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Resource Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Usage</span>
                    <Badge className={getStatusBadge(metrics.memoryUsage, { good: 50, warning: 75 })}>
                      {metrics.memoryUsage.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={metrics.memoryUsage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bundle Size</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {metrics.bundleSize}MB
                    </Badge>
                  </div>
                  <Progress value={(metrics.bundleSize / 5) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cache Hit Rate</span>
                    <Badge className={getStatusBadge(100 - metrics.cacheHitRate, { good: 20, warning: 30 })}>
                      {metrics.cacheHitRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={metrics.cacheHitRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <Badge className={getStatusBadge(metrics.errorRate, { good: 0.5, warning: 1 })}>
                      {metrics.errorRate.toFixed(2)}%
                    </Badge>
                  </div>
                  <Progress value={Math.min(metrics.errorRate * 20, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends (Last 20 measurements)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="loadTime" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Load Time (ms)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="apiResponseTime" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="API Response (ms)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memoryUsage" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Memory Usage (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Optimization Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.loadTime > 3000 && (
                    <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Optimize page load time</p>
                        <p className="text-muted-foreground">Consider lazy loading components and code splitting</p>
                      </div>
                    </div>
                  )}
                  
                  {metrics.memoryUsage > 80 && (
                    <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">High memory usage detected</p>
                        <p className="text-muted-foreground">Check for memory leaks and optimize component cleanup</p>
                      </div>
                    </div>
                  )}

                  {metrics.cacheHitRate < 70 && (
                    <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                      <Wifi className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Improve caching strategy</p>
                        <p className="text-muted-foreground">Implement better caching for frequently used data</p>
                      </div>
                    </div>
                  )}

                  {alerts.length === 0 && (
                    <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Performance looks good!</p>
                        <p className="text-muted-foreground">All metrics are within optimal ranges</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Run Performance Audit
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart Monitoring
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitoringDashboard;
