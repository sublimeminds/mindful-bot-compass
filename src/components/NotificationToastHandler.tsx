
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const NotificationToastHandler = () => {
  // Safety check for React hooks
  if (typeof React === 'undefined' || !React.useState) {
    return null;
  }

  try {
    const { user } = useSimpleApp();
    const { toast } = useToast();
    const channelRef = useRef<any>(null);
    const isSubscribedRef = useRef(false);

    useEffect(() => {
      if (!user || isSubscribedRef.current) return;

      // Clean up any existing channel before creating a new one
      if (channelRef.current) {
        console.log('Cleaning up existing toast channel');
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.log('Error removing toast channel:', error);
        }
        channelRef.current = null;
      }

      // Create a unique channel name with component identifier
      const channelName = `toast-handler-${user.id}-${Date.now()}`;
      
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
            
            console.log('New notification received for toast:', notification);
          }
        );

      // Subscribe to the channel
      channel.subscribe((status) => {
        console.log('Toast channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

      // Store channel reference
      channelRef.current = channel;

      // Cleanup function
      return () => {
        console.log('Cleaning up toast notification channel:', channelName);
        if (channelRef.current) {
          try {
            supabase.removeChannel(channelRef.current);
          } catch (error) {
            console.log('Error during toast cleanup:', error);
          }
          channelRef.current = null;
        }
        isSubscribedRef.current = false;
      };
    }, [user?.id, toast]);

    return null; // This is a utility component that doesn't render anything
  } catch (error) {
    console.warn('NotificationToastHandler: Error initializing component:', error);
    return null;
  }
};

export default NotificationToastHandler;
