import { supabase } from '@/integrations/supabase/client';

export interface AdaptiveInsight {
  userId: string;
  sessionId: string;
  insights: string[];
  emotionalPatterns: Record<string, number>;
  therapeuticTechniques: string[];
  effectiveness: number;
  nextRecommendations: {
    focusAreas: string[];
    techniquesToEmphasize: string[];
    moodTargets: {
      before: number;
      after: number;
      trend: 'improving' | 'stable' | 'declining';
    };
  };
}

export interface TherapyPlanUpdate {
  primaryApproach: string;
  techniques: string[];
  goals: string[];
  adaptations: any;
  effectivenessScore: number;
}

export class AdaptiveTherapyService {
  /**
   * Update therapy plan based on session insights
   */
  static async updateTherapyPlanFromInsights(insight: AdaptiveInsight): Promise<void> {
    try {
      // Get current adaptive therapy plan
      const { data: currentPlan } = await supabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', insight.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const planUpdate: TherapyPlanUpdate = {
        primaryApproach: this.determinePrimaryApproach(insight.therapeuticTechniques, currentPlan),
        techniques: this.optimizeTechniques(insight.therapeuticTechniques, insight.effectiveness),
        goals: insight.nextRecommendations.focusAreas,
          adaptations: {
            lastSessionInsights: insight.insights,
            emotionalPatterns: insight.emotionalPatterns,
            sessionCount: ((currentPlan?.adaptations as any)?.session_count || 0) + 1,
            effectivenessHistory: [
              ...((currentPlan?.adaptations as any)?.effectiveness_history || []),
              insight.effectiveness
            ].slice(-10), // Keep last 10 sessions
            recommendedAdjustments: this.generateAdjustments(insight, currentPlan)
          },
        effectivenessScore: this.calculateUpdatedEffectiveness(
          currentPlan?.effectiveness_score || 5.0,
          insight.effectiveness
        )
      };

      if (currentPlan) {
        await supabase.from('adaptive_therapy_plans')
          .update({
            primary_approach: planUpdate.primaryApproach,
            techniques: planUpdate.techniques,
            goals: planUpdate.goals,
            adaptations: planUpdate.adaptations,
            effectiveness_score: planUpdate.effectivenessScore,
            next_session_recommendations: insight.nextRecommendations,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPlan.id);
      } else {
        await supabase.from('adaptive_therapy_plans').insert({
          user_id: insight.userId,
          primary_approach: planUpdate.primaryApproach,
          techniques: planUpdate.techniques,
          goals: planUpdate.goals,
          adaptations: planUpdate.adaptations,
          effectiveness_score: planUpdate.effectivenessScore,
          next_session_recommendations: insight.nextRecommendations
        });
      }

      // Update user's personalized recommendations
      await this.updatePersonalizedRecommendations(insight);

      console.log('Adaptive therapy plan updated successfully');
    } catch (error) {
      console.error('Error updating adaptive therapy plan:', error);
      throw error;
    }
  }

  /**
   * Determine the most effective primary therapy approach
   */
  private static determinePrimaryApproach(
    currentTechniques: string[],
    existingPlan: any
  ): string {
    if (!currentTechniques.length) return existingPlan?.primary_approach || 'CBT';

    // Count technique frequency and effectiveness
    const approachMap: Record<string, number> = {
      'CBT': 0,
      'DBT': 0,
      'Mindfulness': 0,
      'Trauma-Informed': 0,
      'Humanistic': 0
    };

    currentTechniques.forEach(technique => {
      if (technique.toLowerCase().includes('cognitive') || technique.toLowerCase().includes('cbt')) {
        approachMap.CBT++;
      } else if (technique.toLowerCase().includes('dialectical') || technique.toLowerCase().includes('dbt')) {
        approachMap.DBT++;
      } else if (technique.toLowerCase().includes('mindfulness') || technique.toLowerCase().includes('meditation')) {
        approachMap.Mindfulness++;
      } else if (technique.toLowerCase().includes('trauma') || technique.toLowerCase().includes('emdr')) {
        approachMap['Trauma-Informed']++;
      } else {
        approachMap.Humanistic++;
      }
    });

    // Return the approach with highest frequency
    return Object.entries(approachMap).reduce((a, b) => 
      approachMap[a[0]] > approachMap[b[0]] ? a : b
    )[0];
  }

