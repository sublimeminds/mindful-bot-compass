import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GoalInsight {
  id: string;
  user_id: string;
  goal_id?: string;
  insight_type: string;
  title: string;
  description: string;
  confidence_score: number;
  priority: number;
  action_items: string[];
  expires_at?: string;
  viewed_at?: string;
  acted_upon_at?: string;
  created_at: string;
}

export const useGoalInsights = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goalInsights', user?.id],
    queryFn: async (): Promise<GoalInsight[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('goal_insights')
        .select('*')
        .eq('user_id', user.id)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goal insights:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
};