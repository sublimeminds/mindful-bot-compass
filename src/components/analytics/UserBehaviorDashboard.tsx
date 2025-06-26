
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Eye, 
  Clock, 
  MousePointer,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface UserSession {
  id: string;
  userId: string;
  duration: number;
  pages: number;
  actions: number;
  startTime: string;
  device: string;
  location: string;
}

interface BehaviorMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface PageAnalytics {
  page: string;
  views: number;
  avgTime: number;
  bounceRate: number;
  conversions: number;
}

const UserBehaviorDashboard = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [metrics, setMetrics] = useState<BehaviorMetric[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('sessions');

  useEffect(() => {
    loadBehaviorData();
  }, [timeRange]);

  const loadBehaviorData = () => {
    // Mock user behavior data
    const mockSessions: UserSession[] = [
      {
        id: '1',
        userId: 'user1',
        duration: 1245,
        pages: 8,
        actions: 15,
        startTime: '2024-01-25T10:30:00Z',
        device: 'Desktop',
        location: 'US'
      },
      {
        id: '2',
        userId: 'user2',
        duration: 892,
        pages: 5,
        actions: 12,
        startTime: '2024-01-25T11:15:00Z',
        device: 'Mobile',
        location: 'UK'
      },
      {
        id: '3',
        userId: 'user3',
        duration: 2156,
        pages: 12,
        actions: 28,
        startTime: '2024-01-25T14:20:00Z',
        device: 'Tablet',
        location: 'CA'
      }
    ];

    const mockMetrics: BehaviorMetric[] = [
      { name: 'Active Users', value: 1247, change: 15.3, trend: 'up' },
      { name: 'Avg Session Duration', value: 8.5, change: -2.1, trend: 'down' },
      { name: 'Page Views', value: 15680, change: 23.7, trend: 'up' },
      { name: 'Bounce Rate', value: 24.5, change: -5.2, trend: 'down' },
      { name: 'Conversion Rate', value: 12.8, change: 8.4, trend: 'up' },
      { name: 'Engagement Score', value: 87.3, change: 4.6, trend: 'up' }
    ];

    const mockPageAnalytics: PageAnalytics[] = [
      { page: '/dashboard', views: 3456, avgTime: 245, bounceRate: 18.2, conversions: 89 },
      { page: '/mood-tracker', views: 2891, avgTime: 312, bounceRate: 22.1, conversions: 156 },
      { page: '/therapy-chat', views: 2234, avgTime: 478, bounceRate: 15.7, conversions: 234 },
      { page: '/goals', views: 1876, avgTime: 189, bounceRate: 28.4, conversions: 67 },
      { page: '/analytics', views: 1543, avgTime: 356, bounceRate: 31.2, conversions: 43 }
    ];

    setSessions(mockSessions);
    setMetrics(mockMetrics);
    setPageAnalytics(mockPageAnalytics);
  };

  const activityData = [
    { time: '00:00', users: 45 },
    { time: '04:00', users: 23 },
    { time: '08:00', users: 156 },
    { time: '12:00', users: 289 },
    { time: '16:00', users: 345 },
    { time: '20:00', users: 234 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 60, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 5, color: '#F59E0B' }
  ];

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="h-7 w-7 mr-2 text-therapy-600" />
            User Behavior Analytics
          </h2>
          <p className="text-muted-foreground">Comprehensive insights into user engagement and behavior patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.name}
                </CardTitle>
                {getTrendIcon(metric.trend, metric.change)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {typeof metric.value === 'number' && metric.value > 100 
                    ? metric.value.toLocaleString() 
                    : metric.value}
                  {metric.name.includes('Rate') || metric.name.includes('Score') || metric.name.includes('Duration') ? '%' : ''}
                </div>
                <div className={`text-sm flex items-center ${
                  metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="pages">Page Analytics</TabsTrigger>
          <TabsTrigger value="sessions">Session Details</TabsTrigger>
          <TabsTrigger value="devices">Device & Location</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageAnalytics.map((page, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{page.page}</h4>
                      <Badge variant="outline">{page.views.toLocaleString()} views</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Avg Time on Page</div>
                        <div className="font-medium">{formatDuration(page.avgTime)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Bounce Rate</div>
                        <div className="font-medium">{page.bounceRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Conversions</div>
                        <div className="font-medium">{page.conversions}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">User {session.userId}</div>
                      <Badge variant="outline">{session.device}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Duration
                        </div>
                        <div className="font-medium">{formatDuration(session.duration)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Pages
                        </div>
                        <div className="font-medium">{session.pages}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground flex items-center">
                          <MousePointer className="h-3 w-3 mr-1" />
                          Actions
                        </div>
                        <div className="font-medium">{session.actions}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Location</div>
                        <div className="font-medium">{session.location}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <RechartsPieChart data={deviceData} cx="50%" cy="50%" outerRadius={80}>
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: device.color }}
                      ></div>
                      <span className="text-sm">{device.name} ({device.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { country: 'United States', users: 1247, percentage: 45 },
                    { country: 'United Kingdom', users: 890, percentage: 32 },
                    { country: 'Canada', users: 456, percentage: 16 },
                    { country: 'Australia', users: 234, percentage: 8 },
                    { country: 'Germany', users: 189, percentage: 7 }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{location.country}</div>
                        <div className="text-sm text-muted-foreground">{location.users.toLocaleString()} users</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{location.percentage}%</div>
                        <Progress value={location.percentage} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserBehaviorDashboard;
