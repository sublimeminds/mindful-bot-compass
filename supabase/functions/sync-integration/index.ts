import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { integration_id, platform_type } = await req.json()

    // Get integration details
    const { data: integration, error: integrationError } = await supabaseClient
      .from('platform_integrations')
      .select('*')
      .eq('id', integration_id)
      .single()

    if (integrationError) throw integrationError

    let syncResult = { success: false, message: '', data_synced: 0 }

    switch (platform_type) {
      case 'whatsapp':
        syncResult = await syncWhatsAppMessages(supabaseClient, integration)
        break
      case 'telegram':
        syncResult = await syncTelegramMessages(supabaseClient, integration)
        break
      case 'slack':
        syncResult = await syncSlackMessages(supabaseClient, integration)
        break
      case 'ical':
        syncResult = await syncCalendarEvents(supabaseClient, integration)
        break
      case 'apple_health':
        syncResult = await syncHealthData(supabaseClient, integration)
        break
      default:
        syncResult = {
          success: false,
          message: `Sync not implemented for ${platform_type}`,
          data_synced: 0
        }
    }

    // Update sync timestamp
    await supabaseClient
      .from('platform_integrations')
      .update({ 
        last_sync_at: new Date().toISOString(),
        error_count: syncResult.success ? 0 : integration.error_count + 1
      })
      .eq('id', integration_id)

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error syncing integration:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message,
      data_synced: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function syncWhatsAppMessages(supabase: any, integration: any) {
  try {
    const config = integration.configuration
    
    // Get recent messages from WhatsApp Business API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${config.business_phone_number}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${config.access_token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch WhatsApp messages')
    }

    const data = await response.json()
    const messages = data.data || []

    // Store messages in database
    const messagesToInsert = messages.map((msg: any) => ({
      integration_id: integration.id,
      user_id: integration.user_id,
      whatsapp_message_id: msg.id,
      message_type: msg.type,
      content: msg.text?.body || '',
      sender_type: msg.from === config.business_phone_number ? 'ai' : 'user',
      timestamp: new Date(msg.timestamp * 1000).toISOString()
    }))

    if (messagesToInsert.length > 0) {
      await supabase
        .from('whatsapp_messages')
        .upsert(messagesToInsert, { onConflict: 'whatsapp_message_id' })
    }

    return {
      success: true,
      message: 'WhatsApp messages synced successfully',
      data_synced: messagesToInsert.length
    }
  } catch (error) {
    return {
      success: false,
      message: `WhatsApp sync failed: ${error.message}`,
      data_synced: 0
    }
  }
}

async function syncTelegramMessages(supabase: any, integration: any) {
  try {
    const config = integration.configuration
    
    // Get updates from Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/getUpdates`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Telegram updates')
    }

    const data = await response.json()
    const updates = data.result || []

    // Process messages
    const messagesToInsert = updates
      .filter((update: any) => update.message)
      .map((update: any) => ({
        integration_id: integration.id,
        user_id: integration.user_id,
        telegram_message_id: update.message.message_id,
        content: update.message.text || '',
        sender_type: update.message.from.is_bot ? 'ai' : 'user',
        timestamp: new Date(update.message.date * 1000).toISOString()
      }))

    if (messagesToInsert.length > 0) {
      await supabase
        .from('telegram_messages')
        .upsert(messagesToInsert, { onConflict: 'telegram_message_id' })
    }

    return {
      success: true,
      message: 'Telegram messages synced successfully',
      data_synced: messagesToInsert.length
    }
  } catch (error) {
    return {
      success: false,
      message: `Telegram sync failed: ${error.message}`,
      data_synced: 0
    }
  }
}

