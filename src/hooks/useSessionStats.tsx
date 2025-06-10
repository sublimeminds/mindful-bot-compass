
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSessionStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['session-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get total sessions
      const { count: totalSessions } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get sessions this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count: weeklyProgress } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgo.toISOString());

      // Get total messages
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('id')
        .eq('user_id', user.id);

      let totalMessages = 0;
      if (sessions) {
        for (const session of sessions) {
          const { count } = await supabase
            .from('session_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id);
          totalMessages += count || 0;
        }
      }

      // Calculate mood improvement
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      let averageMoodImprovement = 0;
      if (moodEntries && moodEntries.length >= 2) {
        const recent = moodEntries.slice(0, 5);
        const older = moodEntries.slice(5, 10);
        const recentAvg = recent.reduce((sum, entry) => sum + entry.overall, 0) / recent.length;
        const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.overall, 0) / older.length : recentAvg;
        averageMoodImprovement = recentAvg - olderAvg;
      }

      return {
        totalSessions: totalSessions || 0,
        totalMessages,
        averageMoodImprovement,
        weeklyProgress: weeklyProgress || 0,
        weeklyGoal: 3 // This could be user configurable
      };
    },
    enabled: !!user?.id,
  });

  return { stats, isLoading };
};
