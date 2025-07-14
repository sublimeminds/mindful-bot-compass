import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EliteNotificationService, type NotificationType, type EnhancedNotification } from '@/services/eliteNotificationService';
import { useSimpleApp } from './useSimpleApp';
import { toast } from 'sonner';

export const useEliteNotifications = () => {
  const { user } = useSimpleApp();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['elite-notifications', user?.id],
    queryFn: () => user ? EliteNotificationService.getUserNotifications(user.id) : [],
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      user ? EliteNotificationService.markAsRead(notificationId, user.id) : Promise.resolve(false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elite-notifications'] });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  });

  const createNotificationMutation = useMutation({
    mutationFn: ({
      type,
      title,
      message,
      options = {}
    }: {
      type: NotificationType;
      title: string;
      message: string;
      options?: {
        priority?: 'low' | 'medium' | 'high';
        data?: Record<string, any>;
        scheduledFor?: Date;
        richContent?: Record<string, any>;
        customActions?: any[];
      };
    }) => {
      if (!user) throw new Error('User not authenticated');
      return EliteNotificationService.createIntelligentNotification(user.id, type, title, message, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elite-notifications'] });
    },
    onError: (error) => {
      console.error('Failed to create notification:', error);
      toast.error('Failed to create notification');
    }
  });

  const handleInteractionMutation = useMutation({
    mutationFn: ({
      notificationId,
      action,
      eventData
    }: {
      notificationId: string;
      action: string;
      eventData?: Record<string, any>;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return EliteNotificationService.handleNotificationInteraction(notificationId, user.id, action, eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elite-notifications'] });
    },
    onError: (error) => {
      console.error('Failed to handle notification interaction:', error);
      toast.error('Failed to complete action');
    }
  });

  const {
    data: analytics = [],
    isLoading: isAnalyticsLoading
  } = useQuery({
    queryKey: ['notification-analytics', user?.id],
    queryFn: () => user ? EliteNotificationService.getNotificationAnalytics(user.id) : [],
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  // Computed values
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => !n.isRead && n.priority === 'high').length;
  const expiringCount = notifications.filter(n => 
    n.expiresAt && new Date(n.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000
  ).length;

  // Analytics aggregations
  const analyticsStats = analytics.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const engagementRate = analyticsStats.opened 
    ? (analyticsStats.action_taken || 0) / analyticsStats.opened 
    : 0;

  // Convenience methods for creating specific notification types
  const createMoodCheckNotification = () => {
    return createNotificationMutation.mutate({
      type: 'mood_check',
      title: 'How are you feeling?',
      message: 'Take a moment to check in with your emotions and log your current mood.',
      options: {
        priority: 'low',
        data: { reminder_type: 'daily_checkin' }
      }
    });
  };

  const createSessionReminderNotification = (sessionTime?: Date) => {
    return createNotificationMutation.mutate({
      type: 'session_reminder',
      title: 'Therapy Session Reminder',
      message: sessionTime 
        ? `Your therapy session is scheduled for ${sessionTime.toLocaleTimeString()}`
        : 'Time for your therapy session. Take a few moments to center yourself.',
      options: {
        priority: 'medium',
        scheduledFor: sessionTime,
        data: { session_time: sessionTime?.toISOString() }
      }
    });
  };

  const createMilestoneNotification = (milestone: string, description?: string) => {
    return createNotificationMutation.mutate({
      type: 'milestone_achieved',
      title: '🎉 Milestone Achieved!',
      message: description || `Congratulations! You've reached: ${milestone}`,
      options: {
        priority: 'high',
        data: { milestone, achievement_type: 'progress' },
        richContent: { celebration: true, milestone }
      }
    });
  };

  const createBreathingReminderNotification = () => {
    return createNotificationMutation.mutate({
      type: 'breathing_reminder',
      title: 'Take a Breathing Break',
      message: 'It looks like you might benefit from a quick breathing exercise to help you feel centered.',
      options: {
        priority: 'medium',
        data: { trigger: 'stress_detection' }
      }
    });
  };

  const createCrisisNotification = (severity: 'medium' | 'high' | 'critical', context?: any) => {
    return createNotificationMutation.mutate({
      type: 'crisis_detected',
      title: 'We\'re Here to Help',
      message: 'We\'ve noticed you might be going through a difficult time. Immediate support is available.',
      options: {
        priority: 'high',
        data: { severity, context, emergency: true },
        richContent: { crisis_resources: true }
      }
    });
  };

  return {
    // Data
    notifications,
    analytics,
    unreadCount,
    highPriorityCount,
    expiringCount,
    analyticsStats,
    engagementRate,
    
    // Loading states
    isLoading,
    isAnalyticsLoading,
    isMarkingAsRead: markAsReadMutation.isPending,
    isCreatingNotification: createNotificationMutation.isPending,
    isHandlingInteraction: handleInteractionMutation.isPending,
    
    // Errors
    error,
    
    // Actions
    markAsRead: markAsReadMutation.mutate,
    createNotification: createNotificationMutation.mutate,
    handleInteraction: handleInteractionMutation.mutate,
    
    // Convenience methods
    createMoodCheckNotification,
    createSessionReminderNotification,
    createMilestoneNotification,
    createBreathingReminderNotification,
    createCrisisNotification
  };
};