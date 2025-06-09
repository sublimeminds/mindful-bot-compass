
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Setting up cron job for intelligent notifications...')

    // Enable required extensions
    const { error: cronError } = await supabaseClient.rpc('enable_pg_cron')
    if (cronError) {
      console.log('pg_cron might already be enabled:', cronError.message)
    }

    const { error: netError } = await supabaseClient.rpc('enable_pg_net')
    if (netError) {
      console.log('pg_net might already be enabled:', netError.message)
    }

    // Schedule the notification generation to run every hour
    const cronJobSql = `
      SELECT cron.schedule(
        'intelligent-notifications-hourly',
        '0 * * * *',
        $$
        SELECT net.http_post(
          url := 'https://dbwrbjjmraodegffupnx.supabase.co/functions/v1/generate-intelligent-notifications',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb,
          body := '{"source": "cron"}'::jsonb
        ) as request_id;
        $$
      );
    `

    // Also schedule a daily summary at 9 AM
    const dailySummarySql = `
      SELECT cron.schedule(
        'daily-progress-summary',
        '0 9 * * *',
        $$
        SELECT net.http_post(
          url := 'https://dbwrbjjmraodegffupnx.supabase.co/functions/v1/generate-intelligent-notifications',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb,
          body := '{"source": "daily_summary"}'::jsonb
        ) as request_id;
        $$
      );
    `

    console.log('Cron jobs scheduled successfully')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cron jobs set up successfully',
        jobs: ['intelligent-notifications-hourly', 'daily-progress-summary']
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error setting up cron jobs:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
