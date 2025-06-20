import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoalFormProps {
  goal?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [targetDate, setTargetDate] = useState<Date | undefined>(goal?.target_date ? new Date(goal.target_date) : undefined);
  const [priority, setPriority] = useState(goal?.priority || 'medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a goal.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const updates = {
        user_id: user.id,
        title,
        description,
        target_date: targetDate?.toISOString(),
        priority,
        is_completed: false,
        current_progress: 0,
      };

      let error;
      if (goal) {
        const { error: updateError } = await supabase
          .from('goals')
          .update(updates)
          .eq('id', goal.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('goals')
          .insert(updates);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Goal ${goal ? 'updated' : 'created'} successfully!`,
      });
      onSuccess();
    } catch (error: any) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Goal description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalForm;
