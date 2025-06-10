
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Calendar, Activity, Target, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserDetailsModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal = ({ user, isOpen, onClose }: UserDetailsModalProps) => {
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    totalGoals: 0,
    completedGoals: 0,
    lastSessionDate: null as string | null,
    avgMoodBefore: 0,
    avgMoodAfter: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserStats();
    }
  }, [isOpen, user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Fetch session stats
      const { data: sessions } = await supabase
        .from('therapy_sessions')
        .select('created_at, mood_before, mood_after')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch goal stats
      const { data: goals } = await supabase
        .from('goals')
        .select('is_completed')
        .eq('user_id', user.id);

      const totalSessions = sessions?.length || 0;
      const totalGoals = goals?.length || 0;
      const completedGoals = goals?.filter(g => g.is_completed).length || 0;
      const lastSessionDate = sessions?.[0]?.created_at || null;

      // Calculate average moods
      const validMoodBefore = sessions?.filter(s => s.mood_before !== null) || [];
      const validMoodAfter = sessions?.filter(s => s.mood_after !== null) || [];
      
      const avgMoodBefore = validMoodBefore.length > 0 
        ? validMoodBefore.reduce((sum, s) => sum + s.mood_before, 0) / validMoodBefore.length 
        : 0;
      
      const avgMoodAfter = validMoodAfter.length > 0 
        ? validMoodAfter.reduce((sum, s) => sum + s.mood_after, 0) / validMoodAfter.length 
        : 0;

      setUserStats({
        totalSessions,
        totalGoals,
        completedGoals,
        lastSessionDate,
        avgMoodBefore: Math.round(avgMoodBefore * 10) / 10,
        avgMoodAfter: Math.round(avgMoodAfter * 10) / 10,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-gray-750 border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Plan</label>
                  <Badge variant="secondary">{user.plan || 'free'}</Badge>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Joined</label>
                  <p className="text-white">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Roles</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role: string) => (
                      <Badge key={role} variant="outline">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">user</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-gray-750 border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-gray-400 py-4">
                  Loading statistics...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Total Sessions</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{userStats.totalSessions}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-400">Goals</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {userStats.completedGoals}/{userStats.totalGoals}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Avg Mood Before</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {userStats.avgMoodBefore > 0 ? userStats.avgMoodBefore : 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-gray-400">Avg Mood After</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {userStats.avgMoodAfter > 0 ? userStats.avgMoodAfter : 'N/A'}
                    </p>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Last Session</span>
                    </div>
                    <p className="text-white">
                      {userStats.lastSessionDate 
                        ? formatDistanceToNow(new Date(userStats.lastSessionDate), { addSuffix: true })
                        : 'No sessions yet'
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
