import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface UserDropOffPoint {
  step: string;
  total_attempts: number;
  completed: number;
  drop_off_rate: number;
  common_exit_reasons: string[];
}

export class PerformanceMonitoringService {
  
  /**
   * Track user drop-off analytics throughout the system
   */
  static async trackUserDropOff(): Promise<UserDropOffPoint[]> {
    try {
      const dropOffPoints: UserDropOffPoint[] = [];

      // Onboarding drop-off analysis
      const onboardingDropOff = await this.analyzeOnboardingDropOff();
      dropOffPoints.push(...onboardingDropOff);

      // Therapy session drop-off
      const sessionDropOff = await this.analyzeSessionDropOff();
      dropOffPoints.push(sessionDropOff);

      // Goal completion drop-off
      const goalDropOff = await this.analyzeGoalDropOff();
      dropOffPoints.push(goalDropOff);

      return dropOffPoints;

    } catch (error) {
      console.error('User drop-off tracking failed:', error);
      return [];
    }
  }

  /**
   * Monitor edge function performance
   */
  static async monitorEdgeFunctionPerformance(): Promise<PerformanceMetric[]> {
    try {
      const metrics: PerformanceMetric[] = [];

      // Get recent function invocations from logs
      const functions = [
        'analyze-therapy-message',
        'adaptive-therapy-planner',
        'enhanced-therapy-matching',
        'real-time-therapy-adaptation',
        'system-health-monitor'
      ];

      for (const functionName of functions) {
        const metric = await this.getFunctionPerformanceMetric(functionName);
        if (metric) metrics.push(metric);
      }

      return metrics;

    } catch (error) {
      console.error('Edge function monitoring failed:', error);
      return [];
    }
  }

  /**
   * Real-time system health monitoring
   */
  static async monitorSystemHealth(): Promise<PerformanceMetric[]> {
    try {
      const metrics: PerformanceMetric[] = [];

      // Database performance
      const dbMetric = await this.getDatabasePerformanceMetric();
      metrics.push(dbMetric);

      // Active user count
      const userMetric = await this.getActiveUserMetric();
      metrics.push(userMetric);

      // Error rate
      const errorMetric = await this.getErrorRateMetric();
      metrics.push(errorMetric);

      // Response time
      const responseMetric = await this.getResponseTimeMetric();
      metrics.push(responseMetric);

      // AI service availability
      const aiMetric = await this.getAIServiceMetric();
      metrics.push(aiMetric);

      return metrics;

    } catch (error) {
      console.error('System health monitoring failed:', error);
      return [];
    }
  }

  /**
   * Track performance over time
   */
  static async trackPerformanceTrends(days: number = 7): Promise<{
    [metric: string]: { date: string; value: number }[];
  }> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

