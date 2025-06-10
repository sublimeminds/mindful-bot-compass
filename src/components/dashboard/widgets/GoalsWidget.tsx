
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const GoalsWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(3);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-therapy-600" />
            Your Goals
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
        {goals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No goals set yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/goals')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <>
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{goal.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {goal.current_progress}%
                  </span>
                </div>
                <Progress value={goal.current_progress} className="h-2" />
                {goal.current_progress > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>Making progress!</span>
                  </div>
                )}
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/goals')}
              className="w-full mt-3"
            >
              View All Goals
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;
