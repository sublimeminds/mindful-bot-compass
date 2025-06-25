
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  Users,
  Zap,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';

interface IntegrationMetric {
  id: string;
  integration_type: string;
  event_name: string;
  success: boolean;
  response_time_ms: number;
  created_at: string;
}

interface IntegrationAnalytics {
  total_events: number;
  success_rate: number;
  average_response_time: number;
  events_last_24h: number;
  top_integrations: { type: string; count: number }[];
  error_rate: number;
}

const AnalyticsIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [analytics, setAnalytics] = useState<IntegrationAnalytics | null>(null);
  const [recentEvents, setRecentEvents] = useState<IntegrationMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Mock integration analytics data until we have the actual table
      const mockMetrics: IntegrationMetric[] = [
        {
          id: '1',
          integration_type: 'whatsapp',
          event_name: 'message_sent',
          success: true,
          response_time_ms: 250,
          created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
        },
        {
          id: '2', 
          integration_type: 'slack',
          event_name: 'notification_sent',
          success: true,
          response_time_ms: 180,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: '3',
          integration_type: 'calendar',
          event_name: 'appointment_sync',
          success: false,
          response_time_ms: 5000,
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        },
        {
          id: '4',
          integration_type: 'sms',
          event_name: 'reminder_sent',
          success: true,
          response_time_ms: 320,
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          id: '5',
          integration_type: 'whatsapp',
          event_name: 'status_check',
          success: true,
          response_time_ms: 150,
          created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
        }
      ];

      if (mockMetrics && mockMetrics.length > 0) {
        // Calculate analytics
        const total_events = mockMetrics.length;
        const successful_events = mockMetrics.filter(m => m.success).length;
        const success_rate = (successful_events / total_events) * 100;
        
        const response_times = mockMetrics
          .filter(m => m.response_time_ms)
          .map(m => m.response_time_ms);
        const average_response_time = response_times.length > 0
          ? response_times.reduce((sum, time) => sum + time, 0) / response_times.length
          : 0;

        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const events_last_24h = mockMetrics.filter(m => 
          new Date(m.created_at) > last24h
        ).length;

        // Calculate top integrations
        const integrationCounts = mockMetrics.reduce((acc, metric) => {
          acc[metric.integration_type] = (acc[metric.integration_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const top_integrations = Object.entries(integrationCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const error_rate = ((total_events - successful_events) / total_events) * 100;

        setAnalytics({
          total_events,
          success_rate,
          average_response_time,
          events_last_24h,
          top_integrations,
          error_rate
        });

        // Set recent events for the table
        setRecentEvents(mockMetrics.slice(0, 10));
      } else {
        setAnalytics({
          total_events: 0,
          success_rate: 0,
          average_response_time: 0,
          events_last_24h: 0,
          top_integrations: [],
          error_rate: 0
        });
        setRecentEvents([]);
      }

    } catch (error) {
      console.error('Error loading integration analytics:', error);
      toast({
        title: "Error Loading Analytics",
        description: "Failed to load integration analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
    toast({
      title: "Analytics Refreshed",
      description: "Integration analytics have been updated"
    });
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
    ) : (
      <div className="w-2 h-2 rounded-full bg-red-500"></div>
    );
  };

  const formatResponseTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
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
      {/* Analytics Overview */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-therapy-900">Integration Analytics</h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-therapy-600" />
              <div>
                <p className="text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold">{analytics?.total_events || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold">{analytics?.success_rate.toFixed(1) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">
                  {formatResponseTime(analytics?.average_response_time || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Last 24h</p>
                <p className="text-2xl font-bold">{analytics?.events_last_24h || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Integrations */}
      <Card className="border-therapy-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-therapy-600" />
            <span>Integration Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics && analytics.top_integrations.length > 0 ? (
            <div className="space-y-4">
              {analytics.top_integrations.map((integration, index) => (
                <div key={integration.type} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium capitalize">
                    {integration.type}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={(integration.count / analytics.total_events) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-gray-600">
                    {integration.count} events
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No integration data available</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card className="border-therapy-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-therapy-600" />
            <span>Recent Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length > 0 ? (
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(event.success)}
                    <div>
                      <p className="font-medium capitalize">{event.integration_type}</p>
                      <p className="text-sm text-gray-600">{event.event_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {formatResponseTime(event.response_time_ms)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent events</p>
          )}
        </CardContent>
      </Card>

      {/* Health Status */}
      {analytics && analytics.error_rate > 10 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">High Error Rate Detected</p>
                <p className="text-sm text-red-600">
                  Current error rate: {analytics.error_rate.toFixed(1)}%. 
                  Consider reviewing your integration configurations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsIntegration;
