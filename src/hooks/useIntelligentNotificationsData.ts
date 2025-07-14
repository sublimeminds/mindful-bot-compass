import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService, Notification } from '@/services/notificationService';
import { useSimpleApp } from './useSimpleApp';

export const useIntelligentNotificationsData = () => {
  const { user } = useSimpleApp();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? NotificationService.getUserNotifications(user.id) : [],
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      NotificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const createCustomNotificationMutation = useMutation({
    mutationFn: ({
      type,
      title,
      message,
      priority = 'medium',
      data
    }: {
      type: 'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update';
      title: string;
      message: string;
      priority?: 'low' | 'medium' | 'high';
      data?: Record<string, any>;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return NotificationService.createNotification(user.id, {
        type,
        title,
        message,
        priority,
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => !n.isRead && n.priority === 'high').length;

  return {
    notifications,
    unreadCount,
    highPriorityCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    createCustomNotification: createCustomNotificationMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isCreatingNotification: createCustomNotificationMutation.isPending
  };
};