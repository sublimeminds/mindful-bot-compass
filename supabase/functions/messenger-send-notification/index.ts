import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  category: string;
  type: string;
  data?: Record<string, any>;
  url?: string;
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

    // Get user's Messenger integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_type', 'messenger')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Messenger integration not found', { status: 404, headers: corsHeaders });
    }

    const messengerAccessToken = Deno.env.get('MESSENGER_ACCESS_TOKEN') || 'demo_messenger_token';
    console.log('Using Messenger token:', messengerAccessToken === 'demo_messenger_token' ? 'DEMO MODE' : 'LIVE MODE');

    // Format message for Messenger
    const messengerMessage = {
      recipient: {
        id: integration.platform_user_id
      },
      message: {
        text: `${payload.title}\n\n${payload.body}`
      }
    };

    // Add quick replies based on category
    if (payload.category === 'crisis') {
      messengerMessage.message.quick_replies = [
        {
          content_type: "text",
          title: "🚨 Get Help",
          payload: "GET_CRISIS_HELP"
        },
        {
          content_type: "text", 
          title: "📞 Resources",
          payload: "CRISIS_RESOURCES"
        }
      ];
    } else if (payload.category === 'therapy') {
      messengerMessage.message.quick_replies = [
        {
          content_type: "text",
          title: "💬 Join Session",
          payload: "JOIN_THERAPY_SESSION"
        }
      ];
    }

    // Simulate Messenger API call (since using demo token)
    if (messengerAccessToken === 'demo_messenger_token') {
      console.log('DEMO: Would send Messenger message:', JSON.stringify(messengerMessage, null, 2));
    } else {
      // Real Messenger API call
      const messengerUrl = `https://graph.facebook.com/v18.0/me/messages?access_token=${messengerAccessToken}`;
      const messengerResponse = await fetch(messengerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messengerMessage)
      });

      const messengerResult = await messengerResponse.json();
      if (!messengerResponse.ok) {
        throw new Error(`Messenger API error: ${messengerResult.error?.message}`);
      }
    }

    // Create notification record
    const { data: notification } = await supabaseClient
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

    // Track delivery
    await supabaseClient
      .from('notification_deliveries')
      .insert([{
        notification_id: notification?.id,
        delivery_method: 'messenger',
        platform_integration_id: integration.id,
        status: 'delivered',
        external_message_id: `messenger-${Date.now()}`,
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: `messenger-${Date.now()}`,
      demo: messengerAccessToken === 'demo_messenger_token'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending Messenger notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});