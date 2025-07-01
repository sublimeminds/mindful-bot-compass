
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MoodEntry {
  id: string;
  moodScore: number;
  energyLevel: number | null;
  anxietyLevel: number | null;
  notes: string | null;
  createdAt: string;
}

export const useMoodEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['moodEntries', user?.id],
    queryFn: async (): Promise<MoodEntry[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mood entries:', error);
        throw error;
      }

      return (data || []).map(entry => ({
        id: entry.id,
        moodScore: entry.overall, // Map from actual field name
        energyLevel: entry.energy, // Map from actual field name
        anxietyLevel: entry.anxiety, // Map from actual field name
        notes: entry.notes,
        createdAt: entry.created_at,
      }));
    },
    enabled: !!user,
  });
};
