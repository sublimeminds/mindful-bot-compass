import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck,
  ArrowLeft,
  Filter,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/realNotificationService';

const NotificationsInbox = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
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
      case 'critical': return 'border-l-red-600 bg-red-50/80 hover:bg-red-100/80';
      case 'high': return 'border-l-red-500 bg-red-50/60 hover:bg-red-100/60';
      case 'medium': return 'border-l-therapy-500 bg-therapy-50/60 hover:bg-therapy-100/60';
      case 'low': return 'border-l-green-500 bg-green-50/60 hover:bg-green-100/60';
      default: return 'border-l-gray-500 bg-gray-50/60 hover:bg-gray-100/60';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session_reminder': return <Calendar className="h-5 w-5 text-therapy-600" />;
      case 'milestone_achieved': return <Award className="h-5 w-5 text-balance-600" />;
      case 'progress_update': return <TrendingUp className="h-5 w-5 text-flow-600" />;
      case 'crisis_alert': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'setup_reminder': return <Settings className="h-5 w-5 text-therapy-600" />;
      case 'therapy_plan_reminder': return <Calendar className="h-5 w-5 text-calm-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filterNotifications = (notifications: Notification[], filter: string) => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'reminders':
        return notifications.filter(n => n.type.includes('reminder'));
      case 'achievements':
        return notifications.filter(n => n.type === 'milestone_achieved');
      case 'alerts':
        return notifications.filter(n => n.type === 'crisis_alert');
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications(notifications, selectedFilter);

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'reminders', label: 'Reminders', count: notifications.filter(n => n.type.includes('reminder')).length },
    { value: 'achievements', label: 'Achievements', count: notifications.filter(n => n.type === 'milestone_achieved').length },
    { value: 'alerts', label: 'Alerts', count: notifications.filter(n => n.type === 'crisis_alert').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-calm-50 to-balance-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-therapy-800">Notifications</h1>
              <p className="text-therapy-600 mt-1">Manage your notifications and stay updated</p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              className="bg-therapy-600 hover:bg-therapy-700 text-white"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {filterOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="text-sm">
                <span>{option.label}</span>
                {option.count > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 text-xs">
                    {option.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedFilter} className="space-y-4">
            <Card className="border-therapy-200 shadow-lg">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-therapy-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-therapy-600">Loading notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <BellOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                    <p className="text-sm">
                      {selectedFilter === 'all' 
                        ? "You're all caught up! No notifications at the moment."
                        : `No ${selectedFilter} notifications found.`
                      }
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2 p-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-l-4 rounded-r-lg transition-all duration-200 cursor-pointer",
                            getPriorityColor(notification.priority),
                            !notification.isRead && "ring-2 ring-therapy-200 shadow-md"
                          )}
                        >
                          <div className="flex items-start justify-between space-x-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center space-x-3">
                                {getTypeIcon(notification.type)}
                                <h4 className="font-semibold text-base text-gray-900 leading-tight">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-3 h-3 bg-therapy-500 rounded-full animate-pulse" />
                                )}
                                {notification.isSticky && (
                                  <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-700">
                                    Sticky
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs text-gray-500 font-medium">
                                    {formatTime(notification.createdAt)}
                                  </span>
                                  
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs capitalize bg-white/80 border-therapy-200"
                                  >
                                    {notification.type.replace('_', ' ')}
                                  </Badge>
                                  
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs capitalize",
                                      notification.priority === 'critical' && "border-red-300 text-red-700 bg-red-50",
                                      notification.priority === 'high' && "border-orange-300 text-orange-700 bg-orange-50",
                                      notification.priority === 'medium' && "border-therapy-300 text-therapy-700 bg-therapy-50",
                                      notification.priority === 'low' && "border-green-300 text-green-700 bg-green-50"
                                    )}
                                  >
                                    {notification.priority}
                                  </Badge>
                                </div>
                                
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-8 px-3 hover:bg-therapy-100 text-therapy-600 hover:text-therapy-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Mark Read
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsInbox;