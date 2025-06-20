import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Plus, TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import CreateGoalDialog from './CreateGoalDialog';

const EnhancedGoalTracker = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('active');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (newGoal: { title: string; description: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: newGoal.title,
          description: newGoal.description,
          is_completed: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-goals', user?.id]);
      toast({
        title: "Goal Created",
        description: "Your new goal has been added successfully.",
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal.",
        variant: "destructive",
      });
    },
  });

  const toggleGoalCompletionMutation = useMutation({
    mutationFn: async (goal: any) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ is_completed: !goal.is_completed })
        .eq('id', goal.id);

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-goals', user?.id]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal status.",
        variant: "destructive",
      });
    },
  });

  const filteredGoals = goals.filter(goal => 
    activeTab === 'active' ? !goal.is_completed : goal.is_completed
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-therapy-600" />
              <span>Your Goals</span>
            </CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" variant="outline" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Goal</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="text-center py-6">Loading goals...</div>
          ) : filteredGoals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              {activeTab === 'active' ? 'No active goals yet.' : 'No completed goals yet.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className={`text-lg font-medium ${goal.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={goal.is_completed ? 'default' : 'outline'}
                    onClick={() => toggleGoalCompletionMutation.mutate(goal)}
                  >
                    {goal.is_completed ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Clock className="h-4 w-4 mr-1" />
                    )}
                    {goal.is_completed ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateGoalDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={(title, description) => createGoalMutation.mutate({ title, description })}
      />
    </div>
  );
};

export default EnhancedGoalTracker;
