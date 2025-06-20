
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateResourceDialogProps {
  groupId: string;
  onResourceCreated: () => void;
}

const CreateResourceDialog: React.FC<CreateResourceDialogProps> = ({ 
  groupId, 
  onResourceCreated 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article' as 'article' | 'video' | 'worksheet' | 'link' | 'audio',
    url: '',
    file: null as File | null,
    tags: '',
    is_featured: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual resource creation via CommunityService
      console.log('Creating resource:', formData);
      
      toast({
        title: "Success",
        description: "Resource shared successfully!"
      });
      
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        type: 'article',
        url: '',
        file: null,
        tags: '',
        is_featured: false
      });
      onResourceCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-therapy-600 hover:bg-therapy-700">
          <Plus className="h-4 w-4 mr-2" />
          Share Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share a Resource</DialogTitle>
          <DialogDescription>
            Share helpful articles, worksheets, videos, or other resources with your group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Resource Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Anxiety Management Guide, Relaxation Techniques"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this resource is about and how it can help..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Resource Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="link">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'link' ? (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/resource"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept={formData.type === 'video' ? 'video/*' : formData.type === 'audio' ? 'audio/*' : '*/*'}
                  required
                />
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">
                Max file size: 50MB. Supported formats vary by type.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="anxiety, coping-strategies, self-help"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_featured: checked as boolean })
              }
            />
            <Label htmlFor="featured" className="text-sm">
              Mark as featured resource
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
              {loading ? 'Sharing...' : 'Share Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResourceDialog;
