
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Package, 
  Zap, 
  Database, 
  TrendingUp,
  Settings
} from 'lucide-react';
import BundleAnalysisDashboard from '@/components/performance/BundleAnalysisDashboard';
import PerformanceMonitoringDashboard from '@/components/performance/PerformanceMonitoringDashboard';
import AppErrorBoundary from '@/components/core/AppErrorBoundary';

const PerformanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const getPerformanceScore = () => {
    // Simple performance score calculation
    const loadTime = performance.now();
    let score = 100;
    
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 15;
    
    return Math.max(score, 0);
  };

  const performanceScore = getPerformanceScore();
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor and optimize your application's performance in real-time
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getScoreBadge(performanceScore)}>
                  Performance Score: {performanceScore}/100
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Load Time</p>
                    <p className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                      {performance.now().toFixed(0)}ms
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bundle Size</p>
                    <p className="text-2xl font-bold text-purple-600">2.4MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Memory Usage</p>
                    <p className="text-2xl font-bold text-green-600">64%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Optimization</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {performanceScore >= 90 ? 'Excellent' : performanceScore >= 70 ? 'Good' : 'Needs Work'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="bundle" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Bundle Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Real-time Monitoring</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Performance Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Score</span>
                        <Badge className={getScoreBadge(performanceScore)}>
                          {performanceScore}/100
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Loading Performance</span>
                          <span className="text-green-600">Good</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Bundle Optimization</span>
                          <span className="text-yellow-600">Fair</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Memory Efficiency</span>
                          <span className="text-green-600">Good</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Analyze Bundle Composition
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="h-4 w-4 mr-2" />
                        Run Performance Audit
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="h-4 w-4 mr-2" />
                        Clear Application Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Optimization Tips
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Page load time improved</p>
                        <p className="text-xs text-muted-foreground">
                          Average load time decreased by 15% over the last week
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Bundle size increase detected</p>
                        <p className="text-xs text-muted-foreground">
                          Consider code splitting for better performance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Memory usage optimized</p>
                        <p className="text-xs text-muted-foreground">
                          Component cleanup improvements are working well
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bundle">
              <BundleAnalysisDashboard />
            </TabsContent>

            <TabsContent value="monitoring">
              <PerformanceMonitoringDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppErrorBoundary>
  );
};

export default PerformanceDashboard;
