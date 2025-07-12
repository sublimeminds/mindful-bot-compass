import { supabase } from '@/integrations/supabase/client';

export interface TherapyApproach {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  target_conditions: string[];
  system_prompt_addition: string;
  effectiveness_score: number;
  is_active: boolean;
}

export interface TherapyApproachCombination {
  id: string;
  primary_approach: TherapyApproach;
  secondary_approach: TherapyApproach;
  combination_name: string;
  effectiveness_score: number;
  target_conditions: string[];
  integration_strategy: string;
  session_structure: any;
  contraindications: string[];
}

export interface UserTherapyPreferences {
  id?: string;
  user_id: string;
  preferred_approaches: string[];
  approach_effectiveness: any;
  communication_style: string;
  session_preferences: any;
  crisis_protocols: any;
  cultural_adaptations: any;
}

export interface ApproachRecommendation {
  approach: TherapyApproach;
  confidence: number;
  reasoning: string;
  suitability_factors: string[];
}

class TherapyApproachService {
  // Get all available therapy approaches
  async getAvailableApproaches(): Promise<TherapyApproach[]> {
    try {
      const { data, error } = await supabase
        .from('therapeutic_approach_configs')
        .select('*')
        .eq('is_active', true)
        .order('effectiveness_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching therapy approaches:', error);
      return [];
    }
  }

