import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  completedGoals: number;
  activeGoals: number;
  lastSessionDate: Date | null;
}

export const useUserStats = () => {
  const { user } = useSimpleApp();
  const [data, setData] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id]);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user stats from database or create default
      const { data: userStatsData, error: statsError } = await supabase
        .from('user_stats' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      // Get session data for calculations
      const { data: sessionsData } = await supabase
        .from('therapy_sessions' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      // Get goals data
      const { data: goalsData } = await supabase
        .from('goals' as any)
        .select('*')
        .eq('user_id', user.id);

      // Get recent mood entries for average
      const { data: moodData } = await supabase
        .from('mood_entries' as any)
        .select('overall')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      // Calculate stats
      const totalSessions = sessionsData?.length || 0;
      const totalMinutes = sessionsData?.reduce((total, session) => {
        if (session.end_time && session.start_time) {
          const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
          return total + Math.floor(duration / 60000);
        }
        return total;
      }, 0) || 0;

      const averageMood = moodData?.length > 0 
        ? moodData.reduce((sum, entry) => sum + entry.overall, 0) / moodData.length
        : 5;

      const activeGoals = goalsData?.filter(goal => goal.status === 'active').length || 0;
      const completedGoals = goalsData?.filter(goal => goal.status === 'completed').length || 0;

      const lastSessionDate = sessionsData?.[0]?.start_time 
        ? new Date(sessionsData[0].start_time) 
        : null;

      // Calculate streak (simplified)
      let currentStreak = 0;
      if (sessionsData?.length > 0) {
        const sessionDates = sessionsData
          .map(session => new Date(session.start_time).toDateString())
          .filter((date, index, array) => array.indexOf(date) === index)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (sessionDates.includes(today) || sessionDates.includes(yesterday)) {
          currentStreak = 1;
          for (let i = 1; i < sessionDates.length; i++) {
            const currentDate = new Date(sessionDates[i]);
            const previousDate = new Date(sessionDates[i - 1]);
            const dayDiff = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
            
            if (dayDiff === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }

      const stats: UserStats = {
        totalSessions,
        totalMinutes,
        currentStreak,
        longestStreak: userStatsData?.longest_streak || currentStreak,
        averageMood,
        completedGoals,
        activeGoals,
        lastSessionDate,
      };

      setData(stats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
      
      // Provide fallback data
      setData({
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageMood: 5,
        completedGoals: 0,
        activeGoals: 0,
        lastSessionDate: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch: fetchUserStats };
};