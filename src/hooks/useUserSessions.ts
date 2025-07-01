
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserSession {
  id: string;
  sessionType: string;
  durationMinutes: number;
  moodBefore: number | null;
  moodAfter: number | null;
  notes: string | null;
  completed: boolean;
  createdAt: string;
}

export const useUserSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userSessions', user?.id],
    queryFn: async (): Promise<UserSession[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user sessions:', error);
        throw error;
      }

      return (data || []).map(session => ({
        id: session.id,
        sessionType: 'therapy', // Default type since therapy_sessions doesn't have a type field
        durationMinutes: session.end_time 
          ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
          : 0,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        notes: session.notes,
        completed: !!session.end_time,
        createdAt: session.created_at,
      }));
    },
    enabled: !!user,
  });
};
