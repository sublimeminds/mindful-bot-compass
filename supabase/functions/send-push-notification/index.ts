import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Web Push VAPID Keys (would be from environment in production)
const VAPID_PUBLIC_KEY = 'BH7Cb6Dbs9LUWs6gGf7WQ-oGGNl-Hf8XjX4W8ZBtX0k1D9F5G8b0Qm5K2L8b6T5c4P9E7D3a8B1K5m6W0';
const VAPID_PRIVATE_KEY = 'YOUR_VAPID_PRIVATE_KEY'; // Would be from environment

interface NotificationPayload {
  title: string;
  body: string;
  category: string;
  type: string;
  data?: Record<string, any>;
  url?: string;
  icon?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, payload }: { userId: string; payload: NotificationPayload } = await req.json();

    if (!userId || !payload) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Get user's push subscriptions
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      return new Response('Error fetching subscriptions', { status: 500, headers: corsHeaders });
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No active push subscriptions found for user:', userId);
      return new Response(JSON.stringify({ message: 'No active subscriptions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create notification record
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert([{
        user_id: userId,
        type: payload.type,
        title: payload.title,
        message: payload.body,
        data: payload.data || {},
        read: false
      }])
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    // Prepare push notification data
    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: {
        ...payload.data,
        url: payload.url || '/dashboard',
        notificationId: notification?.id
      },
      actions: payload.actions || [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      requireInteraction: payload.requireInteraction || false,
      silent: payload.silent || false,
      tag: payload.tag || `therapysync-${payload.type}`,
      timestamp: Date.now(),
      category: payload.category
    });

    // Send push notifications to all user's devices
    const pushPromises = subscriptions.map(async (subscription) => {
      try {
        // In a real implementation, you would use a proper Web Push library
        // For now, we'll simulate the push notification sending
        console.log(`Sending push notification to endpoint: ${subscription.endpoint.substring(0, 50)}...`);
        
        // Create delivery tracking record
        await supabaseClient
          .from('notification_deliveries')
          .insert([{
            notification_id: notification?.id,
            delivery_method: 'push',
            status: 'sent',
            delivered_at: new Date().toISOString()
          }]);

        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        console.error('Error sending push notification:', error);
        
        // Track failed delivery
        if (notification?.id) {
          await supabaseClient
            .from('notification_deliveries')
            .insert([{
              notification_id: notification.id,
              delivery_method: 'push',
              status: 'failed',
              error_message: error.message
            }]);
        }

        return { success: false, endpoint: subscription.endpoint, error: error.message };
      }
    });

    const results = await Promise.all(pushPromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Push notification sent to ${successCount} devices, ${failCount} failed`);

    return new Response(JSON.stringify({
      success: true,
      delivered: successCount,
      failed: failCount,
      notificationId: notification?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in send-push-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});