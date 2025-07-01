
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateGoalDialog = ({ open, onOpenChange }: CreateGoalDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetValue: '',
    targetDate: '',
    unit: 'sessions'
  });

  const categories = [
    'Mental Health',
    'Physical Health', 
    'Personal Growth',
    'Relationships',
    'Career',
    'General'
  ];

  const units = [
    'sessions',
    'days',
    'weeks',
    'hours',
    'times',
    'points'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          target_value: parseInt(formData.targetValue),
          current_progress: 0,
          unit: formData.unit,
          target_date: formData.targetDate || null,
          is_completed: false,
          type: 'personal'
        });

      if (error) throw error;

      toast({
        title: "Goal Created!",
        description: `Your goal "${formData.title}" has been created successfully.`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        targetValue: '',
        targetDate: '',
        unit: 'sessions'
      });
      
      onOpenChange(false);
      
      // Invalidate and refetch the goals query
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Complete 30 meditation sessions"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description of your goal..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                min="1"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                placeholder="e.g., 30"
                required
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title || !formData.category || !formData.targetValue}
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalDialog;
