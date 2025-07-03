
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, MessageCircle, TrendingUp } from 'lucide-react';

const SessionHistory = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Mock session history data
  const sessions = [
    {
      id: '1',
      date: '2024-01-15',
      duration: 45,
      type: 'Therapy Chat',
      mood_before: 4,
      mood_after: 7,
      notes: 'Discussed anxiety management techniques',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-13',
      duration: 30,
      type: 'Therapy Chat',
      mood_before: 3,
      mood_after: 6,
      notes: 'Worked on breathing exercises',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-10',
      duration: 40,
      type: 'Therapy Chat',
      mood_before: 5,
      mood_after: 8,
      notes: 'Progress review and goal setting',
      status: 'completed'
    }
  ];

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Please log in to view your session history.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Session History</h1>
        <p className="text-muted-foreground">
          Review your past therapy sessions and track your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{session.type}</CardTitle>
                    <Badge variant="secondary">{session.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.duration}m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{session.mood_before} → {session.mood_after}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notes</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.notes}</p>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSession(session.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Total Sessions</p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Duration</p>
                  <p className="text-2xl font-bold">
                    {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length)}m
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Improvement</p>
                  <p className="text-2xl font-bold">
                    +{Math.round(sessions.reduce((acc, s) => acc + (s.mood_after - s.mood_before), 0) / sessions.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
