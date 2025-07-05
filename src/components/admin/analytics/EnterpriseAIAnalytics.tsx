import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Brain, 
  Zap, 
  Globe, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { MultiModelAIRouter } from '@/services/multiModelAiRouter';
import { GlobalEdgeAIService } from '@/services/globalEdgeAiService';

const EnterpriseAIAnalytics = () => {
  const [selectedView, setSelectedView] = useState<'models' | 'edge' | 'costs' | 'quality'>('models');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedView]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const timeRange = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      };

      let data;
      if (selectedView === 'models') {
        data = await MultiModelAIRouter.getModelAnalytics(timeRange);
      } else if (selectedView === 'edge') {
        data = await GlobalEdgeAIService.getEdgeAnalytics(timeRange);
      }
      
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockModelData = {
    'gpt-4.1-2025-04-14': {
      totalRequests: 15420,
      avgResponseTime: 1200,
      successRate: 98.5,
      cost: 4620.50,
      taskBreakdown: { chat: 8200, analysis: 4100, creative: 3120 }
    },
    'claude-opus-4-20250514': {
      totalRequests: 8900,
      avgResponseTime: 1800,
      successRate: 99.2,
      cost: 4450.00,
      taskBreakdown: { chat: 3500, analysis: 3200, crisis: 1200, cultural: 1000 }
    },
    'claude-sonnet-4-20250514': {
      totalRequests: 12300,
      avgResponseTime: 800,
      successRate: 97.8,
      cost: 1230.00,
      taskBreakdown: { chat: 7800, analysis: 4500 }
    }
  };

  const mockEdgeData = {
    totalRequests: 36620,
    averageLatency: 1100,
    cacheHitRate: 35.2,
    successRate: 98.1,
    regionBreakdown: {
      'us-east': { requests: 15200, averageLatency: 950 },
      'us-west': { requests: 12400, averageLatency: 1050 },
      'eu-central': { requests: 6800, averageLatency: 1200 },
      'asia-pacific': { requests: 2220, averageLatency: 1450 }
    }
  };

  const modelPerformanceData = [
    { time: '00:00', gpt41: 1200, claudeOpus: 1800, claudeSonnet: 800 },
    { time: '04:00', gpt41: 1150, claudeOpus: 1750, claudeSonnet: 780 },
    { time: '08:00', gpt41: 1300, claudeOpus: 1900, claudeSonnet: 850 },
    { time: '12:00', gpt41: 1250, claudeOpus: 1850, claudeSonnet: 820 },
    { time: '16:00', gpt41: 1180, claudeOpus: 1780, claudeSonnet: 790 },
    { time: '20:00', gpt41: 1220, claudeOpus: 1820, claudeSonnet: 810 }
  ];

  const costBreakdownData = [
    { name: 'GPT-4.1', value: 4620.50, color: '#3B82F6' },
    { name: 'Claude Opus', value: 4450.00, color: '#10B981' },
    { name: 'Claude Sonnet', value: 1230.00, color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      {/* View Selection */}
      <div className="flex space-x-4">
        <Button
          variant={selectedView === 'models' ? 'default' : 'outline'}
          onClick={() => setSelectedView('models')}
        >
          <Brain className="h-4 w-4 mr-2" />
          AI Models
        </Button>
        <Button
          variant={selectedView === 'edge' ? 'default' : 'outline'}
          onClick={() => setSelectedView('edge')}
        >
          <Globe className="h-4 w-4 mr-2" />
          Edge Performance
        </Button>
        <Button
          variant={selectedView === 'costs' ? 'default' : 'outline'}
          onClick={() => setSelectedView('costs')}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Cost Analysis
        </Button>
        <Button
          variant={selectedView === 'quality' ? 'default' : 'outline'}
          onClick={() => setSelectedView('quality')}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Quality Metrics
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">36.6K</p>
              </div>
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-600">
                +12.3% from last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">1.1s</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-600">
                -5.2% improvement
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.1%</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-600">
                Above target
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold">$10.3K</p>
              </div>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-yellow-600">
                Within budget
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Analytics */}
      {selectedView === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={modelPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="gpt41" 
                      stroke="#3B82F6" 
                      name="GPT-4.1"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="claudeOpus" 
                      stroke="#10B981" 
                      name="Claude Opus"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="claudeSonnet" 
                      stroke="#8B5CF6" 
                      name="Claude Sonnet"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Usage Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockModelData).map(([modelId, data]) => (
                  <div key={modelId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{modelId.split('-')[0].toUpperCase()}</span>
                      <div className="text-right">
                        <div className="text-sm">{data.totalRequests.toLocaleString()} requests</div>
                        <div className="text-xs text-muted-foreground">{data.successRate}% success</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${(data.totalRequests / 36620) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edge Analytics */}
      {selectedView === 'edge' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Edge Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cache Hit Rate</span>
                    <div className="text-2xl font-bold text-green-600">35.2%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Latency</span>
                    <div className="text-2xl font-bold">1.1s</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(mockEdgeData.regionBreakdown).map(([region, data]) => (
                    <div key={region} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{region.replace('-', ' ').toUpperCase()}</h4>
                        <p className="text-sm text-muted-foreground">{data.requests.toLocaleString()} requests</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{data.averageLatency}ms</div>
                        <div className="text-xs text-muted-foreground">avg latency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(mockEdgeData.regionBreakdown).map(([region, data]) => ({
                        name: region.replace('-', ' ').toUpperCase(),
                        value: data.requests,
                        color: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][Object.keys(mockEdgeData.regionBreakdown).indexOf(region)]
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {Object.entries(mockEdgeData.regionBreakdown).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cost Analysis */}
      {selectedView === 'costs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown by Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: $${value.toFixed(0)}`}
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockModelData).map(([modelId, data]) => (
                  <div key={modelId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{modelId.split('-')[0].toUpperCase()}</span>
                      <div className="text-right">
                        <div className="text-sm">${data.cost.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          ${(data.cost / data.totalRequests).toFixed(4)} per request
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.totalRequests.toLocaleString()} requests • {data.avgResponseTime}ms avg
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quality Metrics */}
      {selectedView === 'quality' && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Quality & Safety Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Response Quality</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Therapeutic Value</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">User Satisfaction</span>
                      <span className="text-sm font-medium">91.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Clinical Accuracy</span>
                      <span className="text-sm font-medium">96.5%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Safety Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Content Safety</span>
                      <span className="text-sm font-medium">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Crisis Detection</span>
                      <span className="text-sm font-medium">98.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bias Detection</span>
                      <span className="text-sm font-medium">97.3%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Cultural Adaptation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cultural Sensitivity</span>
                      <span className="text-sm font-medium">93.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Language Accuracy</span>
                      <span className="text-sm font-medium">95.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Context Awareness</span>
                      <span className="text-sm font-medium">92.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnterpriseAIAnalytics;