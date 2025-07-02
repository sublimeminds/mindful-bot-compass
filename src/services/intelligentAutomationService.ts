import { supabase } from '@/integrations/supabase/client';

export interface AutomationRule {
  id: string;
  name: string;
  type: 'goal_suggestion' | 'session_optimization' | 'content_curation' | 'notification_timing';
  condition: string;
  action: string;
  isActive: boolean;
  priority: number;
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'goal' | 'technique' | 'content' | 'session_timing';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  potentialImpact: 'low' | 'medium' | 'high';
  data: Record<string, any>;
  createdAt: Date;
}

class IntelligentAutomationService {
  private automationRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Mood-Based Goal Adjustment',
      type: 'goal_suggestion',
      condition: 'avg_mood < 4 AND streak_broken = true',
      action: 'suggest_smaller_goals',
      isActive: true,
      priority: 1,
      executionCount: 15,
      successRate: 0.87
    },
    {
      id: '2',
      name: 'Optimal Session Timing',
      type: 'session_optimization',
      condition: 'engagement_score > 0.8',
      action: 'suggest_session_extension',
      isActive: true,
      priority: 2,
      executionCount: 23,
      successRate: 0.92
    },
    {
      id: '3',
      name: 'Content Personalization',
      type: 'content_curation',
      condition: 'anxiety_level > 7',
      action: 'prioritize_anxiety_content',
      isActive: true,
      priority: 1,
      executionCount: 31,
      successRate: 0.79
    }
  ];

  async generateSmartSuggestions(userId: string): Promise<SmartSuggestion[]> {
    try {
      // Get user's recent data
      const [userData, sessionData, goalData, moodData] = await Promise.all([
        this.getUserAnalytics(userId),
        this.getRecentSessions(userId),
        this.getUserGoals(userId),
        this.getRecentMoods(userId)
      ]);

      const suggestions: SmartSuggestion[] = [];

      // Generate goal suggestions based on patterns
      const goalSuggestions = await this.generateGoalSuggestions(userData, goalData, moodData);
      suggestions.push(...goalSuggestions);

      // Generate technique suggestions
      const techniqueSuggestions = await this.generateTechniqueSuggestions(sessionData, moodData);
      suggestions.push(...techniqueSuggestions);

      // Generate content suggestions
      const contentSuggestions = await this.generateContentSuggestions(userData, moodData);
      suggestions.push(...contentSuggestions);

      // Generate session timing suggestions
      const timingSuggestions = await this.generateTimingSuggestions(sessionData, userData);
      suggestions.push(...timingSuggestions);

      return suggestions.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('Error generating smart suggestions:', error);
      return [];
    }
  }

  private async getUserAnalytics(userId: string) {
    const { data } = await supabase
      .from('user_behavior_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(14); // Last 2 weeks

    return data || [];
  }

  private async getRecentSessions(userId: string) {
    const { data } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(10);

    return data || [];
  }

  private async getUserGoals(userId: string) {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data || [];
  }

  private async getRecentMoods(userId: string) {
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(14);

    return data || [];
  }

  private async generateGoalSuggestions(userData: any[], goalData: any[], moodData: any[]): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Analyze goal completion patterns
    const completedGoals = goalData.filter(g => g.is_completed);
    const activeGoals = goalData.filter(g => !g.is_completed);
    const avgMood = moodData.reduce((sum, mood) => sum + (mood.overall || 5), 0) / moodData.length;

    // Suggest easier goals if user is struggling
    if (avgMood < 4 && activeGoals.length > 0) {
      const strugglingGoal = activeGoals.find(g => g.progress < 0.3);
      if (strugglingGoal) {
        suggestions.push({
          id: `goal-${Date.now()}`,
          type: 'goal',
          title: 'Break Down Current Goal',
          description: `Consider breaking "${strugglingGoal.title}" into smaller, more manageable steps`,
          reasoning: 'Your current mood suggests smaller goals might be more achievable right now',
          confidence: 0.82,
          potentialImpact: 'high',
          data: { goalId: strugglingGoal.id, originalGoal: strugglingGoal.title },
          createdAt: new Date()
        });
      }
    }

    // Suggest new goals based on successful patterns
    if (completedGoals.length > 0 && avgMood > 6) {
      const successfulCategories = [...new Set(completedGoals.map(g => g.category))];
      const mostSuccessful = successfulCategories[0]; // Simplified for example

      suggestions.push({
        id: `goal-new-${Date.now()}`,
        type: 'goal',
        title: `New ${mostSuccessful} Goal`,
        description: `You've been successful with ${mostSuccessful} goals. Ready for a new challenge?`,
        reasoning: 'Building on your past successes in this area',
        confidence: 0.75,
        potentialImpact: 'medium',
        data: { category: mostSuccessful, difficulty: 'progressive' },
        createdAt: new Date()
      });
    }

    return suggestions;
  }

  private async generateTechniqueSuggestions(sessionData: any[], moodData: any[]): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Analyze which techniques work best for the user
    const avgMood = moodData.reduce((sum, mood) => sum + (mood.overall || 5), 0) / moodData.length;
    const recentSessions = sessionData.slice(0, 5);

    if (avgMood < 5) {
      // Suggest mood-boosting techniques
      suggestions.push({
        id: `technique-${Date.now()}`,
        type: 'technique',
        title: 'Try Gratitude Journaling',
        description: 'Research shows gratitude practices can improve mood by up to 25%',
        reasoning: 'Your recent mood patterns suggest this technique could be particularly helpful',
        confidence: 0.78,
        potentialImpact: 'high',
        data: { technique: 'gratitude_journaling', duration: '5-10 minutes' },
        createdAt: new Date()
      });
    }

    // Suggest new techniques if user seems to be plateauing
    const lastSessionMoodImprovement = recentSessions.reduce((sum, session) => {
      return sum + ((session.mood_after || 5) - (session.mood_before || 5));
    }, 0) / recentSessions.length;

    if (lastSessionMoodImprovement < 0.5) {
      suggestions.push({
        id: `technique-new-${Date.now()}`,
        type: 'technique',
        title: 'Explore Mindfulness Meditation',
        description: 'Your current techniques might benefit from adding mindfulness practices',
        reasoning: 'Diversifying your toolkit can help overcome current challenges',
        confidence: 0.71,
        potentialImpact: 'medium',
        data: { technique: 'mindfulness', sessionLength: '10-15 minutes' },
        createdAt: new Date()
      });
    }

    return suggestions;
  }

  private async generateContentSuggestions(userData: any[], moodData: any[]): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    const avgAnxiety = moodData.reduce((sum, mood) => sum + (mood.anxiety || 5), 0) / moodData.length;
    const avgEnergy = moodData.reduce((sum, mood) => sum + (mood.energy || 5), 0) / moodData.length;

    // Suggest anxiety-focused content if needed
    if (avgAnxiety > 6) {
      suggestions.push({
        id: `content-anxiety-${Date.now()}`,
        type: 'content',
        title: 'Anxiety Management Resources',
        description: 'Curated articles and exercises specifically for anxiety reduction',
        reasoning: 'Your recent anxiety levels suggest these resources could be valuable',
        confidence: 0.85,
        potentialImpact: 'high',
        data: { contentType: 'anxiety_resources', priority: 'high' },
        createdAt: new Date()
      });
    }

    // Suggest energy-boosting content if needed
    if (avgEnergy < 4) {
      suggestions.push({
        id: `content-energy-${Date.now()}`,
        type: 'content',
        title: 'Energy and Motivation Boosters',
        description: 'Quick exercises and tips to increase energy and motivation',
        reasoning: 'Your energy levels indicate these practices could help',
        confidence: 0.73,
        potentialImpact: 'medium',
        data: { contentType: 'energy_boosting', duration: 'short' },
        createdAt: new Date()
      });
    }

    return suggestions;
  }

  private async generateTimingSuggestions(sessionData: any[], userData: any[]): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Analyze session timing patterns
    const sessionTimes = sessionData.map(session => {
      const hour = new Date(session.start_time).getHours();
      const duration = session.end_time ? 
        (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60) : 30;
      return { hour, duration, moodImprovement: (session.mood_after || 5) - (session.mood_before || 5) };
    });

    // Find optimal time based on mood improvement
    const timeAnalysis = sessionTimes.reduce((acc, session) => {
      const timeSlot = session.hour < 12 ? 'morning' : session.hour < 17 ? 'afternoon' : 'evening';
      if (!acc[timeSlot]) acc[timeSlot] = { total: 0, count: 0, improvement: 0 };
      acc[timeSlot].count++;
      acc[timeSlot].improvement += session.moodImprovement;
      return acc;
    }, {} as Record<string, { total: number; count: number; improvement: number }>);

    const bestTime = Object.entries(timeAnalysis).reduce((best, [time, data]) => {
      const avgImprovement = data.improvement / data.count;
      return avgImprovement > best.improvement ? { time, improvement: avgImprovement } : best;
    }, { time: 'afternoon', improvement: 0 });

    if (bestTime.improvement > 0.5) {
      suggestions.push({
        id: `timing-${Date.now()}`,
        type: 'session_timing',
        title: `Optimize Session Timing`,
        description: `Your ${bestTime.time} sessions show the best results. Consider scheduling more sessions during this time.`,
        reasoning: `${bestTime.time} sessions show ${Math.round(bestTime.improvement * 10) / 10} point better mood improvement`,
        confidence: 0.68,
        potentialImpact: 'medium',
        data: { optimalTime: bestTime.time, improvementRate: bestTime.improvement },
        createdAt: new Date()
      });
    }

    return suggestions;
  }

  async executeAutomationRule(ruleId: string, userId: string): Promise<boolean> {
    const rule = this.automationRules.find(r => r.id === ruleId);
    if (!rule || !rule.isActive) return false;

    try {
      // Execute the automation based on the rule type
      switch (rule.type) {
        case 'goal_suggestion':
          await this.executeGoalAutomation(rule, userId);
          break;
        case 'session_optimization':
          await this.executeSessionOptimization(rule, userId);
          break;
        case 'content_curation':
          await this.executeContentCuration(rule, userId);
          break;
        case 'notification_timing':
          await this.executeNotificationOptimization(rule, userId);
          break;
      }

      // Update rule execution stats
      rule.executionCount++;
      rule.lastExecuted = new Date();

      return true;
    } catch (error) {
      console.error('Error executing automation rule:', error);
      return false;
    }
  }

  private async executeGoalAutomation(rule: AutomationRule, userId: string) {
    // Implementation for goal automation
    console.log(`Executing goal automation for user ${userId}`);
  }

  private async executeSessionOptimization(rule: AutomationRule, userId: string) {
    // Implementation for session optimization
    console.log(`Executing session optimization for user ${userId}`);
  }

  private async executeContentCuration(rule: AutomationRule, userId: string) {
    // Implementation for content curation
    console.log(`Executing content curation for user ${userId}`);
  }

  private async executeNotificationOptimization(rule: AutomationRule, userId: string) {
    // Implementation for notification optimization
    console.log(`Executing notification optimization for user ${userId}`);
  }

  getAutomationRules(): AutomationRule[] {
    return this.automationRules;
  }

  async toggleAutomationRule(ruleId: string, isActive: boolean): Promise<boolean> {
    const rule = this.automationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.isActive = isActive;
      return true;
    }
    return false;
  }
}

export const intelligentAutomationService = new IntelligentAutomationService();