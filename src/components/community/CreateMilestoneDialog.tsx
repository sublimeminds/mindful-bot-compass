import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateMilestoneDialogProps {
  onMilestoneCreated: () => void;
}

const CreateMilestoneDialog: React.FC<CreateMilestoneDialogProps> = ({ onMilestoneCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    milestone_type: '',
    achievement_date: '',
    is_shared: true,
    points_earned: ''
  });
  const { toast } = useToast();

  const milestoneTypes = [
    { value: 'streak', label: 'Streak Achievement' },
    { value: 'goal_completed', label: 'Goal Completed' },
    { value: 'peer_helped', label: 'Helped a Peer' },
    { value: 'event_attended', label: 'Event Attended' },
    { value: 'personal', label: 'Personal Achievement' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would call your community service to create the milestone
      // await CommunityService.createMilestone(formData);
      
      toast({
        title: "Success",
        description: "Milestone shared successfully!"
      });
      
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        milestone_type: '',
        achievement_date: '',
        is_shared: true,
        points_earned: ''
      });
      onMilestoneCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share milestone. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-therapy-600 hover:bg-therapy-700">
          <Trophy className="h-4 w-4 mr-2" />
          Share Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Your Milestone</DialogTitle>
          <DialogDescription>
            Celebrate your achievements and inspire others in the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Milestone Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What did you achieve?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us more about this achievement..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="milestone_type">Milestone Type</Label>
              <Select value={formData.milestone_type} onValueChange={(value) => setFormData({ ...formData, milestone_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {milestoneTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="achievement_date">Achievement Date</Label>
              <Input
                id="achievement_date"
                type="date"
                value={formData.achievement_date}
                onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points_earned">Points Earned (optional)</Label>
            <Input
              id="points_earned"
              type="number"
              value={formData.points_earned}
              onChange={(e) => setFormData({ ...formData, points_earned: e.target.value })}
              placeholder="How many points did you earn?"
              min="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_shared"
              checked={formData.is_shared}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_shared: checked as boolean })
              }
            />
            <Label htmlFor="is_shared" className="text-sm">
              Share publicly with the community
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sharing...' : 'Share Milestone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMilestoneDialog;