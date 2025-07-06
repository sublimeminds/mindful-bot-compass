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

    // Get user's Signal integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_type', 'signal')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Signal integration not found', { status: 404, headers: corsHeaders });
    }

    // Signal uses signal-cli or similar service
    const signalApiUrl = Deno.env.get('SIGNAL_API_URL') || 'demo_signal_api';
    const signalNumber = integration.access_tokens?.signal_number;
    
    console.log('Using Signal API:', signalApiUrl === 'demo_signal_api' ? 'DEMO MODE' : 'LIVE MODE');

    if (!signalNumber) {
      throw new Error('Signal number not found in integration settings');
    }

    // Format message for Signal
    const messageText = `*${payload.title}*\n\n${payload.body}`;
    
    // Add action text based on category
    let actionText = '';
    if (payload.category === 'crisis') {
      actionText = `\n\n🚨 Get help: ${Deno.env.get('SUPABASE_URL')}/therapy-chat?crisis=true\n📞 Resources: ${Deno.env.get('SUPABASE_URL')}/crisis-resources`;
    } else if (payload.category === 'therapy') {
      actionText = `\n\n💬 Join session: ${payload.url || `${Deno.env.get('SUPABASE_URL')}/therapy-chat`}`;
    }

    const fullMessage = messageText + actionText;

    // Simulate Signal API call (since using demo)
    if (signalApiUrl === 'demo_signal_api') {
      console.log('DEMO: Would send Signal message to', signalNumber, ':', fullMessage);
    } else {
      // Real Signal API call (would depend on signal-cli REST API or similar)
      const signalPayload = {
        message: fullMessage,
        number: signalNumber,
        recipients: [integration.platform_user_id]
      };

      const signalResponse = await fetch(`${signalApiUrl}/v2/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signalPayload)
      });

      if (!signalResponse.ok) {
        throw new Error(`Signal API error: ${signalResponse.status}`);
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
        delivery_method: 'signal',
        platform_integration_id: integration.id,
        status: 'delivered',
        external_message_id: `signal-${Date.now()}`,
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: `signal-${Date.now()}`,
      demo: signalApiUrl === 'demo_signal_api'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending Signal notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});