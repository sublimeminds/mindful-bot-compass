import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Zap, 
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsePieChart, Cell } from 'recharts';
import { UserGoal } from '@/hooks/useUserGoals';

interface GoalAnalyticsProps {
  goals: UserGoal[];
}

const GoalAnalytics = ({ goals }: GoalAnalyticsProps) => {
  // Calculate analytics data
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const overallProgress = totalGoals > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.currentValue / goal.targetValue) * 100, 0) / totalGoals)
    : 0;

  // Category breakdown
  const categoryData = goals.reduce((acc, goal) => {
    const category = goal.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0, progress: 0 };
    }
    acc[category].total += 1;
    if (goal.status === 'completed') acc[category].completed += 1;
    acc[category].progress += (goal.currentValue / goal.targetValue) * 100;
    return acc;
  }, {} as Record<string, { total: number; completed: number; progress: number }>);

  // Convert to chart data
  const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    total: data.total,
    completed: data.completed,
    avgProgress: Math.round(data.progress / data.total),
  }));

  // Progress over time (mock data for demonstration)
  const progressOverTime = [
    { month: 'Jan', progress: 15 },
    { month: 'Feb', progress: 28 },
    { month: 'Mar', progress: 42 },
    { month: 'Apr', progress: 55 },
    { month: 'May', progress: 68 },
    { month: 'Jun', progress: overallProgress },
  ];

  // Difficulty distribution
  const difficultyData = goals.reduce((acc, goal) => {
    const difficulty = goal.difficultyLevel || 'medium';
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const difficultyChartData = Object.entries(difficultyData).map(([difficulty, count]) => ({
    name: difficulty,
    value: count,
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Streak statistics
  const totalStreaks = goals.reduce((sum, goal) => sum + (goal.streakCount || 0), 0);
  const bestStreak = Math.max(...goals.map(g => g.bestStreak || 0), 0);
  const avgMotivation = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + (goal.motivationLevel || 0), 0) / goals.length)
    : 0;

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
        <p className="text-gray-600">
          Create and track goals to see detailed analytics and insights about your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{totalGoals}</p>
                <p className="text-sm opacity-90">Total Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{overallProgress}%</p>
                <p className="text-sm opacity-90">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{bestStreak}</p>
                <p className="text-sm opacity-90">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{avgMotivation}/5</p>
                <p className="text-sm opacity-90">Avg Motivation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-therapy-600" />
            <span>Progress Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#7C3AED" 
                strokeWidth={3}
                dot={{ fill: '#7C3AED', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-therapy-600" />
              <span>Goals by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryChartData.map((item, index) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.completed}/{item.total}
                      </Badge>
                      <span className="text-sm text-gray-600">{item.avgProgress}%</span>
                    </div>
                  </div>
                  <Progress value={item.avgProgress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-therapy-600" />
              <span>Difficulty Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsePieChart>
                <RechartsePieChart data={difficultyChartData}>
                  {difficultyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RechartsePieChart>
                <Tooltip />
              </RechartsePieChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center space-x-4 mt-4">
              {difficultyChartData.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm capitalize">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-therapy-600" />
            <span>Goal Performance Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((completedGoals / totalGoals) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
              <Progress value={(completedGoals / totalGoals) * 100} className="mt-2 h-2" />
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {totalStreaks}
              </div>
              <div className="text-sm text-gray-600">Total Streak Days</div>
              <div className="text-xs text-gray-500 mt-1">
                Best: {bestStreak} days
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-therapy-600 mb-2">
                {activeGoals}
              </div>
              <div className="text-sm text-gray-600">Active Goals</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((activeGoals / totalGoals) * 100)}% of total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalAnalytics;