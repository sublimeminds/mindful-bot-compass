import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Target, CheckCircle, Clock, TrendingUp, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
  is_completed: boolean;
}

const RealGoalProgressTracker = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState('');
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error fetching goals",
        description: "Failed to load goal data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const addGoal = async () => {
    if (!newGoal.trim()) return;

    try {
      if (!user) return;

      const { error } = await supabase
        .from('goals')
        .insert({
          title: newGoal,
          description: 'New goal',
          target_value: 100,
          current_value: 0,
          unit: '%',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: user.id,
          is_completed: false,
        });

      if (error) throw error;

      setNewGoal('');
      fetchGoals();
      toast({
        title: "Goal added",
        description: "New goal created successfully.",
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error adding goal",
        description: "Failed to create new goal.",
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (goal: Goal) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ is_completed: !goal.is_completed })
        .eq('id', goal.id);

      if (error) throw error;

      fetchGoals();
      toast({
        title: "Status updated",
        description: `Goal ${goal.is_completed ? 'marked incomplete' : 'completed'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p>Loading goals...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Goals</span>
          <Button onClick={addGoal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.length === 0 ? (
            <p>No goals set yet. Add one to start tracking!</p>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-gray-500">
                    {goal.current_value}/{goal.target_value} {goal.unit}
                  </p>
                  <Progress
                    value={(goal.current_value / goal.target_value) * 100}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={goal.is_completed ? "default" : "secondary"}>
                    {goal.is_completed ? 'Completed' : 'In Progress'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleComplete(goal)}
                  >
                    {goal.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealGoalProgressTracker;
