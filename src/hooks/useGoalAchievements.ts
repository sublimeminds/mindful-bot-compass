import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GoalAchievement {
  id: string;
  user_id: string;
  goal_id?: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  pointsEarned: number;
  unlocked_at: string;
  metadata: any;
}

export const useGoalAchievements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goalAchievements', user?.id],
    queryFn: async (): Promise<GoalAchievement[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('goal_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching goal achievements:', error);
        throw error;
      }

      return (data || []).map(achievement => ({
        ...achievement,
        pointsEarned: achievement.points_earned || 0,
      }));
    },
    enabled: !!user,
  });
};