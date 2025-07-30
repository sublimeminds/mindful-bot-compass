import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communication_style: string;
  experience_level: string;
  color_scheme: string;
  icon: string;
  education?: string[];
  certifications?: string[];
  therapeutic_techniques?: string[];
  elevenlabs_voice_id?: string;
  voice_characteristics?: any;
  cultural_competencies?: string[];
  languages_spoken?: string[];
  therapy_style_details?: any;
  personality_scores?: any;
  session_approach?: any;
  unique_identifier?: string;
  background_story?: string;
  catchphrase?: string;
  preferred_techniques?: string[];
  avatar_image_url?: string;
  avatar_style?: string;
  effectiveness_areas?: any;
  personality_traits?: any;
  emotional_responses?: any;
  years_experience?: number;
  user_rating?: number;
  total_sessions?: number;
  success_rate?: number;
  therapist_tier?: string;
  is_active?: boolean;
  created_at?: string;
  // Legacy fields from database
  avatar_characteristics?: any;
  avatar_emotions?: any;
}

export const useTherapistDatabase = () => {
  const [therapists, setTherapists] = useState<TherapistPersonality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('therapist_personalities')
          .select('*')
          .eq('is_active', true)
          .order('user_rating', { ascending: false });

        if (error) throw error;
        setTherapists((data as any[]) || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching therapists:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch therapists');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const getTherapistById = async (id: string): Promise<TherapistPersonality | null> => {
    try {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Error fetching therapist by ID:', error);
      return null;
    }
  };

  const getTherapistByIdentifier = async (identifier: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('id', identifier)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching therapist by identifier:', error);
      return null;
    }
  };

  const getTherapistsByCulturalCompetency = async (competency: string): Promise<TherapistPersonality[]> => {
    try {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true)
        .order('user_rating', { ascending: false });

      if (error) throw error;
      return (data as TherapistPersonality[]) || [];
    } catch (error) {
      console.error('Error fetching therapists by cultural competency:', error);
      return [];
    }
  };

  const getTherapistsBySpecialty = async (specialty: string): Promise<TherapistPersonality[]> => {
    try {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .contains('specialties', [specialty])
        .eq('is_active', true)
        .order('user_rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching therapists by specialty:', error);
      return [];
    }
  };

  const getTherapistsByLanguage = async (language: string): Promise<TherapistPersonality[]> => {
    try {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .contains('languages_spoken', [language])
        .eq('is_active', true)
        .order('user_rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching therapists by language:', error);
      return [];
    }
  };

  return {
    therapists,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-trigger the useEffect
      setTherapists([]);
    },
    getTherapistById,
    getTherapistByIdentifier,
    getTherapistsByCulturalCompetency,
    getTherapistsBySpecialty,
    getTherapistsByLanguage
  };
};

// Helper hook for getting a specific therapist
export const useTherapist = (identifier: string) => {
  const [therapist, setTherapist] = useState<TherapistPersonality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapist = async () => {
      if (!identifier) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try by unique_identifier first
        let { data, error } = await supabase
          .from('therapist_personalities')
          .select('*')
          .eq('unique_identifier', identifier)
          .eq('is_active', true)
          .single();

        // If not found, try by ID
        if (error) {
          const { data: dataById, error: errorById } = await supabase
            .from('therapist_personalities')
            .select('*')
            .eq('id', identifier)
            .eq('is_active', true)
            .single();
          
          data = dataById;
          error = errorById;
        }

        if (error) throw error;
        setTherapist(data as any);
        setError(null);
      } catch (err) {
        console.error('Error fetching therapist:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch therapist');
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [identifier]);

  return { therapist, loading, error };
};