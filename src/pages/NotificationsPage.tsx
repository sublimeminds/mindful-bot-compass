import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Trash2, Settings, Calendar, Heart, Star, AlertTriangle } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'session',
      title: 'Session Reminder',
      message: 'Your therapy session with Dr. Sarah Chen is starting in 15 minutes',
      time: '2 minutes ago',
      read: false,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You\'ve completed 7 days of mood tracking. Keep up the great work!',
      time: '1 hour ago',
      read: false,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'wellness',
      title: 'Daily Check-in',
      message: 'How are you feeling today? Take a moment to record your mood.',
      time: '3 hours ago',
      read: true,
      icon: Heart,
      color: 'text-therapy-600'
    },
    {
      id: 4,
      type: 'system',
      title: 'New Feature Available',
      message: 'Voice therapy sessions are now available. Try speaking with your AI therapist.',
      time: '1 day ago',
      read: true,
      icon: Bell,
      color: 'text-purple-600'
    },
    {
      id: 5,
      type: 'urgent',
      title: 'Crisis Support Available',
      message: 'We noticed you might need support. Our crisis team is available 24/7.',
      time: '2 days ago',
      read: false,
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterNotifications = (type?: string) => {
    if (!type) return notifications;
    return notifications.filter(n => n.type === type);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-800">Notifications</h1>
          <p className="text-slate-600 mt-2">Stay updated with your therapy progress and important reminders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-therapy-600" />
              <div>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-sm text-slate-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
              <div>
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm text-slate-600">Unread</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{filterNotifications('session').length}</div>
                <div className="text-sm text-slate-600">Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{filterNotifications('achievement').length}</div>
                <div className="text-sm text-slate-600">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="session">Sessions</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NotificationList 
            notifications={notifications} 
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="session" className="mt-6">
          <NotificationList 
            notifications={filterNotifications('session')} 
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="achievement" className="mt-6">
          <NotificationList 
            notifications={filterNotifications('achievement')} 
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-6">
          <NotificationList 
            notifications={filterNotifications('wellness')} 
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="urgent" className="mt-6">
          <NotificationList 
            notifications={filterNotifications('urgent')} 
            onMarkRead={markAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NotificationList = ({ notifications, onMarkRead, onDelete }: {
  notifications: any[];
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No notifications in this category
          </div>
        ) : (
          notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read 
                    ? 'bg-white border-slate-200' 
                    : 'bg-therapy-50 border-therapy-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 ${notification.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{notification.title}</h3>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-therapy-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{notification.message}</p>
                      <div className="text-xs text-slate-500">{notification.time}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onMarkRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </CardContent>
  </Card>
);

export default NotificationsPage;