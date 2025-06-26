
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

const AdvancedAnalyticsDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const metricCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: '2,847',
      change: 12.5,
      trend: 'up',
      icon: <Users className="h-4 w-4" />
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: 8.2,
      trend: 'up',
      icon: <Activity className="h-4 w-4" />
    },
    {
      title: 'Avg Session Duration',
      value: '24m 35s',
      change: -2.1,
      trend: 'down',
      icon: <Clock className="h-4 w-4" />
    },
    {
      title: 'Goal Completion Rate',
      value: '87.3%',
      change: 5.7,
      trend: 'up',
      icon: <Target className="h-4 w-4" />
    }
  ];

  const sessionData = [
    { month: 'Jan', sessions: 1200, newUsers: 150, retention: 78 },
    { month: 'Feb', sessions: 1400, newUsers: 180, retention: 82 },
    { month: 'Mar', sessions: 1600, newUsers: 220, retention: 85 },
    { month: 'Apr', sessions: 1350, newUsers: 190, retention: 79 },
    { month: 'May', sessions: 1800, newUsers: 250, retention: 88 },
    { month: 'Jun', sessions: 2100, newUsers: 300, retention: 91 }
  ];

  const userEngagementData = [
    { name: 'Daily Active', value: 1234 },
    { name: 'Weekly Active', value: 2456 },
    { name: 'Monthly Active', value: 3678 },
    { name: 'Churned', value: 234 }
  ];

  const moodTrendData = [
    { week: 'Week 1', average: 6.2, anxiety: 4.1, stress: 5.3 },
    { week: 'Week 2', average: 6.8, anxiety: 3.8, stress: 4.9 },
    { week: 'Week 3', average: 7.1, anxiety: 3.5, stress: 4.2 },
    { week: 'Week 4', average: 7.4, anxiety: 3.2, stress: 3.8 }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated.",
    });
  };

  const exportData = (format: 'csv' | 'pdf') => {
    toast({
      title: "Export Started",
      description: `Exporting analytics data as ${format.toUpperCase()}...`,
    });
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', change: number) => {
    if (trend === 'stable') return 'text-gray-400';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={() => exportData('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastUpdated.toLocaleString()}</span>
        </div>
        <Badge variant="outline" className="text-green-600">
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-therapy-100 rounded">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${getTrendColor(metric.trend, metric.change)}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="sessions">Session Analytics</TabsTrigger>
          <TabsTrigger value="mood">Mood Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sessions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userEngagementData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth & Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="New Users" />
                  <Line type="monotone" dataKey="retention" stroke="#82ca9d" name="Retention %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Wellness Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={moodTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="average" stroke="#8884d8" name="Average Mood" />
                  <Line type="monotone" dataKey="anxiety" stroke="#ff7300" name="Anxiety Level" />
                  <Line type="monotone" dataKey="stress" stroke="#ff0000" name="Stress Level" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
