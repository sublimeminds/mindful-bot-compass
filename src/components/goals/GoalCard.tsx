
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Clock,
  Flag
} from 'lucide-react';
import { Goal } from '@/services/goalService';
import { format, differenceInDays } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
  onEdit: () => void;
  onUpdateProgress: (goalId: string, progress: number, note?: string) => void;
}

const GoalCard = ({ goal, onClick, onEdit, onUpdateProgress }: GoalCardProps) => {
  const progressPercentage = (goal.currentProgress / goal.targetValue) * 100;
  const daysRemaining = differenceInDays(goal.targetDate, new Date());
  const isOverdue = daysRemaining < 0;
  const isCompleted = goal.isCompleted;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mental Health':
        return 'bg-therapy-100 text-therapy-800';
      case 'Physical Health':
        return 'bg-calm-100 text-calm-800';
      case 'Relationships':
        return 'bg-blue-100 text-blue-800';
      case 'Career':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleQuickProgress = () => {
    const increment = Math.min(5, goal.targetValue - goal.currentProgress);
    const newProgress = Math.min(goal.currentProgress + increment, goal.targetValue);
    onUpdateProgress(goal.id, newProgress);
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1" onClick={onClick}>
            <div className="flex items-center space-x-2">
              <Badge className={getCategoryColor(goal.category)}>
                {goal.category}
              </Badge>
              <Flag className={`h-3 w-3 ${getPriorityColor(goal.priority)}`} />
            </div>
            <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
            {goal.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Progress
            </span>
            <span className="font-medium">
              {goal.currentProgress} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {isCompleted ? 'Completed' : 'Due'}
          </span>
          <span className={isOverdue && !isCompleted ? 'text-red-600 font-medium' : ''}>
            {isCompleted 
              ? format(new Date(goal.updatedAt), 'MMM d, yyyy')
              : isOverdue 
                ? `${Math.abs(daysRemaining)} days overdue`
                : daysRemaining === 0 
                  ? 'Due today'
                  : `${daysRemaining} days left`
            }
          </span>
        </div>

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {goal.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {goal.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{goal.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickProgress();
            }}
            className="w-full"
          >
            <Target className="h-3 w-3 mr-1" />
            Quick Progress +5
          </Button>
        )}

        {isCompleted && (
          <div className="flex items-center justify-center text-green-600 text-sm font-medium">
            <Target className="h-4 w-4 mr-1" />
            Goal Completed!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
