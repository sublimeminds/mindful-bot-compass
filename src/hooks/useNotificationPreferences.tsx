
import { useState, useEffect } from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { NotificationPreferencesService, NotificationPreferences } from '@/services/notificationPreferencesService';
import { useToast } from '@/hooks/use-toast';

export const useNotificationPreferences = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userPreferences = await NotificationPreferencesService.getUserPreferences(user.id);
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Omit<NotificationPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    if (!user || !preferences) return false;

    setIsLoading(true);
    try {
      const success = await NotificationPreferencesService.updatePreferences(user.id, updates);
      
      if (success) {
        // Update local state
        setPreferences(prev => prev ? { ...prev, ...updates } : null);
        toast({
          title: "Preferences Updated",
          description: "Your notification preferences have been saved.",
        });
        return true;
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update notification preferences.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating preferences.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    isLoading,
    updatePreferences,
    refetch: fetchPreferences
  };
};
