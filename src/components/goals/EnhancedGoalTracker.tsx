
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import CreateGoalDialog from './CreateGoalDialog';
import { format } from 'date-fns';

const EnhancedGoalTracker = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', user?.id],
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

  const toggleGoalMutation = useMutation({
    mutationFn: async ({ goalId, completed }: { goalId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('goals')
        .update({ 
          is_completed: completed,
          current_progress: completed ? 100 : 0
        })
        .eq('id', goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: "Goal Updated",
        description: "Goal status has been updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGoalCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (goal: any) => {
    if (goal.is_completed) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const isOverdue = targetDate < today;
    
    if (isOverdue) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-therapy-600" />
              Goal Tracker
            </div>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="bg-therapy-600 hover:bg-therapy-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length > 0 ? (
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(goal)}
                        <h4 className={`font-medium ${goal.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                          {goal.title}
                        </h4>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={goal.is_completed ? "secondary" : "outline"}
                      onClick={() => toggleGoalMutation.mutate({
                        goalId: goal.id,
                        completed: !goal.is_completed
                      })}
                      disabled={toggleGoalMutation.isPending}
                    >
                      {goal.is_completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.current_progress || 0}%</span>
                    </div>
                    <Progress value={goal.current_progress || 0} className="h-2" />
                  </div>
                </div>
              ))}
              
              {goals.length > 3 && (
                <Button variant="outline" className="w-full" size="sm">
                  View All Goals ({goals.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground mb-3">No goals yet</p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                size="sm"
              >
                Create Your First Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateGoalDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onGoalCreated={handleGoalCreated}
      />
    </>
  );
};

export default EnhancedGoalTracker;
