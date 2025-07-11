import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export interface UserSession {
  id: string;
  userId: string;
  sessionType: string;
  startTime: string;
  endTime?: string;
  moodBefore?: number;
  moodAfter?: number;
  completed: boolean;
  durationMinutes: number;
  createdAt: string;
  notes?: string;
  therapistId?: string;
}

export interface UseUserSessionsReturn {
  data: UserSession[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createSession: (sessionData: Partial<UserSession>) => Promise<any>;
  updateSession: (sessionId: string, updates: Partial<UserSession>) => Promise<boolean>;
}

export const useUserSessionsNew = (limit?: number): UseUserSessionsReturn => {
  const { user } = useSimpleApp();
  const [data, setData] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserSessions();
    }
  }, [user?.id, limit]);

  const fetchUserSessions = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: sessionsData, error: sessionsError } = await query;

      if (sessionsError) {
        throw sessionsError;
      }

      const sessions: UserSession[] = (sessionsData || []).map((session: any) => ({
        id: session.id,
        userId: session.user_id,
        sessionType: session.session_type || 'therapy',
        startTime: session.start_time,
        endTime: session.end_time,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        completed: !!session.end_time,
        durationMinutes: session.end_time 
          ? Math.floor((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000)
          : 0,
        createdAt: session.created_at || session.start_time,
        notes: session.notes,
        therapistId: session.therapist_id,
      }));

      setData(sessions);
    } catch (err) {
      console.error('Error fetching user sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      setData([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (sessionData: Partial<UserSession>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionData.sessionType || 'therapy',
          start_time: sessionData.startTime || new Date().toISOString(),
          mood_before: sessionData.moodBefore,
          notes: sessionData.notes,
          therapist_id: sessionData.therapistId,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchUserSessions(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error creating session:', err);
      return null;
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<UserSession>) => {
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({
          end_time: updates.endTime,
          mood_after: updates.moodAfter,
          notes: updates.notes,
        })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchUserSessions(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating session:', err);
      return false;
    }
  };

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchUserSessions,
    createSession,
    updateSession,
  };
};