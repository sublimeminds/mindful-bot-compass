import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPinRequest {
  email: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, user_id }: EmailPinRequest = await req.json();
    
    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Store PIN in database
    const { error: dbError } = await supabase
      .from('email_pin_auth')
      .insert({
        user_id,
        email,
        pin_code: pin,
        expires_at: expiresAt.toISOString(),
        ip_address: clientIP,
        user_agent: userAgent
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to store PIN' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send email with PIN
    const emailResponse = await resend.emails.send({
      from: "Security <security@yourdomain.com>",
      to: [email],
      subject: "Your Security PIN - Expires in 10 minutes",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Security Verification Required</h2>
          <p>Your verification PIN is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 8px;">${pin}</h1>
          </div>
          <p><strong>This PIN expires in 10 minutes.</strong></p>
          <p>If you didn't request this PIN, please ignore this email and contact support immediately.</p>
          <hr style="margin: 30px 0; border: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Request details:<br>
            Time: ${new Date().toISOString()}<br>
            IP: ${clientIP}
          </p>
        </div>
      `,
    });

    // Log security audit
    await supabase.from('security_audit_logs').insert({
      user_id,
      action: 'email_pin_sent',
      resource_type: 'authentication',
      details: { email, expires_at: expiresAt.toISOString() },
      ip_address: clientIP,
      user_agent: userAgent,
      compliance_category: 'security',
      risk_level: 'low'
    });

    console.log('Email PIN sent successfully:', emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      expires_at: expiresAt.toISOString() 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in send-email-pin function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);