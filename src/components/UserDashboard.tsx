
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Calendar, TrendingUp, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { useSessionStats } from "@/hooks/useSessionStats";
import ProgressStats from "./ProgressStats";
import SessionCard from "./SessionCard";
import QuickActions from "./QuickActions";
import { supabase } from '@/integrations/supabase/client';

const UserDashboard = () => {
  const { user } = useAuth();
  const { loadSessions, getSessions } = useSession();
  const { onboardingData } = useOnboardingData();
  const { stats, isLoading: statsLoading } = useSessionStats();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    const fetchRecentSessions = async () => {
      await loadSessions();
      const allSessions = getSessions();
      
      // Transform sessions for SessionCard
      const transformedSessions = allSessions.slice(0, 3).map(session => ({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        messageCount: session.messages.length,
        mood: session.mood,
        techniques: session.techniques,
        notes: session.notes
      }));
      
      setRecentSessions(transformedSessions);
      setIsLoadingSessions(false);
    };

    if (user) {
      fetchRecentSessions();
    }
  }, [user, loadSessions, getSessions]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">
            {onboardingData ? 
              "Continue your journey toward better mental health" : 
              "Let's start your therapy journey"}
          </p>
        </div>

        {/* Progress Stats */}
        {!statsLoading && (
          <ProgressStats stats={stats} />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Sessions</h2>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            {isLoadingSessions ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading sessions...
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first therapy session to begin tracking your progress
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Goals & Preferences */}
            {onboardingData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onboardingData.goals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.goals.map((goal, index) => (
                          <Badge key={index} variant="secondary">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No goals set yet
                      </p>
                    )}
                    
                    {onboardingData.preferences.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Preferred Approaches:</p>
                        <div className="flex flex-wrap gap-2">
                          {onboardingData.preferences.map((pref, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
