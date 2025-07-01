import { supabase } from '@/integrations/supabase/client';

interface UserPattern {
  type: 'mood_cycle' | 'session_timing' | 'technique_preference' | 'stress_trigger';
  pattern: any;
  confidence: number;
  lastUpdated: string;
}

interface ConversationMemory {
  userId: string;
  sessionId?: string;
  emotionalContext: {
    dominantEmotion: string;
    intensity: number;
    triggers: string[];
    copingStrategies: string[];
  };
  conversationFlow: {
    topics: string[];
    breakthroughs: string[];
    resistance: string[];
    engagement: number;
  };
  learnings: {
    effectiveTechniques: string[];
    ineffectiveTechniques: string[];
    preferredApproaches: string[];
    communicationStyle: string;
  };
  timestamp: string;
}

interface ContextualRecommendation {
  id: string;
  type: 'technique' | 'content' | 'timing' | 'intervention';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  context: {
    timeOfDay?: string;
    moodState?: string;
    recentActivity?: string;
    environmentalFactors?: string[];
  };
  estimatedImpact: number;
  validUntil: string;
  metadata: any;
}

export class EnhancedPersonalizationService {
  // Enhanced AI Memory & Learning System
  static async storeConversationMemory(memory: ConversationMemory): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversation_memories')
        .upsert({
          user_id: memory.userId,
          session_id: memory.sessionId,
          emotional_context: memory.emotionalContext,
          conversation_flow: memory.conversationFlow,
          learnings: memory.learnings,
          timestamp: memory.timestamp
        });