  /**
   * Optimize therapeutic techniques based on effectiveness
   */
  private static optimizeTechniques(
    sessionTechniques: string[],
    effectiveness: number
  ): string[] {
    const optimizedTechniques = [...sessionTechniques];

    // If effectiveness is high (>7), keep current techniques and add complementary ones
    if (effectiveness > 7) {
      const complementaryTechniques = this.getComplementaryTechniques(sessionTechniques);
      optimizedTechniques.push(...complementaryTechniques.slice(0, 2));
    }
    // If effectiveness is low (<5), suggest alternative techniques
    else if (effectiveness < 5) {
      const alternativeTechniques = this.getAlternativeTechniques(sessionTechniques);
      optimizedTechniques.splice(0, 1, ...alternativeTechniques.slice(0, 2));
    }

    return [...new Set(optimizedTechniques)]; // Remove duplicates
  }

  /**
   * Get complementary techniques for effective approaches
   */
  private static getComplementaryTechniques(currentTechniques: string[]): string[] {
    const complementaryMap: Record<string, string[]> = {
      'Cognitive Restructuring': ['Mindfulness Meditation', 'Progressive Muscle Relaxation'],
      'Behavioral Activation': ['Goal Setting', 'Activity Scheduling'],
      'Mindfulness': ['Body Scan', 'Breathing Exercises'],
      'Exposure Therapy': ['Systematic Desensitization', 'Cognitive Restructuring'],
      'DBT Skills': ['Emotion Regulation', 'Distress Tolerance']
    };

    const complementary: string[] = [];
    currentTechniques.forEach(technique => {
      const related = complementaryMap[technique] || [];
      complementary.push(...related);
    });

    return complementary;
  }

  /**
   * Get alternative techniques for ineffective approaches
   */
  private static getAlternativeTechniques(currentTechniques: string[]): string[] {
    const alternativeMap: Record<string, string[]> = {
      'Cognitive Restructuring': ['Acceptance and Commitment Therapy', 'Narrative Therapy'],
      'Behavioral Activation': ['Person-Centered Therapy', 'Mindfulness-Based Therapy'],
      'Exposure Therapy': ['EMDR', 'Somatic Experiencing'],
      'Traditional Talk Therapy': ['Art Therapy', 'Movement Therapy']
    };

    const alternatives: string[] = [];
    currentTechniques.forEach(technique => {
      const alts = alternativeMap[technique] || ['Integrative Approach', 'Solution-Focused Therapy'];
      alternatives.push(...alts);
    });

    return alternatives;
  }

  /**
   * Generate specific adjustments based on insights
   */
  private static generateAdjustments(insight: AdaptiveInsight, currentPlan: any): string[] {
    const adjustments: string[] = [];

    // Analyze emotional patterns
    const dominantEmotion = Object.entries(insight.emotionalPatterns)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    if (dominantEmotion === 'anxiety' && insight.emotionalPatterns.anxiety > 7) {
      adjustments.push('Increase anxiety-specific interventions');
      adjustments.push('Add grounding techniques');
    }

    if (dominantEmotion === 'depression' && insight.emotionalPatterns.sadness > 6) {
      adjustments.push('Focus on behavioral activation');
      adjustments.push('Incorporate mood tracking');
    }

      // Analyze effectiveness trends
      const effectivenessHistory = ((currentPlan?.adaptations as any)?.effectiveness_history || []) as number[];
    if (effectivenessHistory.length >= 3) {
      const recentTrend = effectivenessHistory.slice(-3);
      const isDecreasing = recentTrend.every((val, i) => i === 0 || val < recentTrend[i - 1]);
      
      if (isDecreasing) {
        adjustments.push('Consider switching primary therapeutic approach');
        adjustments.push('Increase session frequency');
      }
    }

    // Session content analysis
    if (insight.insights.some(i => i.toLowerCase().includes('resistance'))) {
      adjustments.push('Address therapeutic resistance');
      adjustments.push('Explore motivation and readiness for change');
    }

    if (insight.insights.some(i => i.toLowerCase().includes('breakthrough'))) {
      adjustments.push('Build on breakthrough insights');
      adjustments.push('Increase homework assignments');
    }

    return adjustments;
  }

  /**
   * Calculate updated effectiveness score using weighted average
   */
  private static calculateUpdatedEffectiveness(
    currentScore: number,
    sessionEffectiveness: number
  ): number {
    // Weight: 70% current session, 30% historical average
    return (sessionEffectiveness * 0.7) + (currentScore * 0.3);
  }

