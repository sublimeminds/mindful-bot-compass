
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock,
  Users,
  Zap,
  Eye,
  Target
} from 'lucide-react';

interface AnalyticsData {
  integration_type: string;
  event_name: string;
  success: boolean;
  response_time_ms: number;
  timestamp: string;
}

interface EngagementMetrics {
  date: string;
  integrations_used: string[];
  api_calls_count: number;
  notifications_sent: number;
  notifications_opened: number;
  session_duration_minutes: number;
}

const AnalyticsIntegration = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  const integrationStats = [
    {
      name: 'SMS Integration',
      type: 'sms',
      usage: 85,
      success_rate: 98,
      avg_response_time: 145,
      color: 'bg-blue-500'
    },
    {
      name: 'Health Data Sync',
      type: 'health',
      usage: 72,
      success_rate: 94,
      avg_response_time: 890,
      color: 'bg-red-500'
    },
    {
      name: 'Calendar Sync',
      type: 'calendar',
      usage: 68,
      success_rate: 96,
      avg_response_time: 320,
      color: 'bg-green-500'
    },
    {
      name: 'Video Calls',
      type: 'video',
      usage: 45,
      success_rate: 99,
      avg_response_time: 1200,
      color: 'bg-purple-500'
    },
    {
      name: 'EHR Integration',
      type: 'ehr',
      usage: 35,
      success_rate: 91,
      avg_response_time: 2100,
      color: 'bg-orange-500'
    },
    {
      name: 'Push Notifications',
      type: 'mobile',
      usage: 92,
      success_rate: 97,
      avg_response_time: 89,
      color: 'bg-indigo-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
      generateSampleEngagementData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    try {
      // Mock data until database types are updated
      const mockData: AnalyticsData[] = [
        {
          integration_type: 'sms',
          event_name: 'message_sent',
          success: true,
          response_time_ms: 145,
          timestamp: new Date().toISOString()
        },
        {
          integration_type: 'health',
          event_name: 'data_sync',
          success: true,
          response_time_ms: 890,
          timestamp: new Date().toISOString()
        }
      ];
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const generateSampleEngagementData = async () => {
    // Generate sample engagement data for the last 7 days
    const sampleData: EngagementMetrics[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      sampleData.push({
        date: date.toISOString().split('T')[0],
        integrations_used: ['sms', 'health', 'calendar'].slice(0, Math.floor(Math.random() * 3) + 1),
        api_calls_count: Math.floor(Math.random() * 50) + 10,
        notifications_sent: Math.floor(Math.random() * 20) + 5,
        notifications_opened: Math.floor(Math.random() * 15) + 3,
        session_duration_minutes: Math.floor(Math.random() * 120) + 30
      });
    }
    
    setEngagementData(sampleData);
    setLoading(false);
  };

  const getTotalApiCalls = () => {
    return engagementData.reduce((sum, day) => sum + day.api_calls_count, 0);
  };

  const getAverageSessionDuration = () => {
    const total = engagementData.reduce((sum, day) => sum + day.session_duration_minutes, 0);
    return Math.round(total / engagementData.length);
  };

  const getNotificationOpenRate = () => {
    const totalSent = engagementData.reduce((sum, day) => sum + day.notifications_sent, 0);
    const totalOpened = engagementData.reduce((sum, day) => sum + day.notifications_opened, 0);
    return totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  };

  const getMostUsedIntegrations = () => {
    const integrationCounts: { [key: string]: number } = {};
    
    engagementData.forEach(day => {
      day.integrations_used.forEach(integration => {
        integrationCounts[integration] = (integrationCounts[integration] || 0) + 1;
      });
    });
    
    return Object.entries(integrationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total API Calls</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalApiCalls()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Session Time</p>
                <p className="text-2xl font-bold text-green-600">{getAverageSessionDuration()}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notification Rate</p>
                <p className="text-2xl font-bold text-purple-600">{getNotificationOpenRate()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Integrations</p>
                <p className="text-2xl font-bold text-orange-600">{getMostUsedIntegrations().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Integration Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrationStats.map((stat) => (
            <div key={stat.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <span className="font-medium">{stat.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Success: {stat.success_rate}%</span>
                  <span>Avg: {stat.avg_response_time}ms</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{stat.usage}%</span>
                </div>
                <Progress value={stat.usage} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Engagement Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Weekly Engagement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagementData.map((day, index) => (
              <div key={day.date} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <div className="flex space-x-2">
                    {day.integrations_used.map((integration) => (
                      <Badge key={integration} variant="secondary" className="text-xs">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-gray-600">API Calls</p>
                      <p className="font-medium">{day.api_calls_count}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-gray-600">Session Time</p>
                      <p className="font-medium">{day.session_duration_minutes}m</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-gray-600">Notifications</p>
                      <p className="font-medium">{day.notifications_sent}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-gray-600">Opened</p>
                      <p className="font-medium">{day.notifications_opened}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Used Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Most Used Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getMostUsedIntegrations().map(([integration, count], index) => (
              <div key={integration} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="font-medium capitalize">{integration}</span>
                </div>
                <Badge variant="outline">{count} days</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsIntegration;
