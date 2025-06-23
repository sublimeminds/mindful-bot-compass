
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, userId, integrationId } = await req.json();

    if (!message || !userId || !integrationId) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Get integration details
    const { data: integration, error: integrationError } = await supabaseClient
      .from('whatsapp_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response('Integration not found', { status: 404, headers: corsHeaders });
    }

    // Send message via WhatsApp API
    const response = await fetch(`https://graph.facebook.com/v18.0/${integration.phone_number_id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.access_token_encrypted}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: integration.whatsapp_number,
        type: 'text',
        text: { body: message }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    // Store message in database
    await supabaseClient
      .from('whatsapp_messages')
      .insert({
        integration_id: integrationId,
        user_id: userId,
        whatsapp_message_id: result.messages?.[0]?.id,
        message_type: 'text',
        content: message,
        sender_type: 'ai',
        delivery_status: 'sent'
      });

    return new Response(JSON.stringify({ success: true, messageId: result.messages?.[0]?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
