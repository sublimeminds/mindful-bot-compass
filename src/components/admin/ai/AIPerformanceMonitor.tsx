import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AIPerformanceMonitor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedModel, setSelectedModel] = useState('all');
  
  // Mock real-time performance data
  const [performanceData, setPerformanceData] = useState({
    responseTime: [
      { time: '00:00', value: 1200 },
      { time: '04:00', value: 980 },
      { time: '08:00', value: 1350 },
      { time: '12:00', value: 1800 },
      { time: '16:00', value: 1650 },
      { time: '20:00', value: 1400 },
    ],
    successRate: [
      { time: '00:00', value: 98.5 },
      { time: '04:00', value: 99.2 },
      { time: '08:00', value: 97.8 },
      { time: '12:00', value: 96.5 },
      { time: '16:00', value: 98.1 },
      { time: '20:00', value: 98.8 },
    ],
    costPerRequest: [
      { time: '00:00', value: 0.045 },
      { time: '04:00', value: 0.038 },
      { time: '08:00', value: 0.052 },
      { time: '12:00', value: 0.067 },
      { time: '16:00', value: 0.059 },
      { time: '20:00', value: 0.048 },
    ],
    modelUsage: [
      { model: 'gpt-4o', requests: 1250, cost: 45.67, avgTime: 1200 },
      { model: 'gpt-4o-mini', requests: 3420, cost: 12.34, avgTime: 800 },
      { model: 'claude-3-sonnet', requests: 890, cost: 67.89, avgTime: 1500 },
      { model: 'claude-3-haiku', requests: 2150, cost: 23.45, avgTime: 650 },
    ]
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentRequests: 47,
    avgResponseTime: 1240,
    successRate: 98.3,
    errorRate: 1.7,
    totalCost: 89.45,
    activeModels: 6
  });

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'warning',
      message: 'Response time spike detected for GPT-4o',
      timestamp: new Date(),
      model: 'gpt-4o'
    },
    {
      id: '2',
      type: 'info',
      message: 'Claude-3-haiku performing above baseline',
      timestamp: new Date(),
      model: 'claude-3-haiku'
    }
  ]);

  useEffect(() => {
    loadPerformanceData();
    const interval = setInterval(updateRealTimeMetrics, 5000);
    return () => clearInterval(interval);
  }, [timeRange, selectedModel]);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load performance data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const updateRealTimeMetrics = () => {
    setRealTimeMetrics(prev => ({
      ...prev,
      currentRequests: Math.floor(Math.random() * 20) + 35,
      avgResponseTime: Math.floor(Math.random() * 400) + 1000,
      successRate: 98 + Math.random() * 2,
      errorRate: Math.random() * 3,
    }));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">AI Performance Monitor</h2>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="claude-3-sonnet">Claude-3 Sonnet</SelectItem>
              <SelectItem value="claude-3-haiku">Claude-3 Haiku</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadPerformanceData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold text-blue-400">{realTimeMetrics.currentRequests}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold text-green-400">{realTimeMetrics.avgResponseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">{realTimeMetrics.successRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-400">{realTimeMetrics.errorRate.toFixed(1)}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-orange-400">${realTimeMetrics.totalCost}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold text-purple-400">{realTimeMetrics.activeModels}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Tabs defaultValue="response-time" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="response-time">Response Time</TabsTrigger>
          <TabsTrigger value="success-rate">Success Rate</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="model-usage">Model Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="response-time">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData.responseTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success-rate">
          <Card>
            <CardHeader>
              <CardTitle>Success Rate Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData.successRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[95, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle>Cost per Request</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData.costPerRequest}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model-usage">
          <Card>
            <CardHeader>
              <CardTitle>Model Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData.modelUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        Model: {alert.model} • {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPerformanceMonitor;