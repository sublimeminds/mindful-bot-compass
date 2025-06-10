
import { supabase } from '@/integrations/supabase/client';

export interface SessionDetails {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  moodBefore?: number;
  moodAfter?: number;
  summary?: string;
  insights?: string[];
  techniques?: string[];
  duration?: number;
}

export interface DetailedSession extends SessionDetails {
  messages?: SessionMessage[];
  insights?: SessionInsight[];
  analytics?: SessionAnalytics;
}

export interface SessionMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  emotion?: string;
}

export interface SessionInsight {
  id: string;
  title: string;
  description: string;
  insightType: string;
  priority: 'low' | 'medium' | 'high';
  actionableSuggestion?: string;
  confidenceScore?: number;
}

export interface SessionAnalytics {
  effectivenessScore: number;
  sessionRating?: number;
  keyBreakthrough?: string;
  techniquesEffectiveness: Record<string, number>;
}

export class SessionService {
  static async getSessionDetails(sessionId: string): Promise<DetailedSession | null> {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages(*),
          session_insights(*),
          session_analytics(*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching session details:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        moodBefore: data.mood_before,
        moodAfter: data.mood_after,
        summary: data.notes || '',
        insights: data.notes ? [data.notes] : [],
        techniques: data.techniques || [],
        messages: data.session_messages?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          emotion: msg.emotion
        })) || [],
        insights: data.session_insights?.map((insight: any) => ({
          id: insight.id,
          title: insight.title,
          description: insight.description,
          insightType: insight.insight_type,
          priority: insight.priority,
          actionableSuggestion: insight.actionable_suggestion,
          confidenceScore: insight.confidence_score
        })) || [],
        analytics: data.session_analytics?.[0] ? {
          effectivenessScore: data.session_analytics[0].effectiveness_score,
          sessionRating: data.session_analytics[0].session_rating,
          keyBreakthrough: data.session_analytics[0].key_breakthrough,
          techniquesEffectiveness: data.session_analytics[0].techniques_effectiveness || {}
        } : undefined
      };
    } catch (error) {
      console.error('Error in getSessionDetails:', error);
      return null;
    }
  }
}
