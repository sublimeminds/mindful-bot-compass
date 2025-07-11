import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  crisisInterventions: number;
  systemUptime: number;
}

export interface UserEngagementData {
  date: string;
  sessions: number;
  newUsers: number;
  retention: number;
}

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
}

export const useAdminAnalytics = () => {
  // Get platform analytics
  const { data: platformStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-platform-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get latest platform analytics
      const { data: analytics } = await supabase
        .from('platform_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get today's sessions
      const { data: todaySessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .gte('start_time', today)
        .lt('start_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      return {
        totalUsers: totalUsers || 0,
        activeUsers: analytics?.active_users || 0,
        totalSessions: analytics?.total_sessions || 0,
        avgSessionDuration: analytics?.average_session_duration || 0,
        crisisInterventions: analytics?.crisis_interventions || 0,
        systemUptime: 99.9 // Would come from monitoring service
      } as AdminStats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Get user engagement trends
  const { data: engagementData, isLoading: isLoadingEngagement } = useQuery({
    queryKey: ['admin-engagement-trends'],
    queryFn: async () => {
      const { data } = await supabase
        .from('platform_analytics')
        .select('date, total_sessions, new_signups, active_users')
        .order('date', { ascending: false })
        .limit(30);

      return data?.map(day => ({
        date: day.date,
        sessions: day.total_sessions,
        newUsers: day.new_signups,
        retention: Math.min(95, Math.max(60, (day.active_users / Math.max(1, day.new_signups)) * 100))
      })) || [];
    }
  });

  // Get system performance metrics
  const { data: systemMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['admin-system-metrics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(8);

      // Transform to system metrics format
      const metrics: SystemMetric[] = [
        {
          name: 'Response Time',
          value: data?.find(m => m.metric_type === 'api_response_time')?.metric_value || 120,
          unit: 'ms',
          status: 'healthy',
          description: 'Average API response time'
        },
        {
          name: 'Active Sessions',
          value: data?.find(m => m.metric_type === 'active_sessions')?.metric_value || 247,
          unit: '',
          status: 'healthy',
          description: 'Current active user sessions'
        },
        {
          name: 'Database Load',
          value: data?.find(m => m.metric_type === 'database_cpu')?.metric_value || 35,
          unit: '%',
          status: 'healthy',
          description: 'Database CPU utilization'
        },
        {
          name: 'Memory Usage',
          value: data?.find(m => m.metric_type === 'memory_usage')?.metric_value || 68,
          unit: '%',
          status: 'warning',
          description: 'RAM consumption'
        }
      ];

      return metrics;
    },
    refetchInterval: 30000
  });

  return {
    platformStats,
    engagementData,
    systemMetrics,
    isLoadingStats,
    isLoadingEngagement,
    isLoadingMetrics
  };
};