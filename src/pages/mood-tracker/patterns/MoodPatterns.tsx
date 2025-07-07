import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Brain } from 'lucide-react';

const MoodPatterns = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mood Patterns</h1>
          <p className="text-muted-foreground mt-1">Understand your emotional rhythms and cycles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Weekly mood analysis will be displayed here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Daily Rhythm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Daily patterns and circadian insights.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Emotional Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your emotional profile and characteristics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodPatterns;