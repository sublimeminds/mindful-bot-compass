
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Calendar, Users, Eye, MoreVertical, Pin, Flag } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GroupDiscussion } from '@/services/communityService';
import DiscussionReactions, { Reaction } from './DiscussionReactions';

interface EnhancedDiscussionCardProps {
  discussion: GroupDiscussion;
  canInteract: boolean;
  canModerate?: boolean;
  onViewDiscussion: (discussion: GroupDiscussion) => void;
}

const EnhancedDiscussionCard: React.FC<EnhancedDiscussionCardProps> = ({ 
  discussion, 
  canInteract, 
  canModerate = false,
  onViewDiscussion 
}) => {
  const [isPinned, setIsPinned] = useState(false);

  // Mock data for demonstration - in real app this would come from API
  const reactions: Reaction[] = [
    { type: 'like', count: 8, userReacted: false },
    { type: 'support', count: 3, userReacted: true },
    { type: 'celebrate', count: 1, userReacted: false }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
    // TODO: Implement actual pin functionality
  };

  const handleFlag = () => {
    // TODO: Implement flag functionality
    console.log('Flagging discussion:', discussion.id);
  };

  const handleReact = (type: string) => {
    console.log('Reacting with:', type, 'to discussion:', discussion.id);
    // TODO: Implement actual reaction functionality
  };

  // Use available properties from GroupDiscussion type
  const authorName = discussion.is_anonymous ? 'Anonymous' : (discussion.created_by || 'Unknown User');
  const isFeatured = false; // This would come from database in real implementation

  return (
    <Card className={`hover:shadow-md transition-shadow ${isPinned ? 'ring-2 ring-therapy-200' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {discussion.is_anonymous ? 'A' : authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg hover:text-therapy-600 cursor-pointer" 
                         onClick={() => onViewDiscussion(discussion)}>
                  {discussion.title}
                </CardTitle>
                {isPinned && <Pin className="h-4 w-4 text-therapy-600" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{authorName}</span>
                <span>•</span>
                <span>{formatTimeAgo(discussion.created_at)}</span>
                {isFeatured && (
                  <>
                    <span>•</span>
                    <Badge variant="secondary" className="text-xs">Featured</Badge>
                  </>
                )}
              </div>
              <CardDescription className="line-clamp-2 cursor-pointer" 
                             onClick={() => onViewDiscussion(discussion)}>
                {discussion.content}
              </CardDescription>
            </div>
          </div>
          
          {canModerate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handlePin}>
                  {isPinned ? 'Unpin' : 'Pin'} Discussion
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFlag}>
                  <Flag className="h-4 w-4 mr-2" />
                  Flag Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{discussion.reply_count || 0} replies</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{Math.floor(Math.random() * 100) + 10} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Last activity {formatTimeAgo(discussion.updated_at || discussion.created_at)}</span>
            </div>
          </div>
          
          {canInteract && (
            <div className="flex items-center space-x-2">
              <DiscussionReactions 
                reactions={reactions} 
                discussionId={discussion.id}
                onReact={handleReact}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDiscussion(discussion)}
              >
                View Discussion
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDiscussionCard;
