import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Calendar, Activity } from 'lucide-react';

const DailyMoodTracker = () => {
  const moodOptions = [
    { emoji: '😊', label: 'Great', value: 5, color: 'bg-green-100 hover:bg-green-200' },
    { emoji: '🙂', label: 'Good', value: 4, color: 'bg-blue-100 hover:bg-blue-200' },
    { emoji: '😐', label: 'Okay', value: 3, color: 'bg-yellow-100 hover:bg-yellow-200' },
    { emoji: '🙁', label: 'Low', value: 2, color: 'bg-orange-100 hover:bg-orange-200' },
    { emoji: '😢', label: 'Sad', value: 1, color: 'bg-red-100 hover:bg-red-200' }
  ];

  const recentEntries = [
    { date: 'Today', mood: 'Good', value: 4, note: 'Had a productive therapy session' },
    { date: 'Yesterday', mood: 'Great', value: 5, note: 'Felt energized after morning walk' },
    { date: '2 days ago', mood: 'Okay', value: 3, note: 'Stress from work deadlines' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Daily Mood Tracker</h1>
          <p className="text-muted-foreground">Track and monitor your daily emotional wellbeing</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Heart className="w-4 h-4 mr-1" />
          Mood Tracking
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">4.2</p>
            <p className="text-sm text-muted-foreground">Avg Mood This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">+12%</p>
            <p className="text-sm text-muted-foreground">Improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">28</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">156</p>
            <p className="text-sm text-muted-foreground">Total Entries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  className={`p-4 rounded-lg text-center transition-colors ${mood.color}`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <textarea
                placeholder="Add a note about your mood (optional)..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
              />
              <Button className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                Save Mood Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{entry.date}</p>
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      {entry.mood}
                    </Badge>
                    <p className="text-sm text-therapy-600">{entry.value}/5</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Mood Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Sleep Quality', 'Exercise', 'Social Time', 'Work Stress', 'Weather', 'Nutrition', 'Meditation', 'Therapy'].map((factor) => (
              <Button key={factor} variant="outline" size="sm" className="justify-start">
                {factor}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMoodTracker;