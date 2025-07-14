import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntelligentNotificationsData } from '@/hooks/useIntelligentNotificationsData';
import { toast } from 'sonner';

const NotificationTester = () => {
  const { createCustomNotification } = useIntelligentNotificationsData();

  const testNotifications = [
    {
      type: 'session_reminder' as const,
      title: 'Session Reminder',
      message: 'Time for your scheduled therapy session.',
      priority: 'medium' as const
    },
    {
      type: 'milestone_achieved' as const,
      title: '🎉 Milestone Achieved!',
      message: 'You\'ve completed 10 therapy sessions!',
      priority: 'high' as const
    },
    {
      type: 'insight_generated' as const,
      title: 'New Insight',
      message: 'Your mood patterns show improvement in evening sessions.',
      priority: 'medium' as const
    },
    {
      type: 'mood_check' as const,
      title: 'Mood Check-in',
      message: 'How are you feeling today?',
      priority: 'low' as const
    }
  ];

  const addTestNotification = (notification: typeof testNotifications[0]) => {
    createCustomNotification(notification);
    toast.success('Test notification added!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {testNotifications.map((notification, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => addTestNotification(notification)}
              className="text-sm"
            >
              Add {notification.type.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTester;