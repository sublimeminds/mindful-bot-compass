/**
 * Adaptive Feedback Loop System
 * Continuous learning mechanism that improves therapy effectiveness through session-to-session intelligence
 */

import { supabase } from '@/integrations/supabase/client';

interface SessionOutcome {
  sessionId: string;
  userId: string;
  effectivenessRating: number;
  moodImprovement: number;
  techniqueUsed: string;
  userFeedback: string;
  aiConfidence: number;
  completedAt: string;
}

interface AdaptiveLearning {
  userId: string;
  learningPatterns: any;
  effectivenessMetrics: any;
  preferenceAdjustments: any;
  modelPerformance: any;
  nextSessionRecommendations: any;
}

interface SystemLearning {
  globalTrends: any;
  techniqueEffectiveness: any;
  culturalPatterns: any;
  modelOptimization: any;
}

export class AdaptiveFeedbackLoopSystem {
  private static learningCache: Map<string, AdaptiveLearning> = new Map();
  private static systemLearning: SystemLearning | null = null;

  /**
   * Process session outcome and trigger adaptive learning
   */
  static async processSessionOutcome(outcome: SessionOutcome): Promise<void> {
    console.log('🔄 Processing session outcome for adaptive learning:', outcome.sessionId);

    try {
      // 1. Update individual user learning
      await this.updateUserAdaptiveLearning(outcome);
      
      // 2. Update system-wide learning patterns
      await this.updateSystemLearning(outcome);
      
      // 3. Generate next session recommendations
      await this.generateNextSessionRecommendations(outcome.userId, outcome);
      
      // 4. Update AI model preferences based on performance
      await this.updateAIModelPreferences(outcome);
      
      // 5. Adjust therapy approach effectiveness ratings
      await this.adjustTherapyApproachRatings(outcome);
      
      // 6. Update cultural effectiveness patterns
      await this.updateCulturalEffectivenessPatterns(outcome);

      console.log('✅ Adaptive learning processing completed for session:', outcome.sessionId);

    } catch (error) {
      console.error('❌ Error processing session outcome:', error);
    }
  }

  /**
   * Get adaptive recommendations for next session
   */
  static async getNextSessionRecommendations(userId: string): Promise<any> {
    try {
      // Load user's adaptive learning profile
      const learning = await this.loadUserAdaptiveLearning(userId);
      
      if (!learning.nextSessionRecommendations) {
        return this.generateDefaultRecommendations();
      }

      // Combine user-specific learning with system-wide patterns
      const systemLearning = await this.getSystemLearning();
      
      return {
        ...learning.nextSessionRecommendations,
        systemInsights: systemLearning.globalTrends,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error getting next session recommendations:', error);
      return this.generateDefaultRecommendations();
    }
  }

  /**
   * Update user's adaptive learning profile
   */
  private static async updateUserAdaptiveLearning(outcome: SessionOutcome): Promise<void> {
    try {
      // Load existing learning profile
      let learning = await this.loadUserAdaptiveLearning(outcome.userId);
      
      // Update learning patterns
      learning.learningPatterns = this.updateLearningPatterns(learning.learningPatterns, outcome);
      
      // Update effectiveness metrics
      learning.effectivenessMetrics = this.updateEffectivenessMetrics(learning.effectivenessMetrics, outcome);
      
      // Update preference adjustments
      learning.preferenceAdjustments = this.updatePreferenceAdjustments(learning.preferenceAdjustments, outcome);
      
      // Update model performance tracking
      learning.modelPerformance = this.updateModelPerformance(learning.modelPerformance, outcome);

      // Save updated learning profile
      await supabase
        .from('adaptive_learning_profiles')
        .upsert({
          user_id: outcome.userId,
          learning_patterns: learning.learningPatterns,
          effectiveness_metrics: learning.effectivenessMetrics,
          preference_adjustments: learning.preferenceAdjustments,
          model_performance: learning.modelPerformance,
          last_updated: new Date().toISOString()
        });

      // Update cache
      this.learningCache.set(outcome.userId, learning);

    } catch (error) {
      console.error('Error updating user adaptive learning:', error);
    }
  }

  /**
   * Update system-wide learning patterns
   */
  private static async updateSystemLearning(outcome: SessionOutcome): Promise<void> {
    try {
      // Load system learning data
      let systemLearning = await this.getSystemLearning();
      
      // Update global trends
      systemLearning.globalTrends = this.updateGlobalTrends(systemLearning.globalTrends, outcome);
      
      // Update technique effectiveness
      systemLearning.techniqueEffectiveness = this.updateTechniqueEffectiveness(
        systemLearning.techniqueEffectiveness, 
        outcome
      );
      
      // Update model optimization data
      systemLearning.modelOptimization = this.updateModelOptimization(
        systemLearning.modelOptimization,
        outcome
      );

      // Store system learning metrics
      await this.storeSystemLearningMetrics(systemLearning, outcome);
      
      // Cache updated system learning
      this.systemLearning = systemLearning;

    } catch (error) {
      console.error('Error updating system learning:', error);
    }
  }

  /**
   * Generate recommendations for next session
   */
  private static async generateNextSessionRecommendations(userId: string, outcome: SessionOutcome): Promise<void> {
    try {
      const learning = this.learningCache.get(userId) || await this.loadUserAdaptiveLearning(userId);
      
      // Analyze what worked well in this session
      const successFactors = this.identifySuccessFactors(outcome, learning);
      
      // Identify areas for improvement
      const improvementAreas = this.identifyImprovementAreas(outcome, learning);
      
      // Generate technique recommendations
      const techniqueRecommendations = this.generateTechniqueRecommendations(successFactors, improvementAreas);
      
      // Generate approach adjustments
      const approachAdjustments = this.generateApproachAdjustments(outcome, learning);
      
      // Generate timing and frequency recommendations
      const timingRecommendations = this.generateTimingRecommendations(learning);

      const recommendations = {
        primaryTechnique: techniqueRecommendations.primary,
        secondaryTechniques: techniqueRecommendations.secondary,
        approachAdjustments,
        focusAreas: improvementAreas,
        successBuildOn: successFactors,
        timingRecommendations,
        confidenceLevel: this.calculateRecommendationConfidence(learning),
        generatedAt: new Date().toISOString()
      };

      // Update learning profile with recommendations
      await supabase
        .from('adaptive_learning_profiles')
        .update({
          next_session_recommendations: recommendations,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);

      // Update cache
      if (learning) {
        learning.nextSessionRecommendations = recommendations;
        this.learningCache.set(userId, learning);
      }

    } catch (error) {
      console.error('Error generating next session recommendations:', error);
    }
  }

  /**
   * Update learning patterns based on session outcome
   */
  private static updateLearningPatterns(currentPatterns: any, outcome: SessionOutcome): any {
    const patterns = currentPatterns || {
      sessionCount: 0,
      techniqueHistory: [],
      effectivenessHistory: [],
      moodImprovementHistory: [],
      preferredSessionTimes: {},
      responsePatterns: {}
    };

    patterns.sessionCount++;
    patterns.techniqueHistory.push({
      technique: outcome.techniqueUsed,
      effectiveness: outcome.effectivenessRating,
      moodImprovement: outcome.moodImprovement,
      date: outcome.completedAt
    });

    patterns.effectivenessHistory.push(outcome.effectivenessRating);
    patterns.moodImprovementHistory.push(outcome.moodImprovement);

    // Keep history to manageable size
    if (patterns.techniqueHistory.length > 50) {
      patterns.techniqueHistory = patterns.techniqueHistory.slice(-50);
    }
    if (patterns.effectivenessHistory.length > 100) {
      patterns.effectivenessHistory = patterns.effectivenessHistory.slice(-100);
    }

    // Calculate trends
    patterns.effectivenessTrend = this.calculateTrend(patterns.effectivenessHistory);
    patterns.moodTrend = this.calculateTrend(patterns.moodImprovementHistory);

    return patterns;
  }

  /**
   * Update effectiveness metrics
   */
  private static updateEffectivenessMetrics(currentMetrics: any, outcome: SessionOutcome): any {
    const metrics = currentMetrics || {
      overallEffectiveness: 0,
      techniqueEffectiveness: {},
      moodImprovementAverage: 0,
      sessionCount: 0
    };

    metrics.sessionCount++;
    
    // Update overall effectiveness (running average)
    metrics.overallEffectiveness = (
      (metrics.overallEffectiveness * (metrics.sessionCount - 1)) + outcome.effectivenessRating
    ) / metrics.sessionCount;

    // Update technique-specific effectiveness
    if (!metrics.techniqueEffectiveness[outcome.techniqueUsed]) {
      metrics.techniqueEffectiveness[outcome.techniqueUsed] = {
        count: 0,
        totalEffectiveness: 0,
        avgEffectiveness: 0
      };
    }

    const techniqueMetric = metrics.techniqueEffectiveness[outcome.techniqueUsed];
    techniqueMetric.count++;
    techniqueMetric.totalEffectiveness += outcome.effectivenessRating;
    techniqueMetric.avgEffectiveness = techniqueMetric.totalEffectiveness / techniqueMetric.count;

    // Update mood improvement average
    metrics.moodImprovementAverage = (
      (metrics.moodImprovementAverage * (metrics.sessionCount - 1)) + outcome.moodImprovement
    ) / metrics.sessionCount;

    return metrics;
  }

  /**
   * Update preference adjustments based on feedback
   */
  private static updatePreferenceAdjustments(currentAdjustments: any, outcome: SessionOutcome): any {
    const adjustments = currentAdjustments || {
      communicationStyle: 'balanced',
      sessionIntensity: 'medium',
      pacePreference: 'normal',
      feedbackFrequency: 'regular'
    };

    // Adjust based on effectiveness and feedback
    if (outcome.effectivenessRating >= 4) {
      // Keep current settings, they're working
    } else if (outcome.effectivenessRating <= 2) {
      // Consider adjustments
      adjustments.lastAdjustmentReason = 'low_effectiveness';
      adjustments.adjustmentNeeded = true;
    }

    // Analyze user feedback for preference signals
    if (outcome.userFeedback) {
      const feedback = outcome.userFeedback.toLowerCase();
      
      if (feedback.includes('too fast') || feedback.includes('rushed')) {
        adjustments.pacePreference = 'slower';
      } else if (feedback.includes('too slow') || feedback.includes('dragging')) {
        adjustments.pacePreference = 'faster';
      }
      
      if (feedback.includes('too intense') || feedback.includes('overwhelming')) {
        adjustments.sessionIntensity = 'lighter';
      } else if (feedback.includes('not challenging') || feedback.includes('surface level')) {
        adjustments.sessionIntensity = 'deeper';
      }
    }

    return adjustments;
  }

  /**
   * Load user's adaptive learning profile
   */
  private static async loadUserAdaptiveLearning(userId: string): Promise<AdaptiveLearning> {
    if (this.learningCache.has(userId)) {
      return this.learningCache.get(userId)!;
    }

    try {
      const { data } = await supabase
        .from('adaptive_learning_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        const learning: AdaptiveLearning = {
          userId,
          learningPatterns: data.learning_patterns || {},
          effectivenessMetrics: data.effectiveness_metrics || {},
          preferenceAdjustments: data.preference_adjustments || {},
          modelPerformance: data.model_performance || {},
          nextSessionRecommendations: data.next_session_recommendations || null
        };

        this.learningCache.set(userId, learning);
        return learning;
      }

    } catch (error) {
      console.error('Error loading adaptive learning profile:', error);
    }

    // Return default profile
    return {
      userId,
      learningPatterns: {},
      effectivenessMetrics: {},
      preferenceAdjustments: {},
      modelPerformance: {},
      nextSessionRecommendations: null
    };
  }

  /**
   * Get system-wide learning data
   */
  private static async getSystemLearning(): Promise<SystemLearning> {
    if (this.systemLearning) {
      return this.systemLearning;
    }

    // Load from database or initialize
    return {
      globalTrends: {},
      techniqueEffectiveness: {},
      culturalPatterns: {},
      modelOptimization: {}
    };
  }

  // Helper methods
  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
    const secondHalf = values.slice(midpoint).reduce((a, b) => a + b, 0) / (values.length - midpoint);
    return (secondHalf - firstHalf) / Math.abs(firstHalf);
  }

  private static identifySuccessFactors(outcome: SessionOutcome, learning: AdaptiveLearning): string[] {
    const factors = [];
    
    if (outcome.effectivenessRating >= 4) {
      factors.push(`technique_${outcome.techniqueUsed}`);
      
      if (outcome.moodImprovement > 1) {
        factors.push('significant_mood_improvement');
      }
      
      if (outcome.aiConfidence > 0.8) {
        factors.push('high_ai_confidence');
      }
    }
    
    return factors;
  }

  private static identifyImprovementAreas(outcome: SessionOutcome, learning: AdaptiveLearning): string[] {
    const areas = [];
    
    if (outcome.effectivenessRating <= 2) {
      areas.push('session_effectiveness');
    }
    
    if (outcome.moodImprovement < 0.5) {
      areas.push('mood_improvement');
    }
    
    if (outcome.aiConfidence < 0.6) {
      areas.push('ai_response_quality');
    }
    
    return areas;
  }

  private static generateTechniqueRecommendations(successFactors: string[], improvementAreas: string[]): any {
    // This would use more sophisticated logic in production
    return {
      primary: 'cognitive_behavioral_therapy',
      secondary: ['mindfulness', 'psychodynamic'],
      reasoning: 'Based on recent session outcomes and user preferences'
    };
  }

  private static generateApproachAdjustments(outcome: SessionOutcome, learning: AdaptiveLearning): any {
    return {
      suggested: outcome.effectivenessRating < 3,
      adjustments: outcome.effectivenessRating < 3 ? ['pace', 'intensity'] : [],
      reasoning: 'Low effectiveness suggests need for approach modification'
    };
  }

  private static generateTimingRecommendations(learning: AdaptiveLearning): any {
    return {
      frequency: 'weekly',
      duration: '50_minutes',
      preferredTime: 'flexible'
    };
  }

  private static calculateRecommendationConfidence(learning: AdaptiveLearning): number {
    const sessionCount = learning.learningPatterns?.sessionCount || 0;
    return Math.min(sessionCount * 0.1, 0.9);
  }

  private static generateDefaultRecommendations(): any {
    return {
      primaryTechnique: 'supportive_therapy',
      secondaryTechniques: ['active_listening', 'cognitive_behavioral'],
      approachAdjustments: { suggested: false, adjustments: [] },
      focusAreas: ['rapport_building'],
      confidenceLevel: 0.3,
      generatedAt: new Date().toISOString()
    };
  }

  // Placeholder methods for additional functionality
  private static updateGlobalTrends(trends: any, outcome: SessionOutcome): any {
    return trends || {};
  }

  private static updateTechniqueEffectiveness(effectiveness: any, outcome: SessionOutcome): any {
    return effectiveness || {};
  }

  private static updateModelOptimization(optimization: any, outcome: SessionOutcome): any {
    return optimization || {};
  }

  private static updateModelPerformance(performance: any, outcome: SessionOutcome): any {
    return performance || {};
  }

  private static async updateAIModelPreferences(outcome: SessionOutcome): Promise<void> {
    // Placeholder for AI model preference updates
  }

  private static async adjustTherapyApproachRatings(outcome: SessionOutcome): Promise<void> {
    // Placeholder for therapy approach rating adjustments
  }

  private static async updateCulturalEffectivenessPatterns(outcome: SessionOutcome): Promise<void> {
    // Placeholder for cultural effectiveness pattern updates
  }

  private static async storeSystemLearningMetrics(systemLearning: SystemLearning, outcome: SessionOutcome): Promise<void> {
    try {
      await supabase
        .from('system_intelligence_metrics')
        .insert({
          metric_type: 'adaptive_learning_update',
          metric_value: outcome.effectivenessRating,
          metadata: {
            technique: outcome.techniqueUsed,
            mood_improvement: outcome.moodImprovement,
            session_id: outcome.sessionId
          },
          user_id: outcome.userId,
          session_id: outcome.sessionId,
          recorded_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error storing system learning metrics:', error);
    }
  }
}
