import { supabase } from '@/integrations/supabase/client';

interface HealthMetric {
  type: 'response_time' | 'error_rate' | 'session_quality' | 'ai_confidence' | 'user_engagement';
  value: number;
  threshold: {
    warning: number;
    critical: number;
  };
  unit: string;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  metrics: HealthMetric[];
  lastCheck: Date;
  alerts: string[];
}

class SystemHealthMonitor {
  private static instance: SystemHealthMonitor;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private subscribers: ((health: SystemHealth) => void)[] = [];

  static getInstance(): SystemHealthMonitor {
    if (!SystemHealthMonitor.instance) {
      SystemHealthMonitor.instance = new SystemHealthMonitor();
    }
    return SystemHealthMonitor.instance;
  }

  private constructor() {
    this.startMonitoring();
  }

  subscribe(callback: (health: SystemHealth) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(health: SystemHealth) {
    this.subscribers.forEach(callback => callback(health));
  }

  private async checkResponseTime(): Promise<HealthMetric> {
    const start = performance.now();
    
    try {
      await supabase.from('therapist_personalities').select('id').limit(1);
      const responseTime = performance.now() - start;
      
      return {
        type: 'response_time',
        value: responseTime,
        threshold: {
          warning: 2000,
          critical: 5000
        },
        unit: 'ms'
      };
    } catch (error) {
      return {
        type: 'response_time',
        value: 999999,
        threshold: {
          warning: 2000,
          critical: 5000
        },
        unit: 'ms'
      };
    }
  }

  private async checkSessionQuality(): Promise<HealthMetric> {
    try {
      // Get recent session quality metrics
      const { data: qualityMetrics } = await supabase
        .from('ai_quality_metrics')
        .select('response_quality, therapeutic_value, safety_score')
        .gte('timestamp', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
        .order('timestamp', { ascending: false })
        .limit(10);

      let avgQuality = 0.85; // Default baseline
      
      if (qualityMetrics && qualityMetrics.length > 0) {
        const avgResponseQuality = qualityMetrics.reduce((sum, m) => sum + m.response_quality, 0) / qualityMetrics.length;
        const avgTherapeuticValue = qualityMetrics.reduce((sum, m) => sum + m.therapeutic_value, 0) / qualityMetrics.length;
        const avgSafetyScore = qualityMetrics.reduce((sum, m) => sum + m.safety_score, 0) / qualityMetrics.length;
        
        avgQuality = (avgResponseQuality + avgTherapeuticValue + avgSafetyScore) / 3;
      }

      return {
        type: 'session_quality',
        value: avgQuality,
        threshold: {
          warning: 0.7,
          critical: 0.5
        },
        unit: 'score'
      };
    } catch (error) {
      console.error('Error checking session quality:', error);
      return {
        type: 'session_quality',
        value: 0.5,
        threshold: {
          warning: 0.7,
          critical: 0.5
        },
        unit: 'score'
      };
    }
  }

  private async checkErrorRate(): Promise<HealthMetric> {
    try {
      // Check recent error logs or performance metrics
      const { data: recentMetrics } = await supabase
        .from('performance_metrics')
        .select('metadata')
        .eq('metric_type', 'error_tracking')
        .gte('recorded_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
        .order('recorded_at', { ascending: false })
        .limit(100);

      let errorRate = 0.02; // Default baseline 2%
      
      if (recentMetrics && recentMetrics.length > 0) {
        const errors = recentMetrics.filter(m => {
          const metadata = m.metadata as any;
          return metadata?.error === true;
        }).length;
        errorRate = errors / recentMetrics.length;
      }

      return {
        type: 'error_rate',
        value: errorRate,
        threshold: {
          warning: 0.05, // 5%
          critical: 0.15  // 15%
        },
        unit: 'percentage'
      };
    } catch (error) {
      return {
        type: 'error_rate',
        value: 0.02,
        threshold: {
          warning: 0.05,
          critical: 0.15
        },
        unit: 'percentage'
      };
    }
  }

  private async checkAIConfidence(): Promise<HealthMetric> {
    try {
      // Get recent AI confidence scores
      const { data: confidenceData } = await supabase
        .from('session_technique_tracking')
        .select('ai_confidence')
        .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      let avgConfidence = 0.8; // Default baseline
      
      if (confidenceData && confidenceData.length > 0) {
        avgConfidence = confidenceData.reduce((sum, item) => sum + (item.ai_confidence || 0.8), 0) / confidenceData.length;
      }

      return {
        type: 'ai_confidence',
        value: avgConfidence,
        threshold: {
          warning: 0.6,
          critical: 0.4
        },
        unit: 'score'
      };
    } catch (error) {
      return {
        type: 'ai_confidence',
        value: 0.8,
        threshold: {
          warning: 0.6,
          critical: 0.4
        },
        unit: 'score'
      };
    }
  }

  private async performHealthCheck(): Promise<SystemHealth> {
    const metrics = await Promise.all([
      this.checkResponseTime(),
      this.checkSessionQuality(),
      this.checkErrorRate(),
      this.checkAIConfidence()
    ]);

    const alerts: string[] = [];
    let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

    metrics.forEach(metric => {
      if (metric.value >= metric.threshold.critical || 
          (metric.type === 'session_quality' && metric.value <= metric.threshold.critical) ||
          (metric.type === 'ai_confidence' && metric.value <= metric.threshold.critical)) {
        overallStatus = 'critical';
        alerts.push(`Critical: ${metric.type} is ${metric.value.toFixed(2)} ${metric.unit}`);
      } else if (metric.value >= metric.threshold.warning || 
                 (metric.type === 'session_quality' && metric.value <= metric.threshold.warning) ||
                 (metric.type === 'ai_confidence' && metric.value <= metric.threshold.warning)) {
        if (overallStatus !== 'critical') {
          overallStatus = 'warning';
        }
        alerts.push(`Warning: ${metric.type} is ${metric.value.toFixed(2)} ${metric.unit}`);
      }
    });

    const health: SystemHealth = {
      overall: overallStatus,
      metrics,
      lastCheck: new Date(),
      alerts
    };

    // Log system health metrics
    try {
      await supabase.from('real_time_metrics').insert({
        metric_type: 'system_health',
        metric_value: overallStatus === 'healthy' ? 1 : overallStatus === 'warning' ? 0.5 : 0,
        metric_metadata: {
          status: overallStatus,
          alerts_count: alerts.length,
          timestamp: new Date().toISOString()
        } as any
      });
    } catch (error) {
      console.error('Error logging health metrics:', error);
    }

    return health;
  }

  private startMonitoring() {
    // Perform initial health check
    this.performHealthCheck().then(health => {
      this.notifySubscribers(health);
    });

    // Set up periodic health checks every 2 minutes
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.performHealthCheck();
      this.notifySubscribers(health);
    }, 2 * 60 * 1000);
  }

  stopMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  async getCurrentHealth(): Promise<SystemHealth> {
    return await this.performHealthCheck();
  }
}

export const systemHealthMonitor = SystemHealthMonitor.getInstance();
export type { SystemHealth, HealthMetric };