import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Bell, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { useRealTimeNotificationTriggers } from '@/hooks/useRealTimeNotificationTriggers';
import { NotificationCleanup } from '@/utils/notificationCleanup';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { toast } from 'sonner';

const NotificationAdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const { triggerTestNotifications } = useRealTimeNotificationTriggers();
  const { user } = useSimpleApp();

  // Fetch notification analytics
  const { data: notificationStats } = useQuery({
    queryKey: ['notification-admin-stats', selectedTimeRange],
    queryFn: async () => {
      const daysBack = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 1;
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .gte('created_at', startDate.toISOString());

      const { data: analytics } = await supabase
        .from('notification_analytics')
        .select('*')
        .gte('created_at', startDate.toISOString());

      return { notifications: notifications || [], analytics: analytics || [] };
    },
    refetchInterval: 30000
  });

  // Fetch routing rules
  const { data: routingRules } = useQuery({
    queryKey: ['notification-routing-rules'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notification_routing_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      return data || [];
    }
  });

  // Calculate metrics
  const metrics = React.useMemo(() => {
    if (!notificationStats) return null;

    const { notifications, analytics } = notificationStats;
    
    const totalNotifications = notifications.length;
    const totalDelivered = analytics.filter(a => a.event_type === 'delivered').length;
    const totalOpened = analytics.filter(a => a.event_type === 'opened').length;
    const totalClicked = analytics.filter(a => a.event_type === 'action_taken').length;

    const deliveryRate = totalNotifications > 0 ? (totalDelivered / totalNotifications) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

    // Group by type
    const byType = notifications.reduce((acc, notif) => {
      const type = notif.type;
      if (!acc[type]) acc[type] = { sent: 0, opened: 0, clicked: 0 };
      acc[type].sent++;
      return acc;
    }, {} as Record<string, any>);

    // Add analytics data
    analytics.forEach(event => {
      const notif = notifications.find(n => n.id === event.notification_id);
      if (notif && byType[notif.type]) {
        if (event.event_type === 'opened') byType[notif.type].opened++;
        if (event.event_type === 'action_taken') byType[notif.type].clicked++;
      }
    });

    // Group by priority
    const byPriority = notifications.reduce((acc, notif) => {
      const priority = notif.priority;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalNotifications,
      deliveryRate: Math.round(deliveryRate),
      openRate: Math.round(openRate),
      clickRate: Math.round(clickRate),
      byType: Object.entries(byType).map(([type, data]) => ({
        type,
        ...data,
        openRate: data.sent > 0 ? Math.round((data.opened / data.sent) * 100) : 0
      })),
      byPriority: Object.entries(byPriority).map(([priority, count]) => ({
        priority,
        count,
        percentage: Math.round((count / totalNotifications) * 100)
      }))
    };
  }, [notificationStats]);

  // Activate notification system
  const activateNotificationSystem = async () => {
    try {
      const result = await NotificationCleanup.activateNotificationSystem();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error activating notification system:', error);
      toast.error('Failed to activate notification system');
    }
  };

  // Initialize complete notification system
  const initializeSystem = async () => {
    try {
      await NotificationCleanup.initializeNotificationSystem();
      if (user) {
        await NotificationCleanup.createSampleRealNotifications(user.id);
      }
      toast.success('Notification system fully initialized!');
    } catch (error) {
      console.error('Error initializing system:', error);
      toast.error('Failed to initialize notification system');
    }
  };

  // Clear mock notifications
  const clearMockNotifications = async () => {
    try {
      await NotificationCleanup.cleanupMockData();
      toast.success('Mock notifications cleared');
    } catch (error) {
      console.error('Error clearing mock notifications:', error);
      toast.error('Failed to clear mock notifications');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notification System Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage intelligent notifications</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={initializeSystem} variant="default">
            <Zap className="w-4 h-4 mr-2" />
            Initialize System
          </Button>
          <Button onClick={activateNotificationSystem} variant="secondary">
            Activate Cron Jobs
          </Button>
          <Button onClick={clearMockNotifications} variant="outline">
            Clear Mock Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalNotifications || 0}</div>
            <p className="text-xs text-muted-foreground">Last {selectedTimeRange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.deliveryRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.openRate || 0}%</div>
            <p className="text-xs text-muted-foreground">User engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.clickRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Action taken</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
          <TabsTrigger value="testing">Testing Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notifications by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications by Type</CardTitle>
                <CardDescription>Performance metrics by notification type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics?.byType || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sent" fill="#8884d8" />
                    <Bar dataKey="opened" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Breakdown by notification priority</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics?.byPriority || []}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {metrics?.byPriority?.map((entry, index) => (
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

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Routing Rules</CardTitle>
              <CardDescription>Configuration for intelligent notification routing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routingRules?.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">Routing Rule {rule.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">Routes {rule.notification_type} notifications</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{rule.notification_type}</Badge>
                        <Badge variant="secondary">Priority: {rule.priority}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Tools</CardTitle>
              <CardDescription>Test notification triggers and system functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => triggerTestNotifications.sessionComplete()}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <CheckCircle className="w-6 h-6 mb-2" />
                  Session Complete
                </Button>
                
                <Button 
                  onClick={() => triggerTestNotifications.moodLogged(2)}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <AlertTriangle className="w-6 h-6 mb-2" />
                  Low Mood Alert
                </Button>
                
                <Button 
                  onClick={() => triggerTestNotifications.goalProgress(75)}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Goal Progress
                </Button>
                
                <Button 
                  onClick={() => triggerTestNotifications.breathingReminder()}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Clock className="w-6 h-6 mb-2" />
                  Breathing Reminder
                </Button>
                
                <Button 
                  onClick={() => triggerTestNotifications.crisisDetection("I feel hopeless")}
                  variant="outline"
                  className="h-20 flex-col border-red-200"
                >
                  <AlertTriangle className="w-6 h-6 mb-2 text-red-500" />
                  Crisis Detection
                </Button>
                
                <Button 
                  onClick={() => triggerTestNotifications.moodLogged(9)}
                  variant="outline"
                  className="h-20 flex-col border-green-200"
                >
                  <CheckCircle className="w-6 h-6 mb-2 text-green-500" />
                  Happy Mood
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationAdminDashboard;