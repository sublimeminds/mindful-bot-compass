import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, ArrowRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { format } from 'date-fns';

const SessionHistoryWidget = () => {
  const navigate = useNavigate();
  const { user } = useSimpleApp();

  const { data: recentSessions = [], isLoading } = useQuery({
    queryKey: ['recent-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          session_messages (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent sessions:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: sessionStats } = useQuery({
    queryKey: ['session-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { count: totalSessions } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { data: thisWeekSessions } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      return {
        total: totalSessions || 0,
        thisWeek: thisWeekSessions?.length || 0
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading session history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-therapy-600" />
            Session History
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/session-history')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        {sessionStats && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-therapy-50 rounded-lg">
              <div className="text-2xl font-bold text-therapy-700">{sessionStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center p-3 bg-calm-50 rounded-lg">
              <div className="text-2xl font-bold text-calm-700">{sessionStats.thisWeek}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Sessions</h4>
            {recentSessions.map((session) => {
              const duration = session.end_time 
                ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
                : null;
              
              return (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {format(new Date(session.start_time), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      {duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{duration} min</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{session.session_messages?.[0]?.count || 0} messages</span>
                      </div>
                      {session.mood_before && session.mood_after && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>+{session.mood_after - session.mood_before}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(session.start_time), 'h:mm a')}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No sessions yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chat')}
            >
              Start Your First Session
            </Button>
          </div>
        )}

        {/* Action Button */}
        {recentSessions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/session-history')}
            className="w-full"
          >
            View All Sessions
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionHistoryWidget;
