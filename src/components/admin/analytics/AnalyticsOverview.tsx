
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  totalMessages: number;
  userGrowthRate: number;
}

const AnalyticsOverview = () => {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    totalMessages: 0,
    userGrowthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      setLoading(true);

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (users with sessions in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activeSessions } = await supabase
        .from('therapy_sessions')
        .select('user_id')
        .gte('start_time', thirtyDaysAgo.toISOString());

      const activeUsers = new Set(activeSessions?.map(s => s.user_id) || []).size;

      // Get total sessions
      const { count: totalSessions } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true });

      // Get session duration data
      const { data: completedSessions } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time')
        .not('end_time', 'is', null);

      const averageSessionDuration = completedSessions?.reduce((acc, session) => {
        const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
        return acc + (duration / (1000 * 60)); // Convert to minutes
      }, 0) / (completedSessions?.length || 1) || 0;

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('session_messages')
        .select('*', { count: 'exact', head: true });

      // Calculate user growth rate (comparing last 30 days to previous 30 days)
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

      const userGrowthRate = previousUsers ? ((recentUsers || 0) - (previousUsers || 0)) / (previousUsers || 1) * 100 : 0;

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers,
        totalSessions: totalSessions || 0,
        averageSessionDuration: Math.round(averageSessionDuration),
        totalMessages: totalMessages || 0,
        userGrowthRate: Math.round(userGrowthRate * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
          <Users className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={stats.userGrowthRate >= 0 ? "default" : "destructive"} className="text-xs">
              {stats.userGrowthRate >= 0 ? '+' : ''}{stats.userGrowthRate}%
            </Badge>
            <p className="text-xs text-gray-400">vs last month</p>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Active Users (30d)</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total users
          </p>
        </CardContent>
      </Card>

      {/* Total Sessions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Sessions</CardTitle>
          <MessageSquare className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalSessions.toLocaleString()}</div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.totalMessages.toLocaleString()} total messages
          </p>
        </CardContent>
      </Card>

      {/* Average Session Duration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Avg Session Duration</CardTitle>
          <Clock className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.averageSessionDuration}m</div>
          <p className="text-xs text-gray-400 mt-2">Average time per session</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
