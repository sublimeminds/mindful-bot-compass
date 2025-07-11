import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface RealGoal {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  start_date: string;
  target_date: string;
  target_value: number;
  current_progress: number;
  unit: string;
  type: string;
  is_completed: boolean;
  streak_count?: number;
  best_streak?: number;
  motivation_level?: number;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GoalProgress {
  id: string;
  goal_id: string;
  value: number;
  notes?: string;
  recorded_at: string;
}

export interface GoalInsight {
  id: string;
  goal_id?: string;
  insight_type: string;
  title: string;
  description: string;
  action_items?: string[];
  confidence_score?: number;
  created_at: string;
}

export interface GoalsAnalytics {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  completionRate: number;
  averageProgress: number;
  streakAverage: number;
  categoryBreakdown: Record<string, number>;
  monthlyProgress: Array<{
    month: string;
    completed: number;
    created: number;
  }>;
}

export const useRealGoalsData = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<RealGoal[]>([]);
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [insights, setInsights] = useState<GoalInsight[]>([]);
  const [analytics, setAnalytics] = useState<GoalsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadGoalsData();
    }
  }, [user]);

  const loadGoalsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      setGoals(goalsData || []);

      // Load goal progress
      const { data: progressData, error: progressError } = await supabase
        .from('goal_progress')
        .select('*')
        .in('goal_id', (goalsData || []).map(g => g.id))
        .order('recorded_at', { ascending: false });

      if (progressError) throw progressError;

      setProgress(progressData || []);

      // Load goal insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('goal_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (insightsError) throw insightsError;

      setInsights(insightsData || []);

      // Calculate analytics
      if (goalsData && goalsData.length > 0) {
        const completedGoals = goalsData.filter(g => g.is_completed);
        const activeGoals = goalsData.filter(g => !g.is_completed);
        
        const totalProgress = goalsData.reduce((acc, goal) => acc + goal.current_progress, 0);
        const avgProgress = goalsData.length > 0 ? totalProgress / goalsData.length : 0;

        const totalStreak = goalsData.reduce((acc, goal) => acc + (goal.streak_count || 0), 0);
        const avgStreak = goalsData.length > 0 ? totalStreak / goalsData.length : 0;

        const categoryBreakdown = goalsData.reduce((acc, goal) => {
          acc[goal.category] = (acc[goal.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const monthlyProgress = calculateMonthlyProgress(goalsData);

        setAnalytics({
          totalGoals: goalsData.length,
          completedGoals: completedGoals.length,
          activeGoals: activeGoals.length,
          completionRate: goalsData.length > 0 ? (completedGoals.length / goalsData.length) * 100 : 0,
          averageProgress: avgProgress,
          streakAverage: avgStreak,
          categoryBreakdown,
          monthlyProgress
        });
      }

    } catch (err) {
      console.error('Error loading goals data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load goals data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyProgress = (goals: RealGoal[]) => {
    const months: Record<string, { completed: number; created: number }> = {};
    
    goals.forEach(goal => {
      const createdMonth = new Date(goal.created_at).toISOString().slice(0, 7);
      
      if (!months[createdMonth]) {
        months[createdMonth] = { completed: 0, created: 0 };
      }
      
      months[createdMonth].created++;
      
      if (goal.is_completed) {
        months[createdMonth].completed++;
      }
    });

    return Object.entries(months)
      .map(([month, data]) => ({
        month,
        completed: data.completed,
        created: data.created
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  };

  const createGoal = async (goalData: { 
    title: string;
    category: string;
    target_date: string;
    type: string;
    description?: string;
    priority?: string;
    target_value?: number;
    unit?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{ 
          ...goalData, 
          user_id: user.id,
          current_progress: 0,
          is_completed: false,
          start_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      await loadGoalsData(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error creating goal:', err);
      throw err;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<RealGoal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      await loadGoalsData(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  const recordProgress = async (goalId: string, value: number, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('goal_progress')
        .insert([{
          goal_id: goalId,
          value,
          notes,
          recorded_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Update goal's current progress
      await supabase
        .from('goals')
        .update({ current_progress: value })
        .eq('id', goalId);

      await loadGoalsData(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error recording progress:', err);
      throw err;
    }
  };

  const refreshData = () => {
    loadGoalsData();
  };

  return {
    goals,
    progress,
    insights,
    analytics,
    loading,
    error,
    createGoal,
    updateGoal,
    recordProgress,
    refreshData
  };
};