import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    const {
      affiliateCode,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landingPage,
      deviceFingerprint,
      userAgent,
      ipAddress,
      sessionId
    } = await req.json();

    console.log('Tracking affiliate click:', { affiliateCode, deviceFingerprint });

    // Get affiliate by code
    const { data: affiliate, error: affiliateError } = await supabaseClient
      .from('affiliates')
      .select('id, status')
      .eq('affiliate_code', affiliateCode)
      .eq('status', 'active')
      .single();

    if (affiliateError || !affiliate) {
      console.error('Affiliate not found or inactive:', affiliateCode);
      return new Response(JSON.stringify({ error: 'Invalid affiliate code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create referral record
    const { data: referral, error: referralError } = await supabaseClient
      .from('affiliate_referrals')
      .insert({
        affiliate_id: affiliate.id,
        referral_code: affiliateCode,
        click_data: {
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          referrer,
          landingPage,
          userAgent,
          sessionId,
          timestamp: new Date().toISOString()
        },
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer_url: referrer,
        landing_page: landingPage,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        device_fingerprint: deviceFingerprint,
        session_id: sessionId
      })
      .select()
      .single();

    if (referralError) {
      console.error('Error creating referral:', referralError);
      return new Response(JSON.stringify({ error: 'Failed to track click' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update affiliate metrics
    const today = new Date().toISOString().split('T')[0];
    await supabaseClient
      .from('affiliate_metrics')
      .upsert({
        affiliate_id: affiliate.id,
        metric_date: today,
        clicks: 1,
        unique_visitors: 1
      }, {
        onConflict: 'affiliate_id,metric_date',
        ignoreDuplicates: false
      });

    // Update daily metrics with increment
    await supabaseClient.rpc('increment', {
      table_name: 'affiliate_metrics',
      row_id: `${affiliate.id}_${today}`,
      column_name: 'clicks',
      increment_by: 1
    }).catch(() => {
      // If RPC fails, try direct update
      supabaseClient
        .from('affiliate_metrics')
        .update({ 
          clicks: supabaseClient.raw('clicks + 1'),
          unique_visitors: supabaseClient.raw('unique_visitors + 1')
        })
        .eq('affiliate_id', affiliate.id)
        .eq('metric_date', today);
    });

    console.log('Affiliate click tracked successfully:', referral.id);

    return new Response(JSON.stringify({ 
      success: true, 
      referralId: referral.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in track-affiliate-click:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});