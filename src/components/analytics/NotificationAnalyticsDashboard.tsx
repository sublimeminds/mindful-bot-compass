
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Eye, MousePointer, Bell, Clock, Users, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationAnalyticsService, NotificationMetrics } from '@/services/notificationAnalyticsService';

const NotificationAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<NotificationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user, dateRange]);

  const fetchMetrics = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const range = getDateRange(dateRange);
      const data = await NotificationAnalyticsService.getMetrics(user.id, range);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (range) {
      case '24h':
        start.setHours(start.getHours() - 24);
        break;
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }
    
    return { start, end };
  };

  const formatTypeData = () => {
    if (!metrics) return [];
    return Object.entries(metrics.byType).map(([type, data]) => ({
      name: type.replace('_', ' ').toUpperCase(),
      sent: data.sent,
      viewed: data.viewed,
      clicked: data.clicked,
      rate: data.rate
    }));
  };

  const formatTimeData = () => {
    if (!metrics) return [];
    return Object.entries(metrics.byTimeOfDay).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count
    }));
  };

  const formatDayData = () => {
    if (!metrics) return [];
    return Object.entries(metrics.byDayOfWeek).map(([day, count]) => ({
      day: day.slice(0, 3),
      count
    }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Please sign in to view analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Analytics</h2>
          <p className="text-muted-foreground">Track your notification performance and engagement</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchMetrics} disabled={isLoading} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {metrics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.totalSent}</p>
                    <p className="text-sm text-muted-foreground">Notifications Sent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.viewRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">View Rate</p>
                    <Progress value={metrics.viewRate} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MousePointer className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.clickRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Click Rate</p>
                    <Progress value={metrics.clickRate} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.deliveryRate.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Delivery Rate</p>
                    <Progress value={metrics.deliveryRate} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Notification Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatTypeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                    <Bar dataKey="viewed" fill="#82ca9d" name="Viewed" />
                    <Bar dataKey="clicked" fill="#ffc658" name="Clicked" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity by Time of Day */}
            <Card>
              <CardHeader>
                <CardTitle>Activity by Time of Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Day of Week Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Activity by Day of Week</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formatDayData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performing Types */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formatTypeData()
                    .sort((a, b) => b.rate - a.rate)
                    .slice(0, 5)
                    .map((type, index) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{type.rate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">
                            {type.viewed}/{type.sent}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationAnalyticsDashboard;
