
import { supabase } from '@/integrations/supabase/client';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetValue: number;
  currentProgress: number;
  unit: string;
  targetDate: string;
  isCompleted: boolean;
  tags?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class GoalService {
  static async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }

    return data.map(goal => ({
      id: goal.id,
      title: goal.title,
      description: goal.description || '',
      category: goal.category || 'General',
      priority: goal.priority || 'medium',
      targetValue: goal.target_value || 100,
      currentProgress: goal.current_progress || 0,
      unit: goal.unit || 'points',
      targetDate: goal.target_date || new Date().toISOString(),
      isCompleted: goal.is_completed || false,
      tags: goal.tags || [],
      userId: goal.user_id,
      createdAt: goal.created_at,
      updatedAt: goal.updated_at
    }));
  }

  static async createGoal(userId: string, goalData: Partial<Goal>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        priority: goalData.priority,
        target_value: goalData.targetValue,
        current_progress: goalData.currentProgress || 0,
        unit: goalData.unit,
        target_date: goalData.targetDate,
        tags: goalData.tags
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      category: data.category || 'General',
      priority: data.priority || 'medium',
      targetValue: data.target_value || 100,
      currentProgress: data.current_progress || 0,
      unit: data.unit || 'points',
      targetDate: data.target_date || new Date().toISOString(),
      isCompleted: data.is_completed || false,
      tags: data.tags || [],
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  static async updateGoalProgress(goalId: string, increment: number, note?: string): Promise<void> {
    // First get current progress
    const { data: currentGoal, error: fetchError } = await supabase
      .from('goals')
      .select('current_progress, target_value')
      .eq('id', goalId)
      .single();

    if (fetchError) {
      console.error('Error fetching goal:', fetchError);
      throw fetchError;
    }

    const newProgress = Math.min(currentGoal.current_progress + increment, currentGoal.target_value);
    const isCompleted = newProgress >= currentGoal.target_value;

    const { error } = await supabase
      .from('goals')
      .update({
        current_progress: newProgress,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }

    // Log the progress update
    if (note) {
      await supabase.from('goal_progress_logs').insert({
        goal_id: goalId,
        progress_change: increment,
        notes: note,
        created_at: new Date().toISOString()
      });
    }
  }

  static async deleteGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }
}
