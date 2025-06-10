
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const GoalsWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading goals...</div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-therapy-600" />
            Goals Progress
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/goals')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-4">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No goals yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/goals')}
            >
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <>
            {/* Active Goals */}
            <div className="space-y-3">
              {activeGoals.slice(0, 2).map((goal) => {
                const progressPercentage = Math.min((goal.current_progress / goal.target_value) * 100, 100);
                const daysLeft = Math.ceil(
                  (new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{goal.title}</h4>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      </div>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">
                      {goal.current_progress} / {goal.target_value} {goal.unit} ({progressPercentage.toFixed(1)}%)
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completed Goals Summary */}
            {completedGoals.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {completedGoals.length} goal{completedGoals.length !== 1 ? 's' : ''} completed!
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/goals')}
                className="w-full"
              >
                Manage All Goals
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;
