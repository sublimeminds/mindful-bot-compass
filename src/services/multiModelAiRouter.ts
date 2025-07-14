import { supabase } from '@/integrations/supabase/client';
import { ConfiguredAIService } from './configuredAiService';
import { realAIService } from './realAiService';
import { CostOptimizationService } from './costOptimizationService';

interface ModelSelectionCriteria {
  taskType: 'chat' | 'analysis' | 'crisis' | 'cultural' | 'creative';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex';
  culturalContext?: string;
  userTier: 'free' | 'pro' | 'premium' | 'enterprise';
}

interface AIModelProvider {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'gemini';
  capabilities: string[];
  costPerToken: number;
  averageLatency: number;
  qualityScore: number;
  available: boolean;
}

export class MultiModelAIRouter {
  private static availableModels: AIModelProvider[] = [
    {
      id: 'gpt-4.1-2025-04-14',
      name: 'GPT-4.1',
      provider: 'openai',
      capabilities: ['chat', 'analysis', 'creative'],
      costPerToken: 0.00003,
      averageLatency: 1200,
      qualityScore: 0.92,
      available: true
    },
    {
      id: 'claude-opus-4-20250514',
      name: 'Claude 4 Opus',
      provider: 'anthropic',
      capabilities: ['chat', 'analysis', 'crisis', 'cultural', 'transcription'],
      costPerToken: 0.00008,
      averageLatency: 2000,
      qualityScore: 0.98,
      available: true
    },
    {
      id: 'claude-sonnet-4-20250514',
      name: 'Claude 4 Sonnet',
      provider: 'anthropic',
      capabilities: ['chat', 'analysis', 'cultural', 'transcription'],
      costPerToken: 0.00002,
      averageLatency: 1000,
      qualityScore: 0.95,
      available: true
    },
    {
      id: 'claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      provider: 'anthropic',
      capabilities: ['chat', 'quick-analysis'],
      costPerToken: 0.000005,
      averageLatency: 500,
      qualityScore: 0.85,
      available: true
    }
  ];

    // Intelligent model selection with cost optimization
  static async selectOptimalModel(criteria: ModelSelectionCriteria): Promise<AIModelProvider> {
    let filteredModels = this.availableModels.filter(model => 
      model.available && model.capabilities.includes(criteria.taskType)
    );

    // Check if user has budget constraints
    const userId = (criteria as any).userId;
    let budgetConstraints = null;
    
    if (userId) {
      try {
        const usageLimits = await CostOptimizationService.checkUsageAlerts(userId);
        const monthlyUsage = await CostOptimizationService.getUserUsageMetrics(userId, 'month');
        
        // If approaching cost limits, prefer cheaper models
        if (usageLimits.some(alert => alert.type === 'cost_threshold' && alert.current > alert.threshold * 0.8)) {
          budgetConstraints = 'strict';
        } else if (monthlyUsage.totalCost > 10) {
          budgetConstraints = 'moderate';
        }
      } catch (error) {
        console.warn('Could not check budget constraints:', error);
      }
    }

    // Apply budget constraints
    if (budgetConstraints === 'strict') {
      filteredModels = filteredModels.filter(m => m.costPerToken <= 0.00002);
    } else if (budgetConstraints === 'moderate' && criteria.taskType !== 'crisis') {
      filteredModels = filteredModels.filter(m => m.costPerToken <= 0.00008);
    }

    // Priority-based selection
    if (criteria.urgency === 'critical') {
      // For crisis situations, prioritize quality over cost
      filteredModels = filteredModels.filter(m => m.qualityScore > 0.9);
      return filteredModels.reduce((best, current) => 
        current.qualityScore > best.qualityScore ? current : best
      );
    }

    if (criteria.urgency === 'high') {
      // Balance quality and speed
      filteredModels = filteredModels.filter(m => m.averageLatency < 1500);
      return filteredModels.reduce((best, current) => 
        (current.qualityScore / current.averageLatency) > (best.qualityScore / best.averageLatency) ? current : best
      );
    }

    if (criteria.userTier === 'free' || budgetConstraints === 'strict') {
      // Cost-optimized for free users or budget constraints
      return filteredModels.reduce((best, current) => 
        current.costPerToken < best.costPerToken ? current : best
      );
    }

    if (criteria.userTier === 'pro') {
      // Mid-tier: Balance quality and cost with budget awareness
      return filteredModels.reduce((best, current) => {
        const costWeight = budgetConstraints ? 0.5 : 0.3;
        const qualityWeight = budgetConstraints ? 0.5 : 0.7;
        const currentScore = current.qualityScore * qualityWeight + (1 / current.costPerToken) * costWeight;
        const bestScore = best.qualityScore * qualityWeight + (1 / best.costPerToken) * costWeight;
        return currentScore > bestScore ? current : best;
      });
    }

    if (criteria.complexity === 'complex' || criteria.culturalContext) {
      // Use highest quality model for complex tasks, but consider cost if constrained
      if (budgetConstraints) {
        return filteredModels.reduce((best, current) => {
          const currentScore = (current.qualityScore * 0.8) + ((1 / current.costPerToken) * 0.2);
          const bestScore = (best.qualityScore * 0.8) + ((1 / best.costPerToken) * 0.2);
          return currentScore > bestScore ? current : best;
        });
      }
      return filteredModels.reduce((best, current) => 
        current.qualityScore > best.qualityScore ? current : best
      );
    }

    // Default: balanced selection with cost awareness
    return filteredModels.reduce((best, current) => {
      const costWeight = budgetConstraints ? 0.3 : 0.1;
      const qualityWeight = budgetConstraints ? 0.5 : 0.6;
      const speedWeight = 0.2;
      
      const currentScore = (current.qualityScore * qualityWeight) + 
                          ((1 / current.averageLatency) * speedWeight) + 
                          ((1 / current.costPerToken) * costWeight);
      const bestScore = (best.qualityScore * qualityWeight) + 
                       ((1 / best.averageLatency) * speedWeight) + 
                       ((1 / best.costPerToken) * costWeight);
      return currentScore > bestScore ? current : best;
    });
  }

  // Route message to optimal AI model
  static async routeMessage(
    message: string,
    context: any,
    criteria: ModelSelectionCriteria
  ): Promise<any> {
    const selectedModel = await this.selectOptimalModel(criteria);
    
    // Log model selection for analytics
    await this.logModelSelection(selectedModel.id, criteria, context.userId);

    const startTime = Date.now();
    let response;

    try {
      if (selectedModel.provider === 'anthropic') {
        response = await this.callAnthropicModel(selectedModel, message, context);
      } else if (selectedModel.provider === 'openai') {
        response = await this.callOpenAIModel(selectedModel, message, context);
      } else {
        throw new Error(`Unsupported provider: ${selectedModel.provider}`);
      }

      const responseTime = Date.now() - startTime;
      
      // Record performance metrics and cost tracking
      await this.recordPerformanceMetrics(selectedModel.id, {
        responseTime,
        taskType: criteria.taskType,
        success: true,
        userId: context.userId
      });

      // Track detailed usage for cost optimization
      if (context.userId && response.tokenUsage) {
        await CostOptimizationService.trackUsage({
          userId: context.userId,
          sessionId: context.sessionId,
          modelId: selectedModel.id,
          provider: selectedModel.provider,
          taskType: criteria.taskType,
          inputTokens: response.tokenUsage.inputTokens || 0,
          outputTokens: response.tokenUsage.outputTokens || 0,
          responseTimeMs: responseTime,
          subscriptionTier: criteria.userTier,
          success: true,
          metadata: {
            complexity: criteria.complexity,
            urgency: criteria.urgency,
            culturalContext: criteria.culturalContext
          }
        });
      }

      return {
        ...response,
        modelUsed: selectedModel.name,
        responseTime,
        provider: selectedModel.provider
      };

    } catch (error) {
      console.error(`Error with ${selectedModel.name}:`, error);
      
      // Fallback to alternative model
      const fallbackModel = this.availableModels.find(m => 
        m.id !== selectedModel.id && 
        m.available && 
        m.capabilities.includes(criteria.taskType)
      );

      if (fallbackModel) {
        console.log(`Falling back to ${fallbackModel.name}`);
        return this.callFallbackModel(fallbackModel, message, context);
      }

      throw error;
    }
  }

