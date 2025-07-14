import { supabase } from '@/integrations/supabase/client';

// Cost calculation constants based on latest Claude 4 pricing
const MODEL_COSTS = {
  'claude-opus-4-20250514': {
    inputCost: 0.00015,    // $0.15 per 1K tokens input
    outputCost: 0.0006,    // $0.60 per 1K tokens output
  },
  'claude-sonnet-4-20250514': {
    inputCost: 0.00003,    // $0.03 per 1K tokens input
    outputCost: 0.00015,   // $0.15 per 1K tokens output
  },
  'claude-3-5-haiku-20241022': {
    inputCost: 0.000001,   // $0.001 per 1K tokens input
    outputCost: 0.000005,  // $0.005 per 1K tokens output
  },
  'gpt-4.1-2025-04-14': {
    inputCost: 0.00003,    // $0.03 per 1K tokens input
    outputCost: 0.00006,   // $0.06 per 1K tokens output
  }
};

export interface UsageMetrics {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  modelBreakdown: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

export interface CostForecast {
  period: 'daily' | 'weekly' | 'monthly';
  predictedCost: number;
  predictedUsage: number;
  confidence: number;
  modelBreakdown: Record<string, number>;
}

export interface UsageAlert {
  id: string;
  type: 'usage_threshold' | 'cost_threshold' | 'anomaly_detection';
  threshold: number;
  current: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export interface OptimizationRecommendation {
  id: string;
  type: 'model_downgrade' | 'usage_pattern' | 'plan_upgrade' | 'cost_alert';
  title: string;
  description: string;
  potentialSavings: number;
  confidence: number;
  priority: number;
  actions: string[];
}

export class CostOptimizationService {
  
  // Track AI usage with detailed cost calculation
  static async trackUsage(params: {
    userId: string;
    sessionId?: string;
    modelId: string;
    provider: string;
    taskType: string;
    inputTokens: number;
    outputTokens: number;
    responseTimeMs: number;
    subscriptionTier: string;
    success: boolean;
    metadata?: Record<string, any>;
  }) {
    const modelCost = MODEL_COSTS[params.modelId as keyof typeof MODEL_COSTS];
    if (!modelCost) {
      console.warn(`No cost data for model: ${params.modelId}`);
      return;
    }

    const inputCost = (params.inputTokens / 1000) * modelCost.inputCost;
    const outputCost = (params.outputTokens / 1000) * modelCost.outputCost;
    const totalCost = inputCost + outputCost;
    const totalTokens = params.inputTokens + params.outputTokens;

    try {
      const { error } = await supabase
        .from('ai_usage_tracking')
        .insert({
          user_id: params.userId,
          session_id: params.sessionId,
          model_id: params.modelId,
          provider: params.provider,
          task_type: params.taskType,
          input_tokens: params.inputTokens,
          output_tokens: params.outputTokens,
          total_tokens: totalTokens,
          cost_per_token: totalCost / totalTokens,
          total_cost: totalCost,
          response_time_ms: params.responseTimeMs,
          success: params.success,
          subscription_tier: params.subscriptionTier,
          metadata: params.metadata || {}
        });

      if (error) throw error;

      // Update daily model performance tracking
      await this.updateModelPerformanceTracking(params.modelId, params.provider, {
        requests: 1,
        successfulRequests: params.success ? 1 : 0,
        failedRequests: params.success ? 0 : 1,
        responseTime: params.responseTimeMs,
        tokens: totalTokens,
        cost: totalCost
      });

      // Check for alerts
      await this.checkUsageAlerts(params.userId);

    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }

  // Get usage metrics for a user
  static async getUserUsageMetrics(
    userId: string, 
    period: 'day' | 'week' | 'month' = 'month'
  ): Promise<UsageMetrics> {
    const periodMap = {
      day: '1 day',
      week: '1 week', 
      month: '1 month'
    };

    try {
      const periodMs = period === 'day' ? 86400000 : period === 'week' ? 604800000 : 2592000000;
      const { data, error } = await supabase
        .from('ai_usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - periodMs).toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          totalRequests: 0,
          totalTokens: 0,
          totalCost: 0,
          averageResponseTime: 0,
          modelBreakdown: {}
        };
      }

      const totalRequests = data.length;
      const totalTokens = data.reduce((sum, record) => sum + record.total_tokens, 0);
      const totalCost = data.reduce((sum, record) => sum + parseFloat(String(record.total_cost)), 0);
      const averageResponseTime = data.reduce((sum, record) => sum + (record.response_time_ms || 0), 0) / totalRequests;

      const modelBreakdown = data.reduce((breakdown, record) => {
        if (!breakdown[record.model_id]) {
          breakdown[record.model_id] = { requests: 0, tokens: 0, cost: 0 };
        }
        breakdown[record.model_id].requests++;
        breakdown[record.model_id].tokens += record.total_tokens;
        breakdown[record.model_id].cost += parseFloat(String(record.total_cost));
        return breakdown;
      }, {} as Record<string, { requests: number; tokens: number; cost: number }>);

      return {
        totalRequests,
        totalTokens,
        totalCost,
        averageResponseTime,
        modelBreakdown
      };

    } catch (error) {
      console.error('Error fetching usage metrics:', error);
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        averageResponseTime: 0,
        modelBreakdown: {}
      };
    }
  }

