
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GoalService } from '@/services/goalService';

interface CreateGoalDialogProps {
  children?: React.ReactNode;
}

const CreateGoalDialog = ({ children }: CreateGoalDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    category: 'Mental Health',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetValue: 100,
    unit: 'points',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    tags: [] as string[],
    type: 'personal'
  });

  const [newTag, setNewTag] = useState('');

  const categories = [
    'Mental Health', 'Physical Health', 'Relationships', 'Career', 'Personal Growth',
    'Habits', 'Skills', 'Creativity', 'Spirituality', 'Other'
  ];

  const units = ['points', 'days', 'times', 'hours', 'sessions', 'exercises', 'books', 'habits'];

  const createGoalMutation = useMutation({
    mutationFn: async (data: typeof goalData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return GoalService.createGoal({
        userId: user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        targetValue: data.targetValue,
        currentProgress: 0,
        unit: data.unit,
        startDate: new Date(),
        targetDate: new Date(data.targetDate),
        isCompleted: false,
        tags: data.tags,
        notes: '',
        type: data.type
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goal Created",
        description: "Your new goal has been created successfully!",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setGoalData({
      title: '',
      description: '',
      category: 'Mental Health',
      priority: 'medium',
      targetValue: 100,
      unit: 'points',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: [],
      type: 'personal'
    });
    setNewTag('');
  };

  const handleSubmit = () => {
    if (!goalData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate(goalData);
  };

  const addTag = () => {
    if (newTag.trim() && !goalData.tags.includes(newTag.trim())) {
      setGoalData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setGoalData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Create New Goal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              value={goalData.title}
              onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Complete 30 therapy sessions"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={goalData.description}
              onChange={(e) => setGoalData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal and why it's important to you..."
              rows={3}
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={goalData.category} onValueChange={(value) => setGoalData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={goalData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setGoalData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                value={goalData.targetValue}
                onChange={(e) => setGoalData(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={goalData.unit} onValueChange={(value) => setGoalData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={goalData.targetDate}
              onChange={(e) => setGoalData(prev => ({ ...prev, targetDate: e.target.value }))}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Goal Type</Label>
            <Select value={goalData.type} onValueChange={(value) => setGoalData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="therapy">Therapy</SelectItem>
                <SelectItem value="habit">Habit</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {goalData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {goalData.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createGoalMutation.isPending}>
            {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalDialog;