  private static async callAnthropicModel(model: AIModelProvider, message: string, context: any) {
    const { data, error } = await supabase.functions.invoke('enhanced-api', {
      body: {
        provider: 'anthropic',
        model: model.id,
        message,
        context,
        systemPrompt: context.systemPrompt || 'You are a helpful AI therapist.'
      }
    });

    if (error) throw error;
    return data;
  }

  private static async callOpenAIModel(model: AIModelProvider, message: string, context: any) {
    const { data, error } = await supabase.functions.invoke('enhanced-api', {
      body: {
        provider: 'openai',
        model: model.id,
        message,
        context,
        systemPrompt: context.systemPrompt || 'You are a helpful AI therapist.'
      }
    });

    if (error) throw error;
    return data;
  }

  private static async callFallbackModel(model: AIModelProvider, message: string, context: any) {
    try {
      if (model.provider === 'anthropic') {
        return await this.callAnthropicModel(model, message, context);
      } else {
        return await this.callOpenAIModel(model, message, context);
      }
    } catch (error) {
      // Ultimate fallback response
      return {
        message: "I'm experiencing some technical difficulties. Please try again in a moment.",
        confidence: 0.5,
        technique: 'Technical Fallback',
        emotion: 'neutral'
      };
    }
  }

  private static async logModelSelection(modelId: string, criteria: ModelSelectionCriteria, userId: string) {
    try {
      // Log to existing therapy_sessions table for now
      console.log('Model selection:', { modelId, criteria, userId });
    } catch (error) {
      console.error('Error logging model selection:', error);
    }
  }

  private static async recordPerformanceMetrics(modelId: string, metrics: any) {
    try {
      // Use existing ai_performance_stats table with correct schema
      await supabase.from('ai_performance_stats').insert({
        model_id: modelId,
        response_time: metrics.responseTime,
        token_usage: 0,
        cost: 0,
        user_rating: metrics.success ? 5 : 1
      });
    } catch (error) {
      console.error('Error recording performance metrics:', error);
    }
  }

  // Get model performance analytics
  static async getModelAnalytics(timeRange: { from: Date; to: Date }) {
    try {
      const { data, error } = await supabase
        .from('ai_performance_stats')
        .select('*')
        .gte('timestamp', timeRange.from.toISOString())
        .lte('timestamp', timeRange.to.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Process analytics data
      const modelStats = data.reduce((acc: any, stat: any) => {
        if (!acc[stat.model_id]) {
          acc[stat.model_id] = {
            totalRequests: 0,
            avgResponseTime: 0,
            successRate: 0,
            taskBreakdown: {}
          };
        }

        acc[stat.model_id].totalRequests++;
        acc[stat.model_id].avgResponseTime += stat.response_time;
        
        if (stat.success) {
          acc[stat.model_id].successRate++;
        }

        if (!acc[stat.model_id].taskBreakdown[stat.task_type]) {
          acc[stat.model_id].taskBreakdown[stat.task_type] = 0;
        }
        acc[stat.model_id].taskBreakdown[stat.task_type]++;

        return acc;
      }, {});

      // Calculate averages
      Object.keys(modelStats).forEach(modelId => {
        const stats = modelStats[modelId];
        stats.avgResponseTime = stats.avgResponseTime / stats.totalRequests;
        stats.successRate = (stats.successRate / stats.totalRequests) * 100;
      });

      return modelStats;
    } catch (error) {
      console.error('Error fetching model analytics:', error);
      return {};
    }
  }
}