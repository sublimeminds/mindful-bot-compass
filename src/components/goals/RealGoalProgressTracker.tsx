
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { realAnalyticsService, GoalAnalytics } from '@/services/realAnalyticsService';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  Plus,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_progress: number;
  unit: string;
  target_date: string;
  is_completed: boolean;
  priority: string;
  created_at: string;
}

const RealGoalProgressTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalAnalytics, setGoalAnalytics] = useState<GoalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressUpdate, setProgressUpdate] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      loadGoalsAndAnalytics();
    }
  }, [user]);

  const loadGoalsAndAnalytics = async () => {
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

      // Load analytics
      const analytics = await realAnalyticsService.calculateGoalAnalytics(user.id);
      setGoalAnalytics(analytics);

    } catch (error) {
      console.error('Error loading goals and analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load goals data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, newProgress: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const isCompleted = newProgress >= goal.target_value;

      // Update goal progress
      const { error: goalError } = await supabase
        .from('goals')
        .update({ 
          current_progress: newProgress,
          is_completed: isCompleted
        })
        .eq('id', goalId);

      if (goalError) throw goalError;

      // Log progress entry
      const { error: progressError } = await supabase
        .from('goal_progress')
        .insert({
          goal_id: goalId,
          value: newProgress,
          note: `Progress updated to ${newProgress}/${goal.target_value} ${goal.unit}`
        });

      if (progressError) throw progressError;

      // If goal is newly completed, create achievement
      if (isCompleted && !goal.is_completed) {
        await supabase.from('achievements').insert({
          user_id: user!.id,
          type: 'goal_completion',
          title: 'Goal Achieved!',
          description: `Completed goal: ${goal.title}`,
          icon: 'trophy',
          criteria: { goal_id: goalId, goal_title: goal.title }
        });

        toast({
          title: "🎉 Goal Completed!",
          description: `Congratulations on achieving "${goal.title}"!`
        });
      } else {
        toast({
          title: "Progress Updated",
          description: `Goal progress saved successfully`
        });
      }

      // Reload data
      loadGoalsAndAnalytics();
      setProgressUpdate(prev => ({ ...prev, [goalId]: 0 }));

    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: "Error",
        description: "Failed to update goal progress",
        variant: "destructive"
      });
    }
  };

  const getProgressPercentage = (goal: Goal): number => {
    return Math.min((goal.current_progress / goal.target_value) * 100, 100);
  };

  const getDaysUntilTarget = (targetDate: string): number => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      'mental_health': 'bg-blue-500',
      'physical_health': 'bg-green-500',
      'career': 'bg-purple-500',
      'relationships': 'bg-pink-500',
      'personal_growth': 'bg-orange-500',
      'hobbies': 'bg-cyan-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {goalAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-therapy-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold">{goalAnalytics.completion_rate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-therapy-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Avg. Time</p>
                  <p className="text-2xl font-bold">{Math.round(goalAnalytics.average_time_to_complete)}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-therapy-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Top Category</p>
                  <p className="text-sm font-bold capitalize">
                    {goalAnalytics.most_successful_categories[0] || 'None'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-therapy-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Total Goals</p>
                  <p className="text-2xl font-bold">{goals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals List */}
      <Card className="border-therapy-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-therapy-600" />
            <span>Your Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-therapy-400" />
              <p className="text-lg font-medium">No goals yet</p>
              <p className="text-sm">Set your first goal to start tracking progress</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          ) : (
            goals.map(goal => {
              const progressPercentage = getProgressPercentage(goal);
              const daysUntilTarget = getDaysUntilTarget(goal.target_date);
              const isOverdue = daysUntilTarget < 0;
              const isCompleted = goal.is_completed;

              return (
                <div key={goal.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        {isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="capitalize">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(goal.category)} mr-1`}></div>
                          {goal.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(goal.priority)} mr-1`}></div>
                          {goal.priority} priority
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {isOverdue ? `${Math.abs(daysUntilTarget)}d overdue` : `${daysUntilTarget}d left`}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {goal.current_progress}/{goal.target_value} {goal.unit}</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Progress Update */}
                  {!isCompleted && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Add progress"
                        value={progressUpdate[goal.id] || ''}
                        onChange={(e) => 
                          setProgressUpdate(prev => ({ 
                            ...prev, 
                            [goal.id]: parseInt(e.target.value) || 0 
                          }))
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={() => {
                          const newTotal = goal.current_progress + (progressUpdate[goal.id] || 0);
                          updateGoalProgress(goal.id, newTotal);
                        }}
                        disabled={!progressUpdate[goal.id] || progressUpdate[goal.id] <= 0}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Progress
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {goalAnalytics && goalAnalytics.improvement_areas.length > 0 && (
        <Card className="border-therapy-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-therapy-600" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {goalAnalytics.improvement_areas.map(area => (
                <div key={area} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm capitalize">{area.replace('_', ' ')}</span>
                  <span className="text-xs text-gray-500">- Consider setting more specific goals in this area</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealGoalProgressTracker;
