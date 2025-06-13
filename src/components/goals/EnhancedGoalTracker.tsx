
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trophy, Calendar, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GoalService } from '@/services/goalService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CreateGoalDialog from './CreateGoalDialog';

const EnhancedGoalTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => GoalService.getGoals(user?.id || ''),
    enabled: !!user?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ goalId, increment }: { goalId: string; increment: number }) =>
      GoalService.updateGoalProgress(goalId, increment, `Quick update: +${increment}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Progress Updated",
        description: "Goal progress has been updated!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive",
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) => GoalService.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goal Deleted",
        description: "Goal has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    }
  });

  const handleQuickProgress = (goalId: string, increment: number) => {
    updateProgressMutation.mutate({ goalId, increment });
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoalMutation.mutate(goalId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading goals...</div>;
  }

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => 
        sum + ((goal.currentProgress / goal.targetValue) * 100), 0) / goals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Goal Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Goals</CardTitle>
            <CreateGoalDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </CreateGoalDialog>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No goals yet. Create your first goal to start tracking progress!</p>
              <CreateGoalDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CreateGoalDialog>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progressPercentage = Math.min((goal.currentProgress / goal.targetValue) * 100, 100);
                const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={goal.id} className="border-l-4 border-l-therapy-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{goal.title}</h3>
                              {goal.isCompleted && (
                                <Badge className="bg-green-100 text-green-800">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge variant="outline">
                              {goal.category}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Goal
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Goal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {goal.currentProgress} / {goal.targetValue} {goal.unit}</span>
                            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={progressPercentage}
                            className="h-2"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                            </span>
                            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                          </div>

                          {!goal.isCompleted && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickProgress(goal.id, 1)}
                                disabled={updateProgressMutation.isPending}
                              >
                                +1
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickProgress(goal.id, 5)}
                                disabled={updateProgressMutation.isPending}
                              >
                                +5
                              </Button>
                            </div>
                          )}
                        </div>

                        {goal.tags && goal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {goal.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Recommendations - only show if user has fewer than 3 goals */}
      {goals.length < 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Daily Mindfulness', description: 'Practice 10 minutes of mindfulness daily for 30 days', category: 'Mental Health', targetValue: 30, unit: 'days' },
                { title: 'Weekly Therapy Sessions', description: 'Complete therapy sessions consistently', category: 'Mental Health', targetValue: 12, unit: 'sessions' },
                { title: 'Mood Tracking Habit', description: 'Log mood entries daily for a month', category: 'Self-Awareness', targetValue: 30, unit: 'entries' },
                { title: 'Sleep Quality Improvement', description: 'Maintain good sleep schedule', category: 'Physical Health', targetValue: 21, unit: 'nights' }
              ].map((rec, index) => (
                <Card key={index} className="border-dashed border-2 border-gray-200 hover:border-therapy-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{rec.category}</Badge>
                        <CreateGoalDialog>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </CreateGoalDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedGoalTracker;
