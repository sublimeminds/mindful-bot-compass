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
    console.log('Processing notification queue');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    let processedCount = 0;
    let errorCount = 0;

    // Get pending notifications that are ready to send
    const { data: pendingNotifications } = await supabaseClient
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('send_at', now.toISOString())
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(100); // Process in batches

    if (!pendingNotifications?.length) {
      console.log('No pending notifications to process');
      return new Response(JSON.stringify({ success: true, processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${pendingNotifications.length} notifications`);

    for (const notification of pendingNotifications) {
      try {
        // Update status to sending
        await supabaseClient
          .from('notification_queue')
          .update({ status: 'sending' })
          .eq('id', notification.id);

        // Send the notification
        const response = await supabaseClient.functions.invoke('enhanced-email-notifications', {
          body: {
            userId: notification.user_id,
            templateKey: notification.template_key,
            data: notification.template_data || {},
            priority: notification.priority
          }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        // Mark as sent
        await supabaseClient
          .from('notification_queue')
          .update({ 
            status: 'sent',
            sent_at: now.toISOString(),
            error_message: null
          })
          .eq('id', notification.id);

        processedCount++;
        console.log(`Processed notification ${notification.id}`);

      } catch (error) {
        console.error(`Failed to process notification ${notification.id}:`, error);
        
        const newRetryCount = notification.current_retry_count + 1;
        const shouldRetry = newRetryCount < notification.max_retry_count;

        if (shouldRetry) {
          // Schedule retry with exponential backoff
          const retryDelay = Math.pow(2, newRetryCount) * 60 * 1000; // 2, 4, 8 minutes
          const retryAt = new Date(now.getTime() + retryDelay);

          await supabaseClient
            .from('notification_queue')
            .update({ 
              status: 'pending',
              current_retry_count: newRetryCount,
              send_at: retryAt.toISOString(),
              error_message: error.message
            })
            .eq('id', notification.id);

          console.log(`Scheduled retry ${newRetryCount} for notification ${notification.id} at ${retryAt}`);
        } else {
          // Mark as failed
          await supabaseClient
            .from('notification_queue')
            .update({ 
              status: 'failed',
              error_message: error.message
            })
            .eq('id', notification.id);

          console.log(`Notification ${notification.id} failed after ${newRetryCount} attempts`);
        }
        
        errorCount++;
      }
    }

    // Clean up old processed notifications (older than 7 days)
    const cleanupDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    await supabaseClient
      .from('notification_queue')
      .delete()
      .in('status', ['sent', 'failed'])
      .lt('created_at', cleanupDate.toISOString());

    console.log(`Notification queue processing completed: ${processedCount} processed, ${errorCount} errors`);

    return new Response(JSON.stringify({
      success: true,
      processed: processedCount,
      errors: errorCount,
      timestamp: now.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing notification queue:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});