
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, PartyPopper } from 'lucide-react';

export interface Reaction {
  type: 'like' | 'support' | 'celebrate';
  count: number;
  userReacted: boolean;
}

interface DiscussionReactionsProps {
  reactions: Reaction[];
  discussionId?: string;
  onReact?: (type: string) => void;
}

const DiscussionReactions: React.FC<DiscussionReactionsProps> = ({ 
  reactions, 
  discussionId, 
  onReact 
}) => {
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4" />;
      case 'support':
        return <Heart className="h-4 w-4" />;
      case 'celebrate':
        return <PartyPopper className="h-4 w-4" />;
      default:
        return <ThumbsUp className="h-4 w-4" />;
    }
  };

  const handleReaction = (type: string) => {
    if (onReact) {
      onReact(type);
    }
    console.log('Reacting with:', type, 'to discussion:', discussionId);
  };

  return (
    <div className="flex items-center space-x-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.type}
          variant={reaction.userReacted ? "default" : "ghost"}
          size="sm"
          onClick={() => handleReaction(reaction.type)}
          className={`flex items-center space-x-1 text-xs ${
            reaction.userReacted 
              ? 'bg-therapy-100 text-therapy-700 hover:bg-therapy-200' 
              : 'hover:bg-gray-100'
          }`}
        >
          {getReactionIcon(reaction.type)}
          <span>{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
};

export default DiscussionReactions;
