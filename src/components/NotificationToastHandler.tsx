
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NotificationToastHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!user || isSubscribedRef.current) return;

    // Clean up any existing channel before creating a new one
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create a unique channel name to avoid conflicts
    const channelName = `notification-toasts-${user.id}-${Date.now()}`;
    
    console.log('Creating new notification channel:', channelName);
    
    // Create and configure the channel
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
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Channel subscription status:', status);
      if (status === 'SUBSCRIBED') {
        isSubscribedRef.current = true;
        console.log('Successfully subscribed to notifications channel');
      }
    });

    // Store channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log('Cleaning up notification channel:', channelName);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [user?.id, toast]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        console.log('Component unmounting, cleaning up channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, []);

  return null; // This is a utility component that doesn't render anything
};

export default NotificationToastHandler;
