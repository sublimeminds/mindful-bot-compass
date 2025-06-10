// ... keep existing code (imports and interface)

import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';

const UserDashboard = () => {
  // ... keep existing code (hooks and state)
  const navigate = useNavigate();

  // ... keep existing code (existing methods)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.user_metadata?.name || 'there'}!</h1>
          <p className="text-muted-foreground">
            {currentSession ? 'You have an active session' : 'Ready to start your mental wellness journey?'}
          </p>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Find Your Therapist</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/therapist-matching')}
              className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
              size="sm"
            >
              Match with AI Therapist
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Start</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/chat')}
              className="w-full"
              size="sm"
              variant={currentSession ? "outline" : "default"}
            >
              {currentSession ? 'Resume Session' : 'Start Session'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Track Mood</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/mood-tracker')}
              className="w-full"
              size="sm"
              variant="outline"
            >
              Log Mood
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Set Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/goals')}
              className="w-full"
              size="sm"
              variant="outline"
            >
              Manage Goals
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              Your therapy journey over the past {recentSessions.length} sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center">
                    <div className="flex items-start justify-between w-full">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Mood Improvement
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Average change: {averageMoodChange > 0 ? '+' : ''}{averageMoodChange.toFixed(1)} points
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last 30 days
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={moodChartData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Before
                                      </span>
                                      <span className="font-bold text-muted-foreground">
                                        {payload[0].value}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        After
                                      </span>
                                      <span className="font-bold">
                                        {payload[1].value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          strokeWidth={2}
                          dataKey="before"
                          activeDot={{
                            r: 6,
                            style: { fill: "var(--theme-primary)", opacity: 0.25 },
                          }}
                          style={
                            {
                              stroke: "var(--theme-primary)",
                              opacity: 0.25,
                            } as React.CSSProperties
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="after"
                          strokeWidth={2}
                          activeDot={{
                            r: 8,
                            style: { fill: "var(--theme-primary)" },
                          }}
                          style={
                            {
                              stroke: "var(--theme-primary)",
                            } as React.CSSProperties
                          }
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Recent Sessions</h4>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/sessions')}>
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recentSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(session.startTime).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.techniques.length > 0 
                              ? `Techniques: ${session.techniques.join(', ')}`
                              : 'No techniques recorded'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {session.mood.before !== undefined && session.mood.after !== undefined && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-muted-foreground">Mood:</span>
                              <span className="text-xs">{session.mood.before}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="text-xs font-medium">{session.mood.after}</span>
                            </div>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/sessions/${session.id}`)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] space-y-3">
                <div className="rounded-full bg-muted p-3">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">No sessions yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start your first therapy session to track your progress
                  </p>
                </div>
                <Button onClick={() => navigate('/chat')}>
                  Start Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>
              Track your progress on personal goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.category} • {formatDate(goal.target_date)}
                        </p>
                      </div>
                      <Badge variant={goal.is_completed ? "default" : "outline"}>
                        {goal.is_completed ? 'Completed' : `${Math.round(goal.current_progress)}%`}
                      </Badge>
                    </div>
                    <Progress value={goal.current_progress} className="h-2" />
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm" onClick={() => navigate('/goals')}>
                  View All Goals
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] space-y-3">
                <div className="rounded-full bg-muted p-3">
                  <Target className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">No goals set</p>
                  <p className="text-sm text-muted-foreground">
                    Create goals to track your progress
                  </p>
                </div>
                <Button onClick={() => navigate('/goals')}>
                  Set Goals
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {insights.totalSessions > 0 
                ? `+${recentSessions.length} in the last 30 days` 
                : 'Start your journey today'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.averageRating > 0 ? insights.averageRating.toFixed(1) : 'N/A'}
            </div>
            <div className="flex items-center">
              {insights.averageRating > 0 && (
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(insights.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.moodTrend > 0 ? `+${insights.moodTrend.toFixed(1)}` : insights.moodTrend.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {insights.moodTrend > 0 
                ? 'Positive improvement' 
                : insights.moodTrend < 0 
                  ? 'Declining trend' 
                  : 'Stable mood'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Breakthroughs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalBreakthroughs}</div>
            <p className="text-xs text-muted-foreground">
              Key insights from your sessions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
