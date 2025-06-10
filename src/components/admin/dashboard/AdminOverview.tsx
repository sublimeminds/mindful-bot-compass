
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageCircle, Target, TrendingUp, Activity, Shield } from 'lucide-react';
import SystemMetrics from './SystemMetrics';
import RecentActivity from './RecentActivity';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalGoals: 0,
    activeUsers: 0,
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

        setStats({
          totalUsers: usersCount || 0,
          totalSessions: sessionsCount || 0,
          totalGoals: goalsCount || 0,
          activeUsers: uniqueActiveUsers,
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
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: MessageCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Active Goals',
      value: stats.totalGoals,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your therapy platform</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : stat.value.toLocaleString()}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemMetrics />
        <RecentActivity />
      </div>
    </div>
  );
};

export default AdminOverview;
