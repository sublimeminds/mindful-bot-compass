
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Target, Plus, X } from "lucide-react";
import { Goal, GoalTemplate, GoalMilestone } from "@/services/goalService";
import { format } from "date-fns";

interface GoalFormProps {
  template?: GoalTemplate;
  existingGoal?: Goal;
  onSubmit: (goalData: any, milestones: any[]) => void;
  onCancel: () => void;
}

const GoalForm = ({ template, existingGoal, onSubmit, onCancel }: GoalFormProps) => {
  const [formData, setFormData] = useState({
    title: existingGoal?.title || template?.title || '',
    description: existingGoal?.description || template?.description || '',
    category: existingGoal?.category || template?.category || 'mental-health',
    type: existingGoal?.type || template?.type || 'habit',
    targetValue: existingGoal?.targetValue || template?.defaultTargetValue || 1,
    unit: existingGoal?.unit || template?.defaultUnit || 'days',
    targetDate: existingGoal?.targetDate ? format(existingGoal.targetDate, 'yyyy-MM-dd') : 
                  template ? format(new Date(Date.now() + template.defaultDuration * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') :
                  format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    priority: existingGoal?.priority || 'medium',
    notes: existingGoal?.notes || ''
  });

  const [milestones, setMilestones] = useState<Omit<GoalMilestone, 'id' | 'goalId' | 'isCompleted' | 'completedAt'>[]>(
    existingGoal?.milestones.map(m => ({
      title: m.title,
      description: m.description,
      targetValue: m.targetValue,
      reward: m.reward
    })) || 
    template?.milestoneTemplates || []
  );

  const [tags, setTags] = useState<string[]>(existingGoal?.tags || template?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      targetDate: new Date(formData.targetDate),
      tags,
      currentProgress: existingGoal?.currentProgress || 0,
      isCompleted: existingGoal?.isCompleted || false
    };

    onSubmit(goalData, milestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, {
      title: '',
      description: '',
      targetValue: 1,
      reward: ''
    }]);
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          {existingGoal ? 'Edit Goal' : template ? `Create Goal: ${template.title}` : 'Create Custom Goal'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your goal title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal and why it's important to you"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Goal['category'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="habit-building">Habit Building</SelectItem>
                    <SelectItem value="therapy-specific">Therapy Specific</SelectItem>
                    <SelectItem value="personal-growth">Personal Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Goal['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="habit">Habit</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="outcome">Outcome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Target & Timeline */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="targetValue">Target Value</Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., days, sessions"
                  required
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as Goal['priority'] })}>
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

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Milestones (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </div>

            {milestones.map((milestone, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Milestone {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Milestone title"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Target value"
                    value={milestone.targetValue}
                    onChange={(e) => updateMilestone(index, 'targetValue', Number(e.target.value))}
                  />
                </div>

                <Input
                  placeholder="Description"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                />

                <Input
                  placeholder="Reward (optional)"
                  value={milestone.reward || ''}
                  onChange={(e) => updateMilestone(index, 'reward', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes or context for this goal"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              {existingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalForm;