  /**
   * Update personalized recommendations based on insights
   */
  private static async updatePersonalizedRecommendations(insight: AdaptiveInsight): Promise<void> {
    try {
      const recommendations = [
        {
          user_id: insight.userId,
          recommendation_type: 'technique_optimization',
          title: 'Optimized Therapy Approach',
          description: `Based on your recent session, we recommend focusing on ${insight.therapeuticTechniques[0] || 'mindfulness techniques'}.`,
          reasoning: `Your session showed ${insight.effectiveness > 7 ? 'strong' : 'moderate'} engagement with this approach.`,
          priority_score: insight.effectiveness / 10,
          estimated_impact: Math.min(0.9, insight.effectiveness / 10 + 0.1),
          is_active: true
        },
        {
          user_id: insight.userId,
          recommendation_type: 'emotional_regulation',
          title: 'Emotional Pattern Insight',
          description: `We've identified patterns in your emotional responses that suggest focusing on ${Object.keys(insight.emotionalPatterns)[0] || 'emotional awareness'}.`,
          reasoning: 'Pattern analysis from your recent sessions indicates this area needs attention.',
          priority_score: Math.max(...Object.values(insight.emotionalPatterns)) / 10,
          estimated_impact: 0.8,
          is_active: true
        }
      ];

      // Deactivate old recommendations of the same type
      await supabase.from('personalized_recommendations')
        .update({ is_active: false })
        .eq('user_id', insight.userId)
        .in('recommendation_type', ['technique_optimization', 'emotional_regulation']);

      // Insert new recommendations
      await supabase.from('personalized_recommendations').insert(recommendations);

    } catch (error) {
      console.error('Error updating personalized recommendations:', error);
    }
  }

  /**
   * Get current adaptive therapy plan for a user
   */
  static async getCurrentTherapyPlan(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching current therapy plan:', error);
      return null;
    }
  }

  /**
   * Analyze therapy plan effectiveness over time
   */
  static async analyzeTherapyEffectiveness(
    userId: string,
    timeRange: { from: Date; to: Date }
  ): Promise<{
    overallTrend: 'improving' | 'stable' | 'declining';
    averageEffectiveness: number;
    topTechniques: string[];
    recommendations: string[];
  }> {
    try {
      const { data: sessions } = await supabase
        .from('session_summaries')
        .select('effectiveness_score, created_at, key_takeaways')
        .eq('user_id', userId)
        .gte('created_at', timeRange.from.toISOString())
        .lte('created_at', timeRange.to.toISOString())
        .order('created_at', { ascending: true });

      if (!sessions || sessions.length === 0) {
        return {
          overallTrend: 'stable',
          averageEffectiveness: 5.0,
          topTechniques: [],
          recommendations: ['Start regular therapy sessions to build effectiveness data']
        };
      }

      const scores = sessions.map(s => s.effectiveness_score);
      const averageEffectiveness = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Determine trend
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      let overallTrend: 'improving' | 'stable' | 'declining';
      if (secondAvg > firstAvg + 0.5) overallTrend = 'improving';
      else if (secondAvg < firstAvg - 0.5) overallTrend = 'declining';
      else overallTrend = 'stable';

      // Extract top techniques (simplified)
      const allTechniques: string[] = [];
      sessions.forEach(session => {
        if (session.key_takeaways && Array.isArray(session.key_takeaways)) {
          allTechniques.push(...(session.key_takeaways as string[]));
        }
      });

      const techniqueCount: Record<string, number> = {};
      allTechniques.forEach(technique => {
        techniqueCount[technique] = (techniqueCount[technique] || 0) + 1;
      });

      const topTechniques = Object.entries(techniqueCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([technique]) => technique);

      // Generate recommendations
      const recommendations: string[] = [];
      if (overallTrend === 'declining') {
        recommendations.push('Consider adjusting therapy approach');
        recommendations.push('Increase session frequency');
      } else if (overallTrend === 'improving') {
        recommendations.push('Continue with current approach');
        recommendations.push('Consider setting new therapy goals');
      } else {
        recommendations.push('Explore new therapeutic techniques');
        recommendations.push('Focus on consistency in sessions');
      }

      return {
        overallTrend,
        averageEffectiveness,
        topTechniques,
        recommendations
      };

    } catch (error) {
      console.error('Error analyzing therapy effectiveness:', error);
      return {
        overallTrend: 'stable',
        averageEffectiveness: 5.0,
        topTechniques: [],
        recommendations: ['Error analyzing effectiveness - please try again']
      };
    }
  }
}
