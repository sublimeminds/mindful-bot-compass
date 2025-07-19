import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TherapeuticRelationship {
  id: string;
  therapist_id: string;
  trust_level: number;
  relationship_stage: 'initial' | 'building' | 'established' | 'deep' | 'transitioning';
  communication_style_adaptation: any;
  boundary_preferences: any;
  comfort_zones: any;
  milestone_unlocks: string[];
  last_interaction_at?: string;
}

export const useTherapeuticRelationship = (therapistId: string) => {
  const { user } = useAuth();
  const [relationship, setRelationship] = useState<TherapeuticRelationship | null>(null);
  const [loading, setLoading] = useState(false);

  const initializeRelationship = async () => {
    if (!user || !therapistId) return null;

    try {
      // Check if relationship already exists
      const { data: existing } = await supabase
        .from('therapeutic_relationship')
        .select('*')
        .eq('user_id', user.id)
        .eq('therapist_id', therapistId)
        .single();

      if (existing) {
        setRelationship(existing);
        return existing;
      }

      // Create new relationship
      const { data, error } = await supabase
        .from('therapeutic_relationship')
        .insert({
          user_id: user.id,
          therapist_id: therapistId,
          trust_level: 1,
          relationship_stage: 'initial',
          communication_style_adaptation: {},
          boundary_preferences: {},
          comfort_zones: {},
          milestone_unlocks: [],
          last_interaction_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setRelationship(data);
      return data;
    } catch (error) {
      console.error('Error initializing relationship:', error);
      return null;
    }
  };

  const updateTrustLevel = async (increment: number) => {
    if (!relationship) return;

    const newTrustLevel = Math.max(1, Math.min(10, relationship.trust_level + increment));
    let newStage = relationship.relationship_stage;

    // Update relationship stage based on trust level
    if (newTrustLevel >= 8) newStage = 'deep';
    else if (newTrustLevel >= 6) newStage = 'established';
    else if (newTrustLevel >= 3) newStage = 'building';
    else newStage = 'initial';

    try {
      const { data, error } = await supabase
        .from('therapeutic_relationship')
        .update({
          trust_level: newTrustLevel,
          relationship_stage: newStage,
          last_interaction_at: new Date().toISOString()
        })
        .eq('id', relationship.id)
        .select()
        .single();

      if (error) throw error;
      setRelationship(data);
      
      // Check for milestone unlocks
      checkMilestoneUnlocks(newTrustLevel, newStage);
    } catch (error) {
      console.error('Error updating trust level:', error);
    }
  };

  const checkMilestoneUnlocks = async (trustLevel: number, stage: string) => {
    const newUnlocks: string[] = [];

    if (trustLevel >= 3 && !relationship?.milestone_unlocks.includes('personal_sharing')) {
      newUnlocks.push('personal_sharing');
    }
    if (trustLevel >= 5 && !relationship?.milestone_unlocks.includes('deeper_techniques')) {
      newUnlocks.push('deeper_techniques');
    }
    if (trustLevel >= 7 && !relationship?.milestone_unlocks.includes('vulnerable_conversations')) {
      newUnlocks.push('vulnerable_conversations');
    }
    if (trustLevel >= 9 && !relationship?.milestone_unlocks.includes('life_changing_work')) {
      newUnlocks.push('life_changing_work');
    }

    if (newUnlocks.length > 0 && relationship) {
      try {
        const updatedUnlocks = [...relationship.milestone_unlocks, ...newUnlocks];
        
        await supabase
          .from('therapeutic_relationship')
          .update({ milestone_unlocks: updatedUnlocks })
          .eq('id', relationship.id);

        setRelationship(prev => prev ? {
          ...prev,
          milestone_unlocks: updatedUnlocks
        } : null);
      } catch (error) {
        console.error('Error updating milestone unlocks:', error);
      }
    }
  };

  const getRelationshipBasedResponse = (baseResponse: string) => {
    if (!relationship) return baseResponse;

    let adaptedResponse = baseResponse;

    switch (relationship.relationship_stage) {
      case 'initial':
        adaptedResponse = `${adaptedResponse} I want you to know that this is a safe space for you.`;
        break;
      case 'building':
        adaptedResponse = `${adaptedResponse} I'm glad we're getting to know each other better.`;
        break;
      case 'established':
        adaptedResponse = `${adaptedResponse} I appreciate the trust you've shown in our work together.`;
        break;
      case 'deep':
        adaptedResponse = `${adaptedResponse} Our connection allows us to explore these deeper aspects of your experience.`;
        break;
    }

    return adaptedResponse;
  };

  const canAccessFeature = (feature: string) => {
    if (!relationship) return false;
    return relationship.milestone_unlocks.includes(feature);
  };

  const getTherapistPersonalSharing = () => {
    if (!canAccessFeature('personal_sharing')) return null;

    const sharings = [
      "I've found in my own journey that vulnerability often leads to the greatest breakthroughs.",
      "I remember when I first learned this technique - it was transformative for me too.",
      "This reminds me of something I struggled with early in my career...",
      "I've seen this pattern in my own life as well, and here's what helped me..."
    ];

    return sharings[Math.floor(Math.random() * sharings.length)];
  };

  const recordInteraction = async () => {
    if (!relationship) return;

    try {
      await supabase
        .from('therapeutic_relationship')
        .update({ last_interaction_at: new Date().toISOString() })
        .eq('id', relationship.id);
    } catch (error) {
      console.error('Error recording interaction:', error);
    }
  };

  useEffect(() => {
    if (user && therapistId) {
      initializeRelationship();
    }
  }, [user, therapistId]);

  return {
    relationship,
    loading,
    initializeRelationship,
    updateTrustLevel,
    getRelationshipBasedResponse,
    canAccessFeature,
    getTherapistPersonalSharing,
    recordInteraction
  };
};