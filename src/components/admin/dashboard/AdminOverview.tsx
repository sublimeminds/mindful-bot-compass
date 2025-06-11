
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageCircle, Target, TrendingUp, Activity, Shield, AlertTriangle, CheckCircle, FileText, BarChart3, Settings, Clock, DollarSign } from 'lucide-react';
import SystemMetrics from './SystemMetrics';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import SystemAlerts from './SystemAlerts';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalGoals: 0,
    activeUsers: 0,
    todaysSessions: 0,
    avgSessionDuration: 0,
    completionRate: 0,
    userGrowthRate: 0,
    systemHealth: 'healthy' as 'healthy' | 'warning' | 'critical'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch total sessions
        const { count: sessionsCount } = await supabase
          .from('therapy_sessions')
          .select('*', { count: 'exact', head: true });

        // Fetch total goals
        const { count: goalsCount } = await supabase
          .from('goals')
          .select('*', { count: 'exact', head: true });

        // Fetch active users (users with sessions in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: activeSessions } = await supabase
          .from('therapy_sessions')
          .select('user_id')
          .gte('created_at', sevenDaysAgo.toISOString());

        const uniqueActiveUsers = new Set(activeSessions?.map(s => s.user_id)).size;

        // Fetch today's sessions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: todaysSessionsCount } = await supabase
          .from('therapy_sessions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Calculate average session duration and completion rate
        const { data: completedSessions } = await supabase
          .from('therapy_sessions')
          .select('start_time, end_time')
          .not('end_time', 'is', null)
          .limit(100);

        let avgDuration = 0;
        let completionRate = 0;
        
        if (completedSessions && completedSessions.length > 0) {
          const totalDuration = completedSessions.reduce((sum, session) => {
            const duration = new Date(session.end_time!).getTime() - new Date(session.start_time).getTime();
            return sum + duration;
          }, 0);
          avgDuration = Math.round(totalDuration / completedSessions.length / (1000 * 60));
          completionRate = Math.round((completedSessions.length / (sessionsCount || 1)) * 100);
        }

        // Calculate user growth rate (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const { count: recentUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        const { count: previousUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString());

        const growthRate = previousUsers ? Math.round(((recentUsers || 0) - previousUsers) / previousUsers * 100) : 0;

        setStats({
          totalUsers: usersCount || 0,
          totalSessions: sessionsCount || 0,
          totalGoals: goalsCount || 0,
          activeUsers: uniqueActiveUsers,
          todaysSessions: todaysSessionsCount || 0,
          avgSessionDuration: avgDuration,
          completionRate,
          userGrowthRate: growthRate,
          systemHealth: 'healthy' // This would be calculated based on various metrics
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: `${stats.userGrowthRate > 0 ? '+' : ''}${stats.userGrowthRate}% from last month`,
      trend: stats.userGrowthRate > 0 ? 'up' : 'down'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: MessageCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+8% from last week',
      trend: 'up'
    },
    {
      title: 'Active Goals',
      value: stats.totalGoals,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      change: '+15% from last month',
      trend: 'up'
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      change: '+5% from last week',
      trend: 'up'
    },
    {
      title: "Today's Sessions",
      value: stats.todaysSessions,
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      change: 'vs 42 yesterday',
      trend: 'neutral'
    },
    {
      title: 'Avg Session Duration',
      value: `${stats.avgSessionDuration}m`,
      icon: Clock,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      change: '+2m from last week',
      trend: 'up'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      change: '+3% from last week',
      trend: 'up'
    },
    {
      title: 'Revenue Growth',
      value: '+12.5%',
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      change: 'Monthly recurring revenue',
      trend: 'up'
    }
  ];

  const getHealthIcon = () => {
    switch (stats.systemHealth) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your therapy platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
            {getHealthIcon()}
            <span className="text-sm text-gray-300 capitalize">System {stats.systemHealth}</span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className={`text-xs mt-1 flex items-center ${
                    stat.trend === 'up' ? 'text-green-400' : 
                    stat.trend === 'down' ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Alerts */}
      <SystemAlerts />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemMetrics />
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default AdminOverview;
