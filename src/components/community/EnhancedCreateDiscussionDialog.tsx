
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { CommunityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';

interface EnhancedCreateDiscussionDialogProps {
  groupId: string;
  onDiscussionCreated: () => void;
}

const EnhancedCreateDiscussionDialog: React.FC<EnhancedCreateDiscussionDialogProps> = ({ 
  groupId, 
  onDiscussionCreated 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_anonymous: false,
    images: [] as string[]
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const discussion = await CommunityService.createDiscussion({
        group_id: groupId,
        title: formData.title,
        content: formData.content,
        is_anonymous: formData.is_anonymous
      });
      
      if (discussion) {
        toast({
          title: "Success",
          description: "Discussion created successfully!"
        });
        setOpen(false);
        setFormData({
          title: '',
          content: '',
          is_anonymous: false,
          images: []
        });
        onDiscussionCreated();
      } else {
        throw new Error('Failed to create discussion');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
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
          New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or start a conversation with the group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Discussion Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What would you like to discuss?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Share your thoughts, experiences, or questions..."
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use **bold**, *italic*, > quotes, - lists, and [links](url)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Images (optional)</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData({ ...formData, images })}
              maxImages={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_anonymous: checked as boolean })
              }
            />
            <Label htmlFor="anonymous" className="text-sm">
              Post anonymously
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
              {loading ? 'Creating...' : 'Create Discussion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreateDiscussionDialog;
