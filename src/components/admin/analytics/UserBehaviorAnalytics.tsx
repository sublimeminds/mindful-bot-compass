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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Clock, 
  MousePointer, 
  Eye,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

interface UserBehaviorAnalyticsProps {
  dateRange: { from: Date; to: Date };
}

const UserBehaviorAnalytics = ({ dateRange }: UserBehaviorAnalyticsProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'engagement' | 'sessions' | 'features'>('engagement');

  const engagementData = [
    { day: 'Mon', sessions: 145, duration: 28, interactions: 342 },
    { day: 'Tue', sessions: 167, duration: 32, interactions: 389 },
    { day: 'Wed', sessions: 189, duration: 35, interactions: 456 },
    { day: 'Thu', sessions: 203, duration: 31, interactions: 478 },
    { day: 'Fri', sessions: 178, duration: 29, interactions: 412 },
    { day: 'Sat', sessions: 134, duration: 25, interactions: 298 },
    { day: 'Sun', sessions: 121, duration: 22, interactions: 267 },
  ];

  const userJourneyData = [
    { stage: 'Registration', users: 1000, conversion: 100 },
    { stage: 'Onboarding', users: 850, conversion: 85 },
    { stage: 'First Session', users: 680, conversion: 68 },
    { stage: 'Week 1 Active', users: 510, conversion: 51 },
    { stage: 'Month 1 Retained', users: 340, conversion: 34 },
    { stage: 'Month 3 Retained', users: 204, conversion: 20.4 },
  ];

  const featureUsageData = [
    { feature: 'Chat Therapy', usage: 78, color: '#3B82F6' },
    { feature: 'Mood Tracking', usage: 65, color: '#10B981' },
    { feature: 'Goal Setting', usage: 52, color: '#8B5CF6' },
    { feature: 'Notifications', usage: 43, color: '#F59E0B' },
    { feature: 'Analytics', usage: 31, color: '#EF4444' },
  ];

  const sessionDurationDistribution = [
    { range: '0-5 min', count: 145, percentage: 12.3 },
    { range: '5-15 min', count: 289, percentage: 24.5 },
    { range: '15-30 min', count: 456, percentage: 38.7 },
    { range: '30-60 min', count: 234, percentage: 19.8 },
    { range: '60+ min', count: 56, percentage: 4.7 },
  ];

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Metric Selection */}
      <div className="flex space-x-4">
        <Button
          variant={selectedMetric === 'engagement' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('engagement')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Engagement
        </Button>
        <Button
          variant={selectedMetric === 'sessions' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('sessions')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Sessions
        </Button>
        <Button
          variant={selectedMetric === 'features' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('features')}
        >
          <Target className="h-4 w-4 mr-2" />
          Features
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Session Duration</p>
                <p className="text-2xl font-bold text-white">28m 42s</p>
              </div>
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">+12.5%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Daily Active Users</p>
                <p className="text-2xl font-bold text-white">1,847</p>
              </div>
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">+8.3%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bounce Rate</p>
                <p className="text-2xl font-bold text-white">23.1%</p>
              </div>
              <Eye className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-red-400">-3.2%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">User Retention</p>
                <p className="text-2xl font-bold text-white">67.8%</p>
              </div>
              <Target className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">+15.7%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMetric === 'engagement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Engagement Trends */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weekly Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
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
                      dataKey="sessions" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Sessions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Avg Duration (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Journey Funnel */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Journey Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userJourneyData.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{stage.users.toLocaleString()}</span>
                        <Badge variant="outline">{stage.conversion}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stage.conversion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'sessions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Duration Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Session Duration Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionDurationDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="range" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Custom Activity Heatmap */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Activity Heatmap (Hour vs Day)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-25 gap-1 text-xs text-gray-400">
                  <div></div>
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="text-center">
                      {hour % 6 === 0 ? hour : ''}
                    </div>
                  ))}
                </div>
                {dayLabels.map((day, dayIndex) => (
                  <div key={day} className="grid grid-cols-25 gap-1">
                    <div className="text-xs text-gray-400 text-right pr-2">{day}</div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const intensity = Math.floor(Math.random() * 100);
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className="w-4 h-4 rounded-sm cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${intensity / 100})`
                          }}
                          title={`${day} ${hour}:00 - Activity: ${intensity}%`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'features' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Feature Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureUsageData.map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{feature.feature}</span>
                    <Badge variant="outline">{feature.usage}%</Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${feature.usage}%`,
                        backgroundColor: feature.color
                      }}
                    />
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

export default UserBehaviorAnalytics;
