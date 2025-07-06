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

    // Get user's Telegram integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_type', 'telegram')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Telegram integration not found', { status: 404, headers: corsHeaders });
    }

    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramBotToken) {
      throw new Error('Telegram bot token not configured');
    }

    // Format message for Telegram
    let messageText = `*${payload.title}*\n\n${payload.body}`;
    let replyMarkup = null;

    // Add inline keyboard based on category
    if (payload.category === 'crisis') {
      replyMarkup = {
        inline_keyboard: [[
          {
            text: "🚨 Get Help Now",
            url: `${Deno.env.get('SUPABASE_URL')}/therapy-chat?crisis=true`
          },
          {
            text: "📞 Crisis Resources",
            url: `${Deno.env.get('SUPABASE_URL')}/crisis-resources`
          }
        ]]
      };
    } else if (payload.category === 'therapy') {
      replyMarkup = {
        inline_keyboard: [[
          {
            text: "💬 Join Session",
            url: payload.url || `${Deno.env.get('SUPABASE_URL')}/therapy-chat`
          }
        ]]
      };
    }

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const telegramPayload = {
      chat_id: integration.platform_user_id,
      text: messageText,
      parse_mode: 'Markdown',
      ...(replyMarkup && { reply_markup: replyMarkup })
    };

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramPayload)
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      throw new Error(`Telegram API error: ${telegramResult.description}`);
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
        delivery_method: 'telegram',
        platform_integration_id: integration.id,
        status: 'delivered',
        external_message_id: telegramResult.result.message_id.toString(),
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: telegramResult.result.message_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});