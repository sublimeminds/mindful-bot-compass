import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityEvent {
  eventType: 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'data_breach_attempt';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { eventType, userId, ipAddress, userAgent, metadata, severity }: SecurityEvent = await req.json();

    // Rate limiting check for this endpoint
    const { data: rateLimitAllowed } = await supabaseClient.rpc('check_auth_rate_limit', {
      _identifier: `security_monitor_${ipAddress}`,
      _max_attempts: 50,
      _window_minutes: 60
    });

    if (!rateLimitAllowed) {
      return new Response(
        JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Log security event
    const { error: logError } = await supabaseClient
      .from('security_incidents')
      .insert({
        incident_type: eventType,
        severity,
        description: `Security event: ${eventType}`,
        detection_method: 'automated_monitoring',
        metadata: {
          userId,
          ipAddress,
          userAgent,
          ...metadata,
          timestamp: new Date().toISOString()
        }
      });

    if (logError) {
      console.error('Failed to log security event:', logError);
    }

    // Check for critical events that need immediate attention
    if (severity === 'critical') {
      // In a real app, trigger alerts to security team
      console.log(`CRITICAL SECURITY EVENT: ${eventType} from ${ipAddress}`);
      
      // Auto-block IP for critical events
      if (eventType === 'data_breach_attempt') {
        // Log the blocking action
        await supabaseClient
          .from('security_incidents')
          .insert({
            incident_type: 'ip_blocked',
            severity: 'high',
            description: `Auto-blocked IP ${ipAddress} due to ${eventType}`,
            detection_method: 'automated_response',
            metadata: {
              originalEvent: eventType,
              blockedIp: ipAddress,
              timestamp: new Date().toISOString()
            }
          });
      }
    }

    // Track behavioral analytics
    if (userId) {
      await supabaseClient
        .from('user_behavioral_analytics')
        .insert({
          user_id: userId,
          event_type: eventType,
          ip_address: ipAddress,
          user_agent: userAgent,
          suspicious_patterns: severity === 'high' || severity === 'critical' ? [eventType] : [],
          risk_score: severity === 'critical' ? 1.0 : severity === 'high' ? 0.8 : severity === 'medium' ? 0.5 : 0.2
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        eventLogged: true,
        severity,
        responseActions: severity === 'critical' ? ['logged', 'alerting_enabled'] : ['logged']
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security monitor error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});