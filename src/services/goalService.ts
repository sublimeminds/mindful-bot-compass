
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
  targetDate: Date;
  isCompleted: boolean;
  tags?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
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
      targetDate: new Date(goal.target_date || new Date()),
      isCompleted: goal.is_completed || false,
      tags: goal.tags || [],
      userId: goal.user_id,
      createdAt: goal.created_at,
      updatedAt: goal.updated_at,
      notes: goal.notes || ''
    }));
  }

  static async createGoal(goalData: {
    userId: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    targetValue: number;
    currentProgress: number;
    unit: string;
    startDate: Date;
    targetDate: Date;
    isCompleted: boolean;
    tags: string[];
    notes: string;
  }): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: goalData.userId,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        priority: goalData.priority,
        target_value: goalData.targetValue,
        current_progress: goalData.currentProgress || 0,
        unit: goalData.unit,
        start_date: goalData.startDate.toISOString(),
        target_date: goalData.targetDate.toISOString(),
        tags: goalData.tags,
        notes: goalData.notes
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
      targetDate: new Date(data.target_date || new Date()),
      isCompleted: data.is_completed || false,
      tags: data.tags || [],
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      notes: data.notes || ''
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

    // Log the progress update in goal_progress table
    if (note) {
      await supabase.from('goal_progress').insert({
        goal_id: goalId,
        value: newProgress,
        note: note
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
