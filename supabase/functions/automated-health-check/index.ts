
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthCheckResult {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  error?: string;
  timestamp: string;
}

interface SystemHealthReport {
  overall: 'healthy' | 'degraded' | 'down';
  checks: HealthCheckResult[];
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Define critical endpoints to check
    const endpoints = [
      { name: 'Main App', url: `${supabaseUrl.replace('supabase.co', 'lovableproject.com')}` },
      { name: 'Supabase API', url: `${supabaseUrl}/rest/v1/` },
      { name: 'Auth Service', url: `${supabaseUrl}/auth/v1/health` },
    ]

    const healthChecks: HealthCheckResult[] = []
    
    // Perform health checks
    for (const endpoint of endpoints) {
      const startTime = Date.now()
      try {
        const response = await fetch(endpoint.url, {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
          }
        })
        
        const responseTime = Date.now() - startTime
        
        healthChecks.push({
          endpoint: endpoint.name,
          status: response.ok ? 'healthy' : 'degraded',
          responseTime,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        healthChecks.push({
          endpoint: endpoint.name,
          status: 'down',
          responseTime: Date.now() - startTime,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }
    }

    // Additional system checks
    const memoryUsage = Deno.memoryUsage()
    const performanceCheck: HealthCheckResult = {
      endpoint: 'Edge Function Performance',
      status: memoryUsage.heapUsed < 50 * 1024 * 1024 ? 'healthy' : 'degraded', // 50MB threshold
      responseTime: 0,
      timestamp: new Date().toISOString()
    }
    healthChecks.push(performanceCheck)

    // Determine overall health
    const downCount = healthChecks.filter(c => c.status === 'down').length
    const degradedCount = healthChecks.filter(c => c.status === 'degraded').length
    
    let overall: 'healthy' | 'degraded' | 'down'
    if (downCount > 0) {
      overall = 'down'
    } else if (degradedCount > 0) {
      overall = 'degraded'
    } else {
      overall = 'healthy'
    }

    // Generate recommendations
    const recommendations: string[] = []
    if (downCount > 0) {
      recommendations.push('Critical services are down - immediate attention required')
    }
    if (degradedCount > 0) {
      recommendations.push('Some services are degraded - monitor closely')
    }
    if (healthChecks.some(c => c.responseTime > 5000)) {
      recommendations.push('High response times detected - check network connectivity')
    }
    if (memoryUsage.heapUsed > 30 * 1024 * 1024) {
      recommendations.push('Memory usage is elevated - consider optimization')
    }

    const report: SystemHealthReport = {
      overall,
      checks: healthChecks,
      recommendations
    }

    // Store health check results (optional - could be stored in a table)
    console.log('Health Check Report:', JSON.stringify(report, null, 2))

    return new Response(
      JSON.stringify(report),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Health check failed:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Health check failed', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
