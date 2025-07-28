import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: any;
  error?: string;
}

interface SystemHealth {
  overall_status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: HealthCheckResult[];
  performance_metrics: {
    avg_response_time: number;
    success_rate: number;
    active_users: number;
    error_rate: number;
  };
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🏥 Starting comprehensive system health check...');

    // Run all health checks in parallel
    const healthChecks = await Promise.allSettled([
      checkDatabaseHealth(supabaseClient),
      checkAIServicesHealth(),
      checkEdgeFunctionsHealth(supabaseClient),
      checkOnboardingFlowHealth(supabaseClient),
      checkTherapySessionHealth(supabaseClient),
      checkCrisisDetectionHealth(supabaseClient)
    ]);

    const services: HealthCheckResult[] = healthChecks.map((result, index) => {
      const serviceNames = [
        'database',
        'ai_services',
        'edge_functions',
        'onboarding_flow',
        'therapy_sessions',
        'crisis_detection'
      ];

      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          service: serviceNames[index],
          status: 'unhealthy' as const,
          responseTime: 0,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    // Calculate performance metrics
    const performanceMetrics = await calculatePerformanceMetrics(supabaseClient);

    // Determine overall system status
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (unhealthyServices > 2) {
      overallStatus = 'unhealthy';
    } else if (degradedServices > 1 || unhealthyServices > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(services, performanceMetrics);

    const systemHealth: SystemHealth = {
      overall_status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      performance_metrics: performanceMetrics,
      recommendations
    };

    // Store health check results
    await supabaseClient.from('real_time_metrics').insert({
      metric_type: 'system_health',
      metric_value: overallStatus === 'healthy' ? 1 : overallStatus === 'degraded' ? 0.5 : 0,
      metric_metadata: systemHealth
    });

    console.log('🏥 System health check completed:', {
      status: overallStatus,
      healthy: healthyServices,
      degraded: degradedServices,
      unhealthy: unhealthyServices
    });

    return new Response(JSON.stringify({
      success: true,
      health: systemHealth
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('System health check error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      health: {
        overall_status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: [],
        performance_metrics: {
          avg_response_time: 0,
          success_rate: 0,
          active_users: 0,
          error_rate: 1
        },
        recommendations: ['System health check failed - manual investigation required']
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkDatabaseHealth(supabase: any): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Test basic connectivity
    const { data, error } = await supabase
      .from('therapist_personalities')
      .select('count', { count: 'exact', head: true });

    if (error) throw error;

    const responseTime = Date.now() - startTime;

    // Check for recent therapy plan creation
    const { data: recentPlans } = await supabase
      .from('adaptive_therapy_plans')
      .select('id')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    return {
      service: 'database',
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime,
      details: {
        connection: 'ok',
        recent_plan_creation: recentPlans?.length > 0,
        query_performance: responseTime < 500 ? 'excellent' : responseTime < 1000 ? 'good' : 'slow'
      }
    };

  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

async function checkAIServicesHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    const issues = [];
    if (!anthropicKey) issues.push('ANTHROPIC_API_KEY missing');
    if (!openaiKey) issues.push('OPENAI_API_KEY missing');

    const status = issues.length === 0 ? 'healthy' : issues.length === 1 ? 'degraded' : 'unhealthy';

    return {
      service: 'ai_services',
      status,
      responseTime: Date.now() - startTime,
      details: {
        anthropic_available: !!anthropicKey,
        openai_available: !!openaiKey,
        issues: issues.length > 0 ? issues : undefined
      }
    };

  } catch (error) {
    return {
      service: 'ai_services',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

async function checkEdgeFunctionsHealth(supabase: any): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Test critical edge functions
    const testResults = await Promise.allSettled([
      supabase.functions.invoke('analyze-therapy-message', {
        body: { message: 'test', context: 'health-check' }
      }),
      supabase.functions.invoke('adaptive-therapy-planner', {
        body: { userId: 'health-check', generateRecommendations: true }
      })
    ]);

    const successCount = testResults.filter(r => r.status === 'fulfilled').length;
    const totalCount = testResults.length;

    const status = successCount === totalCount ? 'healthy' : 
                   successCount > 0 ? 'degraded' : 'unhealthy';

    return {
      service: 'edge_functions',
      status,
      responseTime: Date.now() - startTime,
      details: {
        functions_tested: totalCount,
        functions_healthy: successCount,
        success_rate: successCount / totalCount
      }
    };

  } catch (error) {
    return {
      service: 'edge_functions',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

async function checkOnboardingFlowHealth(supabase: any): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Check recent onboarding completions
    const { data: completions, error } = await supabase
      .from('therapy_plan_creation_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const successfulCompletions = completions?.filter(c => c.status === 'completed') || [];
    const failedCompletions = completions?.filter(c => c.status === 'failed') || [];
    
    const successRate = completions?.length > 0 ? 
      successfulCompletions.length / completions.length : 1;

    const status = successRate > 0.8 ? 'healthy' : successRate > 0.5 ? 'degraded' : 'unhealthy';

    return {
      service: 'onboarding_flow',
      status,
      responseTime: Date.now() - startTime,
      details: {
        total_attempts: completions?.length || 0,
        successful_completions: successfulCompletions.length,
        failed_completions: failedCompletions.length,
        success_rate: successRate
      }
    };

  } catch (error) {
    return {
      service: 'onboarding_flow',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

async function checkTherapySessionHealth(supabase: any): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Check recent therapy sessions
    const { data: sessions, error } = await supabase
      .from('therapy_sessions')
      .select('*')
      .gte('start_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const completedSessions = sessions?.filter(s => s.end_time) || [];
    const activeSessions = sessions?.filter(s => !s.end_time) || [];
    
    const avgDuration = completedSessions.length > 0 ? 
      completedSessions.reduce((sum, s) => {
        const duration = new Date(s.end_time).getTime() - new Date(s.start_time).getTime();
        return sum + duration;
      }, 0) / completedSessions.length / 60000 : 0; // in minutes

    const status = avgDuration > 10 && completedSessions.length > 0 ? 'healthy' : 
                   sessions?.length > 0 ? 'degraded' : 'unhealthy';

    return {
      service: 'therapy_sessions',
      status,
      responseTime: Date.now() - startTime,
      details: {
        total_sessions: sessions?.length || 0,
        completed_sessions: completedSessions.length,
        active_sessions: activeSessions.length,
        avg_duration_minutes: Math.round(avgDuration)
      }
    };

  } catch (error) {
    return {
      service: 'therapy_sessions',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

async function checkCrisisDetectionHealth(supabase: any): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Check recent crisis alerts
    const { data: alerts, error } = await supabase
      .from('crisis_alerts')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const resolvedAlerts = alerts?.filter(a => a.status === 'resolved') || [];
    const activeAlerts = alerts?.filter(a => a.status === 'active') || [];
    
    const responseTimeAvg = resolvedAlerts.length > 0 ? 
      resolvedAlerts.reduce((sum, a) => {
        if (a.resolved_at) {
          const responseTime = new Date(a.resolved_at).getTime() - new Date(a.created_at).getTime();
          return sum + responseTime;
        }
        return sum;
      }, 0) / resolvedAlerts.length / 60000 : 0; // in minutes

    const status = activeAlerts.length < 5 && responseTimeAvg < 30 ? 'healthy' : 
                   activeAlerts.length < 10 ? 'degraded' : 'unhealthy';

    return {
      service: 'crisis_detection',
      status,
      responseTime: Date.now() - startTime,
      details: {
        total_alerts: alerts?.length || 0,
        active_alerts: activeAlerts.length,
        resolved_alerts: resolvedAlerts.length,
        avg_response_time_minutes: Math.round(responseTimeAvg)
      }
    };

  } catch (error) {
    return {
      service: 'crisis_detection',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

async function calculatePerformanceMetrics(supabase: any): Promise<SystemHealth['performance_metrics']> {
  try {
    // Get recent performance data
    const { data: metrics } = await supabase
      .from('real_time_metrics')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    const avgResponseTime = metrics?.length > 0 ? 
      metrics.reduce((sum, m) => sum + (m.metric_metadata?.response_time || 0), 0) / metrics.length : 0;

    // Get active user count (simplified)
    const { data: activeSessions } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('status', 'active')
      .gte('last_activity', new Date(Date.now() - 30 * 60 * 1000).toISOString());

    const activeUsers = new Set(activeSessions?.map(s => s.user_id) || []).size;

    // Calculate success and error rates
    const errorMetrics = metrics?.filter(m => m.metric_type === 'error') || [];
    const totalRequests = metrics?.length || 1;
    const errorRate = errorMetrics.length / totalRequests;
    const successRate = 1 - errorRate;

    return {
      avg_response_time: Math.round(avgResponseTime),
      success_rate: Math.round(successRate * 100) / 100,
      active_users: activeUsers,
      error_rate: Math.round(errorRate * 100) / 100
    };

  } catch (error) {
    console.error('Error calculating performance metrics:', error);
    return {
      avg_response_time: 0,
      success_rate: 0,
      active_users: 0,
      error_rate: 1
    };
  }
}

function generateRecommendations(services: HealthCheckResult[], metrics: SystemHealth['performance_metrics']): string[] {
  const recommendations: string[] = [];

  // Service-specific recommendations
  services.forEach(service => {
    if (service.status === 'unhealthy') {
      recommendations.push(`URGENT: ${service.service} is unhealthy - immediate attention required`);
    } else if (service.status === 'degraded') {
      recommendations.push(`WARNING: ${service.service} is degraded - monitor closely`);
    }
  });

  // Performance recommendations
  if (metrics.avg_response_time > 2000) {
    recommendations.push('High response times detected - consider scaling edge functions');
  }

  if (metrics.error_rate > 0.05) {
    recommendations.push('High error rate detected - investigate error patterns');
  }

  if (metrics.success_rate < 0.95) {
    recommendations.push('Low success rate - review error handling and fallbacks');
  }

  // AI service recommendations
  const aiService = services.find(s => s.service === 'ai_services');
  if (aiService?.details?.issues?.length > 0) {
    recommendations.push('Configure missing AI API keys for optimal performance');
  }

  // Default recommendation if all healthy
  if (recommendations.length === 0) {
    recommendations.push('All systems operational - continue monitoring');
  }

  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}