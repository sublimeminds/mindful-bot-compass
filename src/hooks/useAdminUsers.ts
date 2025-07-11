import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_session?: string;
  subscription_status: string;
  role: string;
}

export interface ActivityItem {
  id: string;
  type: 'user_action' | 'system_event' | 'admin_action' | 'session' | 'goal' | 'alert';
  title: string;
  description: string;
  user?: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'success' | 'error';
}

export const useAdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get recent user activity
  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      // Get recent audit logs
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select(`
          id,
          action,
          resource,
          created_at,
          user_id,
          profiles(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      // Get recent sessions
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select(`
          id,
          start_time,
          end_time,
          user_id,
          profiles(name, email)
        `)
        .order('start_time', { ascending: false })
        .limit(10);

      // Get recent goals
      const { data: goals } = await supabase
        .from('goals')
        .select(`
          id,
          title,
          created_at,
          user_id,
          profiles(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      const activities: ActivityItem[] = [];

      // Process audit logs
      auditLogs?.forEach(log => {
        activities.push({
          id: log.id,
          type: 'admin_action',
          title: `${log.action} ${log.resource}`,
          description: `Admin performed ${log.action} on ${log.resource}`,
          user: (log.profiles as any)?.name || 'Unknown User',
          timestamp: new Date(log.created_at),
          severity: 'info'
        });
      });

      // Process sessions
      sessions?.forEach(session => {
        if (session.end_time) {
          activities.push({
            id: session.id,
            type: 'session',
            title: 'Therapy Session Completed',
            description: 'User completed therapy session',
            user: (session.profiles as any)?.name || 'Unknown User',
            timestamp: new Date(session.end_time),
            severity: 'success'
          });
        }
      });

      // Process goals
      goals?.forEach(goal => {
        activities.push({
          id: goal.id,
          type: 'goal',
          title: 'Goal Achievement',
          description: `Completed: ${goal.title}`,
          user: (goal.profiles as any)?.name || 'Unknown User',
          timestamp: new Date(goal.created_at),
          severity: 'success'
        });
      });

      return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 15);
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Get user list with pagination
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          name,
          created_at,
          subscription_status,
          user_roles(role)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      return data?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        subscription_status: user.subscription_status || 'active',
        role: (user.user_roles as any)?.[0]?.role || 'user'
      })) || [];
    }
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'super_admin' | 'content_admin' | 'support_admin' | 'analytics_admin' | 'user' }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role, is_active: true });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    recentActivity,
    users,
    isLoadingActivity,
    isLoadingUsers,
    updateUserRole: updateUserRoleMutation.mutate,
    isUpdatingRole: updateUserRoleMutation.isPending
  };
};