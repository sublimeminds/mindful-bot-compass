import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Heart, Calendar, Award, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProgressOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchMoodData();
      fetchSessionData();
      fetchAchievements();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchMoodData = async () => {
    try {
      const { data } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(30);
      
      const formatted = data?.map(entry => ({
        date: new Date(entry.created_at).toLocaleDateString(),
        mood: entry.overall
      })) || [];
      
      setMoodData(formatted);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

  const fetchSessionData = async () => {
    try {
      const { data } = await supabase
        .from('therapy_sessions')
        .select('start_time, end_time')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true })
        .limit(20);
      
      const formatted = data?.map(session => ({
        date: new Date(session.start_time).toLocaleDateString(),
        duration: session.end_time ? 
          Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60)) : 0,
        type: 'Therapy Session'
      })) || [];
      
      setSessionData(formatted);
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
        .limit(10);
      
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progress Overview</h1>
        <p className="text-gray-600 mt-1">Track your mental health journey and celebrate your achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_minutes || 0} minutes total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.current_streak || 0}</div>
            <p className="text-xs text-muted-foreground">
              Best: {stats?.longest_streak || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Heart className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.average_mood || '--'}</div>
            <p className="text-xs text-muted-foreground">
              Out of 10 scale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">
              Milestones reached
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionData.slice(-10).map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-therapy-600" />
                      <div>
                        <p className="font-medium">{session.type || 'Therapy Session'}</p>
                        <p className="text-sm text-gray-500">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{session.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(achievement.unlocked_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-therapy-50 rounded-lg">
                  <h3 className="font-medium text-therapy-800">Progress Highlights</h3>
                  <p className="text-therapy-700 mt-1">
                    You've maintained a {stats?.current_streak || 0}-day streak! Your consistency is paying off.
                  </p>
                </div>
                
                <div className="p-4 bg-calm-50 rounded-lg">
                  <h3 className="font-medium text-calm-800">Mood Patterns</h3>
                  <p className="text-calm-700 mt-1">
                    Your average mood has been {stats?.average_mood || 'stable'} recently. 
                    Keep focusing on your self-care practices.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800">Recommendations</h3>
                  <p className="text-green-700 mt-1">
                    Based on your progress, consider exploring advanced mindfulness techniques 
                    to further enhance your wellbeing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressOverview;