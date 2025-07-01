
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellOff, 
  Check, 
  Heart,
  Target,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  type: 'reminder' | 'achievement' | 'insight' | 'mood_check' | 'milestone' | 'system';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: Date;
}

const NotificationWidget = () => {
  // Mock notifications - same as notification center
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Therapy Session Reminder',
      message: 'Your scheduled session starts in 30 minutes.',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Milestone Achieved! 🎉',
      message: '7 consecutive days of mood tracking completed.',
      priority: 'medium',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'insight',
      title: 'Weekly Insight',
      message: 'Anxiety levels decreased by 15% this week.',
      priority: 'medium',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 3);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Calendar className="h-4 w-4 text-therapy-600" />;
      case 'achievement': return <Award className="h-4 w-4 text-balance-600" />;
      case 'insight': return <TrendingUp className="h-4 w-4 text-flow-600" />;
      case 'mood_check': return <Heart className="h-4 w-4 text-harmony-600" />;
      case 'milestone': return <Target className="h-4 w-4 text-calm-600" />;
      case 'system': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-therapy-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card className="h-full bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-therapy-50 to-calm-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-therapy-800 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Recent Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-100"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-1 p-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-sm bg-gradient-to-r from-white to-therapy-25",
                    getPriorityColor(notification.priority),
                    !notification.isRead && "ring-1 ring-therapy-200"
                  )}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(notification.type)}
                        <h4 className="font-medium text-sm text-gray-900 leading-tight">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-therapy-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-5 w-5 p-0 hover:bg-therapy-100 rounded-full"
                          >
                            <Check className="h-3 w-3 text-therapy-600" />
                          </Button>
                        )}
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
  );
};

export default NotificationWidget;
