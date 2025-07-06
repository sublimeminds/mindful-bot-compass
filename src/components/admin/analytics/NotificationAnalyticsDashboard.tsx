import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Bell, AlertTriangle, Users, MessageSquare, Zap, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { smartNotificationTriggerService } from '@/services/smartNotificationTriggerService';
import { crisisDetectionService } from '@/services/crisisDetectionService';

interface NotificationStats {
  totalSent: number;
  deliveryRate: number;
  platformBreakdown: Record<string, number>;
  triggerBreakdown: Record<string, number>;
  recentNotifications: any[];
}

const NotificationAnalyticsDashboard = () => {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [crisisStats, setCrisisStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [notificationStats, triggerAnalytics, crisisAnalytics] = await Promise.all([
        loadNotificationStats(),
        smartNotificationTriggerService.getTriggerAnalytics(),
        crisisDetectionService.getCrisisAnalytics()
      ]);

      setStats(notificationStats);
      setCrisisStats(crisisAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationStats = async (): Promise<NotificationStats> => {
    const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Get notification counts
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    // Get delivery stats
    const { data: deliveries } = await supabase
      .from('notification_deliveries')
      .select('*')
      .gte('created_at', startDate.toISOString());

    const totalSent = notifications?.length || 0;
    const totalDelivered = deliveries?.filter(d => d.status === 'delivered').length || 0;
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

    // Platform breakdown
    const platformBreakdown = deliveries?.reduce((acc, delivery) => {
      const method = delivery.delivery_method || 'unknown';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Trigger breakdown
    const triggerBreakdown = notifications?.reduce((acc, notification) => {
      const type = notification.type || 'manual';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      totalSent,
      deliveryRate,
      platformBreakdown,
      triggerBreakdown,
      recentNotifications: notifications?.slice(0, 10) || []
    };
  };

  const getDateRangeText = () => {
    switch (dateRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 30 days';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Notification Analytics</h1>
          <p className="text-gray-600">Monitor notification performance and user engagement</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as any)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={loadAnalytics} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-therapy-500 mr-2" />
              <span className="text-2xl font-bold">{stats?.totalSent || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{getDateRangeText()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{stats?.deliveryRate.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Successful deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Crisis Interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{crisisStats?.totalInterventions || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{getDateRangeText()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{Object.keys(stats?.platformBreakdown || {}).length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Connected platforms</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
          <TabsTrigger value="triggers">Smart Triggers</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Detection</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
              <CardDescription>Notification delivery by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats?.platformBreakdown || {}).map(([platform, count]) => (
                  <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-therapy-500" />
                      <span className="font-medium capitalize">{platform}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{count}</span>
                      <Badge variant="secondary">
                        {((count / (stats?.totalSent || 1)) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Smart Trigger Performance</CardTitle>
              <CardDescription>Automated notification triggers and their effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats?.triggerBreakdown || {}).map(([trigger, count]) => (
                  <div key={trigger} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium capitalize">{trigger.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{String(count)}</span>
                      <Badge variant="outline">Triggered</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crisis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Detection Analytics</CardTitle>
              <CardDescription>Crisis intervention statistics and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Interventions by Status</h4>
                  <div className="space-y-2">
                    {Object.entries(crisisStats?.byStatus || {}).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="capitalize">{status}</span>
                        <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                           {String(count)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Intervention Types</h4>
                  <div className="space-y-2">
                    {Object.entries(crisisStats?.byType || {}).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                        <Badge variant="outline">{String(count)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest notification activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentNotifications.map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{notification.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationAnalyticsDashboard;