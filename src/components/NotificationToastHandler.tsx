
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
      console.log('Cleaning up existing toast channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create a unique channel name to avoid conflicts with NotificationCenter
    const channelName = `toast-notifications-${user.id}-${Date.now()}`;
    
    console.log('Creating new toast notification channel:', channelName);
    
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
          console.log('New notification received for toast:', notification);
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Toast channel subscription status:', status);
      if (status === 'SUBSCRIBED') {
        isSubscribedRef.current = true;
        console.log('Successfully subscribed to toast notifications channel');
      }
    });

    // Store channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log('Cleaning up toast notification channel:', channelName);
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
        console.log('Toast component unmounting, cleaning up channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, []);

  return null; // This is a utility component that doesn't render anything
};

export default NotificationToastHandler;
