
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, Sparkles, HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reaction {
  type: 'like' | 'support' | 'celebrate' | 'heart';
  count: number;
  userReacted: boolean;
}

interface DiscussionReactionsProps {
  discussionId: string;
  reactions: Reaction[];
  onReact: (discussionId: string, reactionType: string) => void;
  size?: 'sm' | 'md';
}

const DiscussionReactions: React.FC<DiscussionReactionsProps> = ({
  discussionId,
  reactions,
  onReact,
  size = 'md'
}) => {
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
      case 'support':
        return <HandHeart className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
      case 'celebrate':
        return <Sparkles className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
      case 'heart':
        return <Heart className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
      default:
        return <ThumbsUp className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />;
    }
  };

  const getReactionColor = (type: string, userReacted: boolean) => {
    if (!userReacted) return 'text-gray-600 hover:text-gray-800';
    
    switch (type) {
      case 'like':
        return 'text-blue-600 hover:text-blue-700';
      case 'support':
        return 'text-green-600 hover:text-green-700';
      case 'celebrate':
        return 'text-yellow-600 hover:text-yellow-700';
      case 'heart':
        return 'text-red-600 hover:text-red-700';
      default:
        return 'text-blue-600 hover:text-blue-700';
    }
  };

  return (
    <div className="flex items-center gap-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.type}
          variant="ghost"
          size={size === 'sm' ? 'sm' : 'default'}
          onClick={() => onReact(discussionId, reaction.type)}
          className={cn(
            "flex items-center gap-1 h-auto py-1 px-2",
            getReactionColor(reaction.type, reaction.userReacted),
            reaction.userReacted && "bg-gray-100"
          )}
        >
          {getReactionIcon(reaction.type)}
          <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
            {reaction.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default DiscussionReactions;
