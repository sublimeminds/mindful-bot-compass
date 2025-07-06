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

    // Get user's Teams integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_type', 'teams')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Teams integration not found', { status: 404, headers: corsHeaders });
    }

    // Format message for Teams
    const teamsMessage = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": "0076D7",
      "summary": payload.title,
      "sections": [{
        "activityTitle": payload.title,
        "activitySubtitle": payload.body,
        "markdown": true
      }]
    };

    // Add action buttons based on category
    if (payload.category === 'crisis') {
      teamsMessage.sections[0].potentialAction = [
        {
          "@type": "OpenUri",
          "name": "Get Help Now",
          "targets": [{
            "os": "default",
            "uri": `${Deno.env.get('SUPABASE_URL')}/therapy-chat?crisis=true`
          }]
        }
      ];
    } else if (payload.category === 'therapy') {
      teamsMessage.sections[0].potentialAction = [
        {
          "@type": "OpenUri",
          "name": "Join Session",
          "targets": [{
            "os": "default",
            "uri": payload.url || `${Deno.env.get('SUPABASE_URL')}/therapy-chat`
          }]
        }
      ];
    }

    // Send message to Teams webhook
    const webhookUrl = integration.access_tokens?.teams_webhook_url;
    
    if (!webhookUrl) {
      throw new Error('Teams webhook URL not found in integration settings');
    }

    const teamsResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamsMessage)
    });

    if (!teamsResponse.ok) {
      throw new Error(`Teams API error: ${teamsResponse.status}`);
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
        delivery_method: 'teams',
        platform_integration_id: integration.id,
        status: 'delivered',
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: `teams-${Date.now()}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending Teams notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});