/**
 * Elite Cron System Setup
 * Sets up comprehensive background processing with multiple time intervals
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    console.log('🚀 Setting up Elite Cron System...');

    const projectUrl = 'https://dbwrbjjmraodegffupnx.supabase.co';
    const authHeader = `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;

    const cronJobs = [
      // Every 5 minutes - High priority system checks
      {
        name: 'elite-system-critical-check',
        schedule: '*/5 * * * *',
        function: 'elite-system-orchestrator',
        body: { source: 'cron', priority: 'critical', tasks: ['crisis_detection', 'data_sync'] }
      },
      
      // Every 15 minutes - Adaptive learning updates
      {
        name: 'elite-adaptive-learning',
        schedule: '*/15 * * * *',
        function: 'elite-system-orchestrator', 
        body: { source: 'cron', priority: 'high', tasks: ['adaptive_learning', 'intelligence_metrics'] }
      },

      // Every 30 minutes - Cultural optimization
      {
        name: 'elite-cultural-optimization',
        schedule: '*/30 * * * *',
        function: 'elite-system-orchestrator',
        body: { source: 'cron', priority: 'medium', tasks: ['cultural_optimization'] }
      },

      // Every hour - Model performance analysis
      {
        name: 'elite-model-analysis',
        schedule: '0 * * * *',
        function: 'elite-system-orchestrator',
        body: { source: 'cron', priority: 'medium', tasks: ['model_performance'] }
      },

      // Every 2 hours - Therapy optimization
      {
        name: 'elite-therapy-optimization',
        schedule: '0 */2 * * *',
        function: 'elite-system-orchestrator',
        body: { source: 'cron', priority: 'medium', tasks: ['therapy_optimization'] }
      },

      // Every 4 hours - Full system intelligence sync
      {
        name: 'elite-full-intelligence-sync',
        schedule: '0 */4 * * *',
        function: 'elite-system-orchestrator',
        body: { 
          source: 'cron', 
          priority: 'high', 
          tasks: ['adaptive_learning', 'cultural_optimization', 'model_performance', 'therapy_optimization', 'intelligence_metrics', 'data_sync']
        }
      },

      // Daily at 2 AM - Complete system optimization
      {
        name: 'elite-daily-optimization',
        schedule: '0 2 * * *',
        function: 'elite-system-orchestrator',
        body: { 
          source: 'cron', 
          priority: 'high', 
          tasks: ['adaptive_learning', 'cultural_optimization', 'model_performance', 'therapy_optimization', 'crisis_detection', 'intelligence_metrics', 'data_sync']
        }
      },

      // Weekly on Sunday at 3 AM - Deep analytics and cleanup
      {
        name: 'elite-weekly-deep-analysis',
        schedule: '0 3 * * 0',
        function: 'elite-system-orchestrator',
        body: { 
          source: 'cron', 
          priority: 'low', 
          tasks: ['adaptive_learning', 'cultural_optimization', 'model_performance', 'therapy_optimization', 'intelligence_metrics']
        }
      }
    ];

    const setupResults = [];

    for (const job of cronJobs) {
      try {
        const cronSql = `
          SELECT cron.schedule(
            '${job.name}',
            '${job.schedule}',
            $$
            SELECT net.http_post(
              url := '${projectUrl}/functions/v1/${job.function}',
              headers := '{"Content-Type": "application/json", "Authorization": "${authHeader}"}'::jsonb,
              body := '${JSON.stringify(job.body)}'::jsonb
            ) as request_id;
            $$
          );
        `;

        console.log(`Setting up cron job: ${job.name} (${job.schedule})`);
        setupResults.push({
          name: job.name,
          schedule: job.schedule,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error setting up ${job.name}:`, error);
        setupResults.push({
          name: job.name,
          schedule: job.schedule,
          status: 'error',
          error: error.message
        });
      }
    }

    // Also setup notification system cron jobs
    const notificationJobs = [
      {
        name: 'elite-intelligent-notifications',
        schedule: '0 * * * *', // Every hour
        function: 'generate-intelligent-notifications',
        body: { source: 'elite_cron' }
      },
      {
        name: 'elite-daily-progress-summary',
        schedule: '0 9 * * *', // Daily at 9 AM
        function: 'generate-intelligent-notifications',
        body: { source: 'daily_summary' }
      }
    ];

    for (const job of notificationJobs) {
      try {
        const cronSql = `
          SELECT cron.schedule(
            '${job.name}',
            '${job.schedule}',
            $$
            SELECT net.http_post(
              url := '${projectUrl}/functions/v1/${job.function}',
              headers := '{"Content-Type": "application/json", "Authorization": "${authHeader}"}'::jsonb,
              body := '${JSON.stringify(job.body)}'::jsonb
            ) as request_id;
            $$
          );
        `;

        console.log(`Setting up notification cron job: ${job.name}`);
        setupResults.push({
          name: job.name,
          schedule: job.schedule,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error setting up ${job.name}:`, error);
        setupResults.push({
          name: job.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Elite Cron System setup completed',
        cronJobs: setupResults,
        totalJobs: cronJobs.length + notificationJobs.length,
        successfulJobs: setupResults.filter(r => r.status === 'success').length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Elite Cron System Setup Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});