  // Generate cost forecast
  static async generateCostForecast(
    userId: string, 
    period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<CostForecast> {
    try {
      // Get historical usage for prediction
      const days = period === 'daily' ? 7 : period === 'weekly' ? 28 : 90;
      const lookbackMs = days * 86400000;
      const { data, error } = await supabase
        .from('ai_usage_tracking')
        .select('total_cost, model_id, timestamp')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - lookbackMs).toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          period,
          predictedCost: 0,
          predictedUsage: 0,
          confidence: 0,
          modelBreakdown: {}
        };
      }

      // Calculate daily averages
      const dailyUsage = new Map<string, number>();
      const modelUsage = new Map<string, number>();

      data.forEach(record => {
        const day = new Date(record.timestamp).toDateString();
        const cost = parseFloat(String(record.total_cost));
        
        dailyUsage.set(day, (dailyUsage.get(day) || 0) + cost);
        modelUsage.set(record.model_id, (modelUsage.get(record.model_id) || 0) + cost);
      });

      const dailyCosts = Array.from(dailyUsage.values());
      const avgDailyCost = dailyCosts.reduce((sum, cost) => sum + cost, 0) / dailyCosts.length;

      let multiplier = 1;
      if (period === 'weekly') multiplier = 7;
      else if (period === 'monthly') multiplier = 30;

      const predictedCost = avgDailyCost * multiplier;
      const confidence = Math.min(0.95, dailyCosts.length / (period === 'monthly' ? 30 : 7));

      // Model breakdown prediction
      const totalModelCost = Array.from(modelUsage.values()).reduce((sum, cost) => sum + cost, 0);
      const modelBreakdown: Record<string, number> = {};
      modelUsage.forEach((cost, modelId) => {
        modelBreakdown[modelId] = (cost / totalModelCost) * predictedCost;
      });

