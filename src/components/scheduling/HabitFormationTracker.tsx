
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Target, Zap, CheckCircle, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Habit {
  id: string;
  name: string;
  category: 'mental_health' | 'physical' | 'social' | 'self_care';
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToForm: number; // days
  daysActive: number;
  isActive: boolean;
  lastCompleted?: Date;
}

interface HabitCompletion {
  date: string;
  completed: boolean;
  mood?: number;
  notes?: string;
}

const HabitFormationTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitHistory, setHabitHistory] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    // Mock data
    const mockHabits: Habit[] = [
      {
        id: '1',
        name: 'Daily Mood Check-in',
        category: 'mental_health',
        currentStreak: 12,
        longestStreak: 18,
        completionRate: 87,
        difficulty: 'easy',
        timeToForm: 21,
        daysActive: 45,
        isActive: true,
        lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Evening Meditation',
        category: 'mental_health',
        currentStreak: 7,
        longestStreak: 14,
        completionRate: 73,
        difficulty: 'medium',
        timeToForm: 66,
        daysActive: 28,
        isActive: true
      },
      {
        id: '3',
        name: 'Gratitude Journaling',
        category: 'self_care',
        currentStreak: 0,
        longestStreak: 9,
        completionRate: 45,
        difficulty: 'medium',
        timeToForm: 66,
        daysActive: 35,
        isActive: false,
        lastCompleted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Morning Walk',
        category: 'physical',
        currentStreak: 5,
        longestStreak: 12,
        completionRate: 68,
        difficulty: 'medium',
        timeToForm: 66,
        daysActive: 21,
        isActive: true
      }
    ];
    setHabits(mockHabits);

    // Mock habit history
    const mockHistory: HabitCompletion[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: Math.random() > 0.3,
      mood: Math.floor(Math.random() * 5) + 1
    })).reverse();
    setHabitHistory(mockHistory);
  };

  const completeHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            currentStreak: habit.currentStreak + 1,
            longestStreak: Math.max(habit.longestStreak, habit.currentStreak + 1),
            lastCompleted: new Date(),
            isActive: true
          }
        : habit
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mental_health': return 'bg-purple-100 text-purple-800';
      case 'physical': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'self_care': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHabitFormationProgress = (habit: Habit) => {
    return Math.min(100, (habit.daysActive / habit.timeToForm) * 100);
  };

  const getStreakMotivation = (streak: number) => {
    if (streak >= 21) return { emoji: '🔥', message: 'Habit Formed!' };
    if (streak >= 14) return { emoji: '💪', message: 'Strong Streak!' };
    if (streak >= 7) return { emoji: '⭐', message: 'Great Progress!' };
    if (streak >= 3) return { emoji: '🌱', message: 'Building Momentum!' };
    return { emoji: '🎯', message: 'Getting Started!' };
  };

  const totalActiveHabits = habits.filter(h => h.isActive).length;
  const averageCompletionRate = habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length;
  const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{totalActiveHabits}</div>
            <p className="text-sm text-muted-foreground">Active Habits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{Math.round(averageCompletionRate)}%</div>
            <p className="text-sm text-muted-foreground">Avg Completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{totalStreakDays}</div>
            <p className="text-sm text-muted-foreground">Total Streak Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {habits.filter(h => getHabitFormationProgress(h) >= 100).length}
            </div>
            <p className="text-sm text-muted-foreground">Habits Formed</p>
          </CardContent>
        </Card>
      </div>

      {/* Habit List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Your Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => {
              const formationProgress = getHabitFormationProgress(habit);
              const motivation = getStreakMotivation(habit.currentStreak);
              
              return (
                <div key={habit.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{motivation.emoji}</div>
                      <div>
                        <h3 className="font-medium">{habit.name}</h3>
                        <p className="text-sm text-muted-foreground">{motivation.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(habit.category)}>
                        {habit.category.replace('_', ' ')}
                      </Badge>
                      <span className={`text-sm font-medium ${getDifficultyColor(habit.difficulty)}`}>
                        {habit.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Streak</span>
                      <div className="font-bold text-orange-600">{habit.currentStreak} days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Best Streak</span>
                      <div className="font-bold text-green-600">{habit.longestStreak} days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completion Rate</span>
                      <div className="font-bold text-blue-600">{habit.completionRate}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Days Active</span>
                      <div className="font-bold">{habit.daysActive} days</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Habit Formation Progress</span>
                      <span className="font-medium">{Math.round(formationProgress)}%</span>
                    </div>
                    <Progress value={formationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {formationProgress >= 100 
                        ? 'Habit formed! 🎉' 
                        : `${habit.timeToForm - habit.daysActive} more days to form this habit`
                      }
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      {habit.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {habit.lastCompleted 
                          ? `Last completed: ${habit.lastCompleted.toLocaleDateString()}`
                          : 'Never completed'
                        }
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedHabit(habit)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => completeHabit(habit.id)}
                        disabled={
                          habit.lastCompleted && 
                          new Date(habit.lastCompleted).toDateString() === new Date().toDateString()
                        }
                      >
                        {habit.lastCompleted && 
                         new Date(habit.lastCompleted).toDateString() === new Date().toDateString()
                          ? 'Completed Today' 
                          : 'Complete Now'
                        }
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={habitHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis domain={[0, 1]} tickFormatter={(value) => value ? 'Done' : 'Missed'} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [value ? 'Completed' : 'Missed', 'Status']}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitFormationTracker;
