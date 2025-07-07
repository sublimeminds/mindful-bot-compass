import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  Users, 
  Zap,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Eye,
  Target,
  Calendar,
  Filter
} from 'lucide-react';

interface UsageMetric {
  platform: string;
  requests: number;
  success: number;
  errors: number;
  avgResponse: number;
  uptime: number;
}

interface TimeSeriesData {
  time: string;
  requests: number;
  errors: number;
  responseTime: number;
}

const IntegrationAnalytics = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const usageMetrics: UsageMetric[] = [
    { platform: 'WhatsApp Business', requests: 3247, success: 3156, errors: 91, avgResponse: 1.2, uptime: 99.2 },
    { platform: 'Google Calendar', requests: 1834, success: 1821, errors: 13, avgResponse: 0.8, uptime: 99.8 },
    { platform: 'Apple Health', requests: 2156, success: 2089, errors: 67, avgResponse: 2.1, uptime: 97.4 },
    { platform: 'Zapier', requests: 892, success: 876, errors: 16, avgResponse: 3.2, uptime: 98.9 },
    { platform: 'Slack', requests: 567, success: 543, errors: 24, avgResponse: 1.8, uptime: 96.2 },
    { platform: 'Microsoft Teams', requests: 423, success: 415, errors: 8, avgResponse: 1.4, uptime: 99.1 }
  ];

  const timeSeriesData: TimeSeriesData[] = [
    { time: '00:00', requests: 45, errors: 2, responseTime: 1.2 },
    { time: '04:00', requests: 23, errors: 1, responseTime: 1.1 },
    { time: '08:00', requests: 156, errors: 8, responseTime: 1.4 },
    { time: '12:00', requests: 234, errors: 12, responseTime: 1.8 },
    { time: '16:00', requests: 298, errors: 15, responseTime: 2.1 },
    { time: '20:00', requests: 187, errors: 9, responseTime: 1.6 }
  ];

  const platformInsights = [
    {
      platform: 'WhatsApp Business',
      insight: 'Peak usage during evening hours (6-9 PM)',
      recommendation: 'Consider increasing rate limits during peak times',
      impact: 'High',
      status: 'healthy'
    },
    {
      platform: 'Apple Health',
      insight: 'Higher error rate in sync operations (3.1%)',
      recommendation: 'Implement retry mechanism for failed syncs',
      impact: 'Medium',
      status: 'warning'
    },
    {
      platform: 'Slack',
      insight: 'Low adoption rate among users (23%)',
      recommendation: 'Create user education campaign',
      impact: 'Low',
      status: 'info'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated with latest metrics.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being prepared for download...",
    });
  };

  const getSuccessRate = (metric: UsageMetric) => {
    return ((metric.success / metric.requests) * 100).toFixed(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Eye className="h-4 w-4 text-blue-500" />;
    }
  };

  const totalRequests = usageMetrics.reduce((sum, metric) => sum + metric.requests, 0);
  const totalErrors = usageMetrics.reduce((sum, metric) => sum + metric.errors, 0);
  const avgResponseTime = usageMetrics.reduce((sum, metric) => sum + metric.avgResponse, 0) / usageMetrics.length;
  const avgUptime = usageMetrics.reduce((sum, metric) => sum + metric.uptime, 0) / usageMetrics.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Analytics</h1>
          <p className="text-gray-600 mt-2">
            Monitor performance, usage patterns, and insights across all your integrations
          </p>
        </div>
        <div className="flex space-x-2">
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
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {((totalErrors / totalRequests) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-purple-600">{avgResponseTime.toFixed(1)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Avg Uptime</p>
                <p className="text-2xl font-bold text-green-600">{avgUptime.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Platform Performance Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Platform Performance Summary</CardTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      {usageMetrics.map(metric => (
                        <SelectItem key={metric.platform} value={metric.platform}>
                          {metric.platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageMetrics
                  .filter(metric => selectedPlatform === 'all' || metric.platform === selectedPlatform)
                  .map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{metric.platform}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {getSuccessRate(metric)}% success
                        </Badge>
                        <Badge variant="outline">
                          {metric.uptime}% uptime
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Requests</p>
                        <p className="font-semibold text-xl">{metric.requests.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Errors</p>
                        <p className="font-semibold text-xl text-red-600">{metric.errors}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Avg Response</p>
                        <p className="font-semibold text-xl">{metric.avgResponse}s</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Uptime</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={metric.uptime} className="flex-1 h-2" />
                          <span className="font-semibold text-sm">{metric.uptime}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set Performance Alerts
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Reports
                </Button>
                <Button variant="outline" className="justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Request Volume</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeSeriesData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.time}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{data.requests} requests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">{data.errors} errors</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Response Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageMetrics.slice(0, 6).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.platform}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={Math.min((5 - metric.avgResponse) * 20, 100)} className="w-20 h-2" />
                        <span className="text-sm w-12">{metric.avgResponse}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
              <CardDescription>
                Compare your integration performance against industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98.7%</div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xs text-green-600 mt-1">Above benchmark (95%)</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">1.7s</div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-xs text-yellow-600 mt-1">Near benchmark (1.5s)</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.1%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-xs text-green-600 mt-1">Above benchmark (99%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Morning Peak</p>
                      <p className="text-sm text-gray-600">8:00 AM - 10:00 AM</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">156 req/hr</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Evening Peak</p>
                      <p className="text-sm text-gray-600">6:00 PM - 9:00 PM</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">298 req/hr</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Low Usage</p>
                      <p className="text-sm text-gray-600">12:00 AM - 6:00 AM</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">23 req/hr</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Adoption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageMetrics.map((metric, index) => {
                    const adoptionRate = Math.round(Math.random() * 40 + 40); // Mock adoption rate
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.platform}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={adoptionRate} className="w-20 h-2" />
                          <span className="text-sm w-12">{adoptionRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Growing Platforms</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">WhatsApp Business</span>
                      <span className="text-sm text-green-600">+23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Apple Health</span>
                      <span className="text-sm text-green-600">+18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Google Calendar</span>
                      <span className="text-sm text-green-600">+12%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Declining Platforms</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slack</span>
                      <span className="text-sm text-red-600">-8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Microsoft Teams</span>
                      <span className="text-sm text-red-600">-5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {platformInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(insight.status)}
                      <div>
                        <h3 className="font-semibold text-lg">{insight.platform}</h3>
                        <p className="text-sm text-gray-600">{insight.insight}</p>
                      </div>
                    </div>
                    <Badge className={insight.impact === 'High' ? 'bg-red-100 text-red-800' : 
                                   insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-blue-100 text-blue-800'}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm"><strong>Recommendation:</strong> {insight.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Overall System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-900">System Performance</p>
                      <p className="text-sm text-green-700">All integrations operating within normal parameters</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{usageMetrics.length}</div>
                    <p className="text-sm text-gray-600">Active Integrations</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">98.7%</div>
                    <p className="text-sm text-gray-600">Overall Success Rate</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">1.7s</div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationAnalytics;