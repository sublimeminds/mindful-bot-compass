
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NotificationToastHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Create a unique channel name to avoid conflicts
    const channelName = `notification-toasts-${user.id}-${Date.now()}`;
    
    // Listen for new notifications in real-time
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new;
          
          // Show toast for high priority notifications
          if (notification.priority === 'high') {
            toast({
              title: notification.title,
              description: notification.message,
              duration: 6000,
            });
          }
          
          // Log all notifications for debugging
          console.log('New notification received:', notification);
        }
      )
      .subscribe();

    // Cleanup function to properly unsubscribe
    return () => {
      console.log('Cleaning up notification channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]); // Only depend on user.id to avoid unnecessary re-subscriptions

  return null; // This is a utility component that doesn't render anything
};

export default NotificationToastHandler;
