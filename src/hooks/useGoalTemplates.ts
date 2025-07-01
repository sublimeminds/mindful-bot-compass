import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_duration_days: number;
  target_value: number;
  unit: string;
  tags: string[];
  icon: string;
  is_featured: boolean;
  usage_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export const useGoalTemplates = () => {
  return useQuery({
    queryKey: ['goalTemplates'],
    queryFn: async (): Promise<GoalTemplate[]> => {
      const { data, error } = await supabase
        .from('goal_templates')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('usage_count', { ascending: false });

      if (error) {
        console.error('Error fetching goal templates:', error);
        throw error;
      }

      return data || [];
    },
  });
};