import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  category: string;
  type: string;
  data?: Record<string, any>;
  url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resendKey = Deno.env.get('RESEND_API_KEY') || 'demo_resend_key';
    const resend = new Resend(resendKey);
    console.log('Using Resend key:', resendKey === 'demo_resend_key' ? 'DEMO MODE' : 'LIVE MODE');

    const { userId, payload }: { userId: string; payload: NotificationPayload } = await req.json();

    if (!userId || !payload) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    // Get user profile for email
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return new Response('User profile not found', { status: 404, headers: corsHeaders });
    }

    // Generate email HTML based on category
    let emailHtml = '';
    let ctaButton = '';

    if (payload.category === 'crisis') {
      ctaButton = `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get('SUPABASE_URL')}/therapy-chat?crisis=true" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            🚨 Get Help Now
          </a>
        </div>
      `;
    } else if (payload.category === 'therapy') {
      ctaButton = `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${payload.url || `${Deno.env.get('SUPABASE_URL')}/therapy-chat`}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            💬 Join Session
          </a>
        </div>
      `;
    } else if (payload.category === 'progress') {
      ctaButton = `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get('SUPABASE_URL')}/progress-overview" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            📈 View Progress
          </a>
        </div>
      `;
    }

    emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${payload.title}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">TherapySync AI</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your AI-Powered Wellness Companion</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">${payload.title}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.7;">${payload.body}</p>
          
          ${ctaButton}
          
          <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>This notification was sent from your TherapySync AI account.</p>
            <p>
              <a href="${Deno.env.get('SUPABASE_URL')}/settings" style="color: #2563eb;">Manage Notifications</a> | 
              <a href="${Deno.env.get('SUPABASE_URL')}/support" style="color: #2563eb;">Get Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'TherapySync AI <notifications@therapysync.com>',
      to: [profile.email],
      subject: payload.title,
      html: emailHtml,
    });

    if (!emailResponse.data) {
      throw new Error('Failed to send email');
    }

    // Create notification record
    const { data: notification } = await supabaseClient
      .from('notifications')
      .insert([{
        user_id: userId,
        type: payload.type,
        title: payload.title,
        message: payload.body,
        data: payload.data || {},
        read: false
      }])
      .select()
      .single();

    // Track delivery
    await supabaseClient
      .from('notification_deliveries')
      .insert([{
        notification_id: notification?.id,
        delivery_method: 'email',
        status: 'delivered',
        external_message_id: emailResponse.data.id,
        delivered_at: new Date().toISOString()
      }]);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data.id,
      emailId: emailResponse.data.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});