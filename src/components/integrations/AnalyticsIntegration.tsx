
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react';
import IntegrationMetrics from './IntegrationMetrics';

const AnalyticsIntegration = () => {
  // Mock data for demonstration
  const mockAnalytics = {
    total_events: 156,
    success_rate: 94.2,
    average_response_time: 342,
    events_last_24h: 23,
    top_integrations: [
      { type: 'ehr', count: 67 },
      { type: 'calendar', count: 45 },
      { type: 'mobile', count: 44 }
    ],
    error_rate: 5.8
  };

  const mockEvents = [
    {
      id: '1',
      integration_type: 'ehr',
      event_name: 'patient_sync',
      success: true,
      response_time_ms: 350,
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
    },
    {
      id: '2',
      integration_type: 'calendar',
      event_name: 'appointment_sync',
      success: true,
      response_time_ms: 180,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-therapy-900">Integration Analytics</h2>
      </div>

      <IntegrationMetrics
        totalEvents={mockAnalytics.total_events}
        successRate={mockAnalytics.success_rate}
        averageResponseTime={mockAnalytics.average_response_time}
        eventsLast24h={mockAnalytics.events_last_24h}
      />

      {/* Top Integrations */}
      <Card className="border-therapy-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-therapy-600" />
            <span>Integration Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockAnalytics.top_integrations.length > 0 ? (
            <div className="space-y-4">
              {mockAnalytics.top_integrations.map((integration, index) => (
                <div key={integration.type} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium capitalize">
                    {integration.type}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={(integration.count / mockAnalytics.total_events) * 100} 
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
          {mockEvents.length > 0 ? (
            <div className="space-y-2">
              {mockEvents.map((event) => (
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
      {mockAnalytics.error_rate > 10 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">High Error Rate Detected</p>
                <p className="text-sm text-red-600">
                  Current error rate: {mockAnalytics.error_rate.toFixed(1)}%. 
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
