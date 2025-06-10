
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface EngagementData {
  dailyActiveUsers: Array<{ date: string; users: number }>;
  sessionFrequency: Array<{ sessions: string; users: number }>;
  userRetention: Array<{ week: string; retention: number }>;
  featureUsage: Array<{ feature: string; usage: number; color: string }>;
}

const UserEngagementMetrics = () => {
  const [data, setData] = useState<EngagementData>({
    dailyActiveUsers: [],
    sessionFrequency: [],
    userRetention: [],
    featureUsage: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);

      // Get daily active users for last 30 days
      const dailyUsers = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { data: sessions } = await supabase
          .from('therapy_sessions')
          .select('user_id')
          .gte('start_time', date.toISOString())
          .lt('start_time', nextDate.toISOString());

        const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []).size;
        
        dailyUsers.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: uniqueUsers
        });
      }

      // Get session frequency distribution
      const { data: userSessions } = await supabase
        .from('therapy_sessions')
        .select('user_id');

      const sessionCounts = userSessions?.reduce((acc, session) => {
        acc[session.user_id] = (acc[session.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const frequencyBuckets = {
        '1 session': 0,
        '2-5 sessions': 0,
        '6-10 sessions': 0,
        '11-20 sessions': 0,
        '21+ sessions': 0
      };

      Object.values(sessionCounts).forEach(count => {
        if (count === 1) frequencyBuckets['1 session']++;
        else if (count <= 5) frequencyBuckets['2-5 sessions']++;
        else if (count <= 10) frequencyBuckets['6-10 sessions']++;
        else if (count <= 20) frequencyBuckets['11-20 sessions']++;
        else frequencyBuckets['21+ sessions']++;
      });

      const sessionFrequency = Object.entries(frequencyBuckets).map(([sessions, users]) => ({
        sessions,
        users
      }));

      // Mock retention data (in real app, this would be calculated from actual user behavior)
      const userRetention = [
        { week: 'Week 1', retention: 100 },
        { week: 'Week 2', retention: 75 },
        { week: 'Week 3', retention: 60 },
        { week: 'Week 4', retention: 45 },
        { week: 'Week 5', retention: 35 },
        { week: 'Week 6', retention: 30 },
        { week: 'Week 7', retention: 25 },
        { week: 'Week 8', retention: 22 }
      ];

      // Get feature usage data
      const { count: moodEntries } = await supabase
        .from('mood_entries')
        .select('*', { count: 'exact', head: true });

      const { count: goals } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true });

      const { count: notifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

      const featureUsage = [
        { feature: 'Chat Sessions', usage: userSessions?.length || 0, color: '#3b82f6' },
        { feature: 'Mood Tracking', usage: moodEntries || 0, color: '#10b981' },
        { feature: 'Goal Setting', usage: goals || 0, color: '#f59e0b' },
        { feature: 'Notifications', usage: notifications || 0, color: '#ef4444' }
      ];

      setData({
        dailyActiveUsers: dailyUsers,
        sessionFrequency,
        userRetention,
        featureUsage
      });
    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-64 bg-gray-600 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Active Users */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Daily Active Users (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "Active Users",
                color: "#3b82f6",
              },
            }}
            className="h-64"
          >
            <LineChart data={data.dailyActiveUsers}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ fill: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Session Frequency */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Session Frequency Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "Users",
                color: "#10b981",
              },
            }}
            className="h-64"
          >
            <BarChart data={data.sessionFrequency}>
              <XAxis dataKey="sessions" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="users" fill="#10b981" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Retention */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Retention Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              retention: {
                label: "Retention %",
                color: "#f59e0b",
              },
            }}
            className="h-64"
          >
            <LineChart data={data.userRetention}>
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="retention" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Feature Usage */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Feature Usage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              usage: {
                label: "Usage Count",
              },
            }}
            className="h-64"
          >
            <PieChart>
              <Pie
                data={data.featureUsage}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="usage"
                label={({ feature, percent }) => `${feature}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.featureUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserEngagementMetrics;
