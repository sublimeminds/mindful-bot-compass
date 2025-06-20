
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock, Pin, MoreHorizontal, Flag, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GroupDiscussion } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import DiscussionReactions from './DiscussionReactions';

interface EnhancedDiscussionCardProps {
  discussion: GroupDiscussion;
  canInteract: boolean;
  canModerate?: boolean;
  onViewDiscussion?: (discussion: GroupDiscussion) => void;
}

const EnhancedDiscussionCard: React.FC<EnhancedDiscussionCardProps> = ({ 
  discussion, 
  canInteract, 
  canModerate = false,
  onViewDiscussion 
}) => {
  const [reactions, setReactions] = useState([
    { type: 'like', count: discussion.like_count || 0, userReacted: false },
    { type: 'support', count: 2, userReacted: false },
    { type: 'celebrate', count: 1, userReacted: false },
    { type: 'heart', count: 3, userReacted: false }
  ]);
  const { toast } = useToast();

  const timeAgo = (date: string) => {
    const now = new Date();
    const discussionDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - discussionDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return discussionDate.toLocaleDateString();
  };

  const renderContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-3 text-gray-600 italic">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const handleReaction = (discussionId: string, reactionType: string) => {
    if (!canInteract) return;

    setReactions(prev => prev.map(reaction => {
      if (reaction.type === reactionType) {
        return {
          ...reaction,
          count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
          userReacted: !reaction.userReacted
        };
      }
      return reaction;
    }));

    toast({
      title: "Reaction added",
      description: "Your reaction has been recorded."
    });
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for reporting this content. Our moderators will review it."
    });
  };

  const handlePin = () => {
    toast({
      title: discussion.is_pinned ? "Discussion unpinned" : "Discussion pinned",
      description: discussion.is_pinned ? "Discussion removed from pinned posts" : "Discussion pinned to top of group"
    });
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
              <CardTitle className="text-lg cursor-pointer hover:text-blue-600" 
                        onClick={() => onViewDiscussion?.(discussion)}>
                {discussion.title}
              </CardTitle>
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
          <div className="flex items-center gap-2">
            {discussion.is_pinned && (
              <Badge variant="secondary">Pinned</Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDiscussion?.(discussion)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Discussion
                </DropdownMenuItem>
                {canModerate && (
                  <DropdownMenuItem onClick={handlePin}>
                    <Pin className="h-4 w-4 mr-2" />
                    {discussion.is_pinned ? 'Unpin' : 'Pin'} Discussion
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="text-gray-700 mb-4 line-clamp-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderContent(discussion.content) }}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{discussion.reply_count || 0} replies</span>
            </div>
          </div>
          
          {canInteract && (
            <DiscussionReactions
              discussionId={discussion.id}
              reactions={reactions}
              onReact={handleReaction}
              size="sm"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDiscussionCard;
