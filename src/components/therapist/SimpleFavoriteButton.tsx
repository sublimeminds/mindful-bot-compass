import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TherapistFavoriteService } from '@/services/therapistFavoriteService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface SimpleFavoriteButtonProps {
  therapistId: string;
  therapistName: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const SimpleFavoriteButton: React.FC<SimpleFavoriteButtonProps> = ({ 
  therapistId, 
  therapistName,
  size = 'default',
  variant = 'outline' 
}) => {
  const { toast } = useToast();
  const { user } = useSimpleApp();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      checkFavoriteStatus();
    }
  }, [user?.id, therapistId]);

  const checkFavoriteStatus = async () => {
    if (!user?.id) return;
    
    try {
      const favorite = await TherapistFavoriteService.isFavorite(user.id, therapistId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user?.id || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const success = await TherapistFavoriteService.toggleFavorite(user.id, therapistId);
      
      if (success) {
        setIsFavorite(!isFavorite);
        toast({
          title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
          description: isFavorite 
            ? `${therapistName} removed from your favorites.`
            : `${therapistName} saved to your favorites.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update favorites. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading || !user?.id}
      className={`
        ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}
        transition-colors duration-200
      `}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''} ${size === 'sm' ? 'h-3 w-3' : ''}`} 
      />
      {size !== 'sm' && (
        <span className="ml-2">
          {isLoading ? '...' : isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
};

export default SimpleFavoriteButton;