
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Mail, 
  Bell, 
  MessageSquare, 
  Send,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface NotificationAnalyticsProps {
  dateRange: { from: Date; to: Date };
}

const NotificationAnalytics = ({ dateRange }: NotificationAnalyticsProps) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'timing'>('overview');

  const notificationMetrics = {
    totalSent: 45623,
    delivered: 44981,
    opened: 22490,
    clicked: 6747,
    deliveryRate: 98.6,
    openRate: 50.0,
    clickRate: 30.0
  };

  const typePerformanceData = [
    { type: 'Email', sent: 15420, opened: 9252, clicked: 2776, color: '#3B82F6' },
    { type: 'Push', sent: 18937, opened: 8983, clicked: 2695, color: '#10B981' },
    { type: 'In-App', sent: 11266, opened: 4255, clicked: 1276, color: '#8B5CF6' },
  ];

  const performanceTrends = [
    { date: '2024-01-01', sent: 1240, opened: 620, clicked: 186 },
    { date: '2024-01-02', sent: 1356, opened: 678, clicked: 203 },
    { date: '2024-01-03', sent: 1189, opened: 595, clicked: 178 },
    { date: '2024-01-04', sent: 1467, opened: 733, clicked: 220 },
    { date: '2024-01-05', sent: 1523, opened: 762, clicked: 229 },
    { date: '2024-01-06', sent: 1398, opened: 699, clicked: 210 },
    { date: '2024-01-07', sent: 1245, opened: 623, clicked: 187 },
  ];

  const timingOptimization = [
    { hour: '06:00', openRate: 23.5 },
    { hour: '08:00', openRate: 45.2 },
    { hour: '10:00', openRate: 52.8 },
    { hour: '12:00', openRate: 38.9 },
    { hour: '14:00', openRate: 41.3 },
    { hour: '16:00', openRate: 48.7 },
    { hour: '18:00', openRate: 55.1 },
    { hour: '20:00', openRate: 49.4 },
    { hour: '22:00', openRate: 32.6 },
  ];

  const campaignData = [
    { name: 'Welcome Series', sent: 8940, openRate: 62.3, clickRate: 18.7, status: 'active' },
    { name: 'Session Reminders', sent: 15670, openRate: 45.8, clickRate: 32.1, status: 'active' },
    { name: 'Weekly Check-in', sent: 7823, openRate: 38.9, clickRate: 12.4, status: 'active' },
    { name: 'Goal Achievements', sent: 4521, openRate: 71.2, clickRate: 28.9, status: 'paused' },
    { name: 'App Updates', sent: 8669, openRate: 28.4, clickRate: 8.7, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* View Selection */}
      <div className="flex space-x-4">
        <Button
          variant={selectedView === 'overview' ? 'default' : 'outline'}
          onClick={() => setSelectedView('overview')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={selectedView === 'performance' ? 'default' : 'outline'}
          onClick={() => setSelectedView('performance')}
        >
          <Eye className="h-4 w-4 mr-2" />
          Performance
        </Button>
        <Button
          variant={selectedView === 'timing' ? 'default' : 'outline'}
          onClick={() => setSelectedView('timing')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Timing
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Sent</p>
                <p className="text-2xl font-bold text-white">{notificationMetrics.totalSent.toLocaleString()}</p>
              </div>
              <Send className="h-5 w-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Delivery Rate</p>
                <p className="text-2xl font-bold text-white">{notificationMetrics.deliveryRate}%</p>
              </div>
              <Mail className="h-5 w-5 text-green-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open Rate</p>
                <p className="text-2xl font-bold text-white">{notificationMetrics.openRate}%</p>
              </div>
              <Eye className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">Above Average</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Click Rate</p>
                <p className="text-2xl font-bold text-white">{notificationMetrics.clickRate}%</p>
              </div>
              <MousePointer className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">Good</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Type Performance */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
                    <Bar dataKey="opened" fill="#10B981" name="Opened" />
                    <Bar dataKey="clicked" fill="#8B5CF6" name="Clicked" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignData.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-medium">{campaign.name}</h4>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{campaign.sent.toLocaleString()} sent</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Open: {campaign.openRate}%</div>
                      <div className="text-sm text-gray-400">Click: {campaign.clickRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'performance' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sent" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Sent"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Opened"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicked" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Clicked"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === 'timing' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Optimal Send Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timingOptimization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="openRate" 
                    fill="#3B82F6"
                    name="Open Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationAnalytics;
