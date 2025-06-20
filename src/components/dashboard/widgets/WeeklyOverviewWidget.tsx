
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Circle, Clock } from 'lucide-react';

interface DayActivity {
  day: string;
  date: string;
  hasSession: boolean;
  moodRating?: number;
  isToday: boolean;
}

const WeeklyOverviewWidget = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const weekData: DayActivity[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      hasSession: Math.random() > 0.4, // Mock data
      moodRating: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 7 : undefined,
      isToday: date.toDateString() === today.toDateString()
    };
  });

  const getMoodColor = (rating?: number) => {
    if (!rating) return 'bg-gray-200';
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const completedSessions = weekData.filter(day => day.hasSession).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            This Week
          </CardTitle>
          <Badge variant="outline">
            {completedSessions}/7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium mx-auto mb-1 ${
                    day.isToday 
                      ? 'border-therapy-500 bg-therapy-50 text-therapy-700' 
                      : 'border-gray-200'
                  }`}
                >
                  {day.date}
                </div>
                <div className="flex flex-col items-center space-y-1">
                  {day.hasSession ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Circle className="h-3 w-3 text-gray-300" />
                  )}
                  {day.moodRating && (
                    <div 
                      className={`w-2 h-2 rounded-full ${getMoodColor(day.moodRating)}`}
                      title={`Mood: ${day.moodRating}/10`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Great mood (8-10)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-muted-foreground">Session completed</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverviewWidget;
