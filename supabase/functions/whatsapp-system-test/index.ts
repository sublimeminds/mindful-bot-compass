
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

    const { test_type } = await req.json();

    if (!test_type) {
      return new Response('Missing test type', { status: 400, headers: corsHeaders });
    }

    let testResult = { success: false, message: '', details: {} };

    switch (test_type) {
      case 'webhook':
        testResult = await testWebhookConnectivity(supabaseClient);
        break;
      case 'api_connection':
        testResult = await testWhatsAppAPIConnection(supabaseClient);
        break;
      case 'configuration':
        testResult = await testConfiguration(supabaseClient);
        break;
      default:
        return new Response('Invalid test type', { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify(testResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in system test:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'System test failed',
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function testWebhookConnectivity(supabaseClient: any) {
  try {
    // Get global config
    const { data: config, error } = await supabaseClient
      .from('whatsapp_global_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error || !config) {
      return {
        success: false,
        message: 'No active WhatsApp configuration found',
        details: { error }
      };
    }

    if (!config.webhook_url) {
      return {
        success: false,
        message: 'Webhook URL not configured',
        details: {}
      };
    }

    // Test webhook endpoint
    const webhookTest = await fetch(config.webhook_url, {
      method: 'GET',
      headers: {
        'User-Agent': 'TherapySync-WebhookTest/1.0'
      }
    });

    return {
      success: webhookTest.ok,
      message: webhookTest.ok ? 'Webhook endpoint is accessible' : 'Webhook endpoint is not accessible',
      details: {
        status: webhookTest.status,
        statusText: webhookTest.statusText,
        url: config.webhook_url
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Failed to test webhook connectivity',
      details: { error: error.message }
    };
  }
}

async function testWhatsAppAPIConnection(supabaseClient: any) {
  try {
    // Get global config
    const { data: config, error } = await supabaseClient
      .from('whatsapp_global_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error || !config) {
      return {
        success: false,
        message: 'No active WhatsApp configuration found',
        details: { error }
      };
    }

    if (!config.access_token_encrypted || !config.phone_number_id) {
      return {
        success: false,
        message: 'WhatsApp API credentials not configured',
        details: {}
      };
    }

    // Test API connection by getting business profile
    const response = await fetch(`https://graph.facebook.com/v18.0/${config.phone_number_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.access_token_encrypted}`,
      }
    });

    const data = await response.json();

    return {
      success: response.ok,
      message: response.ok ? 'WhatsApp API connection successful' : 'WhatsApp API connection failed',
      details: {
        status: response.status,
        data: response.ok ? data : data.error
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Failed to test WhatsApp API connection',
      details: { error: error.message }
    };
  }
}

async function testConfiguration(supabaseClient: any) {
  try {
    // Check all required configurations
    const { data: config, error } = await supabaseClient
      .from('whatsapp_global_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error || !config) {
      return {
        success: false,
        message: 'No active WhatsApp configuration found',
        details: { error }
      };
    }

    const requiredFields = [
      'business_account_id',
      'phone_number_id', 
      'access_token_encrypted',
      'webhook_verify_token'
    ];

    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
      return {
        success: false,
        message: 'Configuration incomplete',
        details: { missingFields }
      };
    }

    // Check if templates and prompts exist
    const [templatesResult, promptsResult] = await Promise.all([
      supabaseClient.from('whatsapp_response_templates').select('count').eq('is_active', true),
      supabaseClient.from('whatsapp_system_prompts').select('count').eq('is_active', true)
    ]);

    return {
      success: true,
      message: 'Configuration is complete',
      details: {
        config: {
          hasBusinessAccount: !!config.business_account_id,
          hasPhoneNumber: !!config.phone_number_id,
          hasAccessToken: !!config.access_token_encrypted,
          hasWebhookToken: !!config.webhook_verify_token,
          rateLimitPerHour: config.rate_limit_per_hour
        },
        activeTemplates: templatesResult.data?.[0]?.count || 0,
        activePrompts: promptsResult.data?.[0]?.count || 0
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Failed to test configuration',
      details: { error: error.message }
    };
  }
}
