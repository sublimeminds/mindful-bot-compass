import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { RealNotificationService, Notification } from '@/services/realNotificationService';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? RealNotificationService.getUserNotifications(user.id) : [],
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });

  const markAsRead = async (notificationId: string) => {
    if (!user) return false;

    try {
      const success = await RealNotificationService.markAsRead(notificationId);
      
      if (success) {
        // Update the local cache
        queryClient.setQueryData(['notifications', user.id], (old: Notification[] = []) =>
          old.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );

        toast({
          title: "Notification marked as read",
          description: "Notification has been marked as read.",
        });
        
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to mark notification as read.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the notification.",
        variant: "destructive",
      });
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user || !notifications.length) return false;

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      // Mark all unread notifications as read
      const promises = unreadNotifications.map(n => RealNotificationService.markAsRead(n.id));
      const results = await Promise.all(promises);
      
      if (results.every(success => success)) {
        // Update the local cache
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
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  return {
    notifications,
    recentNotifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch
  };
};