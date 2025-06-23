
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone_number, message, message_type = 'general' } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Twilio credentials (would be stored in Supabase secrets)
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER')

    if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
      throw new Error('Twilio credentials not configured')
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
    
    const formData = new FormData()
    formData.append('To', phone_number)
    formData.append('From', twilioFromNumber)
    formData.append('Body', message)

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
      },
      body: formData
    })

    const twilioData = await twilioResponse.json()

    if (!twilioResponse.ok) {
      throw new Error(twilioData.message || 'Failed to send SMS')
    }

    // Log the SMS in the database
    const { error: logError } = await supabaseClient
      .from('integration_logs')
      .insert({
        integration_id: null, // Would get from integrations table
        event_type: 'sms_sent',
        payload: {
          phone_number,
          message_type,
          twilio_sid: twilioData.sid
        },
        status: 'success'
      })

    if (logError) {
      console.error('Error logging SMS:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message_sid: twilioData.sid,
        status: twilioData.status 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error sending SMS:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
