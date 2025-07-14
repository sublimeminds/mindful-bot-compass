import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPinRequest {
  email: string;
  pin: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, pin, user_id }: VerifyPinRequest = await req.json();
    
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Get the latest PIN for this user
    const { data: pinData, error: fetchError } = await supabase
      .from('email_pin_auth')
      .select('*')
      .eq('user_id', user_id)
      .eq('email', email)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !pinData) {
      // Log failed attempt
      await supabase.from('security_audit_logs').insert({
        user_id,
        action: 'pin_verification_failed',
        resource_type: 'authentication',
        details: { reason: 'pin_not_found', email },
        ip_address: clientIP,
        user_agent: userAgent,
        compliance_category: 'security',
        risk_level: 'medium'
      });

      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid or expired PIN' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if too many attempts
    if (pinData.attempts >= pinData.max_attempts) {
      await supabase.from('security_audit_logs').insert({
        user_id,
        action: 'pin_verification_blocked',
        resource_type: 'authentication',
        details: { reason: 'max_attempts_exceeded', email, attempts: pinData.attempts },
        ip_address: clientIP,
        user_agent: userAgent,
        compliance_category: 'security',
        risk_level: 'high'
      });

      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Too many attempts. Please request a new PIN.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify PIN
    if (pinData.pin_code === pin) {
      // Mark as verified
      await supabase
        .from('email_pin_auth')
        .update({ 
          verified_at: new Date().toISOString(),
          attempts: pinData.attempts + 1
        })
        .eq('id', pinData.id);

      // Log successful verification
      await supabase.from('security_audit_logs').insert({
        user_id,
        action: 'pin_verification_success',
        resource_type: 'authentication',
        details: { email },
        ip_address: clientIP,
        user_agent: userAgent,
        compliance_category: 'security',
        risk_level: 'low'
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: 'PIN verified successfully'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else {
      // Increment attempts
      await supabase
        .from('email_pin_auth')
        .update({ attempts: pinData.attempts + 1 })
        .eq('id', pinData.id);

      // Log failed attempt
      await supabase.from('security_audit_logs').insert({
        user_id,
        action: 'pin_verification_failed',
        resource_type: 'authentication',
        details: { 
          reason: 'incorrect_pin', 
          email, 
          attempts: pinData.attempts + 1,
          remaining_attempts: pinData.max_attempts - (pinData.attempts + 1)
        },
        ip_address: clientIP,
        user_agent: userAgent,
        compliance_category: 'security',
        risk_level: 'medium'
      });

      const remainingAttempts = pinData.max_attempts - (pinData.attempts + 1);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Incorrect PIN. ${remainingAttempts} attempts remaining.`,
        remaining_attempts: remainingAttempts
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('Error in verify-email-pin function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);