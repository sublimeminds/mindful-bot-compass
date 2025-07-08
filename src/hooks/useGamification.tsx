import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserExperience {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  weekly_xp: number;
  monthly_xp: number;
  xp_sources: any;
  level_rewards_claimed: any;
}

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  xp_reward: number;
  requirements: Record<string, any>;
  unlock_criteria: Record<string, any>;
  earned_at?: string;
  progress_data?: Record<string, any>;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  unlock_requirements: Record<string, any>;
  xp_value: number;
  difficulty_level: string;
  tags: string[];
  is_premium: boolean;
  unlocked_at?: string;
  mastery_level?: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user experience data
  const { data: userXP, isLoading: xpLoading } = useQuery({
    queryKey: ['user-experience', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_experience')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user XP:', error);
        throw error;
      }

      return data as UserExperience;
    },
    enabled: !!user?.id,
  });

  // Get user achievements
  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_badge_achievements')
        .select(`
          *,
          achievement_badges (*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        throw error;
      }

      return data?.map(item => ({
        ...(item.achievement_badges as any),
        earned_at: item.earned_at,
        progress_data: item.progress_data
      })) as Achievement[];
    },
    enabled: !!user?.id,
  });

  // Get available badges
  const { data: availableBadges, isLoading: badgesLoading } = useQuery({
    queryKey: ['available-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_badges')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching badges:', error);
        throw error;
      }

      return data as Achievement[];
    },
  });

  // Get user knowledge
  const { data: userKnowledge, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['user-knowledge', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_knowledge_progress')
        .select(`
          *,
          knowledge_items (*)
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching user knowledge:', error);
        throw error;
      }

      return data?.map(item => ({
        ...(item.knowledge_items as any),
        unlocked_at: item.unlocked_at,
        mastery_level: item.mastery_level,
        last_reviewed_at: item.last_reviewed_at,
        review_count: item.review_count
      })) as KnowledgeItem[];
    },
    enabled: !!user?.id,
  });

  // Award XP mutation
  const awardXPMutation = useMutation({
    mutationFn: async ({ amount, source }: { amount: number; source: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get current XP or create new record
      let currentXP = userXP;
      if (!currentXP) {
        const { data: newXP, error: createError } = await supabase
          .from('user_experience')
          .insert({
            user_id: user.id,
            total_xp: 0,
            current_level: 1,
            xp_to_next_level: 100,
            weekly_xp: 0,
            monthly_xp: 0,
            xp_sources: {},
            level_rewards_claimed: {}
          })
          .select()
          .single();

        if (createError) throw createError;
        currentXP = newXP;
      }

      const newTotalXP = currentXP.total_xp + amount;
      const newWeeklyXP = currentXP.weekly_xp + amount;
      const newMonthlyXP = currentXP.monthly_xp + amount;

      // Calculate new level
      let newLevel = currentXP.current_level;
      let xpForNextLevel = currentXP.xp_to_next_level;
      
      // Level calculation: Level 1 = 100 XP, Level 2 = 250 XP, etc.
      while (newTotalXP >= (newLevel * 150)) {
        newLevel++;
        xpForNextLevel = (newLevel * 150) - newTotalXP;
      }

      // Update XP sources
      const updatedSources = { ...currentXP.xp_sources };
      updatedSources[source] = (updatedSources[source] || 0) + amount;

      const { data, error } = await supabase
        .from('user_experience')
        .update({
          total_xp: newTotalXP,
          current_level: newLevel,
          xp_to_next_level: Math.max(0, xpForNextLevel),
          weekly_xp: newWeeklyXP,
          monthly_xp: newMonthlyXP,
          xp_sources: updatedSources
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Check if user leveled up
      if (newLevel > currentXP.current_level) {
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You've reached level ${newLevel}!`,
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-experience', user?.id] });
      checkForNewAchievements();
    },
    onError: (error) => {
      console.error('Error awarding XP:', error);
      toast({
        title: "Error",
        description: "Failed to award XP. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check for new achievements
  const checkForNewAchievements = useCallback(async () => {
    if (!user?.id || !availableBadges || !userXP) return;

    for (const badge of availableBadges) {
      // Check if user already has this badge
      const alreadyEarned = userAchievements?.some(a => a.id === badge.id);
      if (alreadyEarned) continue;

      // Check if requirements are met
      const meetsRequirements = await checkBadgeRequirements(badge, userXP);
      if (meetsRequirements) {
        await awardBadge(badge.id);
      }
    }
  }, [user?.id, availableBadges, userXP, userAchievements]);

  // Check badge requirements
  const checkBadgeRequirements = async (badge: Achievement, userXP: UserExperience): Promise<boolean> => {
    // This is a simplified check - in a real app, you'd have more complex logic
    const { requirements } = badge;
    
    if (requirements.level && userXP.current_level < requirements.level) {
      return false;
    }

    if (requirements.xp && userXP.total_xp < requirements.xp) {
      return false;
    }

    // Add more requirement checks here based on your needs
    return true;
  };

  // Award badge
  const awardBadge = async (badgeId: string) => {
    if (!user?.id) return;

    try {
      const badge = availableBadges?.find(b => b.id === badgeId);
      if (!badge) return;

      const { error } = await supabase
        .from('user_badge_achievements')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
          xp_earned: badge.xp_reward
        });

      if (error) throw error;

      // Award XP for the badge
      await awardXPMutation.mutateAsync({
        amount: badge.xp_reward,
        source: `badge_${badge.name}`
      });

      toast({
        title: "🏆 Achievement Unlocked!",
        description: `You earned the "${badge.title}" badge!`,
      });

      queryClient.invalidateQueries({ queryKey: ['user-achievements', user.id] });
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  // Unlock knowledge item
  const unlockKnowledgeMutation = useMutation({
    mutationFn: async (knowledgeItemId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_knowledge_progress')
        .insert({
          user_id: user.id,
          knowledge_item_id: knowledgeItemId,
          mastery_level: 1
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Award base XP for unlocking knowledge
      awardXPMutation.mutate({
        amount: 10,
        source: 'knowledge_unlock'
      });

      toast({
        title: "📚 Knowledge Unlocked!",
        description: "You've unlocked a new knowledge item!",
      });
      
      queryClient.invalidateQueries({ queryKey: ['user-knowledge', user?.id] });
    },
    onError: (error) => {
      console.error('Error unlocking knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to unlock knowledge item.",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    userXP,
    userAchievements,
    availableBadges,
    userKnowledge,
    
    // Loading states
    isLoading: xpLoading || achievementsLoading || badgesLoading || knowledgeLoading,
    
    // Actions
    awardXP: awardXPMutation.mutate,
    unlockKnowledge: unlockKnowledgeMutation.mutate,
    checkForNewAchievements,
    
    // Utils
    getXPProgress: () => {
      if (!userXP) return { percentage: 0, current: 0, needed: 100 };
      const currentLevelXP = userXP.total_xp - ((userXP.current_level - 1) * 150);
      const neededForLevel = userXP.current_level * 150 - ((userXP.current_level - 1) * 150);
      return {
        percentage: (currentLevelXP / neededForLevel) * 100,
        current: currentLevelXP,
        needed: neededForLevel
      };
    },
    
    getRarityColor: (rarity: string) => {
      switch (rarity) {
        case 'common': return 'text-gray-600';
        case 'uncommon': return 'text-green-600';
        case 'rare': return 'text-blue-600';
        case 'epic': return 'text-purple-600';
        case 'legendary': return 'text-orange-600';
        default: return 'text-gray-600';
      }
    }
  };
};