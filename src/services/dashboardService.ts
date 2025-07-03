import { supabase } from '@/integrations/supabase/client';

export interface DashboardData {
  userStats: {
    totalSessions: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    averageMood: number | null;
  };
  recentSessions: any[];
  upcomingGoals: any[];
  moodTrend: any[];
  achievements: any[];
}

class DashboardService {
  async getDashboardData(userId: string): Promise<{ data: DashboardData | null; error: any }> {
    try {
      const [userStats, sessions, goals, moodEntries, achievements] = await Promise.all([
        supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('therapy_sessions').select('*').eq('user_id', userId).order('start_time', { ascending: false }).limit(5),
        supabase.from('goals').select('*').eq('user_id', userId).limit(3),
        supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(7),
        supabase.from('achievements').select('*').eq('user_id', userId).order('unlocked_at', { ascending: false }).limit(5)
      ]);

      const data: DashboardData = {
        userStats: {
          totalSessions: userStats.data?.total_sessions || 0,
          totalMinutes: userStats.data?.total_minutes || 0,
          currentStreak: userStats.data?.current_streak || 0,
          longestStreak: userStats.data?.longest_streak || 0,
          averageMood: userStats.data?.average_mood || null,
        },
        recentSessions: sessions.data || [],
        upcomingGoals: goals.data || [],
        moodTrend: moodEntries.data || [],
        achievements: achievements.data || []
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return { data: null, error };
    }
  }

  async createTherapySession(userId: string, sessionData: {
    session_type?: string;
    mood_before?: number;
    notes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: userId,
          start_time: new Date().toISOString(),
          session_type: sessionData.session_type || 'general',
          mood_before: sessionData.mood_before,
          notes: sessionData.notes
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating therapy session:', error);
      return { data: null, error };
    }
  }

  async updateTherapySession(sessionId: string, updates: {
    end_time?: string;
    mood_after?: number;
    notes?: string;
    session_summary?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating therapy session:', error);
      return { data: null, error };
    }
  }

  async logMoodEntry(userId: string, moodData: {
    overall: number;
    energy?: number;
    anxiety?: number;
    stress?: number;
    depression?: number;
    notes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          overall: moodData.overall,
          energy: moodData.energy || 5,
          anxiety: moodData.anxiety || 1,
          stress: moodData.stress || 1,
          depression: moodData.depression || 1,
          notes: moodData.notes
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error logging mood entry:', error);
      return { data: null, error };
    }
  }
}

export const dashboardService = new DashboardService();