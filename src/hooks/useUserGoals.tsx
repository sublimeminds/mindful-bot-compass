import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  status: 'active' | 'completed' | 'paused';
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  streakCount: number;
  bestStreak: number;
}

export const useUserGoals = () => {
  const { user } = useSimpleApp();
  const [data, setData] = useState<UserGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserGoals();
    }
  }, [user?.id]);

  const fetchUserGoals = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data: goalsData, error: goalsError } = await supabase
        .from('goals' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) {
        throw goalsError;
      }

      const goals: UserGoal[] = (goalsData || []).map(goal => ({
        id: goal.id,
        userId: goal.user_id,
        title: goal.title,
        description: goal.description,
        targetValue: goal.target_value || 100,
        currentValue: goal.current_value || 0,
        status: goal.status || 'active',
        category: goal.category || 'general',
        priority: goal.priority || 'medium',
        targetDate: goal.target_date,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
        streakCount: goal.streak_count || 0,
        bestStreak: goal.best_streak || 0,
      }));

      setData(goals);
    } catch (err) {
      console.error('Error fetching user goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      setData([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<UserGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('goals' as any)
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          target_value: goalData.targetValue,
          current_value: goalData.currentValue,
          status: goalData.status,
          category: goalData.category,
          priority: goalData.priority,
          target_date: goalData.targetDate,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchUserGoals(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error creating goal:', err);
      return null;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<UserGoal>) => {
    try {
      const { error } = await supabase
        .from('goals' as any)
        .update({
          title: updates.title,
          description: updates.description,
          target_value: updates.targetValue,
          current_value: updates.currentValue,
          status: updates.status,
          priority: updates.priority,
          target_date: updates.targetDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) throw error;

      await fetchUserGoals(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating goal:', err);
      return false;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals' as any)
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      await fetchUserGoals(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting goal:', err);
      return false;
    }
  };

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchUserGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};