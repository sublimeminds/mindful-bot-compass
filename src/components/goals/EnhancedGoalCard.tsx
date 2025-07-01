import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Plus, 
  Minus, 
  MoreHorizontal,
  Share2,
  Edit,
  Star,
  Award,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { UserGoal } from '@/hooks/useUserGoals';

interface EnhancedGoalCardProps {
  goal: UserGoal & {
    streakCount?: number;
    bestStreak?: number;
    difficultyLevel?: string;
    motivationLevel?: number;
  };
}

const EnhancedGoalCard = ({ goal }: EnhancedGoalCardProps) => {
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  
  const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
  const isCompleted = goal.status === 'completed';
  const daysUntilDue = goal.dueDate 
    ? Math.ceil((new Date(goal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProgressUpdate = async (increment: number) => {
    setIsUpdatingProgress(true);
    try {
      // TODO: Implement progress update API call
      console.log('Updating progress by:', increment);
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200 hover:scale-[1.02]",
      isCompleted && "border-green-300 bg-green-50/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              <span className={cn(isCompleted && "line-through text-green-700")}>
                {goal.title}
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
          </div>
          
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
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags and Difficulty */}
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {goal.category}
          </Badge>
          {goal.difficultyLevel && (
            <Badge className={cn("text-xs", getDifficultyColor(goal.difficultyLevel))}>
              {goal.difficultyLevel}
            </Badge>
          )}
          {goal.streakCount && goal.streakCount > 0 && (
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {goal.streakCount} day streak
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {goal.currentValue} / {goal.targetValue} {goal.unit || 'points'}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={cn(
              "h-3 transition-all duration-300",
              isCompleted && "bg-green-100"
            )}
          />
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{Math.round(progressPercentage)}% complete</span>
            {daysUntilDue !== null && (
              <span className={cn(
                daysUntilDue < 7 && "text-red-600 font-medium",
                daysUntilDue < 0 && "text-red-700 font-bold"
              )}>
                {daysUntilDue < 0 
                  ? `${Math.abs(daysUntilDue)} days overdue`
                  : `${daysUntilDue} days left`
                }
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!isCompleted && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProgressUpdate(-1)}
              disabled={isUpdatingProgress || goal.currentValue <= 0}
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-1" />
              -1
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProgressUpdate(1)}
              disabled={isUpdatingProgress}
              className="flex-1 bg-therapy-50 border-therapy-200 text-therapy-700 hover:bg-therapy-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              +1
            </Button>
          </div>
        )}

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="text-gray-500">Best Streak</div>
            <div className="font-semibold text-orange-600">
              {goal.bestStreak || 0} days
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-gray-500">Motivation</div>
            <div className="flex items-center justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < (goal.motivationLevel || 0) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-gray-500">Created</div>
            <div className="font-semibold text-gray-700">
              {new Date(goal.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">Goal Completed! 🎉</p>
            <p className="text-xs text-green-700">Great job on achieving your goal!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalCard;