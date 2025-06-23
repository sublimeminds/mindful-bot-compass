
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

    const { phoneNumber, userId } = await req.json();

    if (!phoneNumber || !userId) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store or update integration record
    const { data: integration, error } = await supabaseClient
      .from('whatsapp_integrations')
      .upsert({
        user_id: userId,
        phone_number: phoneNumber,
        verification_code: verificationCode,
        verification_status: 'pending',
        is_active: false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,phone_number'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response('Database error', { status: 500, headers: corsHeaders });
    }

    // In a real implementation, you would send the verification code via SMS
    // For now, we'll return it in the response for testing
    return new Response(JSON.stringify({ 
      success: true, 
      integrationId: integration.id,
      // Remove this in production and send via SMS instead
      verificationCode: verificationCode
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in phone verification:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});
