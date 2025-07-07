import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Settings, 
  Download, 
  Calendar,
  Target,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused';
  lastGenerated?: string;
  subscribers: number;
}

const AnalyticsReporting = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);

  const keyMetrics: AnalyticsData[] = [
    { name: 'Session Completion Rate', value: 89.2, change: 5.3, trend: 'up' },
    { name: 'User Engagement Score', value: 7.8, change: -0.2, trend: 'down' },
    { name: 'Crisis Response Time', value: 2.1, change: -0.5, trend: 'up' },
    { name: 'Platform Integration Health', value: 94.7, change: 2.1, trend: 'up' },
    { name: 'Data Sync Success Rate', value: 98.5, change: 0.8, trend: 'up' },
    { name: 'Average User Satisfaction', value: 4.6, change: 0.3, trend: 'up' }
  ];

  const reportConfigs: ReportConfig[] = [
    {
      id: 'weekly-summary',
      name: 'Weekly Integration Summary',
      description: 'Comprehensive weekly report on all platform integrations',
      frequency: 'weekly',
      status: 'active',
      lastGenerated: '2 days ago',
      subscribers: 12
    },
    {
      id: 'daily-health',
      name: 'Daily Health Check',
      description: 'Daily status report on integration health and performance',
      frequency: 'daily',
      status: 'active',
      lastGenerated: '6 hours ago',
      subscribers: 8
    },
    {
      id: 'monthly-insights',
      name: 'Monthly Analytics Insights',
      description: 'Deep analysis of user behavior and platform effectiveness',
      frequency: 'monthly',
      status: 'active',
      lastGenerated: '5 days ago',
      subscribers: 15
    },
    {
      id: 'crisis-alerts',
      name: 'Crisis Response Analytics',
      description: 'Analysis of crisis intervention effectiveness across platforms',
      frequency: 'weekly',
      status: 'paused',
      lastGenerated: '1 week ago',
      subscribers: 6
    }
  ];

  const integrationPerformance = [
    { name: 'WhatsApp Business', usage: 85, reliability: 98, satisfaction: 4.7 },
    { name: 'Google Calendar', usage: 72, reliability: 99, satisfaction: 4.5 },
    { name: 'Apple Health', usage: 64, reliability: 94, satisfaction: 4.2 },
    { name: 'Zapier Automations', usage: 58, reliability: 96, satisfaction: 4.4 },
    { name: 'Slack Workspace', usage: 41, reliability: 97, satisfaction: 4.1 },
    { name: 'Microsoft Teams', usage: 33, reliability: 95, satisfaction: 3.9 }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Report Generated",
        description: `${reportConfigs.find(r => r.id === reportId)?.name} has been generated and sent to subscribers.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    toast({
      title: "Download Started",
      description: "Your report is being prepared for download...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics and automated reporting for all your integrations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}{metric.name.includes('Rate') || metric.name.includes('Health') ? '%' : metric.name.includes('Time') ? 's' : ''}
                      </p>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className={`flex items-center mt-2 ${getTrendColor(metric.trend)}`}>
                    <span className="text-sm font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change}
                      {metric.name.includes('Rate') || metric.name.includes('Health') ? '%' : ''}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Real-time Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Integration Usage (24h)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrationPerformance.slice(0, 4).map((integration, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{integration.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={integration.usage} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-12">{integration.usage}%</span>
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
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">System Health</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">User Engagement</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Response Times</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Performance Matrix</CardTitle>
              <CardDescription>
                Detailed performance metrics for all connected platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrationPerformance.map((integration, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {integration.reliability}% reliability
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          ★ {integration.satisfaction}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Usage</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={integration.usage} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{integration.usage}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Reliability</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={integration.reliability} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{integration.reliability}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={integration.satisfaction * 20} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{integration.satisfaction}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportConfigs.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Frequency</p>
                      <p className="font-medium capitalize">{report.frequency}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Subscribers</p>
                      <p className="font-medium">{report.subscribers}</p>
                    </div>
                    {report.lastGenerated && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Last Generated</p>
                        <p className="font-medium">{report.lastGenerated}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isGenerating}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Generate Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Key Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Peak Usage Hours</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Most integrations see peak usage between 6-9 PM, with WhatsApp leading at 85% utilization.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Reliability Improvement</p>
                    <p className="text-sm text-green-700 mt-1">
                      System reliability has improved by 5.3% this month, with reduced downtime across all platforms.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">Integration Opportunities</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Consider adding Telegram integration - 23% of users have requested this feature.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Optimize Response Times</p>
                      <p className="text-sm text-gray-600">
                        WhatsApp response times can be improved by 15% with webhook optimization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Expand Health Integrations</p>
                      <p className="text-sm text-gray-600">
                        Adding Fitbit integration could increase health data coverage by 40%.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Crisis Response Enhancement</p>
                      <p className="text-sm text-gray-600">
                        Implement multi-platform crisis alerts to reduce response time by 30%.
                      </p>
                    </div>
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

export default AnalyticsReporting;