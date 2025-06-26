
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  Award,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  FileText,
  Brain
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  target: number;
  unit: string;
  category: 'revenue' | 'users' | 'engagement' | 'performance';
}

interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
  churn: number;
}

interface UserGrowth {
  period: string;
  newUsers: number;
  activeUsers: number;
  retainedUsers: number;
}

const BusinessIntelligenceDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    loadBusinessData();
  }, [selectedPeriod]);

  const loadBusinessData = () => {
    // Mock business intelligence data
    const mockMetrics: BusinessMetric[] = [
      {
        id: '1',
        name: 'Monthly Recurring Revenue',
        value: 127500,
        change: 15.3,
        target: 150000,
        unit: '$',
        category: 'revenue'
      },
      {
        id: '2',
        name: 'Active Subscribers',
        value: 2847,
        change: 8.7,
        target: 3000,
        unit: '',
        category: 'users'
      },
      {
        id: '3',
        name: 'Customer Acquisition Cost',
        value: 45,
        change: -12.3,
        target: 40,
        unit: '$',
        category: 'performance'
      },
      {
        id: '4',
        name: 'Customer Lifetime Value',
        value: 1250,
        change: 22.1,
        target: 1500,
        unit: '$',
        category: 'revenue'
      },
      {
        id: '5',
        name: 'Churn Rate',
        value: 3.2,
        change: -1.8,
        target: 2.5,
        unit: '%',
        category: 'users'
      },
      {
        id: '6',
        name: 'Session Engagement',
        value: 87.5,
        change: 5.4,
        target: 90,
        unit: '%',
        category: 'engagement'
      }
    ];

    const mockRevenueData: RevenueData[] = [
      { month: 'Jan', revenue: 95000, subscriptions: 2100, churn: 4.2 },
      { month: 'Feb', revenue: 102000, subscriptions: 2250, churn: 3.8 },
      { month: 'Mar', revenue: 108000, subscriptions: 2400, churn: 3.5 },
      { month: 'Apr', revenue: 115000, subscriptions: 2600, churn: 3.1 },
      { month: 'May', revenue: 121000, subscriptions: 2750, churn: 2.9 },
      { month: 'Jun', revenue: 127500, subscriptions: 2847, churn: 3.2 }
    ];

    const mockUserGrowth: UserGrowth[] = [
      { period: 'Week 1', newUsers: 145, activeUsers: 2100, retainedUsers: 1890 },
      { period: 'Week 2', newUsers: 167, activeUsers: 2250, retainedUsers: 2025 },
      { period: 'Week 3', newUsers: 189, activeUsers: 2400, retainedUsers: 2160 },
      { period: 'Week 4', newUsers: 203, activeUsers: 2600, retainedUsers: 2340 }
    ];

    setMetrics(mockMetrics);
    setRevenueData(mockRevenueData);
    setUserGrowth(mockUserGrowth);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'users': return Users;
      case 'engagement': return Target;
      case 'performance': return Zap;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-green-600';
      case 'users': return 'text-blue-600';
      case 'engagement': return 'text-purple-600';
      case 'performance': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$' && value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `${unit}${value.toLocaleString()}`;
  };

  const exportReport = () => {
    toast({
      title: "Report Generated",
      description: "Business intelligence report has been generated and downloaded.",
    });
  };

  const generateInsights = () => {
    toast({
      title: "AI Insights Generated",
      description: "AI-powered business insights have been generated based on current data.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart3 className="h-7 w-7 mr-2 text-therapy-600" />
            Business Intelligence Dashboard
          </h2>
          <p className="text-muted-foreground">Comprehensive business analytics and performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button onClick={generateInsights} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const IconComponent = getCategoryIcon(metric.category);
          const progress = (metric.value / metric.target) * 100;
          
          return (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </CardTitle>
                  <IconComponent className={`h-5 w-5 ${getCategoryColor(metric.category)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className={`flex items-center ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        metric.change < 0 ? 'transform rotate-180' : ''
                      }`} />
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </div>
                    <div className="text-muted-foreground">
                      Target: {formatValue(metric.target, metric.unit)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress to Target</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      fill="#10B981"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="subscriptions" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Subscriptions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="churn" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Churn Rate (%)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="newUsers" fill="#10B981" name="New Users" />
                  <Bar dataKey="activeUsers" fill="#3B82F6" name="Active Users" />
                  <Bar dataKey="retainedUsers" fill="#8B5CF6" name="Retained Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Customer Satisfaction', current: 4.7, target: 4.8, max: 5 },
                    { name: 'Response Time', current: 245, target: 200, max: 500, unit: 'ms' },
                    { name: 'Uptime', current: 99.8, target: 99.9, max: 100, unit: '%' },
                    { name: 'Feature Adoption', current: 76, target: 80, max: 100, unit: '%' }
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{metric.name}</span>
                        <span>{metric.current}{metric.unit || ''}</span>
                      </div>
                      <Progress 
                        value={(metric.current / metric.max) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        Target: {metric.target}{metric.unit || ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Support Tickets', value: 89, status: 'resolved', color: 'green' },
                    { name: 'Bug Reports', value: 12, status: 'pending', color: 'yellow' },
                    { name: 'Feature Requests', value: 34, status: 'in progress', color: 'blue' },
                    { name: 'System Alerts', value: 3, status: 'critical', color: 'red' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <Badge 
                          variant="outline" 
                          className={`text-${item.color}-600 border-${item.color}-300`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Forecasting</h3>
                <p className="text-muted-foreground">
                  Advanced predictive analytics and revenue forecasting models
                </p>
                <Button className="mt-4" onClick={generateInsights}>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Forecast
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligenceDashboard;
