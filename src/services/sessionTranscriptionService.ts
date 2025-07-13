import { supabase } from "@/integrations/supabase/client";

export interface TranscriptSegment {
  id: string;
  speaker: 'user' | 'therapist' | 'ai';
  content: string;
  timestamp: number;
  confidence: number;
  emotions?: string[];
}

export interface SessionTranscript {
  id: string;
  session_id: string;
  user_id: string;
  transcript_data: TranscriptSegment[];
  processing_status: string;
  confidence_scores: any;
  speaker_identification: any;
  created_at: string;
  updated_at: string;
}

export interface SessionSummary {
  id: string;
  session_id: string;
  user_id: string;
  executive_summary: string;
  key_takeaways: any;
  action_items: any;
  goals_addressed: any;
  mood_correlation: any;
  effectiveness_score: number;
  created_at: string;
  updated_at: string;
}

export interface SessionInsight {
  id: string;
  session_id: string;
  user_id: string;
  ai_analysis: any;
  emotional_tone_timeline: any;
  key_topics: any;
  breakthrough_indicators: any;
  therapy_techniques_used: any;
  progress_indicators: any;
  created_at: string;
  updated_at: string;
}

export interface KeyMoment {
  id: string;
  session_id: string;
  user_id: string;
  timestamp_start: number;
  timestamp_end: number;
  moment_type: string;
  importance_score: number;
  content_summary: string;
  emotional_context: any;
  tags: any;
  created_at: string;
}

export class SessionTranscriptionService {
  static async getTranscript(sessionId: string): Promise<SessionTranscript | null> {
    const { data, error } = await supabase
      .from('session_transcripts')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching transcript:', error);
      return null;
    }

    return data as unknown as SessionTranscript;
  }

  static async getSessionSummary(sessionId: string): Promise<SessionSummary | null> {
    const { data, error } = await supabase
      .from('session_summaries')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching session summary:', error);
      return null;
    }

    return data as SessionSummary;
  }

  static async getSessionInsights(sessionId: string): Promise<SessionInsight | null> {
    const { data, error } = await supabase
      .from('session_insights')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching session insights:', error);
      return null;
    }

    return data as unknown as SessionInsight;
  }

  static async getKeyMoments(sessionId: string): Promise<KeyMoment[]> {
    const { data, error } = await supabase
      .from('session_key_moments')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp_start', { ascending: true });

    if (error) {
      console.error('Error fetching key moments:', error);
      return [];
    }

    return (data || []) as KeyMoment[];
  }

  static async getAllSessionData(sessionId: string) {
    const [transcript, summary, insights, keyMoments] = await Promise.all([
      this.getTranscript(sessionId),
      this.getSessionSummary(sessionId),
      this.getSessionInsights(sessionId),
      this.getKeyMoments(sessionId)
    ]);

    return {
      transcript,
      summary,
      insights,
      keyMoments
    };
  }

  static async getUserTranscripts(userId: string, limit = 10): Promise<SessionTranscript[]> {
    const { data, error } = await supabase
      .from('session_transcripts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user transcripts:', error);
      return [];
    }

    return (data || []) as unknown as SessionTranscript[];
  }

  static async getUserSummaries(userId: string, limit = 10): Promise<SessionSummary[]> {
    const { data, error } = await supabase
      .from('session_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user summaries:', error);
      return [];
    }

    return (data || []) as SessionSummary[];
  }

  static formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  static getEmotionColor(emotion: string): string {
    const emotionColors: Record<string, string> = {
      happy: 'text-green-600',
      sad: 'text-blue-600',
      angry: 'text-red-600',
      anxious: 'text-yellow-600',
      calm: 'text-blue-500',
      excited: 'text-purple-600',
      frustrated: 'text-orange-600',
      hopeful: 'text-emerald-600',
      confused: 'text-gray-600',
      breakthrough: 'text-therapy-600'
    };
    return emotionColors[emotion] || 'text-gray-500';
  }

  static getMomentTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      breakthrough: '🌟',
      emotional_shift: '💫',
      insight: '💡',
      resistance: '🛡️',
      progress: '📈'
    };
    return icons[type] || '📝';
  }
}