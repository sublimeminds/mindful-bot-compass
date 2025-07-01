
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserGoal {
  id: string;
  title: string;
  description: string | null;
  targetValue: number;
  currentValue: number;
  category: string;
  unit?: string;
  status: 'active' | 'completed' | 'paused';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  streakCount?: number;
  bestStreak?: number;
  difficultyLevel?: string;
  motivationLevel?: number;
}

export const useUserGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userGoals', user?.id],
    queryFn: async (): Promise<UserGoal[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user goals:', error);
        throw error;
      }

      return (data || []).map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetValue: goal.target_value || 100,
        currentValue: goal.current_progress || 0,
        category: goal.category || 'general',
        unit: goal.unit || 'points',
        status: goal.is_completed ? 'completed' : 'active',
        dueDate: goal.target_date,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
        streakCount: goal.streak_count || 0,
        bestStreak: goal.best_streak || 0,
        difficultyLevel: goal.difficulty_level || 'medium',
        motivationLevel: goal.motivation_level || 5,
      }));
    },
    enabled: !!user,
  });
};
