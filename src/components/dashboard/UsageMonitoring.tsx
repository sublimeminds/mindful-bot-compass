import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  AlertCircle,
  Settings,
  RefreshCw,
  Target
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { 
  CostOptimizationService, 
  UsageMetrics, 
  CostForecast, 
  UsageAlert, 
  OptimizationRecommendation 
} from '@/services/costOptimizationService';
import { useToast } from '@/hooks/use-toast';

export const UsageMonitoring = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [forecast, setForecast] = useState<CostForecast | null>(null);
  const [alerts, setAlerts] = useState<UsageAlert[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('month');

  useEffect(() => {
    if (user) {
      loadUsageData();
    }
  }, [user, selectedPeriod]);

  const loadUsageData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [usageMetrics, costForecast, usageAlerts, optimizationRecs] = await Promise.all([
        CostOptimizationService.getUserUsageMetrics(user.id, selectedPeriod),
        CostOptimizationService.generateCostForecast(user.id, 'monthly'),
        CostOptimizationService.checkUsageAlerts(user.id),
        CostOptimizationService.generateOptimizationRecommendations(user.id)
      ]);

      setMetrics(usageMetrics);
      setForecast(costForecast);
      setAlerts(usageAlerts);
      setRecommendations(optimizationRecs);
    } catch (error) {
      console.error('Error loading usage data:', error);
      toast({
        title: "Error",
        description: "Failed to load usage information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const usagePercentage = selectedPeriod === 'month' ? 
    Math.min(100, (metrics?.totalRequests || 0) / 500 * 100) : // Assume 500 monthly limit for display
    Math.min(100, (metrics?.totalRequests || 0) / 50 * 100); // Daily/weekly scaled

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usage Monitoring</h2>
          <p className="text-muted-foreground">Track your AI therapy session usage and costs</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={loadUsageData} size="icon" variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-orange-800">Usage Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="text-sm text-orange-700">
                  {alert.message}
                </div>
              ))}
              {alerts.length > 2 && (
                <p className="text-sm text-orange-600">
                  +{alerts.length - 2} more alerts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalRequests || 0}</div>
            <Progress value={usagePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              This {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCost(metrics?.totalCost || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Average: {formatCost((metrics?.totalCost || 0) / Math.max(1, metrics?.totalRequests || 1))} per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCost(forecast?.predictedCost || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Based on current usage patterns
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="breakdown">Model Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Optimization Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(metrics?.modelBreakdown || {}).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No usage data for this period</p>
                  <p className="text-sm">Start a therapy session to see your usage breakdown</p>
                </div>
              ) : (
                Object.entries(metrics?.modelBreakdown || {}).map(([modelId, data]) => {
                  const percentage = ((data.cost / (metrics?.totalCost || 1)) * 100);
                  const modelName = modelId.includes('opus') ? 'Claude Opus (Premium)' :
                                   modelId.includes('sonnet') ? 'Claude Sonnet (Balanced)' :
                                   modelId.includes('haiku') ? 'Claude Haiku (Fast)' :
                                   modelId.includes('gpt') ? 'GPT-4' : modelId;
                  
                  return (
                    <div key={modelId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{modelName}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCost(data.cost)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{data.requests} sessions</span>
                        <span>{data.tokens.toLocaleString()} tokens</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Great job! Your usage looks optimized.</p>
                  <p className="text-sm text-muted-foreground">We'll notify you if we find ways to improve efficiency.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            recommendations.slice(0, 3).map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    {rec.potentialSavings > 0 && (
                      <Badge variant="secondary">
                        Save {formatCost(rec.potentialSavings)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{rec.description}</p>
                  <div className="space-y-1">
                    {rec.actions.slice(0, 2).map((action, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {action}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};