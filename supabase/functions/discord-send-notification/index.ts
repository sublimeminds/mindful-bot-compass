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

    // Get user's Discord integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_type', 'discord')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Discord integration not found', { status: 404, headers: corsHeaders });
    }

    // Format message for Discord
    const embed = {
      title: payload.title,
      description: payload.body,
      color: payload.category === 'crisis' ? 0xff0000 : 0x5865f2,
      timestamp: new Date().toISOString(),
      footer: {
        text: "TherapySync AI"
      }
    };

    // Add fields and components based on category
    const components = [];
    if (payload.category === 'crisis') {
      embed.color = 0xff0000;
      components.push({
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "🚨 Get Help Now",
            url: `${Deno.env.get('SUPABASE_URL')}/therapy-chat?crisis=true`
          },
          {
            type: 2,
            style: 5,
            label: "📞 Crisis Resources",
            url: `${Deno.env.get('SUPABASE_URL')}/crisis-resources`
          }
        ]
      });
    } else if (payload.category === 'therapy') {
      components.push({
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "💬 Join Session",
            url: payload.url || `${Deno.env.get('SUPABASE_URL')}/therapy-chat`
          }
        ]
      });
    }

    const discordMessage = {
      embeds: [embed],
      ...(components.length > 0 && { components })
    };

    // Send message to Discord webhook
    const webhookUrl = integration.access_tokens?.discord_webhook_url;
    
    if (!webhookUrl) {
      throw new Error('Discord webhook URL not found in integration settings');
    }

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage)
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      throw new Error(`Discord API error: ${discordResponse.status} - ${errorText}`);
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
        delivery_method: 'discord',
        platform_integration_id: integration.id,
        status: 'delivered',
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: `discord-${Date.now()}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});