import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[SETUP-FRAUD-MONITORING] Setting up fraud monitoring cron job');

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Set up cron job to run fraud monitoring every 15 minutes
    const { data, error } = await supabaseClient.rpc('cron.schedule', {
      job_name: 'regional-pricing-fraud-monitor',
      schedule: '*/15 * * * *', // Every 15 minutes
      command: `SELECT net.http_post(
        url := '${Deno.env.get("SUPABASE_URL")}/functions/v1/regional-fraud-monitor',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}"}'::jsonb,
        body := '{"timestamp": "' || now() || '"}'::jsonb
      ) as request_id;`
    });

    if (error) {
      console.error('Failed to set up cron job:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to set up monitoring',
        details: error 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log('[SETUP-FRAUD-MONITORING] Cron job set up successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Fraud monitoring cron job set up successfully',
      schedule: 'Every 15 minutes',
      job_name: 'regional-pricing-fraud-monitor'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[SETUP-FRAUD-MONITORING] Error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});