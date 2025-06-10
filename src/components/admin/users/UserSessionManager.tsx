
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  MapPin, 
  Smartphone, 
  Monitor, 
  RefreshCw,
  Ban,
  Eye,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSession {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  status: 'active' | 'completed' | 'abandoned';
  device_type: string;
  ip_address?: string;
  user_agent?: string;
  activity_score: number;
}

const UserSessionManager = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      const now = new Date();
      const hours = selectedTimeRange === '24h' ? 24 : selectedTimeRange === '7d' ? 168 : 720;
      const startDate = new Date(now.getTime() - hours * 60 * 60 * 1000);

      // Fetch therapy sessions with user data
      const { data: therapySessions, error } = await supabase
        .from('therapy_sessions')
        .select(`
          id,
          user_id,
          start_time,
          end_time,
          profiles:user_id (
            name,
            email
          )
        `)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: false });

      if (error) throw error;

      // Transform data to match our interface
      const sessionData: UserSession[] = therapySessions?.map(session => ({
        id: session.id,
        user_id: session.user_id,
        user_name: session.profiles?.name || 'Unknown User',
        user_email: session.profiles?.email || '',
        start_time: session.start_time,
        end_time: session.end_time,
        duration_minutes: session.end_time 
          ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
          : Math.round((new Date().getTime() - new Date(session.start_time).getTime()) / (1000 * 60)),
        status: session.end_time ? 'completed' : 'active',
        device_type: 'web', // Default since we don't track this yet
        activity_score: Math.floor(Math.random() * 100), // Simulated for now
      })) || [];

      setSessions(sessionData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error fetching sessions",
        description: "Failed to load user session data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      // End the therapy session
      const { error } = await supabase
        .from('therapy_sessions')
        .update({ end_time: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session terminated",
        description: "User session has been terminated successfully.",
      });

      fetchSessions();
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Failed to terminate session",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'abandoned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageDuration = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / sessions.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Session Management</h2>
          <p className="text-gray-400">Monitor and manage active user sessions</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSessions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-white">{activeSessions.length}</p>
                <p className="text-sm text-gray-400">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">{formatDuration(averageDuration)}</p>
                <p className="text-sm text-gray-400">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-white">{sessions.length}</p>
                <p className="text-sm text-gray-400">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-white">{completedSessions.length}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Activity className="h-5 w-5 mr-2 text-green-400" />
            Active Sessions ({activeSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(session.device_type)}
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{session.user_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {session.user_email}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(session.duration_minutes || 0)}
                        </span>
                        <span>Started: {new Date(session.start_time).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Activity Score</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={session.activity_score} className="w-16 h-2" />
                        <span className="text-xs text-white">{session.activity_score}%</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => terminateSession(session.id)}
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      End
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="h-5 w-5 mr-2 text-blue-400" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent sessions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {completedSessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(session.device_type)}
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-white">{session.user_name}</span>
                      <div className="text-sm text-gray-400">
                        {formatDuration(session.duration_minutes || 0)} • {new Date(session.start_time).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {session.activity_score}% active
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSessionManager;
