import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        db: {
          schema: 'public'
        }
      }
    );

    console.log('Setting up therapy monitoring cron job...');

    // Create cron job for therapy monitoring
    const { data, error } = await supabase.rpc('cron_schedule', {
      job_name: 'therapy-monitoring-health-check',
      schedule: '*/5 * * * *', // Every 5 minutes
      command: `
        select
          net.http_post(
            url:='${Deno.env.get('SUPABASE_URL')}/functions/v1/therapy-monitoring-job',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb,
            body:=concat('{"time": "', now(), '"}')::jsonb
          ) as request_id;
      `
    });

    if (error) {
      console.error('Error setting up cron job:', error);
      throw error;
    }

    // Also create a daily comprehensive health report
    const { data: dailyData, error: dailyError } = await supabase.rpc('cron_schedule', {
      job_name: 'therapy-daily-health-report',
      schedule: '0 8 * * *', // Daily at 8 AM
      command: `
        select
          net.http_post(
            url:='${Deno.env.get('SUPABASE_URL')}/functions/v1/therapy-monitoring-job',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb,
            body:=concat('{"time": "', now(), '", "type": "daily_report"}')::jsonb
          ) as request_id;
      `
    });

    if (dailyError) {
      console.error('Error setting up daily report job:', dailyError);
      throw dailyError;
    }

    console.log('Therapy monitoring cron jobs set up successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Therapy monitoring cron jobs configured successfully',
        jobs: [
          {
            name: 'therapy-monitoring-health-check',
            schedule: '*/5 * * * *',
            description: 'Real-time therapy system health monitoring'
          },
          {
            name: 'therapy-daily-health-report',
            schedule: '0 8 * * *',
            description: 'Daily comprehensive health report'
          }
        ],
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error setting up therapy monitoring cron:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});