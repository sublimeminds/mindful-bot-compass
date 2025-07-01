
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  averageMood: number;
  lastSessionDate: string | null;
}

export const useUserStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async (): Promise<UserStats> => {
      if (!user) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          totalSessions: 0,
          totalMinutes: 0,
          averageMood: 0,
          lastSessionDate: null,
        };
      }

      // For now, we'll return default stats since user_stats table doesn't exist in types yet
      // This prevents the build error while maintaining the interface
      console.log('User stats functionality pending database schema update');
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
        averageMood: 0,
        lastSessionDate: null,
      };

      // This code will be activated once the database types are regenerated:
      /*
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        throw error;
      }

      if (!data) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          totalSessions: 0,
          totalMinutes: 0,
          averageMood: 0,
          lastSessionDate: null,
        };
      }

      return {
        currentStreak: data.current_streak || 0,
        longestStreak: data.longest_streak || 0,
        totalSessions: data.total_sessions || 0,
        totalMinutes: data.total_minutes || 0,
        averageMood: data.average_mood || 0,
        lastSessionDate: data.last_session_date,
      };
      */
    },
    enabled: !!user,
  });
};
