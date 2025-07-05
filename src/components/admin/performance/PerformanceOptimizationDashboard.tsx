import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MemoryStick,
  Gauge
} from 'lucide-react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const PerformanceOptimizationDashboard = () => {
  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate performance report
  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const report = performanceMonitor.generateReport();
      setPerformanceReport(report);
    } catch (error) {
      console.error('Failed to generate performance report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateReport();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(generateReport, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (value: number, threshold: number, isReversed = false) => {
    const isGood = isReversed ? value < threshold : value > threshold;
    return {
      status: isGood ? 'good' : 'warning',
      color: isGood ? 'text-green-600' : 'text-orange-600',
      bgColor: isGood ? 'bg-green-50' : 'bg-orange-50',
      icon: isGood ? CheckCircle : AlertTriangle
    };
  };

  if (!performanceReport) {
    return (
      <SafeComponentWrapper name="PerformanceOptimizationDashboard">
        <div className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Generating performance report...</p>
        </div>
      </SafeComponentWrapper>
    );
  }

  const { summary, slowComponents, memoryLeaks, recommendations } = performanceReport;

  return (
    <SafeComponentWrapper name="PerformanceOptimizationDashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Performance Optimization</h1>
            <p className="text-muted-foreground">
              Monitor and optimize system performance in real-time
            </p>
          </div>
          <Button 
            onClick={generateReport} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-therapy-500 to-calm-500"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Refresh Report
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Metrics */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalMetrics}</div>
                  <p className="text-xs text-muted-foreground">
                    Performance data points collected
                  </p>
                </CardContent>
              </Card>

              {/* Average Render Time */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Render Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.averageRenderTime.toFixed(1)}ms
                  </div>
                  <Badge 
                    variant={summary.averageRenderTime < 50 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {summary.averageRenderTime < 50 ? 'Good' : 'Needs Optimization'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <MemoryStick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(summary.memoryUsage / 1024 / 1024).toFixed(1)}MB
                  </div>
                  <Progress 
                    value={Math.min((summary.memoryUsage / (100 * 1024 * 1024)) * 100, 100)} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              {/* Error Recovery Time */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recovery Time</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.errorRecoveryTime.toFixed(1)}ms
                  </div>
                  <Badge 
                    variant={summary.errorRecoveryTime < 1000 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {summary.errorRecoveryTime < 1000 ? 'Fast' : 'Slow'}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Slow Components Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slowComponents.length > 0 ? (
                  <div className="space-y-3">
                    {slowComponents.map((component: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{component.component}</h4>
                          <p className="text-sm text-muted-foreground">
                            {component.count} renders tracked
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-orange-600">
                            {component.averageTime.toFixed(1)}ms
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Slow
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All Components Performing Well</h3>
                    <p className="text-muted-foreground">No slow components detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5" />
                  Memory Leak Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memoryLeaks.length > 0 ? (
                  <div className="space-y-3">
                    {memoryLeaks.map((leak: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <h4 className="font-medium text-red-800">{leak.component}</h4>
                          <p className="text-sm text-red-600">
                            {leak.instances} instances tracked
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-600">
                            {(leak.leakSize / 1024 / 1024).toFixed(1)}MB
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            Memory Leak
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Memory Leaks Detected</h3>
                    <p className="text-muted-foreground">Memory usage is within normal limits</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-800">{recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">System Optimized</h3>
                    <p className="text-muted-foreground">No performance optimizations needed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SafeComponentWrapper>
  );
};

export default PerformanceOptimizationDashboard;