
import { supabase } from '@/integrations/supabase/client';

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: 'engagement' | 'achievement' | 'insight' | 'reminder';
  template: {
    title: string;
    message: string;
    variables: string[];
    conditions?: Record<string, any>;
  };
  personalization: {
    useUserName: boolean;
    useMoodData: boolean;
    useProgressData: boolean;
    useTimeContext: boolean;
    useWeatherData: boolean;
  };
  variants: NotificationVariant[];
  performance: {
    sent: number;
    viewed: number;
    clicked: number;
    avgRating: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationVariant {
  id: string;
  name: string;
  weight: number;
  template: {
    title: string;
    message: string;
  };
  performance: {
    sent: number;
    viewed: number;
    clicked: number;
    conversionRate: number;
  };
}

export interface TemplateContext {
  user: {
    name: string;
    timeZone: string;
    preferences: Record<string, any>;
  };
  mood?: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    recent: number[];
  };
  progress?: {
    streak: number;
    totalSessions: number;
    weeklyProgress: number;
    milestones: string[];
  };
  time: {
    hour: number;
    dayOfWeek: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    isWeekend: boolean;
  };
  weather?: {
    condition: string;
    temperature: number;
    mood_impact: 'positive' | 'negative' | 'neutral';
  };
  session?: {
    lastSession: Date;
    daysSinceLastSession: number;
    preferredTechniques: string[];
  };
}

export class AdvancedNotificationTemplateService {
  static async createTemplate(template: Omit<NotificationTemplate, 'id' | 'performance' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      // Store template data in notifications table as a workaround
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: `Template: ${template.name}`,
          message: template.description,
          type: 'notification_template',
          priority: 'low',
          data: {
            template_config: {
              name: template.name,
              description: template.description,
              type: template.type,
              category: template.category,
              template: template.template,
              personalization: template.personalization,
              variants: template.variants,
              is_active: template.isActive
            }
          } as any,
          user_id: '00000000-0000-0000-0000-000000000000' // System user
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }

