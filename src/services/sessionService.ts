
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
}

export class SessionService {
  static async getSessionDetails(sessionId: string): Promise<SessionDetails | null> {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
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
        summary: data.summary,
        insights: data.insights || []
      };
    } catch (error) {
      console.error('Error in getSessionDetails:', error);
      return null;
    }
  }
}
