
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats } from '@/hooks/useUserStats';
import { useUserSessions } from '@/hooks/useUserSessions';
import { useUserGoals } from '@/hooks/useUserGoals';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Calendar, 
  Plus, 
  BarChart3,
  Heart,
  Flame,
  Clock
} from 'lucide-react';

const RealDashboardContent = () => {
  const { user } = useAuth();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { data: userSessions, isLoading: sessionsLoading } = useUserSessions();
  const { data: userGoals, isLoading: goalsLoading } = useUserGoals();
  const { data: moodEntries, isLoading: moodLoading } = useMoodEntries();

  const activeGoals = userGoals?.filter(goal => goal.status === 'active').length || 0;
  const completedGoals = userGoals?.filter(goal => goal.status === 'completed').length || 0;
  const recentSessions = userSessions?.slice(0, 3) || [];
  const recentMoodEntries = moodEntries?.slice(0, 7) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-therapy-100">
                {userStats?.currentStreak ? 
                  `You're on a ${userStats.currentStreak} day streak! Keep going!` :
                  "Ready to start your wellness journey today?"
                }
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Flame className="h-5 w-5" />
                <span className="text-xl font-bold">{userStats?.currentStreak || 0}</span>
              </div>
              <p className="text-sm text-therapy-100">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-therapy-700">
                  {statsLoading ? '...' : userStats?.totalSessions || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-therapy-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-green-700">
                  {goalsLoading ? '...' : activeGoals}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Mood</p>
                <p className="text-2xl font-bold text-blue-700">
                  {statsLoading ? '...' : (userStats?.averageMood?.toFixed(1) || 'N/A')}
                </p>
              </div>
              <Heart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Minutes</p>
                <p className="text-2xl font-bold text-purple-700">
                  {statsLoading ? '...' : userStats?.totalMinutes || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Sessions</span>
            </CardTitle>
            <Button size="sm" className="bg-therapy-500 hover:bg-therapy-600">
              <Plus className="h-4 w-4 mr-1" />
              New Session
            </Button>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600 mx-auto mb-2"></div>
                Loading sessions...
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{session.sessionType}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{session.durationMinutes} min</p>
                      <p className={`text-xs px-2 py-1 rounded ${
                        session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.completed ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No sessions yet</p>
                <Button className="bg-therapy-500 hover:bg-therapy-600">
                  Start Your First Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Goals Progress</span>
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </CardHeader>
          <CardContent>
            {goalsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600 mx-auto mb-2"></div>
                Loading goals...
              </div>
            ) : userGoals && userGoals.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Completed: {completedGoals}</span>
                  <span>Active: {activeGoals}</span>
                </div>
                <div className="space-y-3">
                  {userGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-gray-600">
                          {goal.currentValue}/{goal.targetValue}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-therapy-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No goals set yet</p>
                <Button variant="outline">
                  Create Your First Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Mood Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {moodLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600 mx-auto mb-2"></div>
              Loading mood data...
            </div>
          ) : recentMoodEntries.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {recentMoodEntries.map((entry, index) => (
                  <div key={entry.id} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      entry.moodScore >= 8 ? 'bg-green-500' :
                      entry.moodScore >= 6 ? 'bg-yellow-500' :
                      entry.moodScore >= 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      {entry.moodScore}
                    </div>
                    <span className="text-xs text-gray-600 mt-1">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-therapy-500 hover:bg-therapy-600">
                Track Today's Mood
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No mood entries yet</p>
              <Button className="bg-therapy-500 hover:bg-therapy-600">
                Track Your First Mood
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealDashboardContent;
