import React, { useState, useEffect } from 'react';
import { useEnhancedAuth } from '@/components/EnhancedAuthProviderV2';
import { supabase } from '@/integrations/supabase/client';
import SafeErrorBoundary from '@/components/SafeErrorBoundary';

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: string;
  target_value: number;
  current_progress: number;
  unit: string;
  target_date: string;
  type: string;
  priority: string;
  is_completed: boolean;
  streak_count: number | null;
  best_streak: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const GoalTracker = () => {
  const { user } = useEnhancedAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness',
    target_value: '',
    unit: '',
    target_date: ''
  });

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async () => {
    if (!user || !newGoal.title.trim()) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: newGoal.title.trim(),
          description: newGoal.description.trim() || null,
          category: newGoal.category,
          target_value: newGoal.target_value ? parseInt(newGoal.target_value) : 1,
          unit: newGoal.unit.trim() || 'times',
          target_date: newGoal.target_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'personal',
          priority: 'medium',
          current_progress: 0,
          is_completed: false
        });

      if (error) throw error;

      // Reset form
      setNewGoal({
        title: '',
        description: '',
        category: 'wellness',
        target_value: '',
        unit: '',
        target_date: ''
      });
      setShowCreateForm(false);
      await loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, increment: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newValue = Math.max(0, goal.current_progress + increment);
      const isCompleted = goal.target_value && newValue >= goal.target_value;

      const { error } = await supabase
        .from('goals')
        .update({
          current_progress: newValue,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;
      await loadGoals();
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  };

  const toggleGoalStatus = async (goalId: string) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newCompleted = !goal.is_completed;

      const { error } = await supabase
        .from('goals')
        .update({
          is_completed: newCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;
      await loadGoals();
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    if (!goal.target_value) return 0;
    return Math.min(100, (goal.current_progress / goal.target_value) * 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return '💪';
      case 'wellness': return '🧘';
      case 'learning': return '📚';
      case 'social': return '👥';
      case 'creative': return '🎨';
      default: return '🎯';
    }
  };

  const getStatusColor = (is_completed: boolean) => {
    return is_completed 
      ? 'text-green-600 bg-green-100' 
      : 'text-blue-600 bg-blue-100';
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to track your goals.</p>
      </div>
    );
  }

  return (
    <SafeErrorBoundary name="GoalTracker">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Goal Tracker</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showCreateForm ? 'Cancel' : 'New Goal'}
          </button>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Exercise 3 times per week"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description of your goal"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="wellness">Wellness</option>
                  <option value="fitness">Fitness</option>
                  <option value="learning">Learning</option>
                  <option value="social">Social</option>
                  <option value="creative">Creative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: e.target.value }))}
                  placeholder="e.g., 21 (for 21 days)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., days, sessions, books"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={createGoal}
                disabled={!newGoal.title.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
              <p className="text-gray-600 mb-4">Create your first goal to start tracking your progress!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-gray-600 text-sm">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.is_completed)}`}>
                    {goal.is_completed ? 'Completed' : 'Active'}
                  </span>
                </div>

                {/* Progress Bar */}
                {goal.target_value && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress: {goal.current_progress}/{goal.target_value} {goal.unit}</span>
                      <span>{getProgressPercentage(goal).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(goal)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="ml-1 font-medium text-orange-600">🔥 {goal.streak_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Best Streak:</span>
                    <span className="ml-1 font-medium text-green-600">⭐ {goal.best_streak}</span>
                  </div>
                  {goal.target_date && (
                    <div>
                      <span className="text-gray-600">Target Date:</span>
                      <span className="ml-1 font-medium">{new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-1 font-medium">{new Date(goal.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateGoalProgress(goal.id, 1)}
                    disabled={goal.is_completed}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, -1)}
                    disabled={goal.is_completed || goal.current_progress === 0}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => toggleGoalStatus(goal.id)}
                    className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50"
                  >
                    {goal.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SafeErrorBoundary>
  );
};

export default GoalTracker;