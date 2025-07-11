import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpsellRequest {
  action: 'check_triggers' | 'create_campaign' | 'track_interaction' | 'get_recommendations';
  userId?: string;
  campaignData?: any;
  interactionData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Intelligent upselling function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, userId, campaignData, interactionData }: UpsellRequest = await req.json();

    switch (action) {
      case 'check_triggers':
        console.log('Checking upselling triggers for all users');
        
        // Get active upselling campaigns
        const { data: campaigns } = await supabaseClient
          .from('upselling_campaigns')
          .select('*')
          .eq('is_active', true)
          .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString());

        if (!campaigns?.length) {
          return new Response(JSON.stringify({ success: true, triggered: 0 }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        let triggeredCount = 0;

        for (const campaign of campaigns) {
          const conditions = campaign.trigger_conditions;
          let targetUsers: any[] = [];

          switch (campaign.trigger_type) {
            case 'usage_limit':
              // Find users approaching their plan limits
              const { data: heavyUsers } = await supabaseClient
                .from('user_usage')
                .select(`
                  user_id,
                  resource_type,
                  usage_count,
                  profiles!inner(subscription_plan, email, name, preferred_language)
                `)
                .eq('resource_type', conditions.resource_type)
                .gte('usage_count', conditions.threshold_percentage * conditions.plan_limit / 100)
                .eq('profiles.subscription_plan', conditions.current_plan);

              targetUsers = heavyUsers || [];
              break;

            case 'feature_discovery':
              // Find users who haven't used premium features
              const { data: potentialUsers } = await supabaseClient
                .from('profiles')
                .select('id, email, name, preferred_language, subscription_plan, created_at')
                .eq('subscription_plan', conditions.current_plan)
                .gte('created_at', new Date(Date.now() - conditions.days_since_signup * 24 * 60 * 60 * 1000).toISOString());

              targetUsers = potentialUsers || [];
              break;

            case 'milestone':
              // Find users who achieved specific milestones
              const { data: milestoneUsers } = await supabaseClient
                .from('user_stats')
                .select(`
                  user_id,
                  total_sessions,
                  current_streak,
                  profiles!inner(subscription_plan, email, name, preferred_language)
                `)
                .gte(conditions.metric, conditions.threshold)
                .eq('profiles.subscription_plan', conditions.current_plan);

              targetUsers = milestoneUsers || [];
              break;

            case 'time_based':
              // Find users based on time since signup/last activity
              const timeThreshold = new Date(Date.now() - conditions.days * 24 * 60 * 60 * 1000);
              
              const { data: timeBasedUsers } = await supabaseClient
                .from('profiles')
                .select('id, email, name, preferred_language, subscription_plan, created_at')
                .eq('subscription_plan', conditions.current_plan)
                .lte('created_at', timeThreshold.toISOString());

              targetUsers = timeBasedUsers || [];
              break;
          }

          // Send upselling messages to target users
          for (const user of targetUsers) {
            // Check if we already sent this campaign to this user recently
            const { data: recentInteraction } = await supabaseClient
              .from('upselling_interactions')
              .select('id')
              .eq('campaign_id', campaign.id)
              .eq('user_id', user.user_id || user.id)
              .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
              .limit(1);

            if (!recentInteraction?.length) {
              // Send upselling email
              if (campaign.email_template_key) {
                await supabaseClient.functions.invoke('enhanced-email-notifications', {
                  body: {
                    userId: user.user_id || user.id,
                    templateKey: campaign.email_template_key,
                    data: {
                      userName: user.name || user.profiles?.name,
                      currentPlan: user.subscription_plan || user.profiles?.subscription_plan,
                      targetPlan: campaign.target_plan,
                      discount: campaign.discount_percentage,
                      upgradeUrl: `${Deno.env.get('SUPABASE_URL')}/subscription?campaign=${campaign.id}&discount=${campaign.discount_percentage}`,
                      features: this.getTargetPlanFeatures(campaign.target_plan),
                      validUntil: campaign.valid_until ? new Date(campaign.valid_until).toLocaleDateString() : null
                    },
                    language: user.preferred_language || user.profiles?.preferred_language
                  }
                });
              }

              // Track the interaction
              await supabaseClient
                .from('upselling_interactions')
                .insert({
                  campaign_id: campaign.id,
                  user_id: user.user_id || user.id,
                  interaction_type: 'shown',
                  interaction_context: {
                    trigger_type: campaign.trigger_type,
                    conditions_met: conditions,
                    channel: 'email'
                  }
                });

              triggeredCount++;
            }
          }
        }

        return new Response(JSON.stringify({ success: true, triggered: triggeredCount }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'track_interaction':
        if (!userId || !interactionData) {
          return new Response('User ID and interaction data required', { status: 400, headers: corsHeaders });
        }

        const { data: interaction } = await supabaseClient
          .from('upselling_interactions')
          .insert({
            campaign_id: interactionData.campaignId,
            user_id: userId,
            interaction_type: interactionData.type, // 'clicked', 'dismissed', 'converted'
            interaction_context: interactionData.context,
            conversion_value: interactionData.conversionValue || null
          })
          .select()
          .single();

        // Update campaign metrics
        if (interactionData.type === 'converted') {
          const { data: campaign } = await supabaseClient
            .from('upselling_campaigns')
            .select('success_metrics')
            .eq('id', interactionData.campaignId)
            .single();

          const metrics = campaign?.success_metrics || {};
          metrics.total_conversions = (metrics.total_conversions || 0) + 1;
          metrics.total_revenue = (metrics.total_revenue || 0) + (interactionData.conversionValue || 0);

          await supabaseClient
            .from('upselling_campaigns')
            .update({ success_metrics: metrics })
            .eq('id', interactionData.campaignId);
        }

        return new Response(JSON.stringify({ success: true, interaction }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'get_recommendations':
        if (!userId) {
          return new Response('User ID required', { status: 400, headers: corsHeaders });
        }

        // Get user profile and usage data
        const { data: userProfile } = await supabaseClient
          .from('profiles')
          .select('*, user_stats(*)')
          .eq('id', userId)
          .single();

        if (!userProfile) {
          return new Response('User not found', { status: 404, headers: corsHeaders });
        }

        // Get user's recent usage
        const { data: recentUsage } = await supabaseClient
          .from('user_usage')
          .select('*')
          .eq('user_id', userId)
          .gte('period_start', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        // Generate AI-powered recommendations
        const recommendations = this.generatePersonalizedRecommendations(userProfile, recentUsage);

        return new Response(JSON.stringify({ recommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'create_campaign':
        if (!campaignData) {
          return new Response('Campaign data required', { status: 400, headers: corsHeaders });
        }

        const { data: newCampaign } = await supabaseClient
          .from('upselling_campaigns')
          .insert(campaignData)
          .select()
          .single();

        return new Response(JSON.stringify({ success: true, campaign: newCampaign }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders });
    }

  } catch (error) {
    console.error('Error in intelligent upselling:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions (would be methods in a class)
function getTargetPlanFeatures(planName: string): string[] {
  const features = {
    'Premium': [
      'Unlimited therapy sessions',
      'Advanced progress analytics',
      'Priority customer support',
      'Custom goal templates',
      'Export data and reports'
    ],
    'Enterprise': [
      'Everything in Premium',
      'Team collaboration features',
      'Advanced admin controls',
      'Custom integrations',
      'Dedicated account manager',
      'Priority feature requests'
    ]
  };
  
  return features[planName as keyof typeof features] || [];
}

function generatePersonalizedRecommendations(userProfile: any, recentUsage: any[]): any[] {
  const recommendations = [];
  const currentPlan = userProfile.subscription_plan;
  const stats = userProfile.user_stats?.[0];

  // High usage recommendation
  if (recentUsage?.length) {
    const totalUsage = recentUsage.reduce((sum, usage) => sum + usage.usage_count, 0);
    if (totalUsage > 50 && currentPlan === 'Free') {
      recommendations.push({
        type: 'usage_based',
        title: 'Unlock Unlimited Access',
        description: `You've been very active with ${totalUsage} sessions this month! Upgrade to Premium for unlimited access.`,
        targetPlan: 'Premium',
        confidence: 0.9,
        discount: 20
      });
    }
  }

  // Engagement-based recommendation
  if (stats?.current_streak >= 7 && currentPlan !== 'Premium') {
    recommendations.push({
      type: 'engagement_based',
      title: 'Maintain Your Momentum',
      description: `Amazing ${stats.current_streak}-day streak! Upgrade to Premium to access advanced tools that will help you maintain this progress.`,
      targetPlan: 'Premium',
      confidence: 0.8,
      discount: 15
    });
  }

  // Feature discovery recommendation
  if (stats?.total_sessions >= 10 && currentPlan === 'Free') {
    recommendations.push({
      type: 'feature_discovery',
      title: 'Advanced Analytics Available',
      description: 'With 10+ sessions completed, you could benefit from detailed progress analytics and custom goal tracking.',
      targetPlan: 'Premium',
      confidence: 0.7,
      discount: 10
    });
  }

  return recommendations.sort((a, b) => b.confidence - a.confidence);
}