
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  HardDrive, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Settings
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

const PerformanceDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config] = useState({
    enableMetrics: true,
    sampleRate: 1,
    thresholds: {
      renderTime: 16, // 60fps = 16ms per frame
      memoryUsage: 80, // 80% memory usage
      fps: 30, // minimum acceptable FPS
    }
  });

  const { metrics, warnings, clearWarnings } = usePerformanceMonitor(config);

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
        aria-label="Open performance dashboard"
      >
        <Activity className="h-4 w-4 mr-2" />
        Performance
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
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Performance Dashboard
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(performanceStatus)}>
                {performanceStatus === 'excellent' && <CheckCircle className="h-3 w-3 mr-1" />}
                {performanceStatus === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {performanceStatus.replace('-', ' ')}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close performance dashboard"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
                  <Clock className="h-8 w-8 text-blue-500" />
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
                  <HardDrive className="h-8 w-8 text-purple-500" />
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
                  <Zap className="h-8 w-8 text-green-500" />
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
                  <TrendingUp className="h-8 w-8 text-orange-500" />
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

          {/* Performance Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 text-sm">Improve Render Performance</h4>
                  <p className="text-blue-700 text-xs mt-1">
                    Close unused browser tabs and disable unnecessary browser extensions
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 text-sm">Reduce Memory Usage</h4>
                  <p className="text-purple-700 text-xs mt-1">
                    Clear browser cache and restart the browser if memory usage is high
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 text-sm">Optimize Network</h4>
                  <p className="text-green-700 text-xs mt-1">
                    Use a stable internet connection for the best experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
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

export default PerformanceDashboard;
