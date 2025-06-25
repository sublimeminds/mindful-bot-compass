
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_agent: string;
  details: Record<string, any>;
  created_at: string;
}

interface RateLimitConfig {
  endpoint: string;
  max_requests: number;
  window_minutes: number;
  block_duration_minutes: number;
}

// In-memory stores (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number; blocked: boolean }>()
const suspiciousIPs = new Set<string>()

const defaultRateLimits: RateLimitConfig[] = [
  { endpoint: '/auth/login', max_requests: 5, window_minutes: 15, block_duration_minutes: 30 },
  { endpoint: '/auth/register', max_requests: 3, window_minutes: 60, block_duration_minutes: 60 },
  { endpoint: '/api/sessions', max_requests: 100, window_minutes: 60, block_duration_minutes: 10 },
  { endpoint: '/api/upload', max_requests: 20, window_minutes: 60, block_duration_minutes: 15 }
]

const checkRateLimit = (ip: string, endpoint: string): { allowed: boolean; reason?: string } => {
  const config = defaultRateLimits.find(c => endpoint.includes(c.endpoint)) || 
    { endpoint: 'default', max_requests: 1000, window_minutes: 60, block_duration_minutes: 5 }

  const key = `${ip}:${endpoint}`
  const now = Date.now()
  const windowMs = config.window_minutes * 60 * 1000
  const blockMs = config.block_duration_minutes * 60 * 1000

  const entry = rateLimitStore.get(key) || { 
    count: 0, 
    resetTime: now + windowMs, 
    blocked: false 
  }

  // Check if currently blocked
  if (entry.blocked && now < entry.resetTime) {
    return { allowed: false, reason: 'IP blocked due to rate limit violations' }
  }

  // Reset window if expired
  if (now >= entry.resetTime) {
    entry.count = 0
    entry.resetTime = now + windowMs
    entry.blocked = false
  }

  // Apply stricter limits for suspicious IPs
  const maxRequests = suspiciousIPs.has(ip) ? 
    Math.floor(config.max_requests * 0.2) : 
    config.max_requests

  if (entry.count >= maxRequests) {
    entry.blocked = true
    entry.resetTime = now + blockMs
    suspiciousIPs.add(ip)
    
    return { allowed: false, reason: 'Rate limit exceeded' }
  }

  entry.count++
  rateLimitStore.set(key, entry)
  return { allowed: true }
}

const detectAnomalies = async (supabase: any, event: SecurityEvent): Promise<boolean> => {
  try {
    // Get recent events for this IP
    const { data: recentEvents } = await supabase
      .from('security_events')
      .select('*')
      .eq('ip_address', event.ip_address)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false })

    if (!recentEvents) return false

    // Anomaly patterns
    const failedLogins = recentEvents.filter(e => 
      e.event_type === 'auth_failure' || e.event_type === 'login_attempt'
    ).length

    const rapidRequests = recentEvents.length > 100
    const multipleUserTargets = new Set(recentEvents.map(e => e.user_id)).size > 5
    const offHoursActivity = new Date().getHours() < 6 || new Date().getHours() > 22

    // Geographic anomaly (simplified - in production, use IP geolocation)
    const differentUserAgents = new Set(recentEvents.map(e => e.user_agent)).size > 3

    const anomalyScore = 
      (failedLogins > 10 ? 30 : failedLogins * 3) +
      (rapidRequests ? 25 : 0) +
      (multipleUserTargets ? 20 : 0) +
      (offHoursActivity ? 15 : 0) +
      (differentUserAgents ? 10 : 0)

    return anomalyScore > 40
  } catch (error) {
    console.error('Anomaly detection error:', error)
    return false
  }
}

