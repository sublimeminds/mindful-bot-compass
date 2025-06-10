
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSessionHistory = () => {
  const { user } = useAuth();

  const { data: sessionSummaries = [], isLoading } = useQuery({
    queryKey: ['session-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching session history:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  return { sessionSummaries, isLoading };
};
