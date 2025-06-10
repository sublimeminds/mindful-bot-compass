
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trophy, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { GoalService } from '@/services/goalService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EnhancedGoalTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => GoalService.getUserGoals(user?.id || ''),
    enabled: !!user?.id,
  });

  const handleQuickProgress = async (goalId: string, increment: number) => {
    try {
      await GoalService.updateProgress(goalId, increment, `Quick update: +${increment}`);
      toast({
        title: "Progress Updated",
        description: `Added ${increment} points to your goal!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-therapy-500';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Goal Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{goals.filter(g => !g.isCompleted).length}</p>
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
                <p className="text-2xl font-bold">{goals.filter(g => g.isCompleted).length}</p>
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
                <p className="text-2xl font-bold">
                  {goals.length > 0 
                    ? Math.round(goals.reduce((sum, goal) => 
                        sum + ((goal.currentProgress / goal.targetValue) * 100), 0) / goals.length)
                    : 0}%
                </p>
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
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No goals yet. Create your first goal to start tracking progress!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progressPercentage = (goal.currentProgress / goal.targetValue) * 100;
                const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={goal.id} className="border-l-4 border-l-therapy-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge variant="outline">
                              {goal.category}
                            </Badge>
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
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                            </span>
                            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickProgress(goal.id, 1)}
                              disabled={goal.isCompleted}
                            >
                              +1
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickProgress(goal.id, 5)}
                              disabled={goal.isCompleted}
                            >
                              +5
                            </Button>
                            {goal.isCompleted && (
                              <Badge className="bg-green-100 text-green-800">
                                <Trophy className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
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

      {/* Goal Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Daily Mindfulness', description: 'Practice 10 minutes of mindfulness daily', category: 'Mental Health' },
              { title: 'Weekly Sessions', description: 'Complete 3 therapy sessions per week', category: 'Therapy' },
              { title: 'Mood Tracking', description: 'Log mood entries for 30 days', category: 'Self-Awareness' },
              { title: 'Sleep Quality', description: 'Maintain 8 hours of sleep for a week', category: 'Wellness' }
            ].map((rec, index) => (
              <Card key={index} className="border-dashed border-2 border-gray-200 hover:border-therapy-300 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{rec.category}</Badge>
                      <Button size="sm" variant="ghost">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedGoalTracker;