      return {
        period,
        predictedCost,
        predictedUsage: Math.round(predictedCost / 0.0001), // Rough token estimate
        confidence,
        modelBreakdown
      };

    } catch (error) {
      console.error('Error generating cost forecast:', error);
      return {
        period,
        predictedCost: 0,
        predictedUsage: 0,
        confidence: 0,
        modelBreakdown: {}
      };
    }
  }

  // Check for usage alerts
  static async checkUsageAlerts(userId: string): Promise<UsageAlert[]> {
    try {
      // Get user's configured alerts
      const { data: alerts, error: alertError } = await supabase
        .from('usage_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (alertError) throw alertError;

      const activeAlerts: UsageAlert[] = [];

      if (!alerts || alerts.length === 0) {
        return activeAlerts;
      }

      // Get current month usage
      const currentUsage = await this.getUserUsageMetrics(userId, 'month');

      for (const alert of alerts) {
        let current = 0;
        let threshold = alert.threshold_value;

        if (alert.alert_type === 'cost_threshold') {
          current = currentUsage.totalCost;
        } else if (alert.alert_type === 'usage_threshold') {
          current = currentUsage.totalRequests;
        }

        if (current >= threshold) {
          const severity = current >= threshold * 1.5 ? 'critical' : 
                          current >= threshold * 1.2 ? 'high' : 'medium';

          activeAlerts.push({
            id: alert.id,
            type: alert.alert_type as 'usage_threshold' | 'cost_threshold' | 'anomaly_detection',
            threshold,
            current,
            severity: severity as 'low' | 'medium' | 'high' | 'critical',
            message: `${alert.alert_type === 'cost_threshold' ? 'Cost' : 'Usage'} threshold exceeded: $${current.toFixed(2)} / $${threshold.toFixed(2)}`
          });
        }
      }

      // Check for anomalies
      const forecast = await this.generateCostForecast(userId, 'daily');
      const todayUsage = await this.getUserUsageMetrics(userId, 'day');
      
      if (todayUsage.totalCost > forecast.predictedCost * 2) {
        activeAlerts.push({
          id: 'anomaly-high-usage',
          type: 'anomaly_detection' as const,
          threshold: forecast.predictedCost,
          current: todayUsage.totalCost,
          severity: 'high' as const,
          message: `Unusual high usage detected: $${todayUsage.totalCost.toFixed(2)} (expected: $${forecast.predictedCost.toFixed(2)})`
        });
      }

      return activeAlerts;

    } catch (error) {
      console.error('Error checking usage alerts:', error);
      return [];
    }
  }

  // Generate optimization recommendations
  static async generateOptimizationRecommendations(userId: string): Promise<OptimizationRecommendation[]> {
    try {
      const usage = await this.getUserUsageMetrics(userId, 'month');
      const recommendations: OptimizationRecommendation[] = [];

      // Get user's subscription tier
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      const currentTier = subscription?.subscription_plans?.name?.toLowerCase() || 'free';

      // Model optimization recommendations
      if (usage.modelBreakdown['claude-opus-4-20250514']?.cost > usage.totalCost * 0.8) {
        const potentialSavings = usage.modelBreakdown['claude-opus-4-20250514'].cost * 0.6;
        recommendations.push({
          id: 'model-downgrade-opus',
          type: 'model_downgrade',
          title: 'Consider Claude Sonnet for routine conversations',
          description: 'You\'re using Claude Opus for most conversations. Claude Sonnet can handle 80% of therapy tasks at 75% lower cost.',
          potentialSavings,
          confidence: 0.85,
          priority: 1,
          actions: [
            'Switch to Claude Sonnet for basic therapy sessions',
            'Reserve Opus for complex analysis and crisis situations',
            'Enable smart model routing'
          ]
        });
      }

      // Plan optimization recommendations
      if (currentTier === 'premium' && usage.totalCost < 5) {
        recommendations.push({
          id: 'plan-downgrade',
          type: 'plan_upgrade',
          title: 'Pro plan might be more cost-effective',
          description: 'Your usage patterns suggest the Pro plan would meet your needs at lower cost.',
          potentialSavings: 15,
          confidence: 0.75,
          priority: 2,
          actions: [
            'Review Pro plan features',
            'Downgrade to Pro plan',
            'Monitor usage for optimization'
          ]
        });
      }

      // Usage pattern recommendations
      if (usage.totalRequests > 150 && currentTier === 'free') {
        recommendations.push({
          id: 'plan-upgrade-usage',
          type: 'plan_upgrade',
          title: 'Upgrade for better value',
          description: 'Your high usage suggests a paid plan would provide better per-session value.',
          potentialSavings: 0,
          confidence: 0.9,
          priority: 1,
          actions: [
            'Upgrade to Pro plan for unlimited sessions',
            'Access higher quality AI models',
            'Get priority support'
          ]
        });
      }

      return recommendations;

    } catch (error) {
      console.error('Error generating optimization recommendations:', error);
      return [];
    }
  }

  // Smart model selection based on conversation complexity
  static determineOptimalModel(
    conversationHistory: any[],
    taskType: string,
    userTier: string,
    budget?: number
  ): string {
    // Crisis situations always use best model
    if (taskType === 'crisis') {
      return 'claude-opus-4-20250514';
    }

    // Simple conversations can use Haiku
    if (conversationHistory.length < 3 && taskType === 'chat') {
      return userTier === 'free' ? 'claude-3-5-haiku-20241022' : 'claude-sonnet-4-20250514';
    }

    // Complex analysis needs Opus for premium users
    if (taskType === 'analysis' && (userTier === 'premium' || userTier === 'enterprise')) {
      return 'claude-opus-4-20250514';
    }

    // Default intelligent routing
    if (budget && budget < 0.01) {
      return 'claude-3-5-haiku-20241022';
    }

    return userTier === 'free' ? 'claude-sonnet-4-20250514' : 'claude-sonnet-4-20250514';
  }

  // Update model performance tracking
  private static async updateModelPerformanceTracking(
    modelId: string,
    provider: string,
    metrics: {
      requests: number;
      successfulRequests: number;
      failedRequests: number;
      responseTime: number;
      tokens: number;
      cost: number;
    }
  ) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('model_performance_tracking')
        .upsert({
          model_id: modelId,
          provider,
          date: today,
          total_requests: metrics.requests,
          successful_requests: metrics.successfulRequests,
          failed_requests: metrics.failedRequests,
          avg_response_time_ms: metrics.responseTime,
          total_tokens: metrics.tokens,
          total_cost: metrics.cost
        }, {
          onConflict: 'model_id,date',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating model performance tracking:', error);
    }
  }
}