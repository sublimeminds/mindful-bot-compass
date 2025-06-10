
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, ArrowRight, TrendingUp, Award, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { GoalService } from '@/services/goalService';
import { differenceInDays } from 'date-fns';

const GoalsWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => user ? GoalService.getGoals(user.id) : [],
    enabled: !!user?.id,
  });

  const { data: insights } = useQuery({
    queryKey: ['goal-insights', user?.id],
    queryFn: () => user ? GoalService.getGoalInsights(user.id) : null,
    enabled: !!user?.id,
  });

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const urgentGoals = activeGoals.filter(goal => {
    const daysRemaining = differenceInDays(goal.targetDate, new Date());
    return daysRemaining <= 3 && daysRemaining >= 0;
  });

  const topGoals = activeGoals
    .sort((a, b) => {
      // Sort by priority (high first) then by days remaining
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      const aDays = differenceInDays(a.targetDate, new Date());
      const bDays = differenceInDays(b.targetDate, new Date());
      return aDays - bDays;
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading goals...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-therapy-600" />
            My Goals
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/goals')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        {insights && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-therapy-50 rounded-lg">
              <div className="text-lg font-bold text-therapy-700">{insights.activeGoals}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">{insights.completedGoals}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-2 bg-calm-50 rounded-lg">
              <div className="text-lg font-bold text-calm-700">{Math.round(insights.completionRate)}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        )}

        {/* Urgent Goals Alert */}
        {urgentGoals.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">
                {urgentGoals.length} goal{urgentGoals.length > 1 ? 's' : ''} due soon!
              </span>
            </div>
          </div>
        )}

        {/* Top Goals */}
        {topGoals.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Priority Goals</h4>
            {topGoals.map((goal) => {
              const progressPercentage = (goal.currentProgress / goal.targetValue) * 100;
              const daysRemaining = differenceInDays(goal.targetDate, new Date());
              const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;
              
              return (
                <div key={goal.id} className="space-y-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/goals')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate flex-1">{goal.title}</span>
                      {goal.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">High</Badge>
                      )}
                      {isUrgent && (
                        <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-300">
                          Due Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{goal.currentProgress} / {goal.targetValue} {goal.unit}</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={Math.min(progressPercentage, 100)} className="h-1.5" />
                  </div>
                  
                  {daysRemaining >= 0 && (
                    <div className="text-xs text-muted-foreground">
                      {daysRemaining === 0 ? 'Due today' : `${daysRemaining} days left`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No goals set yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/goals')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Goal
            </Button>
          </div>
        )}

        {/* Achievements Preview */}
        {insights && insights.achievements.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Achievement</h4>
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{insights.achievements[0].title}</div>
              <div className="text-xs text-muted-foreground">{insights.achievements[0].description}</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/goals')}
          className="w-full"
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Manage All Goals
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;