      return !error;
    } catch (error) {
      console.error('Error storing conversation memory:', error);
      return false;
    }
  }

  static async getConversationMemories(userId: string, limit: number = 10): Promise<ConversationMemory[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_memories')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        userId: item.user_id,
        sessionId: item.session_id,
        emotionalContext: item.emotional_context as any || {
          dominantEmotion: 'neutral',
          intensity: 5,
          triggers: [],
          copingStrategies: []
        },
        conversationFlow: item.conversation_flow as any || {
          topics: [],
          breakthroughs: [],
          resistance: [],
          engagement: 5
        },
        learnings: item.learnings as any || {
          effectiveTechniques: [],
          ineffectiveTechniques: [],
          preferredApproaches: [],
          communicationStyle: 'supportive'
        },
        timestamp: item.timestamp
      }));
    } catch (error) {
      console.error('Error fetching conversation memories:', error);
      return [];
    }
  }

  // Dynamic User Pattern Recognition
  static async analyzeUserPatterns(userId: string): Promise<UserPattern[]> {
    try {
      // Fetch user data for pattern analysis
      const [moodData, sessionData, conversationMemories] = await Promise.all([
        this.getUserMoodData(userId),
        this.getUserSessionData(userId),
        this.getConversationMemories(userId, 50)
      ]);

      const patterns: UserPattern[] = [];

      // Analyze mood cycles
      const moodPattern = this.analyzeMoodCycles(moodData);
      if (moodPattern.confidence > 0.6) {
        patterns.push({
          type: 'mood_cycle',
          pattern: moodPattern,
          confidence: moodPattern.confidence,
          lastUpdated: new Date().toISOString()
        });
      }

      // Analyze session timing preferences
      const timingPattern = this.analyzeSessionTiming(sessionData);
      if (timingPattern.confidence > 0.6) {
        patterns.push({
          type: 'session_timing',
          pattern: timingPattern,
          confidence: timingPattern.confidence,
          lastUpdated: new Date().toISOString()
        });
      }

      // Analyze technique preferences from conversation memories
      const techniquePattern = this.analyzeTechniqueEffectiveness(conversationMemories);
      if (techniquePattern.confidence > 0.6) {
        patterns.push({
          type: 'technique_preference',
          pattern: techniquePattern,
          confidence: techniquePattern.confidence,
          lastUpdated: new Date().toISOString()
        });
      }

      return patterns;
    } catch (error) {
      console.error('Error analyzing user patterns:', error);
      return [];
    }
  }

  // Advanced Contextual Recommendations
  static async generateContextualRecommendations(userId: string): Promise<ContextualRecommendation[]> {
    try {
      const [patterns, recentMood, currentTime] = await Promise.all([
        this.analyzeUserPatterns(userId),
        this.getRecentMoodData(userId),
        Promise.resolve(new Date())
      ]);

      const recommendations: ContextualRecommendation[] = [];
      const context = this.buildCurrentContext(currentTime, recentMood);

      // Generate technique recommendations based on patterns
      for (const pattern of patterns) {
        if (pattern.type === 'technique_preference' && pattern.confidence > 0.7) {
          const effectiveTechniques = pattern.pattern.mostEffective || [];
          for (const technique of effectiveTechniques.slice(0, 2)) {
            recommendations.push({
              id: `technique_${Date.now()}_${Math.random()}`,
              type: 'technique',
              title: `Try ${technique}`,
              description: `Based on your patterns, ${technique} tends to be very effective for you`,
              reasoning: `Historical data shows ${technique} improved your mood by an average of ${pattern.pattern.effectiveness[technique] || 'significant'} points`,
              confidence: pattern.confidence,
              priority: this.calculatePriority(context, pattern),
              context,
              estimatedImpact: pattern.pattern.effectiveness[technique] || 0.7,
              validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              metadata: { technique, patternType: pattern.type }
            });
          }
        }
      }

      // Generate timing-based recommendations
      const timingPattern = patterns.find(p => p.type === 'session_timing');
      if (timingPattern && this.isOptimalTime(currentTime, timingPattern.pattern)) {
        recommendations.push({
          id: `timing_${Date.now()}`,
          type: 'timing',
          title: 'Perfect Time for a Session',
          description: 'This is typically your most effective time for therapy sessions',
          reasoning: 'Your pattern shows sessions at this time tend to be more beneficial',
          confidence: timingPattern.confidence,
          priority: 'medium',
          context,
          estimatedImpact: 0.8,
          validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          metadata: { optimalTiming: true }
        });
      }

      // Generate mood-based interventions
      if (context.moodState && ['low', 'stressed', 'anxious'].includes(context.moodState)) {
        recommendations.push({
          id: `intervention_${Date.now()}`,
          type: 'intervention',
          title: 'Proactive Support',
          description: 'Your recent mood suggests you might benefit from some support',
          reasoning: 'Early intervention can prevent mood from declining further',
          confidence: 0.8,
          priority: 'high',
          context,
          estimatedImpact: 0.9,
          validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          metadata: { preventive: true, moodBased: true }
        });
      }

      return recommendations.sort((a, b) => b.confidence * b.estimatedImpact - a.confidence * a.estimatedImpact);
    } catch (error) {
      console.error('Error generating contextual recommendations:', error);
      return [];
    }
  }

  // Helper methods
  private static async getUserMoodData(userId: string) {
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);
    return data || [];
  }

  private static async getUserSessionData(userId: string) {
    const { data } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(20);
    return data || [];
  }

  private static async getRecentMoodData(userId: string) {
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!data || data.length === 0) return null;
    const avgMood = data.reduce((sum, entry) => sum + (entry.overall || 5), 0) / data.length;
    return avgMood < 4 ? 'low' : avgMood > 7 ? 'high' : 'moderate';
  }

  private static buildCurrentContext(currentTime: Date, moodState: string | null) {
    const hour = currentTime.getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17) timeOfDay = 'evening';

    return {
      timeOfDay,
      moodState,
      dayOfWeek: currentTime.toLocaleDateString('en-US', { weekday: 'long' }),
      environmentalFactors: []
    };
  }

  private static analyzeMoodCycles(moodData: any[]) {
    if (moodData.length < 7) return { confidence: 0 };
    
    // Simple pattern analysis - could be enhanced with more sophisticated algorithms
    const weeklyPattern = new Array(7).fill(0);
    const counts = new Array(7).fill(0);
    
    moodData.forEach(entry => {
      const dayOfWeek = new Date(entry.created_at).getDay();
      weeklyPattern[dayOfWeek] += entry.overall || 5;
      counts[dayOfWeek]++;
    });

    // Calculate averages
    const averages = weeklyPattern.map((sum, i) => counts[i] > 0 ? sum / counts[i] : 5);
    const variation = Math.max(...averages) - Math.min(...averages);
    
    return {
      weeklyPattern: averages,
      confidence: Math.min(variation / 3, 0.9), // Higher variation = higher confidence in pattern
      bestDays: averages.map((avg, i) => ({ day: i, average: avg }))
        .sort((a, b) => b.average - a.average)
        .slice(0, 2)
        .map(item => item.day)
    };
  }

  private static analyzeSessionTiming(sessionData: any[]) {
    if (sessionData.length < 5) return { confidence: 0 };
    
    const hourCounts = new Array(24).fill(0);
    sessionData.forEach(session => {
      const hour = new Date(session.start_time).getHours();
      hourCounts[hour]++;
    });

    const maxCount = Math.max(...hourCounts);
    const preferredHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      preferredHours: preferredHours.map(item => item.hour),
      confidence: maxCount / sessionData.length,
      pattern: hourCounts
    };
  }

  private static analyzeTechniqueEffectiveness(memories: ConversationMemory[]) {
    const techniqueEffectiveness: Record<string, number[]> = {};
    
    memories.forEach(memory => {
      memory.learnings.effectiveTechniques.forEach(technique => {
        if (!techniqueEffectiveness[technique]) techniqueEffectiveness[technique] = [];
        techniqueEffectiveness[technique].push(memory.conversationFlow.engagement);
      });
    });

    const effectiveness: Record<string, number> = {};
    let totalTechniques = 0;
    
    Object.entries(techniqueEffectiveness).forEach(([technique, scores]) => {
      if (scores.length > 0) {
        effectiveness[technique] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        totalTechniques++;
      }
    });

    const mostEffective = Object.entries(effectiveness)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([technique]) => technique);

    return {
      mostEffective,
      effectiveness,
      confidence: Math.min(totalTechniques / 3, 0.9)
    };
  }

  private static calculatePriority(context: any, pattern: UserPattern): 'urgent' | 'high' | 'medium' | 'low' {
    if (context.moodState === 'low' && pattern.confidence > 0.8) return 'urgent';
    if (pattern.confidence > 0.8) return 'high';
    if (pattern.confidence > 0.6) return 'medium';
    return 'low';
  }

  private static isOptimalTime(currentTime: Date, timingPattern: any): boolean {
    const currentHour = currentTime.getHours();
    return timingPattern.preferredHours?.includes(currentHour) || false;
  }

  // Technique Effectiveness Tracking
  static async trackTechniqueEffectiveness(
    userId: string,
    technique: string,
    effectiveness: number,
    context: any
  ): Promise<void> {
    try {
      await supabase
        .from('technique_effectiveness')
        .upsert({
          user_id: userId,
          technique,
          effectiveness_score: effectiveness,
          context,
          tracked_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking technique effectiveness:', error);
    }
  }

  // Predictive Intervention System
  static async predictMoodRisk(userId: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
    suggestedActions: string[];
  }> {
    try {
      const [moodData, patterns, recentActivity] = await Promise.all([
        this.getUserMoodData(userId),
        this.analyzeUserPatterns(userId),
        this.getRecentUserActivity(userId)
      ]);

      // Simple predictive logic - could be enhanced with ML models
      const recentMoods = moodData.slice(0, 5).map(entry => entry.overall || 5);
      const trendDirection = this.calculateMoodTrend(recentMoods);
      const avgRecentMood = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let confidence = 0.5;
      const suggestedActions: string[] = [];

      if (avgRecentMood < 4 && trendDirection < -0.5) {
        riskLevel = 'high';
        confidence = 0.8;
        suggestedActions.push('Schedule immediate check-in', 'Use proven coping techniques', 'Contact support network');
      } else if (avgRecentMood < 5 || trendDirection < -0.3) {
        riskLevel = 'medium';
        confidence = 0.7;
        suggestedActions.push('Practice mindfulness', 'Review recent stressors', 'Increase self-care activities');
      } else {
        suggestedActions.push('Continue current practices', 'Maintain routine');
      }

      return { riskLevel, confidence, suggestedActions };
    } catch (error) {
      console.error('Error predicting mood risk:', error);
      return { riskLevel: 'low', confidence: 0, suggestedActions: [] };
    }
  }

  private static async getRecentUserActivity(userId: string) {
    const { data } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    return data || [];
  }

  private static calculateMoodTrend(moods: number[]): number {
    if (moods.length < 2) return 0;
    
    let trend = 0;
    for (let i = 1; i < moods.length; i++) {
      trend += moods[i] - moods[i - 1];
    }
    return trend / (moods.length - 1);
  }
}