  // Get approach combinations
  async getApproachCombinations(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('therapy_approach_combinations')
        .select(`
          *,
          primary_approach:primary_approach_id(*),
          secondary_approach:secondary_approach_id(*)
        `)
        .eq('is_active', true)
        .order('effectiveness_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching approach combinations:', error);
      return [];
    }
  }

  // Get user therapy preferences
  async getUserPreferences(userId: string): Promise<UserTherapyPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_therapy_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user therapy preferences:', error);
      return null;
    }
  }

  // Update user therapy preferences
  async updateUserPreferences(preferences: UserTherapyPreferences): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_therapy_preferences')
        .upsert(preferences);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user therapy preferences:', error);
      throw error;
    }
  }

  // Recommend therapy approaches based on user state and conditions
  async recommendApproaches(
    userId: string,
    currentConditions: string[],
    sessionContext?: {
      mood?: string;
      recentTopics?: string[];
      crisisIndicators?: any;
      previousApproaches?: string[];
    }
  ): Promise<{
    primary: ApproachRecommendation;
    secondary?: ApproachRecommendation;
    combination?: any;
  }> {
    try {
      // Get user preferences
      const userPreferences = await this.getUserPreferences(userId);
      
      // Get all approaches and combinations
      const [approaches, combinations] = await Promise.all([
        this.getAvailableApproaches(),
        this.getApproachCombinations()
      ]);

      // Score approaches based on multiple factors
      const scoredApproaches = approaches.map(approach => {
        let score = approach.effectiveness_score;

        // Factor in target conditions match
        const conditionMatch = currentConditions.some(condition => 
          approach.target_conditions.includes(condition)
        );
        if (conditionMatch) score += 0.2;

        // Factor in user preferences
        if (userPreferences?.preferred_approaches.includes(approach.name)) {
          score += 0.15;
        }

        // Factor in user-specific effectiveness if available
        if (userPreferences?.approach_effectiveness[approach.name]) {
          score = (score + userPreferences.approach_effectiveness[approach.name]) / 2;
        }

        // Factor in session context
        if (sessionContext) {
          if (sessionContext.crisisIndicators?.risk_level > 0.7) {
            // Prioritize crisis-appropriate approaches
            if (approach.target_conditions.includes('crisis') || 
                approach.target_conditions.includes('PTSD') ||
                approach.name.includes('DBT')) {
              score += 0.3;
            }
          }

          // Avoid recently used approaches for variety (unless highly effective)
          if (sessionContext.previousApproaches?.includes(approach.name) && score < 0.9) {
            score -= 0.1;
          }
        }

        return {
          approach,
          confidence: Math.min(score, 1.0),
          reasoning: this.generateRecommendationReasoning(approach, currentConditions, userPreferences, sessionContext),
          suitability_factors: this.calculateSuitabilityFactors(approach, currentConditions, sessionContext)
        };
      });

      // Sort by confidence score
      scoredApproaches.sort((a, b) => b.confidence - a.confidence);

      const primaryRecommendation = scoredApproaches[0];
      const secondaryRecommendation = scoredApproaches[1];

      // Check for optimal combinations
      const optimalCombination = combinations.find(combo => {
        const matchesConditions = currentConditions.some(condition => 
          combo.target_conditions.includes(condition)
        );
        const includesPrimary = combo.primary_approach.id === primaryRecommendation.approach.id ||
                              combo.secondary_approach.id === primaryRecommendation.approach.id;
        return matchesConditions && includesPrimary;
      });

      return {
        primary: primaryRecommendation,
        secondary: secondaryRecommendation,
        combination: optimalCombination
      };
    } catch (error) {
      console.error('Error recommending therapy approaches:', error);
      throw error;
    }
  }

  // Generate reasoning for recommendation
  private generateRecommendationReasoning(
    approach: TherapyApproach,
    conditions: string[],
    userPreferences?: UserTherapyPreferences | null,
    sessionContext?: any
  ): string {
    const reasons = [];

    // Effectiveness score
    if (approach.effectiveness_score >= 0.8) {
      reasons.push(`High effectiveness score (${(approach.effectiveness_score * 100).toFixed(0)}%)`);
    }

    // Condition matching
    const matchingConditions = conditions.filter(c => approach.target_conditions.includes(c));
    if (matchingConditions.length > 0) {
      reasons.push(`Specifically designed for ${matchingConditions.join(', ')}`);
    }

    // User preferences
    if (userPreferences?.preferred_approaches.includes(approach.name)) {
      reasons.push('Matches your preferred therapeutic style');
    }

    // Previous effectiveness
    if (userPreferences?.approach_effectiveness[approach.name] >= 0.7) {
      reasons.push('Has been effective for you in the past');
    }

    // Session context
    if (sessionContext?.crisisIndicators?.risk_level > 0.7 && 
        approach.target_conditions.includes('crisis')) {
      reasons.push('Appropriate for current crisis indicators');
    }

    return reasons.length > 0 ? reasons.join('; ') : 'General therapeutic compatibility';
  }

  // Calculate suitability factors
  private calculateSuitabilityFactors(
    approach: TherapyApproach,
    conditions: string[],
    sessionContext?: any
  ): string[] {
    const factors = [];

    // Evidence-based factors
    if (approach.effectiveness_score >= 0.85) {
      factors.push('High evidence base');
    }

    // Condition-specific factors
    const conditionMatches = conditions.filter(c => approach.target_conditions.includes(c));
    if (conditionMatches.length > 0) {
      factors.push(`Targets ${conditionMatches.join(', ')}`);
    }

    // Technique diversity
    if (approach.techniques.length >= 4) {
      factors.push('Diverse technique repertoire');
    }

    // Crisis appropriateness
    if (sessionContext?.crisisIndicators?.risk_level > 0.5) {
      if (approach.target_conditions.includes('crisis') || 
          approach.target_conditions.includes('trauma')) {
        factors.push('Crisis-appropriate');
      }
    }

    return factors;
  }

  // Track approach effectiveness for a user
  async trackApproachEffectiveness(
    userId: string,
    approachName: string,
    effectivenessScore: number,
    sessionId?: string
  ): Promise<void> {
    try {
      // Get current preferences
      let preferences = await this.getUserPreferences(userId);
      
      if (!preferences) {
        preferences = {
          user_id: userId,
          preferred_approaches: [],
          approach_effectiveness: {},
          communication_style: 'balanced',
          session_preferences: {},
          crisis_protocols: {},
          cultural_adaptations: {}
        };
      }

      // Update effectiveness score (weighted average if previous data exists)
      const currentScore = preferences.approach_effectiveness[approachName];
      if (currentScore) {
        preferences.approach_effectiveness[approachName] = 
          (currentScore * 0.7) + (effectivenessScore * 0.3); // Weight recent effectiveness higher
      } else {
        preferences.approach_effectiveness[approachName] = effectivenessScore;
      }

      // Add to preferred approaches if highly effective
      if (effectivenessScore >= 0.8 && !preferences.preferred_approaches.includes(approachName)) {
        preferences.preferred_approaches.push(approachName);
      }

      await this.updateUserPreferences(preferences);
    } catch (error) {
      console.error('Error tracking approach effectiveness:', error);
    }
  }

  // Get approach by name
  async getApproachByName(name: string): Promise<TherapyApproach | null> {
    try {
      const { data, error } = await supabase
        .from('therapeutic_approach_configs')
        .select('*')
        .eq('name', name)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching approach by name:', error);
      return null;
    }
  }

  // Get user's approach effectiveness history
  async getUserApproachHistory(userId: string): Promise<any> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) return null;

      const approaches = await this.getAvailableApproaches();
      
      return {
        preferred_approaches: preferences.preferred_approaches.map(name => 
          approaches.find(a => a.name === name)
        ).filter(Boolean),
        effectiveness_scores: preferences.approach_effectiveness,
        communication_style: preferences.communication_style
      };
    } catch (error) {
      console.error('Error getting user approach history:', error);
      return null;
    }
  }
}

export const therapyApproachService = new TherapyApproachService();