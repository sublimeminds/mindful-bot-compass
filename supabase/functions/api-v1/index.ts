
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API Rate limiting (simple in-memory store for demo)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const checkRateLimit = (apiKey: string, limit: number = 1000): boolean => {
  const now = Date.now()
  const hourStart = Math.floor(now / (60 * 60 * 1000)) * (60 * 60 * 1000)
  
  const current = rateLimitStore.get(apiKey) || { count: 0, resetTime: hourStart }
  
  if (current.resetTime < hourStart) {
    current.count = 0
    current.resetTime = hourStart
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  rateLimitStore.set(apiKey, current)
  return true
}

const authenticate = async (request: Request, supabase: any) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }
  
  const token = authHeader.substring(7)
  
  // Check if it's a Supabase JWT token or API key
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
    
    if (!checkRateLimit(token, apiKey.rate_limit)) {
      throw new Error('Rate limit exceeded')
    }
    
    // Update last used
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/v1', '')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate request
    const { user, apiKey } = await authenticate(req, supabaseClient)

    // Route handling
    switch (true) {
      case path === '/profile' && req.method === 'GET':
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        return new Response(JSON.stringify(profile), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case path === '/sessions' && req.method === 'GET':
        const { data: sessions } = await supabaseClient
          .from('therapy_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        return new Response(JSON.stringify(sessions || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case path === '/sessions' && req.method === 'POST':
        const sessionData = await req.json()
        const { data: newSession, error } = await supabaseClient
          .from('therapy_sessions')
          .insert({
            user_id: user.id,
            ...sessionData
          })
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(JSON.stringify(newSession), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case path === '/mood' && req.method === 'GET':
        const { data: moodEntries } = await supabaseClient
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(30)
        
        return new Response(JSON.stringify(moodEntries || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case path === '/mood' && req.method === 'POST':
        const moodData = await req.json()
        const { data: newMood, error: moodError } = await supabaseClient
          .from('mood_entries')
          .insert({
            user_id: user.id,
            ...moodData
          })
          .select()
          .single()
        
        if (moodError) throw moodError
        
        return new Response(JSON.stringify(newMood), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case path === '/goals' && req.method === 'GET':
        const { data: goals } = await supabaseClient
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        return new Response(JSON.stringify(goals || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case path === '/webhooks' && req.method === 'POST':
        const webhookData = await req.json()
        const { data: webhook, error: webhookError } = await supabaseClient
          .from('webhooks')
          .insert({
            user_id: user.id,
            ...webhookData
          })
          .select()
          .single()
        
        if (webhookError) throw webhookError
        
        return new Response(JSON.stringify(webhook), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('API Error:', error)
    
    const status = error.message.includes('Rate limit') ? 429 :
                   error.message.includes('Invalid') ? 401 : 400
    
    return new Response(JSON.stringify({ error: error.message }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