async function syncSlackMessages(supabase: any, integration: any) {
  try {
    const config = integration.configuration
    
    // Get conversations from Slack API
    const response = await fetch('https://slack.com/api/conversations.history', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.bot_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: config.channel_id,
        limit: 100
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Slack messages')
    }

    const data = await response.json()
    const messages = data.messages || []

    // Store messages
    const messagesToInsert = messages.map((msg: any) => ({
      integration_id: integration.id,
      user_id: integration.user_id,
      slack_message_id: msg.ts,
      content: msg.text || '',
      sender_type: msg.bot_id ? 'ai' : 'user',
      timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString()
    }))

    if (messagesToInsert.length > 0) {
      await supabase
        .from('slack_messages')
        .upsert(messagesToInsert, { onConflict: 'slack_message_id' })
    }

    return {
      success: true,
      message: 'Slack messages synced successfully',
      data_synced: messagesToInsert.length
    }
  } catch (error) {
    return {
      success: false,
      message: `Slack sync failed: ${error.message}`,
      data_synced: 0
    }
  }
}

async function syncCalendarEvents(supabase: any, integration: any) {
  try {
    const config = integration.configuration
    
    // Fetch iCal data
    const response = await fetch(config.calendar_url)
    if (!response.ok) {
      throw new Error('Failed to fetch calendar data')
    }

    const icalData = await response.text()
    
    // Parse iCal and extract therapy sessions
    const sessions = parseICalForTherapySessions(icalData)
    
    // Store calendar events
    const eventsToInsert = sessions.map((session: any) => ({
      integration_id: integration.id,
      user_id: integration.user_id,
      calendar_event_id: session.uid,
      title: session.summary,
      start_time: session.start,
      end_time: session.end,
      description: session.description || '',
      sync_source: 'ical'
    }))

    if (eventsToInsert.length > 0) {
      await supabase
        .from('calendar_events')
        .upsert(eventsToInsert, { onConflict: 'calendar_event_id' })
    }

    return {
      success: true,
      message: 'Calendar events synced successfully',
      data_synced: eventsToInsert.length
    }
  } catch (error) {
    return {
      success: false,
      message: `Calendar sync failed: ${error.message}`,
      data_synced: 0
    }
  }
}

async function syncHealthData(supabase: any, integration: any) {
  // Apple Health would require HealthKit integration on iOS
  // This is a placeholder for demonstration
  return {
    success: true,
    message: 'Health data sync configured (requires iOS app)',
    data_synced: 0
  }
}

function parseICalForTherapySessions(icalData: string) {
  // Simple iCal parser for therapy-related events
  const events = []
  const lines = icalData.split('\n')
  let currentEvent: any = null

  for (const line of lines) {
    const cleanLine = line.trim()
    
    if (cleanLine === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (cleanLine === 'END:VEVENT' && currentEvent) {
      // Only include therapy-related events
      if (currentEvent.summary && 
          (currentEvent.summary.toLowerCase().includes('therapy') ||
           currentEvent.summary.toLowerCase().includes('counseling') ||
           currentEvent.summary.toLowerCase().includes('session'))) {
        events.push(currentEvent)
      }
      currentEvent = null
    } else if (currentEvent && cleanLine.includes(':')) {
      const [key, ...valueParts] = cleanLine.split(':')
      const value = valueParts.join(':')
      
      switch (key) {
        case 'UID':
          currentEvent.uid = value
          break
        case 'SUMMARY':
          currentEvent.summary = value
          break
        case 'DTSTART':
          currentEvent.start = parseICalDate(value)
          break
        case 'DTEND':
          currentEvent.end = parseICalDate(value)
          break
        case 'DESCRIPTION':
          currentEvent.description = value
          break
      }
    }
  }

  return events
}

function parseICalDate(dateString: string): string {
  // Parse iCal date format (YYYYMMDDTHHMMSSZ)
  if (dateString.length === 15 && dateString.endsWith('Z')) {
    const year = dateString.substr(0, 4)
    const month = dateString.substr(4, 2)
    const day = dateString.substr(6, 2)
    const hour = dateString.substr(9, 2)
    const minute = dateString.substr(11, 2)
    const second = dateString.substr(13, 2)
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`).toISOString()
  }
  
  return new Date().toISOString() // Fallback
}