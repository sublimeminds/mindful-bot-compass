import { supabase } from '@/integrations/supabase/client';

export interface SessionAnalytics {
  totalSessions: number;
  averageDuration: number;
  completionRate: number;
  moodImprovement: number;
  effectivenessScore: number;
  weeklyTrend: number;
}

export interface SessionMetrics {
  id: string;
  sessionDate: string;
  duration: number;
  moodBefore: number;
  moodAfter: number;
  techniques: string[];
  effectiveness: number;
  completed: boolean;
}

export class SessionAnalyticsService {
  static async getSessionAnalytics(userId: string, timeRange: string = '30d'): Promise<SessionAnalytics> {
    try {
      const { data: sessions, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', this.getDateRange(timeRange))
        .order('start_time', { ascending: false });

      if (error) throw error;

      const totalSessions = sessions?.length || 0;
      const completedSessions = sessions?.filter(s => s.end_time) || [];
      const averageDuration = this.calculateAverageDuration(completedSessions);
      const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
      const moodImprovement = this.calculateMoodImprovement(completedSessions);
      
      return {
        totalSessions,
        averageDuration,
        completionRate,
        moodImprovement,
        effectivenessScore: 87, // Placeholder - would calculate from session data
        weeklyTrend: 12 // Placeholder - would calculate from historical data
      };
    } catch (error) {
      console.error('Error fetching session analytics:', error);
      return {
        totalSessions: 0,
        averageDuration: 0,
        completionRate: 0,
        moodImprovement: 0,
        effectivenessScore: 0,
        weeklyTrend: 0
      };
    }
  }

  static async getSessionMetrics(userId: string, limit: number = 10): Promise<SessionMetrics[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return sessions?.map(session => ({
        id: session.id,
        sessionDate: new Date(session.start_time).toLocaleDateString(),
        duration: session.end_time ? 
          Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000) : 0,
        moodBefore: session.mood_before || 0,
        moodAfter: session.mood_after || 0,
        techniques: session.techniques || [],
        effectiveness: 85, // Placeholder
        completed: !!session.end_time
      })) || [];
    } catch (error) {
      console.error('Error fetching session metrics:', error);
      return [];
    }
  }

  private static getDateRange(range: string): string {
    const now = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    return startDate.toISOString();
  }

  private static calculateAverageDuration(sessions: any[]): number {
    if (!sessions.length) return 0;
    
    const totalDuration = sessions.reduce((sum, session) => {
      if (session.end_time) {
        const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
        return sum + (duration / 60000); // Convert to minutes
      }
      return sum;
    }, 0);

    return Math.round(totalDuration / sessions.length);
  }

  private static calculateMoodImprovement(sessions: any[]): number {
    const sessionsWithMood = sessions.filter(s => s.mood_before && s.mood_after);
    if (!sessionsWithMood.length) return 0;

    const totalImprovement = sessionsWithMood.reduce((sum, session) => {
      return sum + ((session.mood_after - session.mood_before) / session.mood_before * 100);
    }, 0);

    return Math.round(totalImprovement / sessionsWithMood.length);
  }
}