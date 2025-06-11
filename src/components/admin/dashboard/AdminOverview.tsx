
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageCircle, Target, TrendingUp, Activity, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import SystemMetrics from './SystemMetrics';
import RecentActivity from './RecentActivity';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalGoals: 0,
    activeUsers: 0,
    todaysSessions: 0,
    avgSessionDuration: 0,
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

        // Calculate average session duration
        const { data: completedSessions } = await supabase
          .from('therapy_sessions')
          .select('start_time, end_time')
          .not('end_time', 'is', null)
          .limit(100);

        let avgDuration = 0;
        if (completedSessions && completedSessions.length > 0) {
          const totalDuration = completedSessions.reduce((sum, session) => {
            const duration = new Date(session.end_time!).getTime() - new Date(session.start_time).getTime();
            return sum + duration;
          }, 0);
          avgDuration = Math.round(totalDuration / completedSessions.length / (1000 * 60)); // Convert to minutes
        }

        setStats({
          totalUsers: usersCount || 0,
          totalSessions: sessionsCount || 0,
          totalGoals: goalsCount || 0,
          activeUsers: uniqueActiveUsers,
          todaysSessions: todaysSessionsCount || 0,
          avgSessionDuration: avgDuration,
          systemHealth: 'healthy' // This would be calculated based on various metrics
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+12% from last month'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: MessageCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+8% from last week'
    },
    {
      title: 'Active Goals',
      value: stats.totalGoals,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      change: '+15% from last month'
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      change: '+5% from last week'
    },
    {
      title: "Today's Sessions",
      value: stats.todaysSessions,
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      change: 'vs 42 yesterday'
    },
    {
      title: 'Avg Session Duration',
      value: `${stats.avgSessionDuration}m`,
      icon: MessageCircle,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      change: '+2m from last week'
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
        
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
          {getHealthIcon()}
          <span className="text-sm text-gray-300 capitalize">System {stats.systemHealth}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemMetrics />
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors">
              <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-white">Manage Users</p>
            </button>
            <button className="p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-colors">
              <FileText className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-white">Content Library</p>
            </button>
            <button className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors">
              <BarChart3 className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-white">View Analytics</p>
            </button>
            <button className="p-4 bg-orange-600/20 border border-orange-600/30 rounded-lg hover:bg-orange-600/30 transition-colors">
              <Settings className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-white">System Settings</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
