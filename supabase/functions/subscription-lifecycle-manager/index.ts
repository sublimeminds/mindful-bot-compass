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
    console.log('Subscription lifecycle manager started');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const results = {
      expirationWarnings: 0,
      trialExpirations: 0,
      failedPayments: 0,
      reactivationCampaigns: 0
    };

    // 1. Handle subscription expiration warnings (30, 14, 7, 3, 1 days)
    const warningDays = [30, 14, 7, 3, 1];
    
    for (const days of warningDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(23, 59, 59, 999); // End of day

      console.log(`Checking for subscriptions expiring in ${days} days`);

      const { data: expiringSubscriptions } = await supabaseClient
        .from('user_subscriptions')
        .select(`
          *,
          profiles!inner(email, name, preferred_language)
        `)
        .eq('status', 'active')
        .gte('current_period_end', targetDate.toISOString().split('T')[0])
        .lt('current_period_end', new Date(targetDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (expiringSubscriptions?.length) {
        console.log(`Found ${expiringSubscriptions.length} subscriptions expiring in ${days} days`);

        for (const subscription of expiringSubscriptions) {
          // Check if we already sent this warning
          const { data: existingEvent } = await supabaseClient
            .from('subscription_lifecycle_events')
            .select('id')
            .eq('user_id', subscription.user_id)
            .eq('event_type', `expiration_warning_${days}d`)
            .gte('created_at', new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString());

          if (!existingEvent?.length) {
            // Send expiration warning
            await supabaseClient.functions.invoke('enhanced-email-notifications', {
              body: {
                userId: subscription.user_id,
                templateKey: 'subscription_expiration_warning',
                data: {
                  userName: subscription.profiles.name,
                  daysRemaining: days,
                  expirationDate: new Date(subscription.current_period_end).toLocaleDateString(),
                  renewUrl: `${Deno.env.get('SUPABASE_URL')}/subscription`,
                  planName: subscription.billing_cycle
                },
                language: subscription.profiles.preferred_language
              }
            });

            // Record the event
            await supabaseClient
              .from('subscription_lifecycle_events')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                event_type: `expiration_warning_${days}d`,
                event_data: {
                  days_remaining: days,
                  expiration_date: subscription.current_period_end,
                  billing_cycle: subscription.billing_cycle
                },
                triggered_notifications: [`expiration_warning_${days}d_email`]
              });

            results.expirationWarnings++;
          }
        }
      }
    }

    // 2. Handle trial expirations (7, 3, 1 days)
    const trialWarningDays = [7, 3, 1];
    
    for (const days of trialWarningDays) {
      const trialTargetDate = new Date();
      trialTargetDate.setDate(trialTargetDate.getDate() + days);

      const { data: expiringTrials } = await supabaseClient
        .from('user_subscriptions')
        .select(`
          *,
          profiles!inner(email, name, preferred_language)
        `)
        .eq('status', 'trialing')
        .gte('trial_end', trialTargetDate.toISOString().split('T')[0])
        .lt('trial_end', new Date(trialTargetDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (expiringTrials?.length) {
        for (const trial of expiringTrials) {
          const { data: existingEvent } = await supabaseClient
            .from('subscription_lifecycle_events')
            .select('id')
            .eq('user_id', trial.user_id)
            .eq('event_type', `trial_warning_${days}d`)
            .gte('created_at', new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString());

          if (!existingEvent?.length) {
            await supabaseClient.functions.invoke('enhanced-email-notifications', {
              body: {
                userId: trial.user_id,
                templateKey: 'trial_expiration_warning',
                data: {
                  userName: trial.profiles.name,
                  daysRemaining: days,
                  trialEndDate: new Date(trial.trial_end).toLocaleDateString(),
                  upgradeUrl: `${Deno.env.get('SUPABASE_URL')}/subscription`,
                  features: ['Unlimited sessions', 'Advanced analytics', 'Priority support']
                },
                language: trial.profiles.preferred_language
              }
            });

            await supabaseClient
              .from('subscription_lifecycle_events')
              .insert({
                user_id: trial.user_id,
                subscription_id: trial.id,
                event_type: `trial_warning_${days}d`,
                event_data: {
                  days_remaining: days,
                  trial_end: trial.trial_end
                },
                triggered_notifications: [`trial_warning_${days}d_email`]
              });

            results.trialExpirations++;
          }
        }
      }
    }

    // 3. Handle failed payment recovery (immediate, 3-day, 7-day)
    const { data: failedPayments } = await supabaseClient
      .from('user_subscriptions')
      .select(`
        *,
        profiles!inner(email, name, preferred_language)
      `)
      .eq('status', 'past_due');

    if (failedPayments?.length) {
      for (const subscription of failedPayments) {
        const daysSinceFailed = Math.floor((now.getTime() - new Date(subscription.updated_at).getTime()) / (1000 * 60 * 60 * 24));
        
        let templateKey = '';
        let eventType = '';
        
        if (daysSinceFailed === 0) {
          templateKey = 'payment_failed_immediate';
          eventType = 'payment_failed_immediate';
        } else if (daysSinceFailed === 3) {
          templateKey = 'payment_failed_3day';
          eventType = 'payment_failed_3day';
        } else if (daysSinceFailed === 7) {
          templateKey = 'payment_failed_7day';
          eventType = 'payment_failed_7day';
        }

        if (templateKey) {
          const { data: existingEvent } = await supabaseClient
            .from('subscription_lifecycle_events')
            .select('id')
            .eq('user_id', subscription.user_id)
            .eq('event_type', eventType)
            .gte('created_at', new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString());

          if (!existingEvent?.length) {
            await supabaseClient.functions.invoke('enhanced-email-notifications', {
              body: {
                userId: subscription.user_id,
                templateKey,
                data: {
                  userName: subscription.profiles.name,
                  daysSinceFailed,
                  updatePaymentUrl: `${Deno.env.get('SUPABASE_URL')}/subscription/payment-methods`,
                  supportUrl: `${Deno.env.get('SUPABASE_URL')}/support`,
                  planName: subscription.billing_cycle
                },
                language: subscription.profiles.preferred_language,
                priority: 2
              }
            });

            await supabaseClient
              .from('subscription_lifecycle_events')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                event_type: eventType,
                event_data: {
                  days_since_failed: daysSinceFailed,
                  billing_cycle: subscription.billing_cycle
                },
                triggered_notifications: [`${eventType}_email`]
              });

            results.failedPayments++;
          }
        }
      }
    }

    // 4. Reactivation campaigns for canceled users (30, 60, 90 days)
    const reactivationDays = [30, 60, 90];
    
    for (const days of reactivationDays) {
      const canceledDate = new Date();
      canceledDate.setDate(canceledDate.getDate() - days);

      const { data: canceledUsers } = await supabaseClient
        .from('user_subscriptions')
        .select(`
          *,
          profiles!inner(email, name, preferred_language)
        `)
        .eq('status', 'canceled')
        .gte('canceled_at', canceledDate.toISOString().split('T')[0])
        .lt('canceled_at', new Date(canceledDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (canceledUsers?.length) {
        for (const user of canceledUsers) {
          const { data: existingEvent } = await supabaseClient
            .from('subscription_lifecycle_events')
            .select('id')
            .eq('user_id', user.user_id)
            .eq('event_type', `reactivation_${days}d`)
            .gte('created_at', new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString());

          if (!existingEvent?.length) {
            await supabaseClient.functions.invoke('enhanced-email-notifications', {
              body: {
                userId: user.user_id,
                templateKey: 'reactivation_campaign',
                data: {
                  userName: user.profiles.name,
                  daysSinceCanceled: days,
                  reactivateUrl: `${Deno.env.get('SUPABASE_URL')}/subscription?promo=welcome_back`,
                  specialOffer: days === 30 ? '20% off first month' : days === 60 ? '30% off first month' : 'Free 7-day trial',
                  features: ['New AI therapists', 'Enhanced progress tracking', 'Group sessions']
                },
                language: user.profiles.preferred_language
              }
            });

            await supabaseClient
              .from('subscription_lifecycle_events')
              .insert({
                user_id: user.user_id,
                subscription_id: user.id,
                event_type: `reactivation_${days}d`,
                event_data: {
                  days_since_canceled: days,
                  offer_type: days === 30 ? '20_percent_off' : days === 60 ? '30_percent_off' : 'free_trial'
                },
                triggered_notifications: [`reactivation_${days}d_email`]
              });

            results.reactivationCampaigns++;
          }
        }
      }
    }

    console.log('Subscription lifecycle management completed:', results);

    return new Response(JSON.stringify({
      success: true,
      processed: results,
      timestamp: now.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in subscription lifecycle manager:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});