import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  userId: string;
  templateKey: string;
  data: Record<string, any>;
  priority?: number;
  sendAt?: string;
  language?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Enhanced email notification function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resendKey = Deno.env.get('RESEND_API_KEY') || 'demo_resend_key';
    const resend = new Resend(resendKey);
    console.log('Using Resend key:', resendKey === 'demo_resend_key' ? 'DEMO MODE' : 'LIVE MODE');

    const { userId, templateKey, data, priority = 5, sendAt, language }: NotificationPayload = await req.json();

    if (!userId || !templateKey) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    console.log('Processing notification:', { userId, templateKey, language });

    // Get user profile and preferences
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, name, preferred_language')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('User profile error:', profileError);
      return new Response('User profile not found', { status: 404, headers: corsHeaders });
    }

    // Get user notification preferences
    const { data: preferences } = await supabaseClient
      .from('enhanced_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Check if user wants to receive this type of notification
    if (preferences && !preferences.email_notifications) {
      console.log('User has disabled email notifications');
      return new Response(JSON.stringify({ success: true, skipped: 'user_preference' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Determine language (user preference > request language > profile language > default)
    const userLanguage = language || preferences?.language_preference || profile.preferred_language || 'en';
    console.log('Using language:', userLanguage);

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('language_code', userLanguage)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('Template error:', templateError);
      // Fallback to English if specific language not found
      const { data: fallbackTemplate } = await supabaseClient
        .from('email_templates')
        .select('*')
        .eq('template_key', templateKey)
        .eq('language_code', 'en')
        .eq('is_active', true)
        .single();

      if (!fallbackTemplate) {
        return new Response('Template not found', { status: 404, headers: corsHeaders });
      }
    }

    const emailTemplate = template || (await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('language_code', 'en')
      .eq('is_active', true)
      .single()).data;

    if (!emailTemplate) {
      return new Response('No template available', { status: 404, headers: corsHeaders });
    }

    // Process template with data
    let subject = emailTemplate.subject;
    let htmlContent = emailTemplate.html_content;

    // Replace variables in template
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Add user-specific data
    const userData = {
      userName: profile.name || 'User',
      userEmail: profile.email,
      unsubscribeUrl: `${Deno.env.get('SUPABASE_URL')}/unsubscribe?user=${userId}&token=${btoa(userId)}`,
      preferencesUrl: `${Deno.env.get('SUPABASE_URL')}/settings`,
      ...data
    };

    // Replace user data variables
    for (const [key, value] of Object.entries(userData)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Check if should send immediately or queue
    const shouldQueue = sendAt && new Date(sendAt) > new Date();
    
    if (shouldQueue) {
      // Queue the notification
      await supabaseClient
        .from('notification_queue')
        .insert({
          user_id: userId,
          template_key: templateKey,
          template_data: { ...data, processedSubject: subject, processedContent: htmlContent },
          priority,
          send_at: sendAt
        });

      console.log('Notification queued for later delivery');
      return new Response(JSON.stringify({ success: true, queued: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send email immediately
    const emailResponse = await resend.emails.send({
      from: 'TherapySync AI <notifications@therapysync.com>',
      to: [profile.email],
      subject: subject,
      html: htmlContent,
    });

    if (!emailResponse.data) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', emailResponse.data.id);

    // Track analytics
    await supabaseClient
      .from('email_analytics')
      .insert({
        template_key: templateKey,
        user_id: userId,
        email: profile.email,
        event_type: 'sent',
        event_data: { 
          message_id: emailResponse.data.id,
          language: userLanguage,
          priority
        }
      });

    // Create notification record
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        type: emailTemplate.category,
        title: subject,
        message: emailTemplate.text_content || 'Email notification sent',
        data: { template_key: templateKey, email_id: emailResponse.data.id },
        priority: priority === 1 ? 'high' : priority <= 3 ? 'medium' : 'low'
      });

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data.id,
      language: userLanguage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in enhanced email notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});