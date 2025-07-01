import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck,
  Heart,
  Target,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationService';

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session_reminder': return <Calendar className="h-4 w-4 text-therapy-600" />;
      case 'milestone_achieved': return <Award className="h-4 w-4 text-balance-600" />;
      case 'insight_generated': return <TrendingUp className="h-4 w-4 text-flow-600" />;
      case 'mood_check': return <Heart className="h-4 w-4 text-harmony-600" />;
      case 'progress_update': return <Target className="h-4 w-4 text-calm-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50';
      case 'medium': return 'border-l-therapy-500 bg-therapy-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'session_reminder': return 'Session Reminder';
      case 'milestone_achieved': return 'Milestone';
      case 'insight_generated': return 'Insight';
      case 'mood_check': return 'Mood Check';
      case 'progress_update': return 'Progress Update';
      default: return 'Notification';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.isRead;
      case 'read': return notification.isRead;
      default: return true;
    }
  });

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-therapy-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
            <p className="text-gray-600">Stay updated with your therapy progress and reminders</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="border-therapy-200 text-therapy-700 hover:bg-therapy-50"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-sm opacity-90">Total Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-harmony-500 to-balance-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BellOff className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm opacity-90">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-flow-500 to-therapy-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
                <p className="text-sm opacity-90">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && <Badge className="ml-1 bg-therapy-500">{unreadCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-sm">
                {filter === 'unread' ? "You're all caught up! No unread notifications." : 
                 filter === 'read' ? "No read notifications yet." :
                 "No notifications yet. They'll appear here when you have updates."}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2 p-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md",
                      getPriorityColor(notification.priority),
                      !notification.isRead && "ring-1 ring-therapy-200 shadow-sm"
                    )}
                  >
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-therapy-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 leading-tight">
                          {notification.title}
                        </h4>
                        
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.createdAt)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={notification.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                            </Badge>
                            
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 px-2 hover:bg-therapy-100"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;