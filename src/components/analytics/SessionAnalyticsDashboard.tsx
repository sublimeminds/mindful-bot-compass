
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Target, Heart } from 'lucide-react';
import { useSessionStats } from '@/hooks/useSessionStats';
import { useSessionHistory } from '@/hooks/useSessionHistory';

const SessionAnalyticsDashboard = () => {
  const { stats, isLoading: statsLoading } = useSessionStats();
  const { sessionSummaries, isLoading: sessionsLoading } = useSessionHistory();

  if (statsLoading || sessionsLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  // Prepare mood trend data
  const moodTrendData = sessionSummaries.slice(0, 10).reverse().map((session, index) => ({
    session: `Session ${index + 1}`,
    moodBefore: session.moodBefore || 0,
    moodAfter: session.moodAfter || 0,
    improvement: (session.moodAfter || 0) - (session.moodBefore || 0)
  }));

  // Calculate session effectiveness with mock rating data
  const effectivenessData = sessionSummaries.slice(0, 10).map((session, index) => ({
    session: `S${index + 1}`,
    rating: Math.floor(Math.random() * 3) + 3, // Mock rating 3-5
    duration: session.duration || 0
  }));

  const averageMoodImprovement = moodTrendData.length > 0 
    ? moodTrendData.reduce((sum, session) => sum + session.improvement, 0) / moodTrendData.length
    : 0;

  const averageRating = effectivenessData.length > 0
    ? effectivenessData.reduce((sum, data) => sum + data.rating, 0) / effectivenessData.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats?.totalSessions || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Mood Improvement</p>
                <p className="text-2xl font-bold">+{averageMoodImprovement.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions This Week</p>
                <p className="text-2xl font-bold">{stats?.weeklyProgress || 0}</p>
              </div>
              <Target className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="moodBefore" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Mood Before"
              />
              <Line 
                type="monotone" 
                dataKey="moodAfter" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Mood After"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Session Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={effectivenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="rating" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionSummaries.slice(0, 5).map((session, index) => (
              <div key={session.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">
                    Session {sessionSummaries.length - index}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                </div>
                
                {session.keyInsights && session.keyInsights.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Insights:</p>
                    {session.keyInsights.slice(0, 2).map((insight, bIndex) => (
                      <p key={bIndex} className="text-sm text-muted-foreground">
                        • {insight}
                      </p>
                    ))}
                  </div>
                )}

                {session.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {session.notes.substring(0, 100)}...
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">Mood Change:</span>
                    <Badge 
                      variant={((session.moodAfter || 0) - (session.moodBefore || 0)) > 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {((session.moodAfter || 0) - (session.moodBefore || 0)) > 0 ? '+' : ''}
                      {((session.moodAfter || 0) - (session.moodBefore || 0)).toFixed(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i}
                        className={`text-xs ${i < effectivenessData[index]?.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Session Consistency</span>
                <span className="text-sm text-muted-foreground">
                  {Math.min(100, ((stats?.weeklyProgress || 0) / 7) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={Math.min(100, ((stats?.weeklyProgress || 0) / 7) * 100)} />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Mood Stability</span>
                <span className="text-sm text-muted-foreground">
                  {Math.max(0, Math.min(100, averageMoodImprovement * 20)).toFixed(0)}%
                </span>
              </div>
              <Progress value={Math.max(0, Math.min(100, averageMoodImprovement * 20))} />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Session Satisfaction</span>
                <span className="text-sm text-muted-foreground">
                  {((averageRating / 5) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={(averageRating / 5) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionAnalyticsDashboard;
