
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Flag,
  Clock,
  Plus,
  CheckCircle
} from 'lucide-react';
import { Goal } from '@/services/goalService';
import { format, differenceInDays } from 'date-fns';

interface GoalDetailsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProgress: (goalId: string, progress: number, note?: string) => void;
}

const GoalDetailsModal = ({ goal, isOpen, onClose, onUpdateProgress }: GoalDetailsModalProps) => {
  const [progressUpdate, setProgressUpdate] = useState(0);
  const [progressNote, setProgressNote] = useState('');

  if (!goal) return null;

  const progressPercentage = (goal.currentProgress / goal.targetValue) * 100;
  const daysRemaining = differenceInDays(goal.targetDate, new Date());
  const isOverdue = daysRemaining < 0;
  const isCompleted = goal.isCompleted;

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'mental-health':
        return 'bg-therapy-100 text-therapy-800';
      case 'habit-building':
        return 'bg-calm-100 text-calm-800';
      case 'therapy-specific':
        return 'bg-blue-100 text-blue-800';
      case 'personal-growth':
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

  const handleProgressSubmit = () => {
    if (progressUpdate > 0) {
      const newProgress = Math.min(goal.currentProgress + progressUpdate, goal.targetValue);
      onUpdateProgress(goal.id, newProgress, progressNote.trim() || undefined);
      setProgressUpdate(0);
      setProgressNote('');
    }
  };

  const completedMilestones = goal.milestones.filter(m => m.isCompleted);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge className={getCategoryColor(goal.category)}>
                {goal.category.replace('-', ' ')}
              </Badge>
              <Badge variant="outline">{goal.type}</Badge>
              <Flag className={`h-4 w-4 ${getPriorityColor(goal.priority)}`} />
            </div>
            <DialogTitle className="text-xl">{goal.title}</DialogTitle>
            {goal.description && (
              <p className="text-muted-foreground">{goal.description}</p>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress Overview
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Current Progress</span>
                <span className="font-medium">
                  {goal.currentProgress} / {goal.targetValue} {goal.unit}
                </span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
              <div className="text-sm text-muted-foreground text-center">
                {Math.round(progressPercentage)}% complete
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">Start Date</div>
                <div className="text-muted-foreground">
                  {format(goal.startDate, 'MMM d, yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Target Date</div>
                <div className={`${isOverdue && !isCompleted ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {format(goal.targetDate, 'MMM d, yyyy')}
                  {!isCompleted && (
                    <div className="text-xs">
                      {isOverdue 
                        ? `${Math.abs(daysRemaining)} days overdue`
                        : daysRemaining === 0 
                          ? 'Due today'
                          : `${daysRemaining} days left`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {goal.milestones.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Milestones ({completedMilestones.length} / {goal.milestones.length})
              </h3>
              
              <div className="space-y-3">
                {goal.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`mt-0.5 ${milestone.isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-4 w-4 ${milestone.isCompleted ? 'fill-current' : ''}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className={`font-medium ${milestone.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {milestone.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {milestone.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: {milestone.targetValue} {goal.unit}
                        {milestone.reward && ` • Reward: ${milestone.reward}`}
                      </div>
                      {milestone.completedAt && (
                        <div className="text-xs text-green-600">
                          Completed {format(milestone.completedAt, 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {goal.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {goal.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {goal.notes && (
            <div className="space-y-2">
              <h3 className="font-medium">Notes</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {goal.notes}
              </div>
            </div>
          )}

          {/* Progress Update */}
          {!isCompleted && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Update Progress
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="progress">Add Progress</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max={goal.targetValue - goal.currentProgress}
                    value={progressUpdate}
                    onChange={(e) => setProgressUpdate(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Total</Label>
                  <div className="h-10 flex items-center px-3 border rounded-md bg-muted">
                    {goal.currentProgress + progressUpdate} / {goal.targetValue} {goal.unit}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Progress Note (Optional)</Label>
                <Textarea
                  id="note"
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="Add a note about your progress..."
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleProgressSubmit}
                disabled={progressUpdate <= 0}
                className="w-full"
              >
                Update Progress
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="text-center py-4 border-t">
              <div className="flex items-center justify-center text-green-600 text-lg font-medium">
                <Award className="h-5 w-5 mr-2" />
                Congratulations! Goal Completed!
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Completed on {format(goal.updatedAt, 'MMMM d, yyyy')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDetailsModal;
