import React from 'react';
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
  ChevronRight,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/hooks/useNotifications';

const EnhancedNotificationWidget = () => {
  const navigate = useNavigate();
  const { 
    recentNotifications: notifications, 
    unreadCount, 
    isLoading, 
    markAsRead 
  } = useNotifications();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session_reminder': return <Calendar className="h-4 w-4 text-therapy-600" />;
      case 'milestone_achieved': return <Award className="h-4 w-4 text-balance-600" />;
      case 'progress_update': return <TrendingUp className="h-4 w-4 text-flow-600" />;
      case 'crisis_alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50/50';
      case 'high': return 'border-l-orange-500 bg-orange-50/50';
      case 'medium': return 'border-l-therapy-500 bg-therapy-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  return (
    <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-therapy-50 to-calm-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-therapy-800 flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/notifications')}
            className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-100 text-xs"
          >
            View All
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin h-6 w-6 border-4 border-therapy-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <BellOff className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-1 p-2">
              {notifications.slice(0, 4).map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-sm",
                    getPriorityColor(notification.priority),
                    !notification.isRead && "ring-1 ring-therapy-200"
                  )}
                >
                  <div className="flex items-start justify-between space-x-2">
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(notification.type)}
                        <h4 className="font-medium text-sm text-gray-900 leading-tight truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-1.5 h-1.5 bg-therapy-500 rounded-full animate-pulse flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        
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
              
              {notifications.length > 4 && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/notifications')}
                    className="text-xs text-therapy-600 hover:text-therapy-700"
                  >
                    View {notifications.length - 4} more notifications
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedNotificationWidget;