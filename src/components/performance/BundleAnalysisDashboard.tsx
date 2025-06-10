
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  Zap, 
  FileText, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BundleAnalysisDashboard = () => {
  const [bundleStats, setBundleStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeBundleComposition();
    bundleAnalyzer.startRuntimeMonitoring();
  }, []);

  const analyzeBundleComposition = async () => {
    setIsAnalyzing(true);
    try {
      const stats = await bundleAnalyzer.analyzeBundleComposition();
      setBundleStats(stats);
      setRecommendations(bundleAnalyzer.getOptimizationRecommendations());
    } catch (error) {
      console.error('Error analyzing bundle:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceScore = () => {
    if (!bundleStats) return 0;
    
    let score = 100;
    
    // Penalize large bundle size
    if (bundleStats.totalSize > 2 * 1024 * 1024) score -= 20;
    if (bundleStats.totalSize > 3 * 1024 * 1024) score -= 30;
    
    // Penalize slow performance
    if (bundleStats.performance.loadTime > 3000) score -= 25;
    if (bundleStats.performance.largestContentfulPaint > 2500) score -= 20;
    
    return Math.max(score, 0);
  };

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

  if (isAnalyzing || !bundleStats) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Analyzing bundle composition...</p>
      </div>
    );
  }

  const chunkData = bundleStats.chunks.map((chunk: any) => ({
    name: chunk.name,
    size: chunk.size,
    sizeFormatted: formatBytes(chunk.size),
    fill: chunk.isAsync ? '#3b82f6' : '#8b5cf6'
  }));

  const dependencyData = bundleStats.dependencies
    .sort((a: any, b: any) => b.size - a.size)
    .slice(0, 10)
    .map((dep: any) => ({
      name: dep.name,
      size: dep.size,
      sizeKB: (dep.size / 1024).toFixed(1)
    }));

  const performanceScore = getPerformanceScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-blue-500" />
              <CardTitle>Bundle Analysis</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getScoreBadge(performanceScore)}>
                Score: {performanceScore}/100
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={analyzeBundleComposition}
                disabled={isAnalyzing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Re-analyze
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-blue-500">
                {formatBytes(bundleStats.totalSize)}
              </p>
              <p className="text-xs text-muted-foreground">Total Size</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-500">
                {formatBytes(bundleStats.gzippedSize)}
              </p>
              <p className="text-xs text-muted-foreground">Gzipped</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-purple-500">
                {bundleStats.chunks.length}
              </p>
              <p className="text-xs text-muted-foreground">Chunks</p>
            </div>
            <div className="text-center space-y-1">
              <p className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                {performanceScore}
              </p>
              <p className="text-xs text-muted-foreground">Performance Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <strong>Optimization Recommendations:</strong>
              {recommendations.map((recommendation, index) => (
                <div key={index} className="text-sm">• {recommendation}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bundle Composition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Bundle Composition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chunkData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="size"
                    label={({ name, sizeFormatted }) => `${name}: ${sizeFormatted}`}
                  >
                    {chunkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatBytes(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Dependencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Largest Dependencies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dependencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} KB`} />
                  <Bar dataKey="size" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Load Time</span>
                <Badge className={bundleStats.performance.loadTime > 3000 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {bundleStats.performance.loadTime.toFixed(0)}ms
                </Badge>
              </div>
              <Progress value={Math.min((bundleStats.performance.loadTime / 5000) * 100, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Parse Time</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {bundleStats.performance.parseTime.toFixed(0)}ms
                </Badge>
              </div>
              <Progress value={Math.min((bundleStats.performance.parseTime / 2000) * 100, 100)} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">First Contentful Paint</span>
                <Badge className={bundleStats.performance.firstContentfulPaint > 1800 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                  {bundleStats.performance.firstContentfulPaint.toFixed(0)}ms
                </Badge>
              </div>
              <Progress value={Math.min((bundleStats.performance.firstContentfulPaint / 3000) * 100, 100)} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Largest Contentful Paint</span>
                <Badge className={bundleStats.performance.largestContentfulPaint > 2500 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {bundleStats.performance.largestContentfulPaint.toFixed(0)}ms
                </Badge>
              </div>
              <Progress value={Math.min((bundleStats.performance.largestContentfulPaint / 4000) * 100, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Optimization Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Optimizations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <TrendingDown className="h-4 w-4 mr-2" />
              Enable Code Splitting
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Tree Shake Dependencies
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Optimize Images
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Enable Lazy Loading
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Compression Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Compression Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Original Size</p>
                <p className="text-xl font-bold">{formatBytes(bundleStats.totalSize)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gzipped Size</p>
                <p className="text-xl font-bold text-green-600">{formatBytes(bundleStats.gzippedSize)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compression Ratio</p>
                <p className="text-xl font-bold text-blue-600">
                  {((1 - bundleStats.gzippedSize / bundleStats.totalSize) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compression Efficiency</span>
                <span>{((1 - bundleStats.gzippedSize / bundleStats.totalSize) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(1 - bundleStats.gzippedSize / bundleStats.totalSize) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BundleAnalysisDashboard;
