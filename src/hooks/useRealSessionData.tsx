import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RealSession {
  id: string;
  start_time: string;
  end_time?: string;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  techniques?: string[];
  user_id: string;
  created_at: string;
}

export interface SessionInsight {
  id: string;
  session_id: string;
  insight_type: string;
  title: string;
  description: string;
  priority: string;
  actionable_suggestion?: string;
  confidence_score?: number;
}

export interface SessionAnalytics {
  totalSessions: number;
  averageDuration: number;
  moodImprovement: number;
  completionRate: number;
  mostUsedTechniques: string[];
  weeklyProgress: Array<{
    week: string;
    sessions: number;
    avgMood: number;
  }>;
}

export const useRealSessionData = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<RealSession[]>([]);
  const [insights, setInsights] = useState<SessionInsight[]>([]);
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSessionData();
    }
  }, [user]);

  const loadSessionData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load therapy sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (sessionsError) throw sessionsError;

      setSessions(sessionsData || []);

      // Load session insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('session_insights')
        .select('*')
        .in('session_id', (sessionsData || []).map(s => s.id))
        .order('created_at', { ascending: false });

      if (insightsError) throw insightsError;

      setInsights(insightsData || []);

      // Calculate analytics
      if (sessionsData && sessionsData.length > 0) {
        const completedSessions = sessionsData.filter(s => s.end_time);
        const totalDuration = completedSessions.reduce((acc, session) => {
          if (session.end_time) {
            const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
            return acc + duration;
          }
          return acc;
        }, 0);

        const moodImprovements = completedSessions
          .filter(s => s.mood_before !== null && s.mood_after !== null)
          .map(s => (s.mood_after! - s.mood_before!));

        const avgMoodImprovement = moodImprovements.length > 0 
          ? moodImprovements.reduce((acc, imp) => acc + imp, 0) / moodImprovements.length 
          : 0;

        const allTechniques = sessionsData
          .flatMap(s => s.techniques || [])
          .reduce((acc, technique) => {
            acc[technique] = (acc[technique] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

        const mostUsedTechniques = Object.entries(allTechniques)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([technique]) => technique);

        // Calculate weekly progress
        const weeklyProgress = calculateWeeklyProgress(sessionsData);

        setAnalytics({
          totalSessions: sessionsData.length,
          averageDuration: completedSessions.length > 0 ? totalDuration / completedSessions.length / (1000 * 60) : 0,
          moodImprovement: avgMoodImprovement,
          completionRate: (completedSessions.length / sessionsData.length) * 100,
          mostUsedTechniques,
          weeklyProgress
        });
      }

    } catch (err) {
      console.error('Error loading session data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyProgress = (sessions: RealSession[]) => {
    const weeks: Record<string, { sessions: number; totalMood: number; moodCount: number }> = {};
    
    sessions.forEach(session => {
      const weekStart = getWeekStart(new Date(session.start_time));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { sessions: 0, totalMood: 0, moodCount: 0 };
      }
      
      weeks[weekKey].sessions++;
      
      if (session.mood_after !== null) {
        weeks[weekKey].totalMood += session.mood_after;
        weeks[weekKey].moodCount++;
      }
    });

    return Object.entries(weeks)
      .map(([week, data]) => ({
        week,
        sessions: data.sessions,
        avgMood: data.moodCount > 0 ? data.totalMood / data.moodCount : 0
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12); // Last 12 weeks
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const refreshData = () => {
    loadSessionData();
  };

  return {
    sessions,
    insights,
    analytics,
    loading,
    error,
    refreshData
  };
};