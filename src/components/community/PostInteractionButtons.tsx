import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  Flag
} from 'lucide-react';
import { CommunityService } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostInteractionButtonsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  isLiked: boolean;
  isBookmarked?: boolean;
  onCommentClick?: () => void;
  onLikeChange?: (newCount: number, isLiked: boolean) => void;
}

const PostInteractionButtons: React.FC<PostInteractionButtonsProps> = ({
  postId,
  initialLikes,
  initialComments,
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked = false,
  onCommentClick,
  onLikeChange
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    
    // Optimistic update
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    onLikeChange?.(newLikes, newIsLiked);

    try {
      // In a real app, this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock API call
      
      toast({
        title: newIsLiked ? "Post liked!" : "Like removed",
        description: newIsLiked ? "You liked this post" : "You removed your like",
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikes(newIsLiked ? likes - 1 : likes + 1);
      onLikeChange?.(initialLikes, initialIsLiked);
      
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    const newIsBookmarked = !isBookmarked;
    setIsBookmarked(newIsBookmarked);
    
    toast({
      title: newIsBookmarked ? "Post bookmarked!" : "Bookmark removed",
      description: newIsBookmarked ? "Post saved to your bookmarks" : "Post removed from bookmarks",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Community Post',
          text: 'Check out this post from our community!',
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing or sharing failed
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Post link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share this post",
          variant: "destructive"
        });
      }
    }
  };

  const handleReport = () => {
    toast({
      title: "Post reported",
      description: "Thank you for reporting. We'll review this content.",
    });
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-4">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLoading}
          className={`${isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-700'}`}
        >
          <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {likes}
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCommentClick}
          className="text-gray-600 hover:text-gray-700"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {initialComments}
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-gray-600 hover:text-gray-700"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`${isBookmarked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-gray-700'}`}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleReport}>
              <Flag className="h-4 w-4 mr-2" />
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostInteractionButtons;