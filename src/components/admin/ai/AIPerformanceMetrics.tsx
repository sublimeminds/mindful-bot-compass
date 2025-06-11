
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Clock, DollarSign, Activity, Zap, Target, AlertCircle, CheckCircle } from 'lucide-react';

const AIPerformanceMetrics = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedModel, setSelectedModel] = useState('all');

  const [performanceData] = useState({
    responseTime: {
      current: 1.2,
      previous: 1.4,
      trend: 'improving',
      target: 1.0
    },
    throughput: {
      current: 847,
      previous: 782,
      trend: 'improving',
      target: 1000
    },
    errorRate: {
      current: 0.2,
      previous: 0.4,
      trend: 'improving',
      target: 0.1
    },
    cost: {
      current: 234.50,
      previous: 298.20,
      trend: 'improving',
      target: 200.00
    }
  });

  const [modelMetrics] = useState([
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      status: 'healthy',
      responseTime: 1.1,
      accuracy: 87.3,
      throughput: 623,
      costPerRequest: 0.12,
      uptime: 99.8,
      lastIncident: 'None',
      alerts: 0
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      status: 'healthy',
      responseTime: 2.7,
      accuracy: 92.1,
      throughput: 224,
      costPerRequest: 0.45,
      uptime: 99.9,
      lastIncident: 'None',
      alerts: 0
    }
  ]);

  const [systemHealth] = useState([
    { component: 'API Gateway', status: 'healthy', uptime: 99.9, responseTime: 45 },
    { component: 'Model Servers', status: 'healthy', uptime: 99.8, responseTime: 120 },
    { component: 'Database', status: 'healthy', uptime: 100, responseTime: 15 },
    { component: 'Cache Layer', status: 'warning', uptime: 98.5, responseTime: 8 },
    { component: 'Load Balancer', status: 'healthy', uptime: 100, responseTime: 5 }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-orange-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'improving' ? 'text-green-400' : 'text-red-400';
  };

  const formatTrendIcon = (current: number, previous: number) => {
    return current < previous ? '↗' : '↘';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-400">{performanceData.responseTime.current}s</p>
                <p className={`text-xs ${getTrendColor(performanceData.responseTime.trend)}`}>
                  {formatTrendIcon(performanceData.responseTime.current, performanceData.responseTime.previous)} 
                  {Math.abs(((performanceData.responseTime.current - performanceData.responseTime.previous) / performanceData.responseTime.previous * 100)).toFixed(1)}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Target: {performanceData.responseTime.target}s</span>
              </div>
              <Progress value={(performanceData.responseTime.target / performanceData.responseTime.current) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Requests/Hour</p>
                <p className="text-2xl font-bold text-green-400">{performanceData.throughput.current}</p>
                <p className={`text-xs ${getTrendColor(performanceData.throughput.trend)}`}>
                  {formatTrendIcon(performanceData.throughput.current, performanceData.throughput.previous)} 
                  {Math.abs(((performanceData.throughput.current - performanceData.throughput.previous) / performanceData.throughput.previous * 100)).toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Target: {performanceData.throughput.target}/hr</span>
              </div>
              <Progress value={(performanceData.throughput.current / performanceData.throughput.target) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Error Rate</p>
                <p className="text-2xl font-bold text-orange-400">{performanceData.errorRate.current}%</p>
                <p className={`text-xs ${getTrendColor(performanceData.errorRate.trend)}`}>
                  {formatTrendIcon(performanceData.errorRate.previous, performanceData.errorRate.current)} 
                  {Math.abs(((performanceData.errorRate.current - performanceData.errorRate.previous) / performanceData.errorRate.previous * 100)).toFixed(1)}%
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-400" />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Target: &lt;{performanceData.errorRate.target}%</span>
              </div>
              <Progress value={100 - (performanceData.errorRate.current / performanceData.errorRate.target) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Daily Cost</p>
                <p className="text-2xl font-bold text-purple-400">${performanceData.cost.current}</p>
                <p className={`text-xs ${getTrendColor(performanceData.cost.trend)}`}>
                  {formatTrendIcon(performanceData.cost.previous, performanceData.cost.current)} 
                  {Math.abs(((performanceData.cost.current - performanceData.cost.previous) / performanceData.cost.previous * 100)).toFixed(1)}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Budget: ${performanceData.cost.target}</span>
              </div>
              <Progress value={(performanceData.cost.target / performanceData.cost.current) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance Breakdown */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Individual Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modelMetrics.map((model) => (
              <div key={model.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(model.status)}
                    <div>
                      <h3 className="text-white font-medium">{model.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(model.status)}`}>
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Uptime</p>
                    <p className="text-sm font-medium text-green-400">{model.uptime}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Response Time</p>
                    <p className="text-white font-medium">{model.responseTime}s</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Accuracy</p>
                    <p className="text-white font-medium">{model.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Throughput</p>
                    <p className="text-white font-medium">{model.throughput}/hr</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Cost/Request</p>
                    <p className="text-white font-medium">${model.costPerRequest}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Active Alerts</p>
                    <p className="text-white font-medium">{model.alerts}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(component.status)}
                  <span className="text-white font-medium">{component.component}</span>
                  <Badge className={`text-xs ${getStatusColor(component.status)}`}>
                    {component.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Uptime</p>
                    <p className="text-white font-medium">{component.uptime}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Response Time</p>
                    <p className="text-white font-medium">{component.responseTime}ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPerformanceMetrics;
