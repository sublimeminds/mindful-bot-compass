
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, TrendingUp, Clock, Award, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserDashboard = () => {
  const { profile, signOut } = useAuth();
  const { sessions, startSession, loadSessions } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const handleStartSession = async () => {
    await startSession();
    navigate('/chat');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const totalSessions = sessions.length;
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate > oneWeekAgo;
  }).length;

  const averageMood = sessions.length > 0 
    ? sessions
        .filter(s => s.mood.after)
        .reduce((sum, s) => sum + (s.mood.after || 0), 0) / sessions.filter(s => s.mood.after).length
    : 0;

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile.name}</h1>
          <p className="text-muted-foreground">Continue your journey to mental wellness</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleStartSession}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
          >
            Start Session
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {thisWeekSessions} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMood.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">
              Post-session mood rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile.plan}</div>
            <p className="text-xs text-muted-foreground">
              {profile.plan === 'free' ? 'Upgrade for more features' : 'Premium member'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sessions yet. Start your first session!</p>
            ) : (
              <div className="space-y-4">
                {sessions.slice(-5).reverse().map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.techniques.length} techniques used
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {session.endTime 
                          ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
                          : 0
                        } min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleStartSession}>
              <Heart className="h-4 w-4 mr-2" />
              Start New Session
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Progress Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Reminder
            </Button>
            {profile?.plan === 'free' && (
              <Button variant="outline" className="w-full justify-start border-therapy-200 text-therapy-600">
                <Award className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
