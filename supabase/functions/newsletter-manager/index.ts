import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignRequest {
  action: 'create' | 'send' | 'schedule' | 'list' | 'analytics';
  campaignData?: {
    name: string;
    templateKey: string;
    subject: string;
    targetAudience: Record<string, any>;
    segmentationRules: Record<string, any>;
    sendAt?: string;
    abTestConfig?: Record<string, any>;
  };
  campaignId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Newsletter manager function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, campaignData, campaignId }: CampaignRequest = await req.json();

    switch (action) {
      case 'create':
        if (!campaignData) {
          return new Response('Campaign data required', { status: 400, headers: corsHeaders });
        }

        const { data: campaign, error: createError } = await supabaseClient
          .from('newsletter_campaigns')
          .insert({
            name: campaignData.name,
            template_key: campaignData.templateKey,
            subject: campaignData.subject,
            target_audience: campaignData.targetAudience,
            segmentation_rules: campaignData.segmentationRules,
            send_at: campaignData.sendAt,
            a_b_test_config: campaignData.abTestConfig,
            status: campaignData.sendAt ? 'scheduled' : 'draft'
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return new Response(JSON.stringify({ success: true, campaign }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'send':
        if (!campaignId) {
          return new Response('Campaign ID required', { status: 400, headers: corsHeaders });
        }

        // Get campaign details
        const { data: campaignToSend, error: campaignError } = await supabaseClient
          .from('newsletter_campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (campaignError || !campaignToSend) {
          return new Response('Campaign not found', { status: 404, headers: corsHeaders });
        }

        // Build audience query based on segmentation rules
        let audienceQuery = supabaseClient
          .from('profiles')
          .select('id, email, name, preferred_language');

        // Apply segmentation rules
        const rules = campaignToSend.segmentation_rules || {};
        
        if (rules.subscriptionPlan) {
          audienceQuery = audienceQuery.eq('subscription_plan', rules.subscriptionPlan);
        }
        
        if (rules.joinedAfter) {
          audienceQuery = audienceQuery.gte('created_at', rules.joinedAfter);
        }
        
        if (rules.joinedBefore) {
          audienceQuery = audienceQuery.lte('created_at', rules.joinedBefore);
        }

        // Get newsletter preferences
        const { data: audience, error: audienceError } = await audienceQuery;

        if (audienceError) {
          throw audienceError;
        }

        if (!audience?.length) {
          return new Response('No audience found', { status: 400, headers: corsHeaders });
        }

        // Filter by newsletter preferences
        const { data: preferences } = await supabaseClient
          .from('enhanced_notification_preferences')
          .select('user_id, newsletter_subscribed, email_notifications')
          .in('user_id', audience.map(u => u.id));

        const subscribedUsers = audience.filter(user => {
          const userPrefs = preferences?.find(p => p.user_id === user.id);
          return !userPrefs || (userPrefs.newsletter_subscribed && userPrefs.email_notifications);
        });

        console.log(`Sending newsletter to ${subscribedUsers.length} subscribers`);

        // Update campaign status
        await supabaseClient
          .from('newsletter_campaigns')
          .update({ status: 'sending' })
          .eq('id', campaignId);

        // Create recipient records
        const recipients = subscribedUsers.map(user => ({
          campaign_id: campaignId,
          user_id: user.id,
          email: user.email,
          status: 'pending'
        }));

        await supabaseClient
          .from('campaign_recipients')
          .insert(recipients);

        // Send emails in batches
        const batchSize = 50;
        let sentCount = 0;
        let errorCount = 0;

        for (let i = 0; i < subscribedUsers.length; i += batchSize) {
          const batch = subscribedUsers.slice(i, i + batchSize);
          
          const sendPromises = batch.map(async (user) => {
            try {
              // A/B test logic
              let templateKey = campaignToSend.template_key;
              if (campaignToSend.a_b_test_config && Math.random() < 0.5) {
                templateKey = campaignToSend.a_b_test_config.variant_template_key || templateKey;
              }

              await supabaseClient.functions.invoke('enhanced-email-notifications', {
                body: {
                  userId: user.id,
                  templateKey,
                  data: {
                    userName: user.name,
                    campaignName: campaignToSend.name,
                    unsubscribeUrl: `${Deno.env.get('SUPABASE_URL')}/unsubscribe?campaign=${campaignId}&user=${user.id}`
                  },
                  language: user.preferred_language
                }
              });

              // Update recipient status
              await supabaseClient
                .from('campaign_recipients')
                .update({ 
                  status: 'sent', 
                  sent_at: new Date().toISOString() 
                })
                .eq('campaign_id', campaignId)
                .eq('user_id', user.id);

              sentCount++;
            } catch (error) {
              console.error(`Failed to send to user ${user.id}:`, error);
              
              await supabaseClient
                .from('campaign_recipients')
                .update({ 
                  status: 'failed',
                  bounce_reason: error.message
                })
                .eq('campaign_id', campaignId)
                .eq('user_id', user.id);

              errorCount++;
            }
          });

          await Promise.allSettled(sendPromises);
          
          // Rate limiting - wait between batches
          if (i + batchSize < subscribedUsers.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Update campaign with final status and analytics
        await supabaseClient
          .from('newsletter_campaigns')
          .update({ 
            status: 'sent',
            analytics_data: {
              total_recipients: subscribedUsers.length,
              sent_count: sentCount,
              error_count: errorCount,
              sent_at: new Date().toISOString()
            }
          })
          .eq('id', campaignId);

        return new Response(JSON.stringify({
          success: true,
          sentCount,
          errorCount,
          totalRecipients: subscribedUsers.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'schedule':
        // Handle scheduled campaign processing
        const now = new Date();
        
        const { data: scheduledCampaigns } = await supabaseClient
          .from('newsletter_campaigns')
          .select('*')
          .eq('status', 'scheduled')
          .lte('send_at', now.toISOString());

        let processedCount = 0;

        if (scheduledCampaigns?.length) {
          for (const campaign of scheduledCampaigns) {
            // Recursively call send action
            await supabaseClient.functions.invoke('newsletter-manager', {
              body: {
                action: 'send',
                campaignId: campaign.id
              }
            });
            processedCount++;
          }
        }

        return new Response(JSON.stringify({
          success: true,
          processedCount
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'list':
        const { data: campaigns } = await supabaseClient
          .from('newsletter_campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        return new Response(JSON.stringify({ campaigns }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'analytics':
        if (!campaignId) {
          return new Response('Campaign ID required', { status: 400, headers: corsHeaders });
        }

        // Get campaign analytics
        const { data: campaignAnalytics } = await supabaseClient
          .from('newsletter_campaigns')
          .select('*, analytics_data')
          .eq('id', campaignId)
          .single();

        // Get recipient analytics
        const { data: recipientStats } = await supabaseClient
          .from('campaign_recipients')
          .select('status')
          .eq('campaign_id', campaignId);

        // Get email analytics
        const { data: emailStats } = await supabaseClient
          .from('email_analytics')
          .select('event_type, created_at')
          .eq('campaign_id', campaignId);

        const analytics = {
          campaign: campaignAnalytics,
          recipient_breakdown: recipientStats?.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          email_events: emailStats?.reduce((acc, e) => {
            acc[e.event_type] = (acc[e.event_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };

        return new Response(JSON.stringify({ analytics }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders });
    }

  } catch (error) {
    console.error('Error in newsletter manager:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});