import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FraudAlert {
  user_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: any;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FRAUD-MONITOR] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting fraud monitoring check");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const alerts: FraudAlert[] = [];

    // 1. Check for VPN/Proxy patterns
    logStep("Checking for VPN/Proxy patterns");
    const { data: suspiciousIPs } = await supabaseClient
      .from('user_behavioral_analytics')
      .select('user_id, ip_address, country_claimed, country_detected')
      .neq('country_claimed', 'country_detected')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (suspiciousIPs && suspiciousIPs.length > 0) {
      for (const record of suspiciousIPs) {
        alerts.push({
          user_id: record.user_id,
          alert_type: 'location_mismatch',
          severity: 'medium',
          description: 'Country mismatch detected between claimed and detected location',
          evidence: {
            claimed_country: record.country_claimed,
            detected_country: record.country_detected,
            ip_address: record.ip_address
          }
        });
      }
    }

    // 2. Check for multiple rapid location changes
    logStep("Checking for rapid location changes");
    const { data: locationChanges } = await supabaseClient
      .from('user_behavioral_analytics')
      .select('user_id, country_claimed, created_at')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false });

    if (locationChanges) {
      const userLocationMap = new Map<string, string[]>();
      
      for (const change of locationChanges) {
        if (!userLocationMap.has(change.user_id)) {
          userLocationMap.set(change.user_id, []);
        }
        userLocationMap.get(change.user_id)!.push(change.country_claimed);
      }

      userLocationMap.forEach((locations, userId) => {
        const uniqueLocations = [...new Set(locations)];
        if (uniqueLocations.length >= 3) {
          alerts.push({
            user_id: userId,
            alert_type: 'rapid_location_changes',
            severity: 'high',
            description: `User changed location ${uniqueLocations.length} times in the last hour`,
            evidence: {
              locations: uniqueLocations,
              change_count: uniqueLocations.length,
              time_window: '1 hour'
            }
          });
        }
      });
    }

    // 3. Check for suspicious signup patterns
    logStep("Checking for suspicious signup patterns");
    const { data: recentSignups } = await supabaseClient
      .from('user_behavioral_analytics')
      .select('user_id, country_claimed, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .eq('event_type', 'signup');

    if (recentSignups) {
      const countrySignupCounts = new Map<string, number>();
      
      for (const signup of recentSignups) {
        const current = countrySignupCounts.get(signup.country_claimed) || 0;
        countrySignupCounts.set(signup.country_claimed, current + 1);
      }

      countrySignupCounts.forEach((count, country) => {
        if (count > 10) { // More than 10 signups from same country in 24h
          alerts.push({
            user_id: 'system',
            alert_type: 'suspicious_signup_volume',
            severity: 'medium',
            description: `Unusual signup volume detected from ${country}`,
            evidence: {
              country,
              signup_count: count,
              time_window: '24 hours'
            }
          });
        }
      });
    }

    // 4. Check for users with consistently low trust scores
    logStep("Checking for low trust scores");
    const { data: lowTrustUsers } = await supabaseClient
      .from('user_location_confidence')
      .select('user_id, confidence_score, trust_level, verification_count')
      .lt('confidence_score', 0.3)
      .gte('verification_count', 5);

    if (lowTrustUsers) {
      for (const user of lowTrustUsers) {
        alerts.push({
          user_id: user.user_id,
          alert_type: 'persistently_low_trust',
          severity: 'high',
          description: 'User maintains low trust score despite multiple verifications',
          evidence: {
            confidence_score: user.confidence_score,
            trust_level: user.trust_level,
            verification_count: user.verification_count
          }
        });
      }
    }

    // Store alerts in database
    if (alerts.length > 0) {
      logStep(`Storing ${alerts.length} fraud alerts`);
      const { error: insertError } = await supabaseClient
        .from('regional_pricing_alerts')
        .insert(alerts);

      if (insertError) {
        console.error('Failed to store alerts:', insertError);
      }
    }

    // Update user trust levels based on alerts
    for (const alert of alerts) {
      if (alert.user_id !== 'system' && alert.severity === 'high') {
        await supabaseClient
          .from('user_location_confidence')
          .update({ trust_level: 'suspicious' })
          .eq('user_id', alert.user_id);
      }
    }

    logStep(`Fraud monitoring completed. Found ${alerts.length} potential issues`);

    return new Response(JSON.stringify({
      success: true,
      alerts_generated: alerts.length,
      summary: {
        location_mismatches: alerts.filter(a => a.alert_type === 'location_mismatch').length,
        rapid_location_changes: alerts.filter(a => a.alert_type === 'rapid_location_changes').length,
        suspicious_signups: alerts.filter(a => a.alert_type === 'suspicious_signup_volume').length,
        low_trust_users: alerts.filter(a => a.alert_type === 'persistently_low_trust').length
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in fraud monitoring", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});