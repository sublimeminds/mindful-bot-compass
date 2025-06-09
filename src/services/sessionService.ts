
import { supabase } from '@/integrations/supabase/client';

export interface SessionInsight {
  id: string;
  sessionId: string;
  insightType: 'achievement' | 'suggestion' | 'concern' | 'milestone' | 'pattern';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionableSuggestion?: string;
  confidenceScore?: number;
  createdAt: Date;
}

export interface SessionAnalytics {
  id: string;
  sessionId: string;
  effectivenessScore: number;
  moodImprovement?: number;
  techniquesEffectiveness: Record<string, number>;
  keyBreakthrough?: string;
  sessionRating?: number;
  createdAt: Date;
}

export interface DetailedSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  moodBefore?: number;
  moodAfter?: number;
  techniques: string[];
  notes: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    emotion?: string;
  }>;
  insights: SessionInsight[];
  analytics?: SessionAnalytics;
}

export class SessionService {
  static async getSessionDetails(sessionId: string): Promise<DetailedSession | null> {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages (*),
          session_insights (*),
          session_analytics (*)
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('Error fetching session details:', sessionError);
        return null;
      }

      return {
        id: session.id,
        userId: session.user_id,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : undefined,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        techniques: session.techniques || [],
        notes: session.notes || '',
        messages: session.session_messages?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          emotion: msg.emotion
        })) || [],
        insights: session.session_insights?.map((insight: any) => ({
          id: insight.id,
          sessionId: insight.session_id,
          insightType: insight.insight_type,
          title: insight.title,
          description: insight.description,
          priority: insight.priority,
          actionableSuggestion: insight.actionable_suggestion,
          confidenceScore: insight.confidence_score,
          createdAt: new Date(insight.created_at)
        })) || [],
        analytics: session.session_analytics?.length > 0 ? {
          id: session.session_analytics[0].id,
          sessionId: session.session_analytics[0].session_id,
          effectivenessScore: session.session_analytics[0].effectiveness_score,
          moodImprovement: session.session_analytics[0].mood_improvement,
          techniquesEffectiveness: session.session_analytics[0].techniques_effectiveness || {},
          keyBreakthrough: session.session_analytics[0].key_breakthrough,
          sessionRating: session.session_analytics[0].session_rating,
          createdAt: new Date(session.session_analytics[0].created_at)
        } : undefined
      };
    } catch (error) {
      console.error('Error in getSessionDetails:', error);
      return null;
    }
  }

  static async createSessionInsight(
    sessionId: string,
    insight: Omit<SessionInsight, 'id' | 'sessionId' | 'createdAt'>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_insights')
        .insert({
          session_id: sessionId,
          insight_type: insight.insightType,
          title: insight.title,
          description: insight.description,
          priority: insight.priority,
          actionable_suggestion: insight.actionableSuggestion,
          confidence_score: insight.confidenceScore
        });

      if (error) {
        console.error('Error creating session insight:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createSessionInsight:', error);
      return false;
    }
  }

  static async createSessionAnalytics(
    sessionId: string,
    analytics: Omit<SessionAnalytics, 'id' | 'sessionId' | 'createdAt'>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_analytics')
        .insert({
          session_id: sessionId,
          effectiveness_score: analytics.effectivenessScore,
          mood_improvement: analytics.moodImprovement,
          techniques_effectiveness: analytics.techniquesEffectiveness,
          key_breakthrough: analytics.keyBreakthrough,
          session_rating: analytics.sessionRating
        });

      if (error) {
        console.error('Error creating session analytics:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createSessionAnalytics:', error);
      return false;
    }
  }

  static async getUserSessions(userId: string, limit = 10): Promise<DetailedSession[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages (*),
          session_insights (*),
          session_analytics (*)
        `)
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      return sessions?.map((session: any) => ({
        id: session.id,
        userId: session.user_id,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : undefined,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        techniques: session.techniques || [],
        notes: session.notes || '',
        messages: session.session_messages?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          emotion: msg.emotion
        })) || [],
        insights: session.session_insights?.map((insight: any) => ({
          id: insight.id,
          sessionId: insight.session_id,
          insightType: insight.insight_type,
          title: insight.title,
          description: insight.description,
          priority: insight.priority,
          actionableSuggestion: insight.actionable_suggestion,
          confidenceScore: insight.confidence_score,
          createdAt: new Date(insight.created_at)
        })) || [],
        analytics: session.session_analytics?.length > 0 ? {
          id: session.session_analytics[0].id,
          sessionId: session.session_analytics[0].session_id,
          effectivenessScore: session.session_analytics[0].effectiveness_score,
          moodImprovement: session.session_analytics[0].mood_improvement,
          techniquesEffectiveness: session.session_analytics[0].techniques_effectiveness || {},
          keyBreakthrough: session.session_analytics[0].key_breakthrough,
          sessionRating: session.session_analytics[0].session_rating,
          createdAt: new Date(session.session_analytics[0].created_at)
        } : undefined
      })) || [];
    } catch (error) {
      console.error('Error in getUserSessions:', error);
      return [];
    }
  }
}
