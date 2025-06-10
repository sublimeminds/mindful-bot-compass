
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Users, MessageCircle, Target, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch recent sessions
        const { data: sessions } = await supabase
          .from('therapy_sessions')
          .select(`
            id,
            created_at,
            user_id,
            profiles!therapy_sessions_user_id_fkey(name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent goals
        const { data: goals } = await supabase
          .from('goals')
          .select(`
            id,
            created_at,
            title,
            user_id,
            profiles!goals_user_id_fkey(name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent user registrations
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, created_at, name, email')
          .order('created_at', { ascending: false })
          .limit(5);

        // Combine and format activities
        const allActivities = [
          ...(sessions?.map(session => ({
            id: `session-${session.id}`,
            type: 'session',
            title: 'New therapy session',
            description: `${session.profiles?.name || session.profiles?.email || 'User'} started a session`,
            timestamp: session.created_at,
            icon: MessageCircle,
            color: 'bg-blue-500',
          })) || []),
          ...(goals?.map(goal => ({
            id: `goal-${goal.id}`,
            type: 'goal',
            title: 'New goal created',
            description: `${goal.profiles?.name || goal.profiles?.email || 'User'} created "${goal.title}"`,
            timestamp: goal.created_at,
            icon: Target,
            color: 'bg-purple-500',
          })) || []),
          ...(profiles?.map(profile => ({
            id: `user-${profile.id}`,
            type: 'user',
            title: 'New user registration',
            description: `${profile.name || profile.email} joined the platform`,
            timestamp: profile.created_at,
            icon: Users,
            color: 'bg-green-500',
          })) || []),
        ];

        // Sort by timestamp and take the most recent 10
        const sortedActivities = allActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'session': return 'Session';
      case 'goal': return 'Goal';
      case 'user': return 'User';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-blue-500';
      case 'goal': return 'bg-purple-500';
      case 'user': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Clock className="h-5 w-5 mr-2 text-blue-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-400 py-8">
            Loading recent activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No recent activity found
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/50">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.title}
                    </p>
                    <Badge variant="secondary" className="ml-2">
                      {getTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
