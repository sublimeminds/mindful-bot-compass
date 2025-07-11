import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? `${therapistName} removed from your favorites.`
        : `${therapistName} saved to your favorites.`
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
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
          {isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
};

export default SimpleFavoriteButton;