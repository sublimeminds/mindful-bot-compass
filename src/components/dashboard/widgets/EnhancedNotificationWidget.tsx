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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Enhanced mock data with more realistic notifications
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'session_reminder',
    title: 'Session Reminder',
    message: 'Your therapy session is scheduled for 3:00 PM today. Don\'t forget to prepare your mood check-in.',
    priority: 'high' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    data: { sessionId: 'sess_123', technique: 'CBT' }
  },
  {
    id: '2',
    type: 'milestone_achieved',
    title: 'Milestone Unlocked! 🎉',
    message: 'Congratulations! You\'ve completed 7 consecutive days of mood tracking. Keep up the excellent work!',
    priority: 'medium' as const,
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    data: { achievement: '7_day_streak', xpEarned: 100 }
  },
  {
    id: '3',
    type: 'insight_generated',
    title: 'New Insight Available',
    message: 'Your AI therapist has generated new insights based on your recent mood patterns. Take a look to see personalized recommendations.',
    priority: 'medium' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    data: { insightType: 'mood_pattern', confidence: 0.87 }
  },
  {
    id: '4',
    type: 'mood_check',
    title: 'Daily Mood Check-in',
    message: 'How are you feeling today? Take a moment to track your mood and reflect on your emotional state.',
    priority: 'low' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    data: { reminderType: 'daily', streak: 6 }
  },
  {
    id: '5',
    type: 'progress_update',
    title: 'Weekly Progress Update',
    message: 'You\'ve made significant progress this week! Your mood improved by 15% and you completed 4 therapy sessions.',
    priority: 'low' as const,
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    data: { weeklyImprovement: 15, sessionsCompleted: 4 }
  }
];

const EnhancedNotificationWidget = () => {
  const navigate = useNavigate();
  const notifications = SAMPLE_NOTIFICATIONS;
  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const handleMarkAsRead = (notificationId: string) => {
    // In real implementation, this would call the API
    console.log('Marking notification as read:', notificationId);
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
        {notifications.length === 0 ? (
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