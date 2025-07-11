import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export interface MoodEntry {
  id: string;
  userId: string;
  moodScore: number;
  anxiety?: number;
  depression?: number;
  stress?: number;
  energy?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  context?: string;
}

export const useMoodEntries = (limit?: number) => {
  const { user } = useSimpleApp();
  const [data, setData] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchMoodEntries();
    }
  }, [user?.id, limit]);

  const fetchMoodEntries = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('mood_entries' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: moodData, error: moodError } = await query;

      if (moodError) {
        throw moodError;
      }

      const entries: MoodEntry[] = (moodData || []).map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        moodScore: entry.overall || entry.mood_score || 5,
        anxiety: entry.anxiety,
        depression: entry.depression,
        stress: entry.stress,
        energy: entry.energy,
        notes: entry.notes,
        tags: entry.tags || [],
        createdAt: entry.created_at,
        context: entry.context,
      }));

      setData(entries);
    } catch (err) {
      console.error('Error fetching mood entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch mood entries');
      setData([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  const createMoodEntry = async (moodData: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('mood_entries' as any)
        .insert({
          user_id: user.id,
          overall: moodData.moodScore,
          anxiety: moodData.anxiety,
          depression: moodData.depression,
          stress: moodData.stress,
          energy: moodData.energy,
          notes: moodData.notes,
          tags: moodData.tags,
          context: moodData.context,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchMoodEntries(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error creating mood entry:', err);
      return null;
    }
  };

  const updateMoodEntry = async (entryId: string, updates: Partial<MoodEntry>) => {
    try {
      const { error } = await supabase
        .from('mood_entries' as any)
        .update({
          overall: updates.moodScore,
          anxiety: updates.anxiety,
          depression: updates.depression,
          stress: updates.stress,
          energy: updates.energy,
          notes: updates.notes,
          tags: updates.tags,
          context: updates.context,
        })
        .eq('id', entryId);

      if (error) throw error;

      await fetchMoodEntries(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating mood entry:', err);
      return false;
    }
  };

  const deleteMoodEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('mood_entries' as any)
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      await fetchMoodEntries(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting mood entry:', err);
      return false;
    }
  };

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchMoodEntries,
    createMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
  } as const;
};