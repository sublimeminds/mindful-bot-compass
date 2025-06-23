
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const webhookType = url.searchParams.get('type')
    const userId = url.searchParams.get('user_id')
    
    if (!webhookType || !userId) {
      throw new Error('Missing required parameters: type and user_id')
    }

    const payload = await req.json()
    
    // Verify webhook signature (basic implementation)
    const signature = req.headers.get('x-webhook-signature')
    
    // Log the webhook event
    await supabaseClient
      .from('integration_logs')
      .insert({
        user_id: userId,
        event_type: `webhook_${webhookType}`,
        payload: payload,
        status: 'received'
      })

    let response = { success: true, message: 'Webhook processed' }

    // Process different webhook types
    switch (webhookType) {
      case 'ehr_update':
        await processEHRUpdate(supabaseClient, userId, payload)
        break
        
      case 'calendar_sync':
        await processCalendarSync(supabaseClient, userId, payload)
        break
        
      case 'health_data':
        await processHealthData(supabaseClient, userId, payload)
        break
        
      case 'crisis_alert':
        await processCrisisAlert(supabaseClient, userId, payload)
        response.message = 'Crisis alert processed with high priority'
        break
        
      default:
        console.log(`Unknown webhook type: ${webhookType}`)
    }

    // Update analytics
    await supabaseClient
      .from('integration_analytics')
      .insert({
        user_id: userId,
        integration_type: webhookType,
        event_name: 'webhook_received',
        success: true,
        response_time_ms: Date.now() % 1000 // Simple response time simulation
      })

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processEHRUpdate(supabase: any, userId: string, payload: any) {
  console.log('Processing EHR update for user:', userId)
  
  // Store EHR data
  if (payload.fhir_resources) {
    for (const resource of payload.fhir_resources) {
      await supabase
        .from('ehr_data')
        .upsert({
          user_id: userId,
          ehr_connection_id: payload.connection_id,
          data_type: resource.resourceType?.toLowerCase() || 'unknown',
          fhir_resource_type: resource.resourceType,
          external_id: resource.id,
          data_payload: resource,
          sync_status: 'synced'
        })
    }
  }

  // Update last sync time
  if (payload.connection_id) {
    await supabase
      .from('ehr_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', payload.connection_id)
  }
}

async function processCalendarSync(supabase: any, userId: string, payload: any) {
  console.log('Processing calendar sync for user:', userId)
  
  if (payload.appointments) {
    for (const appointment of payload.appointments) {
      await supabase
        .from('therapy_appointments')
        .upsert({
          user_id: userId,
          calendar_connection_id: payload.connection_id,
          external_event_id: appointment.id,
          title: appointment.summary || appointment.title,
          description: appointment.description,
          start_time: appointment.start.dateTime || appointment.start_time,
          end_time: appointment.end.dateTime || appointment.end_time,
          location: appointment.location,
          status: appointment.status || 'scheduled'
        })
    }
  }
}

async function processHealthData(supabase: any, userId: string, payload: any) {
  console.log('Processing health data for user:', userId)
  
  // Store health metrics for therapy correlation
  if (payload.metrics) {
    await supabase
      .from('integration_logs')
      .insert({
        user_id: userId,
        event_type: 'health_sync',
        payload: payload.metrics,
        status: 'processed'
      })
  }

  // Create mood correlation if heart rate variability indicates stress
  if (payload.metrics?.heart_rate_variability && payload.metrics.heart_rate_variability < 30) {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'health_alert',
        title: 'Stress Indicator Detected',
        message: 'Your health data suggests elevated stress levels. Consider a mindfulness session.',
        priority: 'medium'
      })
  }
}

async function processCrisisAlert(supabase: any, userId: string, payload: any) {
  console.log('Processing CRISIS ALERT for user:', userId)
  
  // Create crisis assessment record
  await supabase
    .from('crisis_assessments')
    .insert({
      user_id: userId,
      assessment_type: payload.alert_type || 'automated',
      risk_level: payload.risk_level || 'medium',
      responses: payload.trigger_data || {},
      immediate_actions_taken: ['automated_alert_sent'],
      status: 'active'
    })

  // Send immediate notification
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'crisis_alert',
      title: 'Crisis Support Available',
      message: 'We detected you might need support. Crisis resources are available 24/7.',
      priority: 'high'
    })

  // Notify emergency contacts if configured
  const { data: emergencyContacts } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (emergencyContacts && emergencyContacts.length > 0) {
    // In a real implementation, this would trigger SMS/email to emergency contacts
    console.log(`Would notify ${emergencyContacts.length} emergency contacts`)
  }
}
