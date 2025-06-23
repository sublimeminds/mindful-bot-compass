
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

    if (req.method === 'GET') {
      // Webhook verification
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_VERIFY_TOKEN')) {
        return new Response(challenge, { 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        });
      }

      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    if (req.method === 'POST') {
      // Handle incoming WhatsApp messages
      const body = await req.json();
      console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));

      // Verify webhook signature
      const signature = req.headers.get('x-hub-signature-256');
      if (!signature) {
        return new Response('No signature', { status: 401, headers: corsHeaders });
      }

      // Process webhook payload
      if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              await processMessages(change.value, supabaseClient);
            }
          }
        }
      }

      return new Response('OK', { headers: corsHeaders });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error('Error in WhatsApp webhook:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});

async function processMessages(value: any, supabaseClient: any) {
  const messages = value.messages || [];
  
  for (const message of messages) {
    try {
      // Find user by phone number
      const { data: integration } = await supabaseClient
        .from('whatsapp_integrations')
        .select('*')
        .eq('whatsapp_number', message.from)
        .eq('is_active', true)
        .single();

      if (!integration) {
        console.log('No active integration found for phone:', message.from);
        continue;
      }

      // Store incoming message
      await supabaseClient
        .from('whatsapp_messages')
        .insert({
          integration_id: integration.id,
          user_id: integration.user_id,
          whatsapp_message_id: message.id,
          message_type: message.type,
          content: getMessageContent(message),
          sender_type: 'user',
          timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString()
        });

      // Generate AI response
      await generateAIResponse(integration, message, supabaseClient);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
}

function getMessageContent(message: any): string {
  switch (message.type) {
    case 'text':
      return message.text?.body || '';
    case 'image':
      return message.image?.caption || '[Image]';
    case 'document':
      return message.document?.caption || '[Document]';
    case 'audio':
      return '[Audio message]';
    case 'video':
      return message.video?.caption || '[Video]';
    default:
      return '[Unsupported message type]';
  }
}

async function generateAIResponse(integration: any, userMessage: any, supabaseClient: any) {
  try {
    // Get user config
    const { data: config } = await supabaseClient
      .from('whatsapp_config')
      .select('*')
      .eq('user_id', integration.user_id)
      .single();

    if (!config?.auto_responses_enabled) {
      return;
    }

    // Get recent conversation context
    const { data: recentMessages } = await supabaseClient
      .from('whatsapp_messages')
      .select('content, sender_type, timestamp')
      .eq('integration_id', integration.id)
      .order('timestamp', { ascending: false })
      .limit(10);

    const conversationHistory = recentMessages
      ?.reverse()
      .map(msg => `${msg.sender_type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n') || '';

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate AI therapist providing support via WhatsApp. Keep responses concise (under 160 characters when possible), warm, and therapeutic. Previous conversation:\n${conversationHistory}`
          },
          {
            role: 'user',
            content: getMessageContent(userMessage)
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const aiData = await openaiResponse.json();
    const aiResponse = aiData.choices?.[0]?.message?.content || 'I\'m here to support you. Could you tell me more about how you\'re feeling?';

    // Store AI response
    await supabaseClient
      .from('whatsapp_messages')
      .insert({
        integration_id: integration.id,
        user_id: integration.user_id,
        message_type: 'text',
        content: aiResponse,
        sender_type: 'ai',
        ai_response_metadata: {
          model: 'gpt-4',
          tokens_used: aiData.usage?.total_tokens || 0
        }
      });

    // Send response via WhatsApp
    await sendWhatsAppMessage(integration, aiResponse);

  } catch (error) {
    console.error('Error generating AI response:', error);
  }
}

async function sendWhatsAppMessage(integration: any, message: string) {
  try {
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
      throw new Error(`WhatsApp API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}
