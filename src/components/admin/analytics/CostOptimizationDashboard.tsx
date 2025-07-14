import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Lightbulb,
  BarChart3,
  Settings,
  RefreshCw
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

export const CostOptimizationDashboard = () => {
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
      loadDashboardData();
    }
  }, [user, selectedPeriod]);

  const loadDashboardData = async () => {
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
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load cost optimization data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cost Optimization</h1>
          <p className="text-muted-foreground">Monitor AI usage costs and optimize spending</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={loadDashboardData} size="icon" variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium text-orange-800">{alert.message}</p>
                  <p className="text-sm text-orange-600">
                    Current: {alert.type === 'cost_threshold' ? formatCost(alert.current) : alert.current} / 
                    Threshold: {alert.type === 'cost_threshold' ? formatCost(alert.threshold) : alert.threshold}
                  </p>
                </div>
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCost(metrics?.totalCost || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Last {selectedPeriod}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground">
              AI requests made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics?.averageResponseTime || 0)}ms</div>
            <p className="text-xs text-muted-foreground">
              Per request
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
              {Math.round((forecast?.confidence || 0) * 100)}% confidence
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="models">Model Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="forecast">Cost Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Usage Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(metrics?.modelBreakdown || {}).map(([modelId, data]) => {
                const percentage = ((data.cost / (metrics?.totalCost || 1)) * 100);
                return (
                  <div key={modelId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{modelId}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCost(data.cost)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{data.requests} requests</span>
                      <span>{data.tokens.toLocaleString()} tokens</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No optimization recommendations at this time.</p>
                  <p className="text-sm text-muted-foreground">Your usage patterns look optimal!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {rec.potentialSavings > 0 && (
                        <Badge variant="secondary">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Save {formatCost(rec.potentialSavings)}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        Priority {rec.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{rec.description}</p>
                  <div>
                    <p className="font-medium mb-2">Recommended actions:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {rec.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Confidence: {Math.round(rec.confidence * 100)}%
                    </span>
                    <Button size="sm">
                      Apply Recommendation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{formatCost(forecast?.predictedCost || 0)}</div>
                  <p className="text-sm text-muted-foreground">Predicted Monthly Cost</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{(forecast?.predictedUsage || 0).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Predicted Usage</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{Math.round((forecast?.confidence || 0) * 100)}%</div>
                  <p className="text-sm text-muted-foreground">Forecast Confidence</p>
                </div>
              </div>

              {forecast?.modelBreakdown && Object.keys(forecast.modelBreakdown).length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Predicted Model Costs</h4>
                  {Object.entries(forecast.modelBreakdown).map(([modelId, cost]) => (
                    <div key={modelId} className="flex items-center justify-between">
                      <span className="text-sm">{modelId}</span>
                      <span className="text-sm font-medium">{formatCost(cost)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};