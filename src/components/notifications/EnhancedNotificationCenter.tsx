
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  Heart,
  Target,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

const EnhancedNotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/80';
      case 'medium': return 'border-l-therapy-500 bg-therapy-50/80';
      case 'low': return 'border-l-green-500 bg-green-50/80';
      default: return 'border-l-gray-500 bg-gray-50/80';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session_reminder': return <Calendar className="h-4 w-4 text-therapy-600" />;
      case 'milestone_achieved': return <Award className="h-4 w-4 text-balance-600" />;
      case 'progress_update': return <TrendingUp className="h-4 w-4 text-flow-600" />;
      case 'crisis_alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-10 w-10 rounded-full hover:bg-therapy-50 transition-all duration-200 hover:scale-105"
        >
          <Bell className="h-5 w-5 text-therapy-600" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0 bg-white/95 backdrop-blur-md border border-therapy-200 shadow-xl" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 bg-gradient-to-r from-therapy-50 to-calm-50 border-b border-therapy-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-therapy-800 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-therapy-600 hover:text-therapy-700 hover:bg-therapy-100"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-therapy-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm text-slate-600">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">All caught up!</p>
                  <p className="text-sm">No notifications at the moment.</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md",
                        getPriorityColor(notification.priority),
                        !notification.isRead && "ring-1 ring-therapy-200 shadow-sm"
                      )}
                    >
                      <div className="flex items-start justify-between space-x-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-therapy-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">
                              {formatTime(notification.createdAt)}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs capitalize bg-white/80 border-therapy-200"
                              >
                                {notification.type.replace('_', ' ')}
                              </Badge>
                              
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-therapy-100 rounded-full"
                                >
                                  <Check className="h-3 w-3 text-therapy-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default EnhancedNotificationCenter;
