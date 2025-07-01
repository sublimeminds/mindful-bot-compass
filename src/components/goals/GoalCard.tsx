
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, Target, Calendar, TrendingUp } from 'lucide-react';
import { UserGoal } from '@/hooks/useUserGoals';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { IntelligentNotificationService } from '@/services/intelligentNotificationService';

interface GoalCardProps {
  goal: UserGoal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const progressPercentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  
  const updateProgress = async (increment: number) => {
    setIsUpdating(true);
    try {
      const newValue = Math.max(0, Math.min(goal.currentValue + increment, goal.targetValue));
      const isCompleted = newValue >= goal.targetValue;

      const { error } = await supabase
        .from('goals')
        .update({
          current_progress: newValue,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', goal.id);

      if (error) throw error;

      // Check if goal was just completed
      if (isCompleted && goal.status !== 'completed' && user) {
        await IntelligentNotificationService.createCustomNotification(
          user.id,
          'milestone_achieved',
          'Goal Completed! 🎉',
          `Congratulations! You've completed your goal: ${goal.title}`,
          'high',
          { goalId: goal.id, goalTitle: goal.title }
        );
      }

      toast({
        title: increment > 0 ? "Progress Updated!" : "Progress Adjusted",
        description: `Goal progress: ${newValue}/${goal.targetValue}`,
      });

      // Invalidate and refetch the goals query
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: "Error",
        description: "Failed to update goal progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Mental Health': 'bg-therapy-100 text-therapy-700',
      'Physical Health': 'bg-harmony-100 text-harmony-700', 
      'Personal Growth': 'bg-flow-100 text-flow-700',
      'Relationships': 'bg-calm-100 text-calm-700',
      'Career': 'bg-balance-100 text-balance-700',
      'General': 'bg-gray-100 text-gray-700'
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">{goal.title}</CardTitle>
          <Badge className={getStatusColor(goal.status)}>
            {goal.status}
          </Badge>
        </div>
        {goal.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category and Due Date */}
        <div className="flex justify-between items-center">
          <Badge className={getCategoryColor(goal.category)}>
            {goal.category}
          </Badge>
          {goal.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(goal.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {goal.currentValue}/{goal.targetValue}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-center">
            <span className="text-lg font-bold text-therapy-700">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Progress Controls */}
        {goal.status === 'active' && (
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateProgress(-1)}
              disabled={isUpdating || goal.currentValue <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => updateProgress(1)}
              disabled={isUpdating || goal.currentValue >= goal.targetValue}
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Completion Badge */}
        {goal.status === 'completed' && (
          <div className="text-center">
            <Badge className="bg-green-100 text-green-700">
              <Target className="h-3 w-3 mr-1" />
              Goal Completed!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
