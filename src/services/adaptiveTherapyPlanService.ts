import { supabase } from '@/integrations/supabase/client';
import { SessionAnalyticsService } from './sessionAnalyticsService';
import { therapyApproachService } from './therapyApproachService';

export interface AdaptiveTherapyPlan {
  id: string;
  user_id: string;
  primary_approach: string;
  secondary_approach?: string;
  techniques: string[];
  goals: string[];
  effectiveness_score: number;
  adaptations: any; // JSON field
  next_session_recommendations: any; // JSON field
  created_at: string;
  updated_at: string;
}

export interface AdaptationHistory {
  timestamp: string;
  reason: string;
  changes: string[];
  effectiveness_before: number;
  effectiveness_after?: number;
  trigger_data: any;
}

export interface Recommendation {
  type: 'technique' | 'approach' | 'focus' | 'intervention';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  reasoning: string;
  confidence: number;
  expires_at?: string;
}

export interface UserProgressPattern {
  mood_trends: {
    average_change: number;
    volatility: number;
    trending_direction: 'improving' | 'stable' | 'declining';
  };
  engagement_patterns: {
    session_frequency: number;
    response_quality: number;
    breakthrough_frequency: number;
  };
  technique_effectiveness: Record<string, number>;
  crisis_indicators: {
    frequency: number;
    triggers: string[];
    protective_factors: string[];
  };
}

class AdaptiveTherapyPlanService {
  // Analyze user data and automatically adjust therapy plan
  async analyzeAndAdaptPlan(userId: string): Promise<AdaptiveTherapyPlan | null> {
    try {
      console.log(`Starting adaptive plan analysis for user ${userId}`);

      // Get current therapy plan
      const currentPlan = await this.getCurrentPlan(userId);
      
      // Analyze user progress patterns
      const progressPattern = await this.analyzeUserProgressPatterns(userId);
      
      // Get recent session analytics
      const recentAnalytics = await SessionAnalyticsService.getSessionAnalytics(userId, '14d');
      
      // Determine if adaptation is needed
      const adaptationNeeded = await this.shouldAdaptPlan(currentPlan, progressPattern, recentAnalytics);
      
      if (!adaptationNeeded && currentPlan) {
        console.log(`No adaptation needed for user ${userId}`);
        return currentPlan;
      }

      // Generate new therapy plan recommendations
      const recommendations = await this.generateAdaptationRecommendations(
        userId, 
        currentPlan, 
        progressPattern,
        recentAnalytics
      );

      // Apply adaptations
      const adaptedPlan = await this.applyAdaptations(userId, currentPlan, recommendations);
      
      console.log(`Therapy plan adapted for user ${userId}, new effectiveness score: ${adaptedPlan.effectiveness_score}`);
      
      return adaptedPlan;
    } catch (error) {
      console.error('Error in adaptive therapy plan analysis:', error);
      return null;
    }
  }

  // Get current therapy plan for user
  private async getCurrentPlan(userId: string): Promise<AdaptiveTherapyPlan | null> {
    try {
      const { data, error } = await supabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching current therapy plan:', error);
      return null;
    }
  }

