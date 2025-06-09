
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Calendar, 
  Trophy, 
  CheckCircle, 
  Clock,
  Flag,
  Plus,
  TrendingUp,
  Edit
} from "lucide-react";
import { Goal, GoalService, GoalProgress } from "@/services/goalService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface GoalDetailsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (goal: Goal) => void;
  onGoalUpdated: (goal: Goal) => void;
}

const GoalDetailsModal = ({ goal, isOpen, onClose, onEdit, onGoalUpdated }: GoalDetailsModalProps) => {
  const [progressUpdate, setProgressUpdate] = useState('');
  const [progressNote, setProgressNote] = useState('');
  const [progressHistory, setProgressHistory] = useState<GoalProgress[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (goal && isOpen) {
      loadProgressHistory();
    }
  }, [goal, isOpen]);

  const loadProgressHistory = async () => {
    if (!goal) return;
    try {
      const history = await GoalService.getGoalProgress(goal.id);
      setProgressHistory(history);
    } catch (error) {
      console.error('Error loading progress history:', error);
    }
  };

  if (!goal) return null;

  const progressPercentage = (goal.currentProgress / goal.targetValue) * 100;
  const isOverdue = new Date() > goal.targetDate && !goal.isCompleted;
  const daysRemaining = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
  
  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'mental-health': return 'bg-blue-100 text-blue-800';
      case 'habit-building': return 'bg-green-100 text-green-800';
      case 'therapy-specific': return 'bg-purple-100 text-purple-800';
      case 'personal-growth': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProgressUpdate = async () => {
    if (!progressUpdate) return;
    
    const newProgress = Number(progressUpdate);
    if (isNaN(newProgress) || newProgress < 0) {
      toast({
        title: "Invalid Progress",
        description: "Please enter a valid number for progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedGoal = await GoalService.updateGoalProgress(goal.id, newProgress, progressNote);
      if (updatedGoal) {
        onGoalUpdated(updatedGoal);
        setProgressUpdate('');
        setProgressNote('');
        
        toast({
          title: "Progress Updated",
          description: `Goal progress updated to ${newProgress} ${goal.unit}`,
        });

        // Check for milestone completions
        const newlyCompleted = updatedGoal.milestones.filter(m => 
          m.isCompleted && !goal.milestones.find(om => om.id === m.id)?.isCompleted
        );
        
        if (newlyCompleted.length > 0) {
          toast({
            title: "Milestone Achieved! 🎉",
            description: `You completed: ${newlyCompleted.map(m => m.title).join(', ')}`,
          });
        }

        if (updatedGoal.isCompleted && !goal.isCompleted) {
          toast({
            title: "Goal Completed! 🏆",
            description: "Congratulations on achieving your goal!",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {goal.isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Target className="h-6 w-6 text-therapy-500" />
              )}
              <span>{goal.title}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(goal)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(goal.category)}>
              {goal.category.replace('-', ' ')}
            </Badge>
            <Badge variant="outline">
              {goal.type}
            </Badge>
            <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
              {goal.priority} priority
            </Badge>
            {goal.priority === 'high' && <Flag className="h-4 w-4 text-red-500" />}
          </div>

          <p className="text-muted-foreground">{goal.description}</p>

          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Progress</span>
                  <span className="text-muted-foreground">
                    {goal.currentProgress} / {goal.targetValue} {goal.unit}
                  </span>
                </div>
                <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
                <div className="text-right text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% complete
                </div>
              </div>

              {!goal.isCompleted && (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="New progress value"
                    value={progressUpdate}
                    onChange={(e) => setProgressUpdate(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Note (optional)"
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleProgressUpdate}>
                    <Plus className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{format(goal.startDate, 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Date</p>
                  <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                    {format(goal.targetDate, 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className={isOverdue ? 'text-red-600' : ''}>
                      {goal.isCompleted ? 'Completed' :
                       isOverdue ? 'Overdue' : 
                       daysRemaining > 0 ? `${daysRemaining} days left` : 'Due today'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{format(goal.createdAt, 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          {goal.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Milestones
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {completedMilestones} / {goal.milestones.length} completed
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goal.milestones.map((milestone) => (
                    <div 
                      key={milestone.id} 
                      className={`p-3 rounded-lg border ${
                        milestone.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {milestone.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                          <span className={`font-medium ${milestone.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {milestone.title}
                          </span>
                        </div>
                        <Badge variant={milestone.isCompleted ? "default" : "outline"}>
                          {milestone.targetValue} {goal.unit}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">
                        {milestone.description}
                      </p>
                      {milestone.reward && (
                        <p className="text-sm text-therapy-600 ml-7 mt-1">
                          🎁 Reward: {milestone.reward}
                        </p>
                      )}
                      {milestone.isCompleted && milestone.completedAt && (
                        <p className="text-xs text-green-600 ml-7 mt-1">
                          Completed on {format(milestone.completedAt, 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {goal.tags.length > 0 && (
            <div>
              <p className="font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {goal.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {goal.notes && (
            <div>
              <p className="font-medium mb-2">Notes</p>
              <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                {goal.notes}
              </p>
            </div>
          )}

          {/* Progress History */}
          {progressHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {progressHistory.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{entry.value} {goal.unit}</p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(entry.date, 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDetailsModal;
