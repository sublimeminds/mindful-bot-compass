import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, TrendingUp } from 'lucide-react';
import DetailedMoodTracker from '@/components/mood/DetailedMoodTracker';

const DailyMoodTracker = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Mood Tracker</h1>
          <p className="text-muted-foreground mt-1">Track and understand your emotional patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Mood</p>
                  <p className="text-2xl font-bold text-muted-foreground mt-2">Not logged</p>
                </div>
                <Heart className="h-8 w-8 text-therapy-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Average</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-3xl font-bold">7.2</span>
                    <span className="text-sm text-muted-foreground">/10</span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-calm-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Streak</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-3xl font-bold">7</span>
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-focus-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <DetailedMoodTracker />
      </div>
    </div>
  );
};

export default DailyMoodTracker;