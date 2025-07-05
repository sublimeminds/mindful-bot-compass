import React, { useState } from 'react';
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
  Settings,
  Shield
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { isAdminUser } from '@/utils/adminUtils';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

const AdminPerformanceDashboard = () => {
  const { user } = useSimpleApp();
  const [isOpen, setIsOpen] = useState(false);
  const [config] = useState({
    enableMetrics: true,
    sampleRate: 1,
    thresholds: {
      renderTime: 16,
      memoryUsage: 80,
      fps: 30,
    }
  });

  const { metrics, warnings, clearWarnings } = usePerformanceMonitor(config);

  // Only show to admin users
  if (!isAdminUser(user)) {
    return null;
  }

  const getPerformanceStatus = () => {
    if (warnings.length > 0) return 'warning';
    if (metrics.renderTime < 16 && metrics.fps > 45 && metrics.memoryUsage < 60) return 'excellent';
    if (metrics.renderTime < 32 && metrics.fps > 30 && metrics.memoryUsage < 80) return 'good';
    return 'needs-attention';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'needs-attention': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const performanceStatus = getPerformanceStatus();

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50"
        aria-label="Open admin performance dashboard"
      >
        <Shield className="h-4 w-4 mr-2" />
        Admin Performance
        {warnings.length > 0 && (
          <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 flex items-center justify-center">
            {warnings.length}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Admin Performance Dashboard
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin Only
              </Badge>
              <Badge className={getStatusColor(performanceStatus)}>
                {performanceStatus === 'excellent' && <CheckCircle className="h-3 w-3 mr-1" />}
                {performanceStatus === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {performanceStatus.replace('-', ' ')}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close admin performance dashboard"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Admin Warning Section */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-purple-800">Admin Performance Tools</h3>
              </div>
              <p className="text-purple-700 text-sm mt-2">
                These performance monitoring tools are only visible to administrators. 
                Regular users cannot see this dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-yellow-800 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Performance Warnings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearWarnings}
                    className="text-yellow-700 hover:text-yellow-900"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-800 flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Overall Health Score */}
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold">
              System Health: {Math.round((1 - metrics.memoryUsage / 100) * 100)}%
            </div>
            <Progress value={Math.max(0, (1 - metrics.memoryUsage / 100) * 100)} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Render Time</p>
                    <p className="text-2xl font-bold">
                      {metrics.renderTime.toFixed(1)}ms
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
                <Progress 
                  value={Math.min((metrics.renderTime / 32) * 100, 100)} 
                  className="mt-2 h-2" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Target: &lt;16ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Memory Usage</p>
                    <p className="text-2xl font-bold">
                      {metrics.memoryUsage.toFixed(1)}%
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
                <Progress 
                  value={metrics.memoryUsage} 
                  className="mt-2 h-2" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Target: &lt;80%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Frame Rate</p>
                    <p className="text-2xl font-bold">
                      {metrics.fps} fps
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <Progress 
                  value={Math.min((metrics.fps / 60) * 100, 100)} 
                  className="mt-2 h-2" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Target: &gt;30fps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cache Hit Rate</p>
                    <p className="text-2xl font-bold">
                      {metrics.cacheHitRate.toFixed(1)}%
                    </p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-orange-500" />
                </div>
                <Progress 
                  value={metrics.cacheHitRate} 
                  className="mt-2 h-2" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Target: &gt;90%
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => window.open('/monitoring', '_blank')}
            >
              Full Monitoring Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerformanceDashboard;