  // Analyze user progress patterns
  private async analyzeUserProgressPatterns(userId: string): Promise<UserProgressPattern> {
    try {
      // Get mood entries for trend analysis
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      // Get session data for engagement analysis
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Get technique tracking data
      const { data: techniques } = await supabase
        .from('session_technique_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Analyze mood trends
      const moodTrends = this.analyzeMoodTrends(moodEntries || []);
      
      // Analyze engagement patterns
      const engagementPatterns = this.analyzeEngagementPatterns(sessions || []);
      
      // Analyze technique effectiveness
      const techniqueEffectiveness = this.analyzeTechniqueEffectiveness(techniques || []);
      
      // Analyze crisis indicators
      const crisisIndicators = await this.analyzeCrisisIndicators(userId);

      return {
        mood_trends: moodTrends,
        engagement_patterns: engagementPatterns,
        technique_effectiveness: techniqueEffectiveness,
        crisis_indicators: crisisIndicators
      };
    } catch (error) {
      console.error('Error analyzing user progress patterns:', error);
      throw error;
    }
  }

  // Analyze mood trends
  private analyzeMoodTrends(moodEntries: any[]): UserProgressPattern['mood_trends'] {
    if (moodEntries.length < 2) {
      return { average_change: 0, volatility: 0, trending_direction: 'stable' };
    }

    const moods = moodEntries.map(entry => entry.overall);
    const changes = [];
    
    for (let i = 1; i < moods.length; i++) {
      changes.push(moods[i] - moods[i - 1]);
    }

    const averageChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const volatility = Math.sqrt(changes.reduce((sum, change) => sum + Math.pow(change - averageChange, 2), 0) / changes.length);
    
    let trendingDirection: 'improving' | 'stable' | 'declining' = 'stable';
    if (averageChange > 0.3) trendingDirection = 'improving';
    else if (averageChange < -0.3) trendingDirection = 'declining';

    return {
      average_change: averageChange,
      volatility,
      trending_direction: trendingDirection
    };
  }

  // Analyze engagement patterns
  private analyzeEngagementPatterns(sessions: any[]): UserProgressPattern['engagement_patterns'] {
    if (sessions.length === 0) {
      return { session_frequency: 0, response_quality: 0, breakthrough_frequency: 0 };
    }

    const completedSessions = sessions.filter(s => s.end_time);
    const sessionFrequency = completedSessions.length / 4; // Sessions per week over 30 days

    // Calculate response quality based on session duration and engagement
    const responseQuality = completedSessions.reduce((sum, session) => {
      const duration = session.end_time ? 
        (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000 : 0;
      const qualityScore = Math.min(duration / 45, 1); // Normalize to 45 min sessions
      return sum + qualityScore;
    }, 0) / (completedSessions.length || 1);

    // Breakthrough frequency (sessions with significant mood improvement)
    const breakthroughSessions = completedSessions.filter(session => 
      session.mood_after && session.mood_before && (session.mood_after - session.mood_before) >= 2
    );
    const breakthroughFrequency = breakthroughSessions.length / (completedSessions.length || 1);

    return {
      session_frequency: sessionFrequency,
      response_quality: responseQuality,
      breakthrough_frequency: breakthroughFrequency
    };
  }

  // Analyze technique effectiveness
  private analyzeTechniqueEffectiveness(techniques: any[]): Record<string, number> {
    const effectivenessMap: Record<string, number[]> = {};

    techniques.forEach(technique => {
      if (!effectivenessMap[technique.technique_name]) {
        effectivenessMap[technique.technique_name] = [];
      }
      effectivenessMap[technique.technique_name].push(technique.user_response_score || 0);
    });

    const averagedEffectiveness: Record<string, number> = {};
    Object.keys(effectivenessMap).forEach(techniqueName => {
      const scores = effectivenessMap[techniqueName];
      averagedEffectiveness[techniqueName] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return averagedEffectiveness;
  }

  // Analyze crisis indicators
  private async analyzeCrisisIndicators(userId: string): Promise<UserProgressPattern['crisis_indicators']> {
    try {
      const { data: crisisAlerts } = await supabase
        .from('crisis_alerts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const frequency = (crisisAlerts?.length || 0) / 4; // Per week over 30 days
      
      const triggers = crisisAlerts?.flatMap(alert => {
        const triggerData = alert.trigger_data as any;
        return triggerData?.indicators || [];
      }).filter((value, index, self) => self.indexOf(value) === index) || [];

      return {
        frequency,
        triggers,
        protective_factors: [] // Would be extracted from user data
      };
    } catch (error) {
      console.error('Error analyzing crisis indicators:', error);
      return { frequency: 0, triggers: [], protective_factors: [] };
    }
  }

  // Determine if plan adaptation is needed
  private async shouldAdaptPlan(
    currentPlan: AdaptiveTherapyPlan | null,
    progressPattern: UserProgressPattern,
    recentAnalytics: any
  ): Promise<boolean> {
    // No current plan - always need adaptation
    if (!currentPlan) return true;

    // Plan is old (more than 2 weeks)
    const planAge = Date.now() - new Date(currentPlan.updated_at).getTime();
    if (planAge > 14 * 24 * 60 * 60 * 1000) return true;

    // Declining mood trends
    if (progressPattern.mood_trends.trending_direction === 'declining') return true;

    // Low effectiveness scores
    if (recentAnalytics.effectivenessScore < 70) return true;

    // High crisis indicator frequency
    if (progressPattern.crisis_indicators.frequency > 0.5) return true;

    // Low engagement
    if (progressPattern.engagement_patterns.response_quality < 0.5) return true;

    return false;
  }

  // Generate adaptation recommendations using AI
  private async generateAdaptationRecommendations(
    userId: string,
    currentPlan: AdaptiveTherapyPlan | null,
    progressPattern: UserProgressPattern,
    recentAnalytics: any
  ): Promise<Recommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('adaptive-therapy-planner', {
        body: {
          userId,
          currentPlan,
          progressPattern,
          recentAnalytics,
          generateRecommendations: true
        }
      });

      if (error) throw error;

      return data?.recommendations || [];
    } catch (error) {
      console.error('Error generating adaptation recommendations:', error);
      
      // Fallback recommendations based on patterns
      return this.generateFallbackRecommendations(progressPattern, recentAnalytics);
    }
  }

  // Generate fallback recommendations
  private generateFallbackRecommendations(
    progressPattern: UserProgressPattern,
    recentAnalytics: any
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Mood-based recommendations
    if (progressPattern.mood_trends.trending_direction === 'declining') {
      recommendations.push({
        type: 'approach',
        priority: 'high',
        description: 'Switch to Cognitive Behavioral Therapy (CBT) for mood stabilization',
        reasoning: 'Declining mood trends indicate need for more structured cognitive intervention',
        confidence: 0.8
      });
    }

    // Engagement-based recommendations
    if (progressPattern.engagement_patterns.response_quality < 0.5) {
      recommendations.push({
        type: 'technique',
        priority: 'medium',
        description: 'Introduce more interactive and varied therapeutic techniques',
        reasoning: 'Low engagement suggests need for more dynamic session structure',
        confidence: 0.7
      });
    }

    // Crisis-based recommendations
    if (progressPattern.crisis_indicators.frequency > 0.3) {
      recommendations.push({
        type: 'intervention',
        priority: 'urgent',
        description: 'Implement crisis prevention protocols and safety planning',
        reasoning: 'Elevated crisis frequency requires immediate intervention focus',
        confidence: 0.9
      });
    }

    return recommendations;
  }

  // Apply adaptations to create new therapy plan
  private async applyAdaptations(
    userId: string,
    currentPlan: AdaptiveTherapyPlan | null,
    recommendations: Recommendation[]
  ): Promise<AdaptiveTherapyPlan> {
    try {
      // Get optimal therapy approaches based on recommendations
      const approachRecommendations = await therapyApproachService.recommendApproaches(
        userId,
        recommendations.map(r => r.type),
        {
          crisisIndicators: { risk_level: recommendations.some(r => r.priority === 'urgent') ? 0.8 : 0.3 }
        }
      );

      const newPlan = {
        user_id: userId,
        primary_approach: approachRecommendations.primary.approach.name,
        secondary_approach: approachRecommendations.secondary?.approach.name,
        techniques: approachRecommendations.primary.approach.techniques,
        goals: this.extractGoalsFromRecommendations(recommendations),
        effectiveness_score: approachRecommendations.primary.confidence,
        adaptations: [
          ...currentPlan?.adaptations || [],
          {
            timestamp: new Date().toISOString(),
            reason: 'Automated adaptation based on progress analysis',
            changes: recommendations.map(r => r.description),
            effectiveness_before: currentPlan?.effectiveness_score || 0,
            trigger_data: { recommendations }
          }
        ] as any,
        next_session_recommendations: recommendations as any
      };

      // Save new plan
      const { data, error } = await supabase
        .from('adaptive_therapy_plans')
        .upsert(newPlan)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error applying adaptations:', error);
      throw error;
    }
  }

  // Extract goals from recommendations
  private extractGoalsFromRecommendations(recommendations: Recommendation[]): string[] {
    const goalMap: Record<string, string> = {
      'approach': 'Optimize therapeutic approach effectiveness',
      'technique': 'Improve session engagement and response',
      'focus': 'Address identified focus areas',
      'intervention': 'Implement crisis prevention strategies'
    };

    return recommendations.map(r => goalMap[r.type] || 'General therapeutic improvement');
  }

  // Prepare session with adaptive insights
  async prepareSessionWithAdaptiveInsights(userId: string, sessionId: string): Promise<any> {
    try {
      console.log(`Preparing adaptive session insights for user ${userId}, session ${sessionId}`);

      // Get current adaptive plan
      const currentPlan = await this.getCurrentPlan(userId);
      
      if (!currentPlan) {
        // Create initial plan if none exists
        await this.analyzeAndAdaptPlan(userId);
        return this.getCurrentPlan(userId);
      }

      // Check if plan needs updating before session
      const progressPattern = await this.analyzeUserProgressPatterns(userId);
      const recentAnalytics = await SessionAnalyticsService.getSessionAnalytics(userId, '7d');
      
      if (await this.shouldAdaptPlan(currentPlan, progressPattern, recentAnalytics)) {
        console.log(`Updating plan before session for user ${userId}`);
        return await this.analyzeAndAdaptPlan(userId);
      }

      return currentPlan;
    } catch (error) {
      console.error('Error preparing session with adaptive insights:', error);
      return null;
    }
  }

  // Get plan for user (public method)
  async getUserTherapyPlan(userId: string): Promise<AdaptiveTherapyPlan | null> {
    return await this.getCurrentPlan(userId);
  }

  // Update plan effectiveness after session
  async updatePlanEffectiveness(userId: string, sessionId: string, effectivenessScore: number): Promise<void> {
    try {
      const currentPlan = await this.getCurrentPlan(userId);
      if (!currentPlan) return;

      // Update the latest adaptation with effectiveness after score
      const updatedAdaptations = [...currentPlan.adaptations];
      if (updatedAdaptations.length > 0) {
        const latestAdaptation = updatedAdaptations[updatedAdaptations.length - 1];
        if (!latestAdaptation.effectiveness_after) {
          latestAdaptation.effectiveness_after = effectivenessScore;
        }
      }

      // Update plan with new effectiveness score and adaptations
      await supabase
        .from('adaptive_therapy_plans')
        .update({
          effectiveness_score: effectivenessScore,
          adaptations: updatedAdaptations as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentPlan.id);

      console.log(`Updated plan effectiveness for user ${userId}: ${effectivenessScore}`);
    } catch (error) {
      console.error('Error updating plan effectiveness:', error);
    }
  }
}

export const adaptiveTherapyPlanService = new AdaptiveTherapyPlanService();