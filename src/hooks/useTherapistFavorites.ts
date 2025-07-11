import { useState, useEffect } from 'react';
import { TherapistFavoriteService, TherapistFavorite } from '@/services/therapistFavoriteService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export const useTherapistFavorites = () => {
  const { user } = useSimpleApp();
  const [favorites, setFavorites] = useState<TherapistFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const userFavorites = await TherapistFavoriteService.getUserFavorites(user.id);
      setFavorites(userFavorites);
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (therapistId: string) => {
    if (!user?.id) return false;
    
    try {
      const success = await TherapistFavoriteService.toggleFavorite(user.id, therapistId);
      if (success) {
        await loadFavorites(); // Refresh the list
      }
      return success;
    } catch (err) {
      setError('Failed to update favorite');
      console.error('Error toggling favorite:', err);
      return false;
    }
  };

  const isFavorite = (therapistId: string) => {
    return favorites.some(fav => fav.therapist_id === therapistId);
  };

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    refetch: loadFavorites
  };
};