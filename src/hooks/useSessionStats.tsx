
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek } from 'date-fns';

interface SessionStats {
  totalSessions: number;
  totalMessages: number;
  averageMoodImprovement: number;
  weeklyGoal: number;
  weeklyProgress: number;
  longestStreak: number;
}

export const useSessionStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalMessages: 0,
    averageMoodImprovement: 0,
    weeklyGoal: 3,
    weeklyProgress: 0,
    longestStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Get all completed sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('therapy_sessions')
        .select('*, session_messages(*)')
        .eq('user_id', user.id)
        .not('end_time', 'is', null);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        setIsLoading(false);
        return;
      }

      // Calculate stats
      const totalSessions = sessions?.length || 0;
      const totalMessages = sessions?.reduce((sum, session) => 
        sum + (session.session_messages?.length || 0), 0) || 0;

      // Calculate mood improvement
      const sessionsWithMood = sessions?.filter(s => 
        s.mood_before !== null && s.mood_after !== null) || [];
      const averageMoodImprovement = sessionsWithMood.length > 0
        ? sessionsWithMood.reduce((sum, session) => 
            sum + (session.mood_after - session.mood_before), 0) / sessionsWithMood.length
        : 0;

      // Calculate weekly progress
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const weeklyProgress = sessions?.filter(session => {
        const sessionDate = new Date(session.start_time);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      }).length || 0;

      setStats({
        totalSessions,
        totalMessages,
        averageMoodImprovement,
        weeklyGoal: 3, // Default weekly goal
        weeklyProgress,
        longestStreak: 0 // TODO: Calculate streak
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return { stats, isLoading, refetch: fetchStats };
};