  static async getTemplates(category?: string): Promise<NotificationTemplate[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('type', 'notification_template');

      const { data, error } = await query;
      if (error) throw error;

      return data?.map(this.mapToTemplate).filter(template => 
        !category || template.category === category
      ) || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  static async generatePersonalizedNotification(
    templateId: string,
    userId: string,
    context?: Partial<TemplateContext>
  ): Promise<{ title: string; message: string; variant?: string } | null> {
    try {
      // Get template
      const { data: template } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', templateId)
        .single();

      if (!template) return null;

      const templateConfig = (template.data as any)?.template_config;
      if (!templateConfig) return null;

      // Build context
      const fullContext = await this.buildContext(userId, context);

      // Select variant (A/B testing)
      const selectedVariant = this.selectVariant(templateConfig.variants || []);

      // Generate personalized content
      const personalizedContent = this.personalizeContent(
        selectedVariant?.template || templateConfig.template,
        fullContext,
        templateConfig.personalization
      );

      return {
        ...personalizedContent,
        variant: selectedVariant?.id
      };
    } catch (error) {
      console.error('Error generating personalized notification:', error);
      return null;
    }
  }

  static async generateAIContent(
    prompt: string,
    context: TemplateContext,
    constraints?: {
      maxTitleLength?: number;
      maxMessageLength?: number;
      tone?: 'encouraging' | 'informative' | 'celebratory' | 'gentle';
      includeEmoji?: boolean;
    }
  ): Promise<{ title: string; message: string } | null> {
    try {
      // Simplified AI content generation
      const tone = constraints?.tone || 'encouraging';
      const includeEmoji = constraints?.includeEmoji || false;
      
      // Basic template-based generation
      const templates = {
        encouraging: {
          title: `Keep going, ${context.user.name}! ${includeEmoji ? '💪' : ''}`,
          message: `You're making great progress! ${includeEmoji ? '🌟' : ''}`
        },
        informative: {
          title: `Progress Update for ${context.user.name}`,
          message: 'Here\'s your latest progress summary.'
        },
        celebratory: {
          title: `Congratulations, ${context.user.name}! ${includeEmoji ? '🎉' : ''}`,
          message: `Amazing achievement! ${includeEmoji ? '🎊' : ''}`
        },
        gentle: {
          title: `Gentle reminder for ${context.user.name}`,
          message: `Take care of yourself today. ${includeEmoji ? '🤗' : ''}`
        }
      };

      return templates[tone];
    } catch (error) {
      console.error('Error generating AI content:', error);
      return null;
    }
  }

  static async trackTemplatePerformance(
    templateId: string,
    variantId: string | undefined,
    event: 'sent' | 'viewed' | 'clicked',
    userId: string
  ): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          title: 'Template Performance',
          message: `Event: ${event}`,
          type: 'template_performance',
          user_id: userId,
          data: {
            template_id: templateId,
            variant_id: variantId,
            event,
            timestamp: new Date().toISOString()
          } as any
        });
    } catch (error) {
      console.error('Error tracking template performance:', error);
    }
  }

  static async getTemplateAnalytics(templateId: string): Promise<{
    overall: { sent: number; viewed: number; clicked: number; conversionRate: number };
    byVariant: Record<string, { sent: number; viewed: number; clicked: number; conversionRate: number }>;
    byTimeOfDay: Record<string, number>;
    byUserSegment: Record<string, number>;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'template_performance')
        .like('data->>template_id', templateId);

      if (error) throw error;

      const analytics = this.calculateTemplateAnalytics(data || []);
      return analytics;
    } catch (error) {
      console.error('Error fetching template analytics:', error);
      return null;
    }
  }

  static async optimizeTemplate(templateId: string): Promise<{
    recommendations: string[];
    bestVariant?: string;
    suggestedChanges: Record<string, any>;
  } | null> {
    try {
      const analytics = await this.getTemplateAnalytics(templateId);
      if (!analytics) return null;

      const recommendations: string[] = [];
      const suggestedChanges: Record<string, any> = {};

      // Analyze performance
      if (analytics.overall.conversionRate < 0.1) {
        recommendations.push('Consider revising the message to be more engaging');
        suggestedChanges.message = 'Make the call-to-action clearer';
      }

      const viewRate = analytics.overall.sent > 0 ? analytics.overall.viewed / analytics.overall.sent : 0;
      if (viewRate < 0.5) {
        recommendations.push('The title may not be compelling enough');
        suggestedChanges.title = 'Use more emotionally engaging language';
      }

      // Find best performing variant
      let bestVariant = '';
      let bestRate = 0;
      
      Object.entries(analytics.byVariant).forEach(([variantId, metrics]) => {
        if (metrics.conversionRate > bestRate) {
          bestRate = metrics.conversionRate;
          bestVariant = variantId;
        }
      });

      return {
        recommendations,
        bestVariant: bestVariant || undefined,
        suggestedChanges
      };
    } catch (error) {
      console.error('Error optimizing template:', error);
      return null;
    }
  }

  // Helper methods
  private static async buildContext(userId: string, partialContext?: Partial<TemplateContext>): Promise<TemplateContext> {
    try {
      // Get user data
      const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get mood data
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(7);

      // Get session data
      const { data: sessionData } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(10);

      const now = new Date();
      const hour = now.getHours();
      
      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
      else timeOfDay = 'night';

      const context: TemplateContext = {
        user: {
          name: user?.name || 'Friend',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferences: {}
        },
        mood: moodData && moodData.length > 0 ? {
          current: moodData[0].overall,
          trend: this.calculateMoodTrend(moodData),
          recent: moodData.slice(0, 7).map(m => m.overall)
        } : undefined,
        progress: sessionData ? {
          streak: this.calculateStreak(sessionData),
          totalSessions: sessionData.length,
          weeklyProgress: this.calculateWeeklyProgress(sessionData),
          milestones: this.calculateMilestones(sessionData)
        } : undefined,
        time: {
          hour,
          dayOfWeek: now.getDay(),
          timeOfDay,
          isWeekend: now.getDay() === 0 || now.getDay() === 6
        },
        session: sessionData && sessionData.length > 0 ? {
          lastSession: new Date(sessionData[0].start_time),
          daysSinceLastSession: Math.floor((now.getTime() - new Date(sessionData[0].start_time).getTime()) / (1000 * 60 * 60 * 24)),
          preferredTechniques: this.extractPreferredTechniques(sessionData)
        } : undefined,
        ...partialContext
      };

      return context;
    } catch (error) {
      console.error('Error building context:', error);
      return {
        user: { name: 'Friend', timeZone: 'UTC', preferences: {} },
        time: { hour: 9, dayOfWeek: 1, timeOfDay: 'morning', isWeekend: false }
      };
    }
  }

  private static selectVariant(variants: NotificationVariant[]): NotificationVariant | undefined {
    if (variants.length === 0) return undefined;
    
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const variant of variants) {
      currentWeight += variant.weight;
      if (random <= currentWeight) {
        return variant;
      }
    }
    
    return variants[0];
  }

  private static personalizeContent(
    template: { title: string; message: string; variables?: string[] },
    context: TemplateContext,
    personalization: NotificationTemplate['personalization']
  ): { title: string; message: string } {
    let { title, message } = template;

    // Replace variables
    if (personalization.useUserName) {
      title = title.replace(/\{userName\}/g, context.user.name);
      message = message.replace(/\{userName\}/g, context.user.name);
    }

    if (personalization.useTimeContext) {
      title = title.replace(/\{timeOfDay\}/g, context.time.timeOfDay);
      message = message.replace(/\{timeOfDay\}/g, context.time.timeOfDay);
    }

    if (personalization.useMoodData && context.mood) {
      const moodDescription = this.getMoodDescription(context.mood.current);
      title = title.replace(/\{moodDescription\}/g, moodDescription);
      message = message.replace(/\{moodDescription\}/g, moodDescription);
    }

    if (personalization.useProgressData && context.progress) {
      title = title.replace(/\{streak\}/g, context.progress.streak.toString());
      message = message.replace(/\{streak\}/g, context.progress.streak.toString());
      title = title.replace(/\{totalSessions\}/g, context.progress.totalSessions.toString());
      message = message.replace(/\{totalSessions\}/g, context.progress.totalSessions.toString());
    }

    return { title, message };
  }

  private static calculateMoodTrend(moodData: any[]): 'up' | 'down' | 'stable' {
    if (moodData.length < 2) return 'stable';
    
    const recent = moodData.slice(0, 3).map(m => m.overall);
    const older = moodData.slice(3, 6).map(m => m.overall);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.5) return 'up';
    if (diff < -0.5) return 'down';
    return 'stable';
  }

  private static calculateStreak(sessionData: any[]): number {
    if (sessionData.length === 0) return 0;
    
    const sessions = sessionData.map(s => new Date(s.start_time)).sort((a, b) => b.getTime() - a.getTime());
    let streak = 1;
    
    for (let i = 1; i < sessions.length; i++) {
      const daysDiff = Math.floor((sessions[i-1].getTime() - sessions[i].getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private static calculateWeeklyProgress(sessionData: any[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return sessionData.filter(s => new Date(s.start_time) >= oneWeekAgo).length;
  }

  private static calculateMilestones(sessionData: any[]): string[] {
    const milestones = [];
    const count = sessionData.length;
    
    if (count >= 5) milestones.push('First Steps');
    if (count >= 10) milestones.push('Getting Started');
    if (count >= 25) milestones.push('Making Progress');
    if (count >= 50) milestones.push('Committed');
    if (count >= 100) milestones.push('Dedicated');
    
    return milestones;
  }

  private static extractPreferredTechniques(sessionData: any[]): string[] {
    const techniques: Record<string, number> = {};
    
    sessionData.forEach(session => {
      (session.techniques || []).forEach((technique: string) => {
        techniques[technique] = (techniques[technique] || 0) + 1;
      });
    });
    
    return Object.entries(techniques)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([technique]) => technique);
  }

  private static getMoodDescription(mood: number): string {
    if (mood >= 8) return 'excellent';
    if (mood >= 6) return 'good';
    if (mood >= 4) return 'okay';
    if (mood >= 2) return 'low';
    return 'difficult';
  }

  private static mapToTemplate(data: any): NotificationTemplate {
    const templateConfig = (data.data as any)?.template_config;
    return {
      id: data.id,
      name: templateConfig?.name || 'Unnamed Template',
      description: templateConfig?.description || '',
      type: templateConfig?.type || 'notification',
      category: templateConfig?.category || 'engagement',
      template: templateConfig?.template || { title: '', message: '', variables: [] },
      personalization: templateConfig?.personalization || {
        useUserName: false,
        useMoodData: false,
        useProgressData: false,
        useTimeContext: false,
        useWeatherData: false
      },
      variants: templateConfig?.variants || [],
      performance: templateConfig?.performance || { sent: 0, viewed: 0, clicked: 0, avgRating: 0 },
      isActive: templateConfig?.is_active || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.created_at)
    };
  }

  private static calculateTemplateAnalytics(performanceData: any[]): any {
    // Calculate analytics from performance data
    const overall = performanceData.reduce((acc, item) => {
      const eventData = (item.data as any);
      if (eventData?.event === 'sent') acc.sent++;
      else if (eventData?.event === 'viewed') acc.viewed++;
      else if (eventData?.event === 'clicked') acc.clicked++;
      return acc;
    }, { sent: 0, viewed: 0, clicked: 0 });

    return {
      overall: {
        ...overall,
        conversionRate: overall.viewed > 0 ? overall.clicked / overall.viewed : 0
      },
      byVariant: {},
      byTimeOfDay: {},
      byUserSegment: {}
    };
  }
}
