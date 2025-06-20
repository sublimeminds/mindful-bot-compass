
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { CommunityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';

interface CreateGroupDialogProps {
  onGroupCreated: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ onGroupCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    group_type: 'open',
    max_members: 50
  });
  const { toast } = useToast();

  const categories = [
    'Anxiety Support',
    'Depression Recovery',
    'Addiction Recovery',
    'Grief & Loss',
    'Trauma Recovery',
    'Bipolar Support',
    'PTSD Support',
    'General Mental Health',
    'Young Adults',
    'Parents & Caregivers',
    'LGBTQ+ Support',
    'Workplace Stress',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const group = await CommunityService.createSupportGroup(formData);
      if (group) {
        toast({
          title: "Success",
          description: "Support group created successfully!"
        });
        setOpen(false);
        setFormData({
          name: '',
          description: '',
          category: '',
          group_type: 'open',
          max_members: 50
        });
        onGroupCreated();
      } else {
        throw new Error('Failed to create group');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support group. Please try again.",
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
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Support Group</DialogTitle>
          <DialogDescription>
            Create a new support group to connect with others who share similar experiences.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Anxiety Support Circle"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
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

          <div className="space-y-2">
            <Label htmlFor="group_type">Group Type</Label>
            <Select
              value={formData.group_type}
              onValueChange={(value) => setFormData({ ...formData, group_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open - Anyone can join</SelectItem>
                <SelectItem value="closed">Closed - Invitation only</SelectItem>
                <SelectItem value="moderated">Moderated - Approval required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_members">Maximum Members</Label>
            <Input
              id="max_members"
              type="number"
              min="5"
              max="500"
              value={formData.max_members}
              onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose and guidelines of your support group..."
              rows={3}
            />
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
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
