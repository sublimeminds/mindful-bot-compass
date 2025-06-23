
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced rate limiting with per-endpoint limits
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const checkRateLimit = (apiKey: string, endpoint: string, limit: number = 1000): boolean => {
  const now = Date.now()
  const hourStart = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000)
  const key = `${apiKey}:${endpoint}`
  
  const current = rateLimitStore.get(key) || { count: 0, resetTime: hourStart }
  
  if (current.resetTime < hourStart) {
    current.count = 0
    current.resetTime = hourStart
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  rateLimitStore.set(key, current)
  return true
}

const authenticate = async (request: Request, supabase: any) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }
  
  const token = authHeader.substring(7)
  
  // Check if it's an API key or JWT token
  if (token.startsWith('tk_')) {
    // API Key authentication
    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .select('*, profiles(*)')
      .eq('key_hash', btoa(token))
      .eq('is_active', true)
      .single()
    
    if (error || !apiKey) {
      throw new Error('Invalid API key')
    }
    
    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKey.id)
    
    return { user: apiKey.profiles, apiKey }
  } else {
    // JWT token authentication
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      throw new Error('Invalid JWT token')
    }
    return { user, apiKey: null }
  }
}

const logAPICall = async (supabase: any, userId: string, endpoint: string, method: string, status: number) => {
  try {
    await supabase
      .from('integration_logs')
      .insert({
        user_id: userId,
        event_type: 'api_call',
        payload: {
          endpoint,
          method,
          status,
          timestamp: new Date().toISOString()
        },
        status: status < 400 ? 'success' : 'failed'
      })
  } catch (error) {
    console.error('Failed to log API call:', error)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/enhanced-api/v1', '')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate request
    const { user, apiKey } = await authenticate(req, supabaseClient)

    // Check rate limit
    if (!checkRateLimit(apiKey?.key_hash || user.id, path, apiKey?.rate_limit || 1000)) {
      throw new Error('Rate limit exceeded')
    }

    let response: Response
    let statusCode = 200

    // Enhanced route handling with better error handling and logging
    try {
      switch (true) {
        case path === '/profile' && req.method === 'GET':
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('id, name, email, avatar_url, created_at, subscription_plan')
            .eq('id', user.id)
            .single()
          
          if (profileError) throw profileError
          
          response = new Response(JSON.stringify(profile), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          break

        case path === '/sessions' && req.method === 'GET':
          const limit = parseInt(url.searchParams.get('limit') || '50')
          const offset = parseInt(url.searchParams.get('offset') || '0')
          
          const { data: sessions, error: sessionsError } = await supabaseClient
            .from('therapy_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)
          
          if (sessionsError) throw sessionsError
          
          response = new Response(JSON.stringify({
            data: sessions || [],
            pagination: { limit, offset, total: sessions?.length || 0 }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          break

        case path === '/sessions' && req.method === 'POST':
          const sessionData = await req.json()
          const { data: newSession, error: sessionError } = await supabaseClient
            .from('therapy_sessions')
            .insert({
              user_id: user.id,
              title: sessionData.title,
              notes: sessionData.notes,
              mood_before: sessionData.mood_before,
              mood_after: sessionData.mood_after,
              techniques_used: sessionData.techniques_used || [],
              status: 'completed'
            })
            .select()
            .single()
          
          if (sessionError) throw sessionError
          
          // Trigger webhook if configured
          const { data: webhooks } = await supabaseClient
            .from('webhooks')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .contains('event_types', ['session.created'])
          
          // Send webhook notifications (background task)
          if (webhooks && webhooks.length > 0) {
            webhooks.forEach(async (webhook) => {
              try {
                await fetch(webhook.url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Secret': webhook.secret
                  },
                  body: JSON.stringify({
                    event: 'session.created',
                    data: newSession,
                    timestamp: new Date().toISOString()
                  })
                })
              } catch (error) {
                console.error('Webhook delivery failed:', error)
              }
            })
          }
          
          response = new Response(JSON.stringify(newSession), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          statusCode = 201
          break

        case path === '/mood' && req.method === 'GET':
          const days = parseInt(url.searchParams.get('days') || '30')
          const fromDate = new Date()
          fromDate.setDate(fromDate.getDate() - days)
          
          const { data: moodEntries, error: moodError } = await supabaseClient
            .from('mood_entries')
            .select('*')
            .eq('user_id', user.id)
            .gte('timestamp', fromDate.toISOString())
            .order('timestamp', { ascending: false })
          
          if (moodError) throw moodError
          
          response = new Response(JSON.stringify(moodEntries || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          break

        case path === '/mood' && req.method === 'POST':
          const moodData = await req.json()
          const { data: newMood, error: newMoodError } = await supabaseClient
            .from('mood_entries')
            .insert({
              user_id: user.id,
              overall: moodData.overall,
              anxiety: moodData.anxiety,
              depression: moodData.depression,
              stress: moodData.stress,
              energy: moodData.energy,
              notes: moodData.notes,
              activities: moodData.activities || [],
              triggers: moodData.triggers || []
            })
            .select()
            .single()
          
          if (newMoodError) throw newMoodError
          
          response = new Response(JSON.stringify(newMood), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          statusCode = 201
          break

        case path === '/goals' && req.method === 'GET':
          const { data: goals, error: goalsError } = await supabaseClient
            .from('goals')
            .select(`
              *,
              goal_progress(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          if (goalsError) throw goalsError
          
          response = new Response(JSON.stringify(goals || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          break

        case path === '/health/sync' && req.method === 'POST':
          const healthData = await req.json()
          
          // Store health data correlation
          const { data: healthEntry, error: healthError } = await supabaseClient
            .from('integration_logs')
            .insert({
              user_id: user.id,
              event_type: 'health_sync',
              payload: healthData,
              status: 'success'
            })
            .select()
            .single()
          
          if (healthError) throw healthError
          
          response = new Response(JSON.stringify({ 
            message: 'Health data synced successfully',
            id: healthEntry.id 
          }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          statusCode = 201
          break

        case path === '/webhooks' && req.method === 'POST':
          const webhookData = await req.json()
          const { data: webhook, error: webhookError } = await supabaseClient
            .from('webhooks')
            .insert({
              user_id: user.id,
              url: webhookData.url,
              event_types: webhookData.event_types,
              secret: Math.random().toString(36).substring(2),
              is_active: true
            })
            .select()
            .single()
          
          if (webhookError) throw webhookError
          
          response = new Response(JSON.stringify(webhook), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          statusCode = 201
          break

        default:
          response = new Response(JSON.stringify({ 
            error: 'Endpoint not found',
            available_endpoints: [
              'GET /profile',
              'GET /sessions',
              'POST /sessions', 
              'GET /mood',
              'POST /mood',
              'GET /goals',
              'POST /health/sync',
              'POST /webhooks'
            ]
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
          statusCode = 404
      }
    } catch (error) {
      console.error('API Route Error:', error)
      statusCode = 500
      response = new Response(JSON.stringify({ error: error.message }), {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Log API call
    await logAPICall(supabaseClient, user.id, path, req.method, statusCode)

    return response

  } catch (error) {
    console.error('API Error:', error)
    
    const status = error.message.includes('Rate limit') ? 429 :
                   error.message.includes('Invalid') ? 401 : 400
    
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
