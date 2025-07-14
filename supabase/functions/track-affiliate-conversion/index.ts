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
    const { affiliateCode, conversion, deviceFingerprint, ...trackingData } = await req.json();
    
    console.log('Processing affiliate conversion:', { 
      affiliateCode, 
      orderValue: conversion.orderValue,
      productType: conversion.productType 
    });

    // Get affiliate
    const { data: affiliate, error: affiliateError } = await supabaseClient
      .from('affiliates')
      .select('id, status, tier_id')
      .eq('affiliate_code', affiliateCode)
      .eq('status', 'active')
      .single();

    if (affiliateError || !affiliate) {
      console.error('Affiliate not found:', affiliateCode);
      return new Response(JSON.stringify({ error: 'Invalid affiliate code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Find existing referral to update
    const { data: existingReferral } = await supabaseClient
      .from('affiliate_referrals')
      .select('id, converted_at')
      .eq('affiliate_id', affiliate.id)
      .eq('referral_code', affiliateCode)
      .or(`device_fingerprint.eq.${deviceFingerprint},session_id.eq.${trackingData.sessionId}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Prevent duplicate conversions
    if (existingReferral?.converted_at) {
      console.log('Conversion already tracked for this referral');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Conversion already tracked' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Calculate commission
    const { data: commissionAmount } = await supabaseClient
      .rpc('calculate_commission', {
        affiliate_id_param: affiliate.id,
        product_type_param: conversion.productType,
        product_id_param: conversion.productId || null,
        order_value_param: conversion.orderValue
      });

    console.log('Calculated commission:', commissionAmount);

    // Get user if available
    let userId = null;
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: userData } = await supabaseClient.auth.getUser(token);
        userId = userData.user?.id;
      }
    } catch (e) {
      console.log('No authenticated user for conversion');
    }

    // Update or create referral with conversion data
    let referralId = existingReferral?.id;
    if (existingReferral) {
      // Update existing referral
      const { error: updateError } = await supabaseClient
        .from('affiliate_referrals')
        .update({
          referred_user_id: userId,
          converted_at: new Date().toISOString(),
          conversion_value: conversion.orderValue,
          commission_amount: commissionAmount || 0,
          conversion_data: conversion,
          order_id: conversion.orderId,
          subscription_id: conversion.subscriptionId,
          commission_status: 'pending'
        })
        .eq('id', existingReferral.id);

      if (updateError) {
        console.error('Error updating referral:', updateError);
        throw updateError;
      }
    } else {
      // Create new referral record
      const { data: newReferral, error: createError } = await supabaseClient
        .from('affiliate_referrals')
        .insert({
          affiliate_id: affiliate.id,
          referred_user_id: userId,
          referral_code: affiliateCode,
          device_fingerprint: deviceFingerprint,
          converted_at: new Date().toISOString(),
          conversion_value: conversion.orderValue,
          commission_amount: commissionAmount || 0,
          conversion_data: conversion,
          order_id: conversion.orderId,
          subscription_id: conversion.subscriptionId,
          commission_status: 'pending',
          click_data: trackingData
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating referral:', createError);
        throw createError;
      }
      
      referralId = newReferral.id;
    }

    // Update affiliate totals
    await supabaseClient
      .from('affiliates')
      .update({
        total_referrals: supabaseClient.raw('total_referrals + 1'),
        total_revenue: supabaseClient.raw(`total_revenue + ${conversion.orderValue}`),
        total_commissions_earned: supabaseClient.raw(`total_commissions_earned + ${commissionAmount || 0}`)
      })
      .eq('id', affiliate.id);

    // Update affiliate metrics
    const today = new Date().toISOString().split('T')[0];
    await supabaseClient
      .from('affiliate_metrics')
      .upsert({
        affiliate_id: affiliate.id,
        metric_date: today,
        conversions: 1,
        revenue: conversion.orderValue,
        commissions_earned: commissionAmount || 0,
        avg_order_value: conversion.orderValue
      }, {
        onConflict: 'affiliate_id,metric_date'
      });

    // Calculate and update conversion rate
    const { data: metrics } = await supabaseClient
      .from('affiliate_metrics')
      .select('clicks, conversions')
      .eq('affiliate_id', affiliate.id)
      .eq('metric_date', today)
      .single();

    if (metrics && metrics.clicks > 0) {
      await supabaseClient
        .from('affiliate_metrics')
        .update({
          conversion_rate: metrics.conversions / metrics.clicks
        })
        .eq('affiliate_id', affiliate.id)
        .eq('metric_date', today);
    }

    console.log('Affiliate conversion tracked successfully:', referralId);

    return new Response(JSON.stringify({
      success: true,
      referralId,
      commissionAmount: commissionAmount || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in track-affiliate-conversion:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});