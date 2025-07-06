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

    // Get user's Slack integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_type', 'slack')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Slack integration not found', { status: 404, headers: corsHeaders });
    }

    // Format message for Slack
    let slackMessage = {
      text: `${payload.title}\n${payload.body}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${payload.title}*\n${payload.body}`
          }
        }
      ]
    };

    // Add interactive elements based on category
    if (payload.category === 'crisis') {
      slackMessage.blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Get Help Now" },
            style: "danger",
            url: `${Deno.env.get('SUPABASE_URL')}/therapy-chat?crisis=true`
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Crisis Resources" },
            url: `${Deno.env.get('SUPABASE_URL')}/crisis-resources`
          }
        ]
      });
    } else if (payload.category === 'therapy') {
      slackMessage.blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Join Session" },
            style: "primary",
            url: payload.url || `${Deno.env.get('SUPABASE_URL')}/therapy-chat`
          }
        ]
      });
    }

    // Get Slack access token from integration settings
    const slackToken = integration.access_tokens?.slack_bot_token;
    
    if (!slackToken) {
      throw new Error('Slack bot token not found in integration settings');
    }

    // Send message to Slack
    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: integration.platform_user_id || '#general',
        ...slackMessage
      })
    });

    const slackResult = await slackResponse.json();

    if (!slackResult.ok) {
      throw new Error(`Slack API error: ${slackResult.error}`);
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
        delivery_method: 'slack',
        platform_integration_id: integration.id,
        status: 'delivered',
        external_message_id: slackResult.ts,
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: slackResult.ts,
      channel: slackResult.channel
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});