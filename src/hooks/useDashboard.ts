import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { dashboardService } from '@/services/dashboardService';

export const useDashboard = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await dashboardService.getDashboardData(user.id);
      if (error) throw error;
      
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};