import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitRequest {
  identifier: string;
  maxRequests: number;
  windowMinutes: number;
  endpoint: string;
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

    const { identifier, maxRequests, windowMinutes, endpoint }: RateLimitRequest = await req.json();

    // Check rate limit using the existing RPC function
    const { data: isAllowed, error } = await supabaseClient.rpc('check_auth_rate_limit', {
      _identifier: `${endpoint}_${identifier}`,
      _max_attempts: maxRequests,
      _window_minutes: windowMinutes
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      return new Response(
        JSON.stringify({ allowed: false, error: 'Rate limit check failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Log rate limit events for monitoring
    if (!isAllowed) {
      await supabaseClient
        .from('security_incidents')
        .insert({
          incident_type: 'rate_limit_exceeded',
          severity: 'medium',
          description: `Rate limit exceeded for endpoint: ${endpoint}`,
          detection_method: 'automated_monitoring',
          metadata: {
            identifier,
            endpoint,
            maxRequests,
            windowMinutes,
            timestamp: new Date().toISOString()
          }
        });
    }

    return new Response(
      JSON.stringify({ 
        allowed: isAllowed,
        endpoint,
        remaining: isAllowed ? Math.max(0, maxRequests - 1) : 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limit guard error:', error);
    return new Response(
      JSON.stringify({ allowed: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});