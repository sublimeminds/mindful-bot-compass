
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  Zap,
  Info,
  AlertCircle
} from 'lucide-react';
import { cacheService, sessionCache, userCache, apiCache } from '@/services/cachingService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CacheInstance {
  name: string;
  instance: typeof cacheService;
  color: string;
}

const CacheManagementDashboard = () => {
  const [selectedCache, setSelectedCache] = useState<CacheInstance | null>(null);
  const [cacheMetrics, setCacheMetrics] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cacheInstances: CacheInstance[] = [
    { name: 'Main Cache', instance: cacheService, color: '#8b5cf6' },
    { name: 'Session Cache', instance: sessionCache, color: '#3b82f6' },
    { name: 'User Cache', instance: userCache, color: '#10b981' },
    { name: 'API Cache', instance: apiCache, color: '#f59e0b' }
  ];

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = () => {
    setIsRefreshing(true);
    
    const metrics = cacheInstances.map(cache => ({
      name: cache.name,
      ...cache.instance.getMetrics(),
      color: cache.color,
      statistics: cache.instance.getStatistics()
    }));

    setCacheMetrics(metrics);
    
    if (!selectedCache && metrics.length > 0) {
      setSelectedCache(cacheInstances[0]);
    }
    
    setIsRefreshing(false);
  };

  const clearCache = (cacheInstance: typeof cacheService) => {
    cacheInstance.clear();
    refreshMetrics();
  };

  const clearAllCaches = () => {
    cacheInstances.forEach(cache => cache.instance.clear());
    refreshMetrics();
  };

  const getHitRateColor = (hitRate: number) => {
    if (hitRate >= 80) return 'text-green-600';
    if (hitRate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHitRateBadge = (hitRate: number) => {
    if (hitRate >= 80) return 'bg-green-100 text-green-800';
    if (hitRate >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const totalCacheSize = cacheMetrics.reduce((sum, cache) => sum + cache.size, 0);
  const totalMaxSize = cacheMetrics.reduce((sum, cache) => sum + cache.maxSize, 0);
  const averageHitRate = cacheMetrics.length > 0 
    ? cacheMetrics.reduce((sum, cache) => sum + cache.hitRate, 0) / cacheMetrics.length 
    : 0;

  const pieData = cacheMetrics.map(cache => ({
    name: cache.name,
    value: cache.size,
    fill: cache.color
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-500" />
              <CardTitle>Cache Management</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshMetrics}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearAllCaches}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-blue-500">{totalCacheSize}</p>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
            <div className="text-center space-y-1">
              <p className={`text-2xl font-bold ${getHitRateColor(averageHitRate)}`}>
                {averageHitRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Hit Rate</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-purple-500">
                {((totalCacheSize / totalMaxSize) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Capacity Used</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-500">{cacheInstances.length}</p>
              <p className="text-xs text-muted-foreground">Cache Instances</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Performance Alert */}
      {averageHitRate < 60 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Low cache hit rate detected!</strong> Consider reviewing your caching strategy to improve performance.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instances">Instances</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cache Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hit Rate Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cacheMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hitRate" fill="#8b5cf6" name="Hit Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cacheMetrics.map((cache, index) => (
              <Card key={cache.name}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{cache.name}</h4>
                      <Badge className={getHitRateBadge(cache.hitRate)}>
                        {cache.hitRate.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Size:</span>
                        <span>{cache.size}/{cache.maxSize}</span>
                      </div>
                      <Progress value={(cache.size / cache.maxSize) * 100} className="h-2" />
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Hits:</span>
                        <span>{cache.hits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Misses:</span>
                        <span>{cache.misses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Evictions:</span>
                        <span>{cache.evictions}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          {cacheMetrics.map((cache, index) => {
            const cacheInstance = cacheInstances[index];
            return (
              <Card key={cache.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" style={{ color: cache.color }} />
                      <span>{cache.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getHitRateBadge(cache.hitRate)}>
                        {cache.hitRate.toFixed(1)}% hit rate
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => clearCache(cacheInstance.instance)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Entries</p>
                      <p className="text-xl font-bold">{cache.size}/{cache.maxSize}</p>
                      <Progress value={(cache.size / cache.maxSize) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-xl font-bold">{cache.totalRequests}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cache Hits</p>
                      <p className="text-xl font-bold text-green-600">{cache.hits}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cache Misses</p>
                      <p className="text-xl font-bold text-red-600">{cache.misses}</p>
                    </div>
                  </div>

                  {cache.statistics.mostPopular.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Most Popular Entries</h5>
                      <div className="space-y-1">
                        {cache.statistics.mostPopular.slice(0, 3).map((entry: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="truncate mr-2">{entry.key}</span>
                            <span className="text-muted-foreground">{entry.hits} hits</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Cache Performance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Overall Efficiency</p>
                    <p className={`text-3xl font-bold ${getHitRateColor(averageHitRate)}`}>
                      {averageHitRate > 80 ? 'Excellent' : averageHitRate > 60 ? 'Good' : 'Poor'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {averageHitRate.toFixed(1)}% average hit rate
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Memory Usage</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {((totalCacheSize / totalMaxSize) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {totalCacheSize} of {totalMaxSize} entries
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Total Evictions</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {cacheMetrics.reduce((sum, cache) => sum + cache.evictions, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Across all caches
                    </p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cacheMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hits" fill="#10b981" name="Hits" />
                      <Bar dataKey="misses" fill="#ef4444" name="Misses" />
                      <Bar dataKey="evictions" fill="#f59e0b" name="Evictions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={clearAllCaches}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Caches
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Metrics
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Optimize Cache Sizes
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Adjust TTL Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Cache Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium">Optimal Hit Rate</p>
                    <p className="text-muted-foreground">Aim for 80%+ hit rate for best performance</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium">Memory Management</p>
                    <p className="text-muted-foreground">Keep cache usage below 90% to prevent evictions</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium">TTL Strategy</p>
                    <p className="text-muted-foreground">Shorter TTL for dynamic data, longer for static content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CacheManagementDashboard;
