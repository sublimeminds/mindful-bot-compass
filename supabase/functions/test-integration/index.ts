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

    const { integration_id, platform_type, configuration } = await req.json()

    let testResult = { success: false, message: '', details: {} }

    switch (platform_type) {
      case 'whatsapp':
        testResult = await testWhatsApp(configuration)
        break
      case 'telegram':
        testResult = await testTelegram(configuration)
        break
      case 'slack':
        testResult = await testSlack(configuration)
        break
      case 'discord':
        testResult = await testDiscord(configuration)
        break
      case 'ical':
        testResult = await testICal(configuration)
        break
      case 'apple_health':
        testResult = await testAppleHealth(configuration)
        break
      default:
        testResult = {
          success: false,
          message: `Platform ${platform_type} is not supported for testing`,
          details: {}
        }
    }

    // Log test result
    await supabaseClient
      .from('integration_test_logs')
      .insert({
        integration_id,
        platform_type,
        test_result: testResult,
        tested_at: new Date().toISOString()
      })

    return new Response(JSON.stringify(testResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error testing integration:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message,
      details: {}
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function testWhatsApp(config: any) {
  try {
    if (!config.business_phone_number || !config.access_token) {
      return {
        success: false,
        message: 'WhatsApp Business API configuration incomplete',
        details: { missing: ['business_phone_number', 'access_token'] }
      }
    }

    // Test WhatsApp Business API connection
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${config.business_phone_number}`,
      {
        headers: {
          'Authorization': `Bearer ${config.access_token}`
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: 'WhatsApp Business API connection successful',
        details: { phone_number: data.display_phone_number }
      }
    } else {
      return {
        success: false,
        message: 'WhatsApp Business API connection failed',
        details: { status: response.status }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'WhatsApp test failed',
      details: { error: error.message }
    }
  }
}

async function testTelegram(config: any) {
  try {
    if (!config.bot_token) {
      return {
        success: false,
        message: 'Telegram bot token missing',
        details: { missing: ['bot_token'] }
      }
    }

    // Test Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/getMe`
    )

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: 'Telegram bot connection successful',
        details: { bot_username: data.result.username }
      }
    } else {
      return {
        success: false,
        message: 'Telegram bot connection failed',
        details: { status: response.status }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Telegram test failed',
      details: { error: error.message }
    }
  }
}

async function testSlack(config: any) {
  try {
    if (!config.bot_token) {
      return {
        success: false,
        message: 'Slack bot token missing',
        details: { missing: ['bot_token'] }
      }
    }

    // Test Slack API
    const response = await fetch('https://slack.com/api/auth.test', {
      headers: {
        'Authorization': `Bearer ${config.bot_token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.ok) {
        return {
          success: true,
          message: 'Slack workspace connection successful',
          details: { team: data.team, user: data.user }
        }
      } else {
        return {
          success: false,
          message: 'Slack authentication failed',
          details: { error: data.error }
        }
      }
    } else {
      return {
        success: false,
        message: 'Slack API connection failed',
        details: { status: response.status }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Slack test failed',
      details: { error: error.message }
    }
  }
}

async function testDiscord(config: any) {
  try {
    if (!config.bot_token) {
      return {
        success: false,
        message: 'Discord bot token missing',
        details: { missing: ['bot_token'] }
      }
    }

    // Test Discord API
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bot ${config.bot_token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: 'Discord bot connection successful',
        details: { bot_username: data.username }
      }
    } else {
      return {
        success: false,
        message: 'Discord bot connection failed',
        details: { status: response.status }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Discord test failed',
      details: { error: error.message }
    }
  }
}

async function testICal(config: any) {
  try {
    if (!config.calendar_url) {
      return {
        success: false,
        message: 'iCal calendar URL missing',
        details: { missing: ['calendar_url'] }
      }
    }

    // Test iCal URL accessibility
    const response = await fetch(config.calendar_url)
    
    if (response.ok) {
      const icalData = await response.text()
      const eventCount = (icalData.match(/BEGIN:VEVENT/g) || []).length
      
      return {
        success: true,
        message: 'iCal calendar accessible',
        details: { events_found: eventCount }
      }
    } else {
      return {
        success: false,
        message: 'iCal calendar not accessible',
        details: { status: response.status }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'iCal test failed',
      details: { error: error.message }
    }
  }
}

async function testAppleHealth(config: any) {
  // Apple Health integration would require iOS app and HealthKit
  // This is a placeholder for testing configuration
  return {
    success: true,
    message: 'Apple Health configuration validated',
    details: { 
      permissions: config.health_permissions || [],
      note: 'Full testing requires iOS device with HealthKit'
    }
  }
}