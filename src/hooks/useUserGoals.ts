
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
  status: 'active' | 'completed' | 'paused';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useUserGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userGoals', user?.id],
    queryFn: async (): Promise<UserGoal[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_goals')
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
        targetValue: goal.target_value,
        currentValue: goal.current_value,
        category: goal.category,
        status: goal.status as 'active' | 'completed' | 'paused',
        dueDate: goal.due_date,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
      }));
    },
    enabled: !!user,
  });
};
