
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TherapeuticRelationshipRow = Database['public']['Tables']['therapeutic_relationships']['Row'];

interface TherapeuticRelationship extends Omit<TherapeuticRelationshipRow, 'relationship_stage' | 'communication_style_adaptation' | 'comfort_zones' | 'milestone_unlocks'> {
  relationship_stage: string;
  communication_style_adaptation: any;
  comfort_zones: string[];
  milestone_unlocks: string[];
}

export const useTherapeuticRelationship = () => {
  const { user } = useAuth();
  const [relationship, setRelationship] = useState<TherapeuticRelationship | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRelationship = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapeutic_relationships')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        // Transform the data to match our interface
        const transformedData: TherapeuticRelationship = {
          ...data,
          relationship_stage: 'building_rapport',
          communication_style_adaptation: data.communication_preferences,
          comfort_zones: data.effective_techniques || [],
          milestone_unlocks: []
        };
        setRelationship(transformedData);
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
      const { data, error } = await supabase
        .from('therapeutic_relationships')
        .insert({
          user_id: user.id,
          therapeutic_style: 'adaptive',
          communication_preferences: { style: 'supportive', tone: 'warm' },
          boundary_preferences: { strictness: 'moderate' },
          effective_techniques: [],
          ineffective_techniques: [],
          trust_level: 1,
          progress_indicators: { sessions_completed: 0 },
        })
        .select()
        .single();

      if (error) throw error;
      
      const transformedData: TherapeuticRelationship = {
        ...data,
        relationship_stage: 'building_rapport',
        communication_style_adaptation: data.communication_preferences,
        comfort_zones: data.effective_techniques || [],
        milestone_unlocks: []
      };
      setRelationship(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error initializing therapeutic relationship:', error);
      return null;
    }
  };

  const updateRelationship = async (updates: Partial<TherapeuticRelationship>) => {
    if (!user || !relationship) return null;

    try {
      // Transform updates to match database schema
      const dbUpdates: any = {
        ...updates,
        last_interaction: new Date().toISOString(),
      };
      
      // Remove fields that don't exist in database
      delete dbUpdates.relationship_stage;
      delete dbUpdates.communication_style_adaptation;
      delete dbUpdates.comfort_zones;
      delete dbUpdates.milestone_unlocks;

      const { data, error } = await supabase
        .from('therapeutic_relationships')
        .update(dbUpdates)
        .eq('id', relationship.id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedData: TherapeuticRelationship = {
        ...data,
        relationship_stage: relationship.relationship_stage,
        communication_style_adaptation: data.communication_preferences,
        comfort_zones: data.effective_techniques || [],
        milestone_unlocks: relationship.milestone_unlocks
      };
      setRelationship(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error updating therapeutic relationship:', error);
      return null;
    }
  };

  const trackProgress = async (milestone: string) => {
    if (!relationship) return;

    const updatedMilestones = [...relationship.milestone_unlocks, milestone];
    await updateRelationship({
      ...relationship,
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
      ...relationship,
      communication_style_adaptation: adaptedStyle
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
  };
};
