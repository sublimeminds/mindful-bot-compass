import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Flame, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  weekData: Array<{
    day: string;
    date: number;
    completed: boolean;
    isToday: boolean;
  }>;
  streakType: string;
}

const SAMPLE_STREAK: StreakData = {
  currentStreak: 7,
  bestStreak: 12,
  streakType: 'Daily Check-ins',
  weekData: [
    { day: 'Mon', date: 8, completed: true, isToday: false },
    { day: 'Tue', date: 9, completed: true, isToday: false },
    { day: 'Wed', date: 10, completed: true, isToday: false },
    { day: 'Thu', date: 11, completed: true, isToday: false },
    { day: 'Fri', date: 12, completed: true, isToday: false },
    { day: 'Sat', date: 13, completed: true, isToday: false },
    { day: 'Sun', date: 14, completed: true, isToday: true }
  ]
};

const StreakTrackerWidget = () => {
  const streak = SAMPLE_STREAK;
  const completedDays = streak.weekData.filter(d => d.completed).length;
  const isStreakActive = streak.currentStreak > 0;

  return (
    <Card className="h-full flex flex-col bg-white border border-therapy-100 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-therapy-50 to-calm-50">
        <CardTitle className="text-base font-semibold text-therapy-800 flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Streak Tracker
          </div>
          {isStreakActive && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              <Flame className="h-3 w-3 mr-1" />
              {streak.currentStreak}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 flex-1 space-y-4">
        {/* Current Streak Display */}
        <div className="text-center space-y-2">
          <div className={cn(
            "text-3xl font-bold",
            isStreakActive ? "text-orange-600" : "text-gray-400"
          )}>
            {streak.currentStreak}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              Day{streak.currentStreak !== 1 ? 's' : ''} Strong
            </p>
            <p className="text-xs text-gray-600">
              {streak.streakType}
            </p>
          </div>
          
          {streak.bestStreak > streak.currentStreak && (
            <Badge variant="outline" className="text-xs">
              Best: {streak.bestStreak} days
            </Badge>
          )}
        </div>

        {/* Week Calendar */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            This Week
          </h4>
          
          <div className="grid grid-cols-7 gap-1">
            {streak.weekData.map((day) => (
              <div key={day.day} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {day.day}
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all",
                  day.completed 
                    ? "bg-green-500 border-green-500 text-white" 
                    : day.isToday
                      ? "border-therapy-500 text-therapy-600 bg-therapy-50"
                      : "border-gray-200 text-gray-400",
                  day.isToday && "ring-2 ring-therapy-200"
                )}>
                  {day.completed ? '✓' : day.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-700">
              {completedDays}/7
            </div>
            <div className="text-xs text-green-600">This Week</div>
          </div>
          
          <div className="bg-therapy-50 rounded-lg p-2">
            <div className="text-lg font-bold text-therapy-700">
              {Math.round((completedDays / 7) * 100)}%
            </div>
            <div className="text-xs text-therapy-600">Completion</div>
          </div>
        </div>

        {/* Motivation */}
        {isStreakActive ? (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 text-center">
            <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
            <p className="text-sm font-medium text-orange-800">
              You're on fire! 🔥
            </p>
            <p className="text-xs text-orange-600">
              Keep your streak alive tomorrow!
            </p>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full bg-therapy-600 hover:bg-therapy-700 text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Start New Streak
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakTrackerWidget;