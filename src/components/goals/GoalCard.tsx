
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  Trophy, 
  CheckCircle, 
  Play,
  Flag,
  Clock,
  Edit
} from "lucide-react";
import { Goal } from "@/services/goalService";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (goalId: string, progress: number) => void;
  onEdit: (goal: Goal) => void;
  onViewDetails: (goal: Goal) => void;
}

const GoalCard = ({ goal, onUpdateProgress, onEdit, onViewDetails }: GoalCardProps) => {
  const progressPercentage = (goal.currentProgress / goal.targetValue) * 100;
  const isOverdue = new Date() > goal.targetDate && !goal.isCompleted;
  const daysRemaining = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'mental-health': return 'bg-blue-100 text-blue-800';
      case 'habit-building': return 'bg-green-100 text-green-800';
      case 'therapy-specific': return 'bg-purple-100 text-purple-800';
      case 'personal-growth': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${getPriorityColor(goal.priority)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              {goal.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Target className="h-5 w-5 text-therapy-500" />
              )}
              <span className={goal.isCompleted ? 'line-through text-muted-foreground' : ''}>
                {goal.title}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getCategoryColor(goal.category)}>
                {goal.category.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {goal.type}
              </Badge>
              {goal.priority === 'high' && (
                <Flag className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(goal)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{goal.description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {goal.currentProgress} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          <div className="text-right text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-1" />
                Milestones
              </span>
              <span className="text-sm text-muted-foreground">
                {completedMilestones} / {goal.milestones.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {goal.milestones.slice(0, 3).map((milestone, index) => (
                <Badge 
                  key={milestone.id} 
                  variant={milestone.isCompleted ? "default" : "outline"}
                  className="text-xs"
                >
                  {milestone.isCompleted ? '✓' : index + 1} {milestone.title}
                </Badge>
              ))}
              {goal.milestones.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{goal.milestones.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(goal.targetDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className={isOverdue ? 'text-red-600' : ''}>
              {isOverdue ? 'Overdue' : daysRemaining > 0 ? `${daysRemaining} days left` : 'Due today'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {!goal.isCompleted && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUpdateProgress(goal.id, goal.currentProgress + 1)}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Update Progress
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(goal)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
