import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

// Mock therapeutic relationship interface since table doesn't exist
interface TherapeuticRelationship {
  id: string;
  user_id: string;
  therapeutic_style: string;
  communication_preferences: any;
  boundary_preferences: any;
  effective_techniques: string[];
  ineffective_techniques: string[];
  trust_level: number;
  progress_indicators: any;
  last_interaction: string;
  created_at: string;
  updated_at: string;
  relationship_stage: string;
  communication_style_adaptation: any;
  comfort_zones: string[];
  milestone_unlocks: string[];
}

export const useTherapeuticRelationship = () => {
  const { user } = useAuth();
  const [relationship, setRelationship] = useState<TherapeuticRelationship | null>(null);
  const [loading, setLoading] = useState(false);

  const createMockRelationship = (): TherapeuticRelationship => ({
    id: `rel_${Date.now()}`,
    user_id: user?.id || '',
    therapeutic_style: 'adaptive',
    communication_preferences: { style: 'supportive', tone: 'warm' },
    boundary_preferences: { strictness: 'moderate' },
    effective_techniques: ['active_listening', 'cbt', 'mindfulness'],
    ineffective_techniques: [],
    trust_level: 3,
    progress_indicators: { sessions_completed: 5 },
    last_interaction: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    relationship_stage: 'building_rapport',
    communication_style_adaptation: { style: 'supportive', tone: 'warm' },
    comfort_zones: ['active_listening', 'cbt'],
    milestone_unlocks: ['trust_building', 'goal_setting']
  });

  const fetchRelationship = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Mock implementation - use localStorage or create new
      const stored = localStorage.getItem(`therapeutic_relationship_${user.id}`);
      if (stored) {
        setRelationship(JSON.parse(stored));
      } else {
        const mockRel = createMockRelationship();
        localStorage.setItem(`therapeutic_relationship_${user.id}`, JSON.stringify(mockRel));
        setRelationship(mockRel);
      }
    } catch (error) {
      console.error('Error fetching therapeutic relationship:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeRelationship = async () => {
    if (!user) return null;

    try {
      const mockRel = createMockRelationship();
      localStorage.setItem(`therapeutic_relationship_${user.id}`, JSON.stringify(mockRel));
      setRelationship(mockRel);
      return mockRel;
    } catch (error) {
      console.error('Error initializing therapeutic relationship:', error);
      return null;
    }
  };

  const updateRelationship = async (updates: Partial<TherapeuticRelationship>) => {
    if (!user || !relationship) return null;

    try {
      const updatedRelationship = {
        ...relationship,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(`therapeutic_relationship_${user.id}`, JSON.stringify(updatedRelationship));
      setRelationship(updatedRelationship);
      return updatedRelationship;
    } catch (error) {
      console.error('Error updating therapeutic relationship:', error);
      return null;
    }
  };

  const trackProgress = async (milestone: string) => {
    if (!relationship) return;

    const updatedMilestones = [...relationship.milestone_unlocks, milestone];
    await updateRelationship({
      milestone_unlocks: updatedMilestones
    });
  };

  const adaptCommunicationStyle = async (feedback: any) => {
    if (!relationship) return;

    const adaptedStyle = {
      ...relationship.communication_style_adaptation,
      ...feedback,
      last_adapted: new Date().toISOString()
    };

    await updateRelationship({
      communication_style_adaptation: adaptedStyle
    });
  };

  // Missing methods that were called
  const updateTrustLevel = async (increment: number) => {
    if (!relationship) return;
    
    const newTrustLevel = Math.min(5, Math.max(1, relationship.trust_level + increment));
    await updateRelationship({
      trust_level: newTrustLevel
    });
  };

  const canAccessFeature = (feature: string): boolean => {
    if (!relationship) return false;
    
    const trustLevel = relationship.trust_level;
    
    switch (feature) {
      case 'personal_sharing':
        return trustLevel >= 3;
      case 'deeper_techniques':
        return trustLevel >= 4;
      case 'vulnerable_conversations':
        return trustLevel >= 4;
      default:
        return true;
    }
  };

  const getTherapistPersonalSharing = () => {
    if (!relationship || !canAccessFeature('personal_sharing')) {
      return null;
    }
    
    return {
      enabled: true,
      level: 'moderate',
      topics: ['professional_experience', 'general_insights']
    };
  };

  const getRelationshipBasedResponse = (baseResponse: string): string => {
    if (!relationship) return baseResponse;
    
    const trustLevel = relationship.trust_level;
    const stage = relationship.relationship_stage;
    
    if (stage === 'building_rapport' && trustLevel < 3) {
      return `${baseResponse} I'm here to support you through this.`;
    }
    
    if (trustLevel >= 4) {
      return `${baseResponse} I really appreciate you sharing this with me.`;
    }
    
    return baseResponse;
  };

  const recordInteraction = async () => {
    if (!relationship) return;
    
    await updateRelationship({
      last_interaction: new Date().toISOString(),
      progress_indicators: {
        ...relationship.progress_indicators,
        total_interactions: (relationship.progress_indicators.total_interactions || 0) + 1
      }
    });
  };

  useEffect(() => {
    if (user) {
      fetchRelationship();
    }
  }, [user]);

  return {
    relationship,
    loading,
    fetchRelationship,
    initializeRelationship,
    updateRelationship,
    trackProgress,
    adaptCommunicationStyle,
    updateTrustLevel,
    canAccessFeature,
    getTherapistPersonalSharing,
    getRelationshipBasedResponse,
    recordInteraction,
  };
};