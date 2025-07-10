import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { NotificationEngine, NotificationRequest } from '@/services/notificationEngine';
import { PushNotificationService } from '@/services/pushNotificationService';
import { NotificationService, Notification } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export interface NotificationAnalytics {
  totalEvents: number;
  byEventType: Record<string, number>;
  byDeliveryMethod: Record<string, number>;
  timeline: Record<string, number>;
}

export const useEnhancedNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubscribedToPush, setIsSubscribedToPush] = useState(false);
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(null);

  // Get notifications using the existing hook functionality
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? NotificationService.getUserNotifications(user.id) : [],
    enabled: !!user,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Check push subscription status
  useEffect(() => {
    if (user) {
      checkPushSubscriptionStatus();
    }
  }, [user]);

  // Set up real-time notification listener
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time notification listener for user:', user.id);

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time notification received:', payload);
          
          const notification = payload.new;
          
          // Show toast for high priority notifications
          if (notification.priority === 'high') {
            sonnerToast(notification.title, {
              description: notification.message,
              duration: 6000,
              action: {
                label: 'View',
                onClick: () => {
                  // Mark as read when viewed
                  markAsRead(notification.id);
                }
              }
            });
          }

          // Refresh notifications list
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time notification listener');
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  const checkPushSubscriptionStatus = async () => {
    if (!user) return;

    try {
      const hasSubscription = await PushNotificationService.hasActiveSubscription(user.id);
      setIsSubscribedToPush(hasSubscription);
    } catch (error) {
      console.error('Error checking push subscription status:', error);
    }
  };

  /**
   * Send notification through the unified engine
   */
  const sendNotification = useCallback(async (request: Omit<NotificationRequest, 'userId'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await NotificationEngine.sendNotification({
        ...request,
        userId: user.id
      });

      if (success) {
        // Refresh notifications list to show the new notification
        refetch();
        
        toast({
          title: "Notification sent",
          description: "Your notification has been queued for delivery.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send notification.",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending the notification.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, refetch, toast]);

  /**
   * Subscribe to push notifications
   */
  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await PushNotificationService.subscribe(user.id);
      
      if (success) {
        setIsSubscribedToPush(true);
        toast({
          title: "Push notifications enabled",
          description: "You'll now receive push notifications for important updates.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to enable push notifications. Please check your browser permissions.",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Error",
        description: "An error occurred while enabling push notifications.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await PushNotificationService.unsubscribe(user.id);
      
      if (success) {
        setIsSubscribedToPush(false);
        toast({
          title: "Push notifications disabled",
          description: "You'll no longer receive push notifications.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to disable push notifications.",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Error",
        description: "An error occurred while disabling push notifications.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await NotificationService.markAsRead(notificationId);
      
      if (success) {
        // Update local cache
        queryClient.setQueryData(['notifications', user.id], (old: Notification[] = []) =>
          old.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, [user, queryClient]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    if (!user || !notifications.length) return false;

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      const promises = unreadNotifications.map(n => NotificationService.markAsRead(n.id));
      const results = await Promise.all(promises);
      
      if (results.every(success => success)) {
        // Update local cache
        queryClient.setQueryData(['notifications', user.id], (old: Notification[] = []) =>
          old.map(notification => ({ ...notification, isRead: true }))
        );

        toast({
          title: "All notifications marked as read",
          description: `Marked ${unreadNotifications.length} notifications as read.`,
        });
        
        return true;
      } else {
        throw new Error('Some notifications failed to update');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, notifications, queryClient, toast]);

  /**
   * Send therapy-specific notifications
   */
  const sendSessionReminder = useCallback(async (sessionTime: string, therapistName?: string) => {
    return sendNotification({
      type: 'session_reminder',
      title: 'Therapy Session Reminder',
      message: `Your session ${therapistName ? `with ${therapistName}` : ''} is starting at ${sessionTime}`,
      priority: 'medium',
      deliveryMethods: ['in_app', 'web_push', 'email'],
      data: { sessionTime, therapistName }
    });
  }, [sendNotification]);

  const sendMilestoneNotification = useCallback(async (milestone: string) => {
    return sendNotification({
      type: 'milestone_achieved',
      title: 'Milestone Achieved! 🎉',
      message: `Congratulations! You've reached a new milestone: ${milestone}`,
      priority: 'high',
      deliveryMethods: ['in_app', 'web_push', 'email', 'discord', 'slack'],
      data: { milestone }
    });
  }, [sendNotification]);

  const sendMoodCheckReminder = useCallback(async () => {
    return sendNotification({
      type: 'mood_check',
      title: 'Mood Check-In',
      message: 'How are you feeling today? Take a moment to log your mood.',
      priority: 'low',
      deliveryMethods: ['in_app', 'web_push'],
      data: { type: 'mood_check' }
    });
  }, [sendNotification]);

  const sendInsightNotification = useCallback(async (insight: string) => {
    return sendNotification({
      type: 'insight_generated',
      title: 'New Insight Available',
      message: `We've discovered a new pattern in your progress: ${insight}`,
      priority: 'medium',
      deliveryMethods: ['in_app', 'web_push', 'email'],
      data: { insight }
    });
  }, [sendNotification]);

  /**
   * Load analytics data
   */
  const loadAnalytics = useCallback(async (days: number = 30) => {
    if (!user) return;

    try {
      const analyticsData = await NotificationEngine.getAnalytics(user.id, days);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading notification analytics:', error);
    }
  }, [user]);

  // Computed values
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  return {
    // Data
    notifications,
    recentNotifications,
    unreadCount,
    isLoading,
    error,
    analytics,
    isSubscribedToPush,

    // Actions
    sendNotification,
    markAsRead,
    markAllAsRead,
    refetch,

    // Push notifications
    subscribeToPush,
    unsubscribeFromPush,

    // Therapy-specific notifications
    sendSessionReminder,
    sendMilestoneNotification,
    sendMoodCheckReminder,
    sendInsightNotification,

    // Analytics
    loadAnalytics
  };
};