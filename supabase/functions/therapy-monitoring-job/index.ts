import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SessionHealth {
  sessionId: string;
  healthScore: number;
  issues: string[];
  recommendations: string[];
}

interface SystemHealth {
  totalSessions: number;
  activeSessions: number;
  averageEngagement: number;
  crisisAlerts: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Starting therapy monitoring job...');

    // 1. Check active sessions health
    const activeSessionsHealth = await checkActiveSessionsHealth(supabase);
    
    // 2. Monitor crisis escalations
    const crisisStatus = await monitorCrisisEscalations(supabase);
    
    // 3. Analyze system performance
    const systemHealth = await analyzeSystemHealth(supabase);
    
    // 4. Generate health report
    const healthReport = await generateHealthReport(supabase, {
      activeSessionsHealth,
      crisisStatus,
      systemHealth
    });

    // 5. Store monitoring metrics
    await storeMonitoringMetrics(supabase, healthReport);

    // 6. Send alerts if needed
    await sendHealthAlerts(supabase, healthReport);

    console.log('Therapy monitoring job completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        healthReport,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in therapy monitoring job:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function checkActiveSessionsHealth(supabase: any): Promise<SessionHealth[]> {
  try {
    // Get active sessions from real-time status
    const { data: sessions, error } = await supabase
      .from('session_real_time_status')
      .select('*')
      .gte('last_update', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (error) throw error;

    const sessionHealthChecks: SessionHealth[] = [];

    for (const session of sessions || []) {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let healthScore = 100;

      // Check engagement level
      if (session.engagement_level < 0.3) {
        issues.push('Low engagement detected');
        recommendations.push('Consider technique adjustment or therapist intervention');
        healthScore -= 20;
      }

      // Check therapeutic alliance
      if (session.therapeutic_alliance_score < 0.4) {
        issues.push('Poor therapeutic alliance');
        recommendations.push('Focus on rapport building and trust');
        healthScore -= 15;
      }

      // Check crisis level
      if (session.crisis_level && session.crisis_level !== 'none') {
        issues.push(`Crisis level: ${session.crisis_level}`);
        recommendations.push('Immediate professional oversight required');
        healthScore -= 30;
      }

      // Check session duration (if too long without progress)
      const sessionStart = new Date(session.last_update);
      const hoursElapsed = (Date.now() - sessionStart.getTime()) / (1000 * 60 * 60);
      if (hoursElapsed > 2) {
        issues.push('Session duration exceeded normal limits');
        recommendations.push('Review session continuation or escalate to supervisor');
        healthScore -= 10;
      }

      sessionHealthChecks.push({
        sessionId: session.session_id,
        healthScore: Math.max(0, healthScore),
        issues,
        recommendations
      });
    }

    return sessionHealthChecks;
  } catch (error) {
    console.error('Error checking active sessions health:', error);
    return [];
  }
}

async function monitorCrisisEscalations(supabase: any): Promise<any> {
  try {
    // Get recent crisis alerts
    const { data: crisisAlerts, error } = await supabase
      .from('session_crisis_monitoring')
      .select('*')
      .neq('crisis_level', 'none')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const unescalatedCrises = crisisAlerts?.filter(alert => 
      !alert.escalation_triggered && 
      ['high', 'immediate'].includes(alert.crisis_level)
    ) || [];

    const escalatedCrises = crisisAlerts?.filter(alert => 
      alert.escalation_triggered
    ) || [];

    // Auto-escalate critical cases that haven't been escalated
    for (const crisis of unescalatedCrises) {
      if (crisis.crisis_level === 'immediate') {
        await autoEscalateCrisis(supabase, crisis);
      }
    }

    return {
      totalCrises: crisisAlerts?.length || 0,
      unescalatedCrises: unescalatedCrises.length,
      escalatedCrises: escalatedCrises.length,
      immediateAlerts: crisisAlerts?.filter(a => a.crisis_level === 'immediate').length || 0
    };
  } catch (error) {
    console.error('Error monitoring crisis escalations:', error);
    return {
      totalCrises: 0,
      unescalatedCrises: 0,
      escalatedCrises: 0,
      immediateAlerts: 0
    };
  }
}

async function autoEscalateCrisis(supabase: any, crisis: any): Promise<void> {
  try {
    const escalationActions = {
      timestamp: new Date().toISOString(),
      actions: [
        'Automatic escalation triggered',
        'Emergency protocols activated',
        'Professional oversight required',
        'Safety plan activation recommended'
      ],
      severity: crisis.crisis_level,
      automated: true
    };

    await supabase
      .from('session_crisis_monitoring')
      .update({
        escalation_triggered: true,
        escalation_actions: escalationActions,
        safety_plan_activated: true
      })
      .eq('session_id', crisis.session_id);

    // Create professional oversight record
    await supabase
      .from('professional_oversight')
      .insert({
        user_id: crisis.user_id,
        oversight_type: 'automatic_crisis_escalation',
        status: 'urgent',
        priority_level: 'immediate',
        reason: `Automatic escalation for ${crisis.crisis_level} crisis`,
        context_data: crisis
      });

    console.log(`Auto-escalated crisis for session: ${crisis.session_id}`);
  } catch (error) {
    console.error('Error auto-escalating crisis:', error);
  }
}

async function analyzeSystemHealth(supabase: any): Promise<SystemHealth> {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get session metrics
    const { data: sessions } = await supabase
      .from('session_quality_metrics')
      .select('*')
      .gte('created_at', oneHourAgo.toISOString());

    // Get active sessions
    const { data: activeSessions } = await supabase
      .from('session_real_time_status')
      .select('*')
      .gte('last_update', oneHourAgo.toISOString());

    // Get crisis alerts
    const { data: crisisAlerts } = await supabase
      .from('session_crisis_monitoring')
      .select('*')
      .neq('crisis_level', 'none')
      .gte('created_at', oneHourAgo.toISOString());

    const totalSessions = sessions?.length || 0;
    const activeSessionsCount = activeSessions?.length || 0;
    const averageEngagement = sessions?.reduce((sum, s) => sum + (s.engagement_level || 0), 0) / Math.max(1, totalSessions);
    const crisisCount = crisisAlerts?.length || 0;

    // Determine system status
    let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (crisisCount > 5 || averageEngagement < 0.4) {
      systemStatus = 'critical';
    } else if (crisisCount > 2 || averageEngagement < 0.6) {
      systemStatus = 'warning';
    }

    return {
      totalSessions,
      activeSessions: activeSessionsCount,
      averageEngagement,
      crisisAlerts: crisisCount,
      systemStatus,
      timestamp: now.toISOString()
    };
  } catch (error) {
    console.error('Error analyzing system health:', error);
    return {
      totalSessions: 0,
      activeSessions: 0,
      averageEngagement: 0,
      crisisAlerts: 0,
      systemStatus: 'critical',
      timestamp: new Date().toISOString()
    };
  }
}

async function generateHealthReport(supabase: any, data: any): Promise<any> {
  const { activeSessionsHealth, crisisStatus, systemHealth } = data;

  // Calculate overall health score
  const avgSessionHealth = activeSessionsHealth.reduce((sum: number, session: SessionHealth) => 
    sum + session.healthScore, 0) / Math.max(1, activeSessionsHealth.length);

  const criticalIssues = activeSessionsHealth.filter((session: SessionHealth) => 
    session.healthScore < 50).length;

  const healthReport = {
    overallHealthScore: avgSessionHealth,
    systemStatus: systemHealth.systemStatus,
    criticalIssues,
    activeSessionsCount: systemHealth.activeSessions,
    crisisAlertsCount: crisisStatus.totalCrises,
    unescalatedCrises: crisisStatus.unescalatedCrises,
    immediateAlerts: crisisStatus.immediateAlerts,
    averageEngagement: systemHealth.averageEngagement,
    sessionHealthDetails: activeSessionsHealth,
    recommendations: generateRecommendations(activeSessionsHealth, crisisStatus, systemHealth),
    timestamp: new Date().toISOString()
  };

  return healthReport;
}

function generateRecommendations(sessionHealth: SessionHealth[], crisisStatus: any, systemHealth: SystemHealth): string[] {
  const recommendations: string[] = [];

  if (systemHealth.systemStatus === 'critical') {
    recommendations.push('CRITICAL: Immediate system attention required');
  }

  if (crisisStatus.unescalatedCrises > 0) {
    recommendations.push(`${crisisStatus.unescalatedCrises} crisis alerts need immediate escalation`);
  }

  if (systemHealth.averageEngagement < 0.5) {
    recommendations.push('Low system-wide engagement - review therapy techniques and training');
  }

  if (sessionHealth.filter((s: SessionHealth) => s.healthScore < 50).length > 0) {
    recommendations.push('Multiple sessions with poor health scores - consider intervention');
  }

  if (recommendations.length === 0) {
    recommendations.push('System operating within normal parameters');
  }

  return recommendations;
}

async function storeMonitoringMetrics(supabase: any, healthReport: any): Promise<void> {
  try {
    await supabase
      .from('real_time_metrics')
      .insert({
        metric_type: 'therapy_system_health',
        metric_value: healthReport.overallHealthScore,
        metric_metadata: {
          system_status: healthReport.systemStatus,
          active_sessions: healthReport.activeSessionsCount,
          crisis_alerts: healthReport.crisisAlertsCount,
          avg_engagement: healthReport.averageEngagement,
          recommendations: healthReport.recommendations
        }
      });
  } catch (error) {
    console.error('Error storing monitoring metrics:', error);
  }
}

async function sendHealthAlerts(supabase: any, healthReport: any): Promise<void> {
  try {
    // Send alerts for critical issues
    if (healthReport.systemStatus === 'critical' || healthReport.immediateAlerts > 0) {
      console.log('CRITICAL ALERT: Therapy system requires immediate attention');
      
      // In a real system, this would send notifications to administrators
      // For now, we'll just log the alert
      console.log('Health Report:', JSON.stringify(healthReport, null, 2));
    }
  } catch (error) {
    console.error('Error sending health alerts:', error);
  }
}