const logSecurityEvent = async (supabase: any, event: SecurityEvent) => {
  try {
    await supabase
      .from('security_events')
      .insert(event)

    // Check for anomalies
    const isAnomalous = await detectAnomalies(supabase, event)
    
    if (isAnomalous) {
      await supabase
        .from('security_events')
        .insert({
          ...event,
          id: crypto.randomUUID(),
          event_type: 'anomaly_detected',
          severity: 'high',
          details: {
            ...event.details,
            original_event: event.id,
            anomaly_reason: 'Pattern analysis detected suspicious behavior'
          }
        })
    }

    // Real-time notifications for critical events
    if (event.severity === 'critical') {
      await supabase
        .from('admin_notifications')
        .insert({
          type: 'security_alert',
          title: 'Critical Security Event',
          message: `${event.event_type} from ${event.ip_address}`,
          severity: 'critical',
          metadata: event
        })
    }

  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname
    const ip = req.headers.get('x-forwarded-for') || 
              req.headers.get('x-real-ip') || 
              'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rate limiting check
    const rateLimitResult = checkRateLimit(ip, path)
    if (!rateLimitResult.allowed) {
      const event: SecurityEvent = {
        id: crypto.randomUUID(),
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        ip_address: ip,
        user_agent: userAgent,
        details: { 
          endpoint: path,
          reason: rateLimitResult.reason,
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      }

      await logSecurityEvent(supabaseClient, event)

      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        message: rateLimitResult.reason,
        retry_after: 300 // 5 minutes
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': '300'
        }
      })
    }

    // Route handling
    switch (path) {
      case '/security-monitor/events':
        if (req.method === 'POST') {
          const eventData = await req.json()
          
          const securityEvent: SecurityEvent = {
            id: crypto.randomUUID(),
            user_id: eventData.user_id,
            event_type: eventData.event_type,
            severity: eventData.severity || 'low',
            ip_address: ip,
            user_agent: userAgent,
            details: eventData.details || {},
            created_at: new Date().toISOString()
          }

          await logSecurityEvent(supabaseClient, securityEvent)

          return new Response(JSON.stringify({ 
            success: true,
            event_id: securityEvent.id 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        if (req.method === 'GET') {
          const { data: events, error } = await supabaseClient
            .from('security_events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

          if (error) throw error

          return new Response(JSON.stringify(events), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case '/security-monitor/metrics':
        if (req.method === 'GET') {
          const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          
          const { data: events, error } = await supabaseClient
            .from('security_events')
            .select('*')
            .gte('created_at', last24h)

          if (error) throw error

          const metrics = {
            total_events: events?.length || 0,
            critical_events: events?.filter(e => e.severity === 'critical').length || 0,
            high_events: events?.filter(e => e.severity === 'high').length || 0,
            rate_limit_violations: events?.filter(e => e.event_type === 'rate_limit_exceeded').length || 0,
            anomalies_detected: events?.filter(e => e.event_type === 'anomaly_detected').length || 0,
            unique_ips: new Set(events?.map(e => e.ip_address)).size || 0,
            suspicious_ips: suspiciousIPs.size,
            timestamp: new Date().toISOString()
          }

          return new Response(JSON.stringify(metrics), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case '/security-monitor/health':
        const healthStatus = {
          status: 'healthy',
          monitoring_active: true,
          rate_limiting_active: true,
          anomaly_detection_active: true,
          last_check: new Date().toISOString(),
          version: '1.0.0'
        }

        return new Response(JSON.stringify(healthStatus), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ 
          error: 'Endpoint not found',
          available_endpoints: [
            'POST /security-monitor/events',
            'GET /security-monitor/events', 
            'GET /security-monitor/metrics',
            'GET /security-monitor/health'
          ]
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('Security monitor error:', error)

    // Log the error as a security event
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await logSecurityEvent(supabaseClient, {
      id: crypto.randomUUID(),
      event_type: 'system_error',
      severity: 'high',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      details: { 
        error: error.message,
        stack: error.stack,
        endpoint: new URL(req.url).pathname
      },
      created_at: new Date().toISOString()
    })

    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Security monitoring system encountered an error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