      // Get historical performance data
      const { data: metrics, error } = await supabase
        .from('real_time_metrics')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) throw error;

      // Group by metric type and aggregate by day
      const trends: { [metric: string]: { date: string; value: number }[] } = {};

      metrics?.forEach(metric => {
        const date = new Date(metric.timestamp).toISOString().split('T')[0];
        const type = metric.metric_type;

        if (!trends[type]) {
          trends[type] = [];
        }

        const existingEntry = trends[type].find(t => t.date === date);
        if (existingEntry) {
          existingEntry.value = (existingEntry.value + metric.metric_value) / 2; // Average
        } else {
          trends[type].push({ date, value: metric.metric_value });
        }
      });

      return trends;

    } catch (error) {
      console.error('Performance trend tracking failed:', error);
      return {};
    }
  }

  /**
   * Generate performance alerts
   */
  static async generatePerformanceAlerts(): Promise<{
    critical: string[];
    warnings: string[];
    recommendations: string[];
  }> {
    try {
      const critical: string[] = [];
      const warnings: string[] = [];
      const recommendations: string[] = [];

      // Check current metrics
      const systemMetrics = await this.monitorSystemHealth();
      const dropOffData = await this.trackUserDropOff();

      // Analyze metrics for alerts
      systemMetrics.forEach(metric => {
        if (metric.status === 'critical') {
          critical.push(`CRITICAL: ${metric.name} is ${metric.value}${metric.unit} (threshold: ${metric.threshold}${metric.unit})`);
        } else if (metric.status === 'warning') {
          warnings.push(`WARNING: ${metric.name} is ${metric.value}${metric.unit} (threshold: ${metric.threshold}${metric.unit})`);
        }

        // Generate recommendations based on trends
        if (metric.trend === 'down' && metric.status !== 'good') {
          recommendations.push(`Consider optimizing ${metric.name} - showing declining trend`);
        }
      });

      // Check for high drop-off rates
      dropOffData.forEach(point => {
        if (point.drop_off_rate > 0.5) {
          critical.push(`HIGH DROP-OFF: ${point.drop_off_rate * 100}% users dropping off at ${point.step}`);
        } else if (point.drop_off_rate > 0.3) {
          warnings.push(`Elevated drop-off at ${point.step}: ${point.drop_off_rate * 100}%`);
        }
      });

      // Store alerts for tracking
      await this.storePerformanceAlerts({ critical, warnings, recommendations });

      return { critical, warnings, recommendations };

    } catch (error) {
      console.error('Performance alert generation failed:', error);
      return { critical: [], warnings: [], recommendations: [] };
    }
  }

  // Private helper methods

  private static async analyzeOnboardingDropOff(): Promise<UserDropOffPoint[]> {
    try {
      const { data: logs } = await supabase
        .from('therapy_plan_creation_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const steps = ['analysis', 'plan_creation', 'therapist_matching', 'completion'];
      const dropOffPoints: UserDropOffPoint[] = [];

      for (const step of steps) {
        const stepAttempts = logs?.filter(log => {
          const planData = log.plan_data as any;
          return (planData?.onboarding_step === step || 
                  log.error_message?.includes(step));
        }) || [];

        const completed = stepAttempts.filter(log => log.status === 'completed').length;
        const total = stepAttempts.length;

        if (total > 0) {
          dropOffPoints.push({
            step: `onboarding_${step}`,
            total_attempts: total,
            completed,
            drop_off_rate: (total - completed) / total,
            common_exit_reasons: this.extractExitReasons(stepAttempts.filter(log => log.status === 'failed'))
          });
        }
      }

      return dropOffPoints;

    } catch (error) {
      console.error('Onboarding drop-off analysis failed:', error);
      return [];
    }
  }

  private static async analyzeSessionDropOff(): Promise<UserDropOffPoint> {
    try {
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .gte('start_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.end_time).length || 0;

      return {
        step: 'therapy_session',
        total_attempts: totalSessions,
        completed: completedSessions,
        drop_off_rate: totalSessions > 0 ? (totalSessions - completedSessions) / totalSessions : 0,
        common_exit_reasons: ['session_timeout', 'technical_issues', 'user_disconnection']
      };

    } catch (error) {
      console.error('Session drop-off analysis failed:', error);
      return {
        step: 'therapy_session',
        total_attempts: 0,
        completed: 0,
        drop_off_rate: 0,
        common_exit_reasons: []
      };
    }
  }

  private static async analyzeGoalDropOff(): Promise<UserDropOffPoint> {
    try {
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const totalGoals = goals?.length || 0;
      const completedGoals = goals?.filter(g => g.is_completed).length || 0;

      return {
        step: 'goal_completion',
        total_attempts: totalGoals,
        completed: completedGoals,
        drop_off_rate: totalGoals > 0 ? (totalGoals - completedGoals) / totalGoals : 0,
        common_exit_reasons: ['lack_of_motivation', 'unrealistic_goals', 'insufficient_support']
      };

    } catch (error) {
      console.error('Goal drop-off analysis failed:', error);
      return {
        step: 'goal_completion',
        total_attempts: 0,
        completed: 0,
        drop_off_rate: 0,
        common_exit_reasons: []
      };
    }
  }

  private static async getFunctionPerformanceMetric(functionName: string): Promise<PerformanceMetric | null> {
    try {
      // Get recent performance data for this function
      const { data: metrics } = await supabase
        .from('real_time_metrics')
        .select('*')
        .eq('metric_type', 'function_performance')
        .ilike('metric_metadata->function_name', functionName)
        .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('timestamp', { ascending: false });

      if (!metrics || metrics.length === 0) {
        return null;
      }

      const avgResponseTime = metrics.reduce((sum, m) => {
        const metadata = m.metric_metadata as any;
        return sum + (metadata?.response_time || 0);
      }, 0) / metrics.length;

      return {
        name: `${functionName}_response_time`,
        value: Math.round(avgResponseTime),
        unit: 'ms',
        threshold: 2000,
        status: avgResponseTime < 1000 ? 'good' : avgResponseTime < 2000 ? 'warning' : 'critical',
        trend: this.calculateTrend(metrics.map(m => {
          const metadata = m.metric_metadata as any;
          return metadata?.response_time || 0;
        }))
      };

    } catch (error) {
      console.error(`Function performance metric failed for ${functionName}:`, error);
      return null;
    }
  }

  private static async getDatabasePerformanceMetric(): Promise<PerformanceMetric> {
    const startTime = Date.now();
    
    try {
      // Simple query to test DB performance
      await supabase
        .from('therapist_personalities')
        .select('count', { count: 'exact', head: true });

      const responseTime = Date.now() - startTime;

      return {
        name: 'database_response_time',
        value: responseTime,
        unit: 'ms',
        threshold: 500,
        status: responseTime < 200 ? 'good' : responseTime < 500 ? 'warning' : 'critical',
        trend: 'stable'
      };

    } catch (error) {
      return {
        name: 'database_response_time',
        value: Date.now() - startTime,
        unit: 'ms',
        threshold: 500,
        status: 'critical',
        trend: 'down'
      };
    }
  }

  private static async getActiveUserMetric(): Promise<PerformanceMetric> {
    try {
      // Mock active users for now
      const activeUsers = Math.floor(Math.random() * 50) + 10; // TODO: Implement proper session tracking

      

      return {
        name: 'active_users',
        value: activeUsers,
        unit: ' users',
        threshold: 0,
        status: 'good',
        trend: 'stable'
      };

    } catch (error) {
      return {
        name: 'active_users',
        value: 0,
        unit: ' users',
        threshold: 0,
        status: 'warning',
        trend: 'down'
      };
    }
  }

  private static async getErrorRateMetric(): Promise<PerformanceMetric> {
    try {
      const { data: errorLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'error_occurred')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

      const { data: totalLogs } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const errorCount = errorLogs?.length || 0;
      const totalCount = typeof totalLogs === 'number' ? totalLogs : 1;
      const errorRate = errorCount / totalCount;

      return {
        name: 'error_rate',
        value: Math.round(errorRate * 100),
        unit: '%',
        threshold: 5,
        status: errorRate < 0.01 ? 'good' : errorRate < 0.05 ? 'warning' : 'critical',
        trend: 'stable'
      };

    } catch (error) {
      return {
        name: 'error_rate',
        value: 100,
        unit: '%',
        threshold: 5,
        status: 'critical',
        trend: 'up'
      };
    }
  }

  private static async getResponseTimeMetric(): Promise<PerformanceMetric> {
    try {
      const { data: metrics } = await supabase
        .from('real_time_metrics')
        .select('*')
        .eq('metric_type', 'response_time')
        .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const avgResponseTime = metrics?.length > 0 ? 
        metrics.reduce((sum, m) => sum + m.metric_value, 0) / metrics.length : 0;

      return {
        name: 'avg_response_time',
        value: Math.round(avgResponseTime),
        unit: 'ms',
        threshold: 1000,
        status: avgResponseTime < 500 ? 'good' : avgResponseTime < 1000 ? 'warning' : 'critical',
        trend: this.calculateTrend(metrics?.map(m => m.metric_value) || [])
      };

    } catch (error) {
      return {
        name: 'avg_response_time',
        value: 0,
        unit: 'ms',
        threshold: 1000,
        status: 'warning',
        trend: 'stable'
      };
    }
  }

  private static async getAIServiceMetric(): Promise<PerformanceMetric> {
    const anthropicKey = typeof window === 'undefined' ? process.env.ANTHROPIC_API_KEY : undefined;
    const openaiKey = typeof window === 'undefined' ? process.env.OPENAI_API_KEY : undefined;

    const availability = (anthropicKey ? 50 : 0) + (openaiKey ? 50 : 0);

    return {
      name: 'ai_service_availability',
      value: availability,
      unit: '%',
      threshold: 100,
      status: availability === 100 ? 'good' : availability >= 50 ? 'warning' : 'critical',
      trend: 'stable'
    };
  }

  private static calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';

    const recent = values.slice(-Math.min(5, values.length));
    const avg1 = recent.slice(0, Math.floor(recent.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(recent.length / 2);
    const avg2 = recent.slice(Math.floor(recent.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(recent.length / 2);

    const change = (avg2 - avg1) / avg1;

    if (change > 0.1) return 'up';
    if (change < -0.1) return 'down';
    return 'stable';
  }

  private static extractExitReasons(failedLogs: any[]): string[] {
    const reasons: { [key: string]: number } = {};
    
    failedLogs.forEach(log => {
      const error = log.error_message || 'unknown_error';
      reasons[error] = (reasons[error] || 0) + 1;
    });

    return Object.entries(reasons)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([reason]) => reason);
  }

  private static async storePerformanceAlerts(alerts: {
    critical: string[];
    warnings: string[];
    recommendations: string[];
  }): Promise<void> {
    try {
      await supabase.from('real_time_metrics').insert({
        metric_type: 'performance_alerts',
        metric_value: alerts.critical.length + alerts.warnings.length,
        metric_metadata: alerts
      });
    } catch (error) {
      console.error('Failed to store performance alerts:', error);
    }
  }
}