import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  scheduled_for?: string;
}

interface NotificationDelivery {
  id: string;
  delivery_method: string;
  status: string;
  delivered_at?: string;
  clicked_at?: string;
  error_message?: string;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deliveries, setDeliveries] = useState<Record<string, NotificationDelivery[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'crisis' | 'therapy'>('all');

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    setupRealtimeSubscription();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data: notificationData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (notificationData) {
        const mappedNotifications = notificationData.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          data: n.data as Record<string, any>,
          read: n.is_read,
          priority: n.priority as 'low' | 'medium' | 'high',
          created_at: n.created_at,
          scheduled_for: n.scheduled_for
        }));
        setNotifications(mappedNotifications);
        
        // Fetch delivery info for each notification
        const deliveryPromises = notificationData.map(async (notification) => {
          const { data: deliveryData } = await supabase
            .from('notification_deliveries')
            .select('*')
            .eq('notification_id', notification.id);
          
          return { notificationId: notification.id, deliveries: deliveryData || [] };
        });

        const deliveryResults = await Promise.all(deliveryPromises);
        const deliveryMap = deliveryResults.reduce((acc, result) => {
          acc[result.notificationId] = result.deliveries;
          return acc;
        }, {} as Record<string, NotificationDelivery[]>);

        setDeliveries(deliveryMap);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => 
          prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (!error) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (!error) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (type === 'crisis_alert') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (priority === 'high') return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    if (type === 'goal_achievement') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getDeliveryStatus = (notificationId: string) => {
    const notificationDeliveries = deliveries[notificationId] || [];
    if (notificationDeliveries.length === 0) return null;

    const delivered = notificationDeliveries.filter(d => d.status === 'delivered').length;
    const failed = notificationDeliveries.filter(d => d.status === 'failed').length;
    const total = notificationDeliveries.length;

    return (
      <div className="flex gap-1 text-xs text-gray-500">
        <span>Sent via {total} platform{total > 1 ? 's' : ''}</span>
        {failed > 0 && <span className="text-red-500">({failed} failed)</span>}
      </div>
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'crisis': return notification.type.includes('crisis');
      case 'therapy': return notification.type.includes('therapy') || notification.type.includes('session');
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="crisis">Crisis</TabsTrigger>
            <TabsTrigger value="therapy">Therapy</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-6">
            <ScrollArea className="h-[600px]">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        !notification.read 
                          ? 'border-blue-200 bg-blue-50/50 shadow-sm' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">
                                {notification.message}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                              {getDeliveryStatus(notification.id)}
                            </div>
                            
                            {notification.data?.url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a 
                                  href={notification.data.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Open
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;