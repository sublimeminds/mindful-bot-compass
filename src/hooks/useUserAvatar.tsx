import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserAvatarProfile {
  id: string;
  user_id: string;
  avatar_name: string;
  appearance_config: any;
  mood_expressions: any;
  animation_preferences: any;
  voice_settings: any;
  current_mood: string;
  mood_history: any;
  customization_level: number;
  unlocked_features: string[];
}

export interface AvatarCustomizationItem {
  id: string;
  name: string;
  category: string;
  item_type: string;
  config_data: any;
  unlock_requirements: any;
  rarity: string;
  xp_cost: number;
  is_premium: boolean;
  preview_url?: string;
  is_equipped?: boolean;
  unlocked_at?: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_value: string;
  mood_intensity: number;
  context_data: any;
  detected_by: string;
  session_id?: string;
  recorded_at: string;
}

export const useUserAvatar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user avatar profile
  const { data: avatarProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-avatar-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_avatar_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching avatar profile:', error);
        throw error;
      }

      return data as UserAvatarProfile;
    },
    enabled: !!user?.id,
  });

  // Get user avatar inventory
  const { data: avatarInventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['user-avatar-inventory', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_avatar_inventory')
        .select(`
          *,
          avatar_customization_items (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching avatar inventory:', error);
        throw error;
      }

      return data?.map(item => ({
        ...(item.avatar_customization_items as any),
        is_equipped: item.is_equipped,
        unlocked_at: item.unlocked_at
      })) as AvatarCustomizationItem[];
    },
    enabled: !!user?.id,
  });

  // Get available customization items
  const { data: availableItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['avatar-customization-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('avatar_customization_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching customization items:', error);
        throw error;
      }

      return data as AvatarCustomizationItem[];
    },
  });

  // Get mood history
  const { data: moodHistory, isLoading: moodLoading } = useQuery({
    queryKey: ['avatar-mood-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('avatar_mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching mood history:', error);
        throw error;
      }

      return data as MoodEntry[];
    },
    enabled: !!user?.id,
  });

  // Create avatar profile mutation
  const createAvatarMutation = useMutation({
    mutationFn: async (config: Partial<UserAvatarProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_avatar_profiles')
        .insert({
          user_id: user.id,
          avatar_name: config.avatar_name || 'My Avatar',
          appearance_config: config.appearance_config || {
            body_type: 'default',
            skin_tone: '#F4C2A1',
            hair_style: 'short',
            hair_color: '#8B4513',
            clothing: {
              top: 'casual_tshirt',
              bottom: 'jeans',
              accessories: []
            }
          },
          mood_expressions: config.mood_expressions || {
            neutral: { eyes: 'normal', mouth: 'slight_smile' },
            happy: { eyes: 'bright', mouth: 'wide_smile' },
            sad: { eyes: 'droopy', mouth: 'frown' },
            excited: { eyes: 'wide', mouth: 'open_smile' },
            calm: { eyes: 'peaceful', mouth: 'soft_smile' }
          },
          animation_preferences: config.animation_preferences || {
            idle_animation: 'gentle_breathing',
            speaking_animation: 'natural_gestures',
            emotion_transitions: 'smooth'
          },
          voice_settings: config.voice_settings || {
            pitch: 0.5,
            speed: 0.5,
            emotion_expression: true
          },
          current_mood: 'neutral',
          customization_level: 1,
          unlocked_features: ['basic_expressions', 'basic_animations']
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar-profile', user?.id] });
      toast({
        title: "🎭 Avatar Created!",
        description: "Your personal avatar has been created successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating avatar:', error);
      toast({
        title: "Error",
        description: "Failed to create avatar. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update avatar mood
  const updateMoodMutation = useMutation({
    mutationFn: async ({ mood, intensity = 0.5, context = {} }: { 
      mood: string; 
      intensity?: number; 
      context?: any 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Update avatar profile mood
      const { error: profileError } = await supabase
        .from('user_avatar_profiles')
        .update({ current_mood: mood })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Record mood entry
      const { data, error } = await supabase
        .from('avatar_mood_entries')
        .insert({
          user_id: user.id,
          mood_value: mood,
          mood_intensity: intensity,
          context_data: context,
          detected_by: 'user_input'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar-profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['avatar-mood-history', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating mood:', error);
    },
  });

  // Customize avatar
  const customizeAvatarMutation = useMutation({
    mutationFn: async (updates: Partial<UserAvatarProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_avatar_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar-profile', user?.id] });
      toast({
        title: "✨ Avatar Updated!",
        description: "Your avatar customization has been saved!",
      });
    },
    onError: (error) => {
      console.error('Error customizing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Unlock customization item
  const unlockItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_avatar_inventory')
        .insert({
          user_id: user.id,
          item_id: itemId,
          is_equipped: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar-inventory', user?.id] });
      toast({
        title: "🎁 Item Unlocked!",
        description: "New customization item added to your inventory!",
      });
    },
    onError: (error) => {
      console.error('Error unlocking item:', error);
      toast({
        title: "Error",
        description: "Failed to unlock item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Equip/unequip item
  const toggleEquipMutation = useMutation({
    mutationFn: async ({ itemId, equip }: { itemId: string; equip: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_avatar_inventory')
        .update({ is_equipped: equip })
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar-inventory', user?.id] });
      toast({
        title: variables.equip ? "✅ Item Equipped!" : "📦 Item Unequipped",
        description: variables.equip ? "Item is now active on your avatar!" : "Item removed from your avatar.",
      });
    },
    onError: (error) => {
      console.error('Error toggling item equipment:', error);
    },
  });

  return {
    // Data
    avatarProfile,
    avatarInventory,
    availableItems,
    moodHistory,
    
    // Loading states
    isLoading: profileLoading || inventoryLoading || itemsLoading || moodLoading,
    
    // Actions
    createAvatar: createAvatarMutation.mutate,
    updateMood: updateMoodMutation.mutate,
    customizeAvatar: customizeAvatarMutation.mutate,
    unlockItem: unlockItemMutation.mutate,
    toggleEquipItem: toggleEquipMutation.mutate,
    
    // Utils
    getMoodEmoji: (mood: string) => {
      const moodEmojis: Record<string, string> = {
        happy: '😊',
        sad: '😢',
        excited: '🤩',
        calm: '😌',
        anxious: '😰',
        angry: '😠',
        neutral: '😐',
        thoughtful: '🤔',
        confident: '😎',
        peaceful: '🧘'
      };
      return moodEmojis[mood] || '😐';
    },
    
    getRarityColor: (rarity: string) => {
      switch (rarity) {
        case 'common': return 'text-gray-600 border-gray-300';
        case 'uncommon': return 'text-green-600 border-green-300';
        case 'rare': return 'text-blue-600 border-blue-300';
        case 'epic': return 'text-purple-600 border-purple-300';
        case 'legendary': return 'text-orange-600 border-orange-300';
        default: return 'text-gray-600 border-gray-300';
      }
    },
    
    getEquippedItems: () => {
      return avatarInventory?.filter(item => item.is_equipped) || [];
    },
    
    hasAvatar: !!avatarProfile
  };
};