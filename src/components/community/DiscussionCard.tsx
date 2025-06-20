
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, User, Clock, Pin } from 'lucide-react';
import { GroupDiscussion } from '@/services/communityService';

interface DiscussionCardProps {
  discussion: GroupDiscussion;
  canInteract: boolean;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion, canInteract }) => {
  const timeAgo = (date: string) => {
    const now = new Date();
    const discussionDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - discussionDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return discussionDate.toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {discussion.is_pinned && (
                <Pin className="h-4 w-4 text-blue-600" />
              )}
              <CardTitle className="text-lg">{discussion.title}</CardTitle>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{discussion.is_anonymous ? 'Anonymous' : 'Member'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timeAgo(discussion.created_at)}</span>
              </div>
            </div>
          </div>
          {discussion.is_pinned && (
            <Badge variant="secondary">Pinned</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {discussion.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{discussion.reply_count || 0} replies</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{discussion.like_count || 0} likes</span>
            </div>
          </div>
          
          {canInteract && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionCard;
