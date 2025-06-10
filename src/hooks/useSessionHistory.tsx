
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SessionSummary {
  id: string;
  date: Date;
  duration: number;
  moodBefore?: number;
  moodAfter?: number;
  moodChange?: number;
  techniques: string[];
  keyInsights: string[];
  effectiveness: 'high' | 'medium' | 'low';
  notes?: string;
}

export const useSessionHistory = () => {
  const { user } = useAuth();

  const { data: sessionSummaries = [], isLoading, error } = useQuery({
    queryKey: ['session-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching session history:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  const getSessionStats = () => {
    const totalSessions = sessionSummaries.length;
    const averageDuration = totalSessions > 0 
      ? Math.round(sessionSummaries.reduce((sum, session) => {
          if (session.end_time && session.start_time) {
            const duration = Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60));
            return sum + duration;
          }
          return sum + 30; // default duration
        }, 0) / totalSessions)
      : 0;

    const averageMoodImprovement = sessionSummaries
      .filter(s => s.mood_before && s.mood_after)
      .reduce((sum, s) => sum + (s.mood_after! - s.mood_before!), 0) / Math.max(sessionSummaries.length, 1);

    const techniquesList = sessionSummaries.flatMap(s => s.techniques || []);
    const mostUsedTechnique = techniquesList.length > 0 
      ? techniquesList.reduce((a, b, i, arr) => 
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        )
      : null;

    return {
      totalSessions,
      averageDuration,
      averageMoodImprovement: Math.round(averageMoodImprovement * 10) / 10,
      mostUsedTechnique,
      effectivenessDistribution: {
        high: sessionSummaries.filter(s => (s.mood_after || 5) - (s.mood_before || 5) > 2).length,
        medium: sessionSummaries.filter(s => Math.abs((s.mood_after || 5) - (s.mood_before || 5)) <= 2).length,
        low: sessionSummaries.filter(s => (s.mood_after || 5) - (s.mood_before || 5) < -2).length
      }
    };
  };

  const exportSessions = () => {
    const csvHeader = 'Date,Duration,Mood Before,Mood After,Techniques,Notes\n';
    const csvData = sessionSummaries.map(session => {
      const date = new Date(session.start_time).toLocaleDateString();
      const duration = session.end_time 
        ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
        : 'N/A';
      const techniques = (session.techniques || []).join(';');
      const notes = (session.notes || '').replace(/,/g, ';');
      
      return `${date},${duration},${session.mood_before || 'N/A'},${session.mood_after || 'N/A'},"${techniques}","${notes}"`;
    }).join('\n');
    
    return csvHeader + csvData;
  };

  return { 
    sessionSummaries, 
    isLoading, 
    error: error?.message || null,
    getSessionStats,
    exportSessions
  };
};
