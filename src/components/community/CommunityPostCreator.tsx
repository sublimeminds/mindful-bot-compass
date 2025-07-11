import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Mic, 
  Smile, 
  MapPin, 
  Users,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CommunityPostCreatorProps {
  onPostCreated?: () => void;
}

const CommunityPostCreator: React.FC<CommunityPostCreatorProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const postTypes = [
    { value: 'discussion', label: 'Discussion', icon: Users },
    { value: 'milestone', label: 'Milestone', icon: Sparkles },
    { value: 'question', label: 'Question', icon: Users },
    { value: 'resource', label: 'Resource', icon: Users }
  ];

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something to share with the community.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock post creation - in real app, call CommunityService
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
      
      setContent('');
      setPostType('discussion');
      setIsAnonymous(false);
      setIsPrivate(false);
      onPostCreated?.();
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeData = postTypes.find(t => t.value === type);
    return typeData?.icon || Users;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please sign in to create posts and interact with the community.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Share with Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {isAnonymous ? '?' : (user?.user_metadata?.name || user?.email)?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {isAnonymous ? 'Anonymous' : (user?.user_metadata?.name || 'User')}
              </span>
              {isPrivate && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
              {!isPrivate && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Post Type Selection */}
        <div className="space-y-2">
          <Label>Post Type</Label>
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {postTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <IconComponent className="h-4 w-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Content Input */}
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, milestones, or questions with the community..."
            rows={4}
            className="resize-none"
          />
          <div className="text-xs text-gray-500">
            {content.length}/280 characters
          </div>
        </div>

        {/* Media and Location Options */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Camera className="h-4 w-4 mr-2" />
            Photo
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Mic className="h-4 w-4 mr-2" />
            Voice Note
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Smile className="h-4 w-4 mr-2" />
            Mood
          </Button>
          <Button variant="outline" size="sm" disabled>
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </Button>
        </div>

        {/* Privacy Settings */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Post anonymously
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="private" className="text-sm">
                Share privately (only with your groups)
              </Label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !content.trim()}
            className="bg-therapy-600 hover:bg-therapy-700"
          >
            {isLoading ? 'Sharing...' : 'Share Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPostCreator;