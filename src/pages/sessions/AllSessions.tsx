import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Heart, Star, Filter } from 'lucide-react';

const AllSessions = () => {
  const sessions = [
    {
      id: 1,
      date: "2024-01-15",
      time: "09:30 AM",
      duration: "25 min",
      type: "Mindfulness",
      mood: "Calm",
      rating: 4.5,
      status: "completed"
    },
    {
      id: 2,
      date: "2024-01-14",
      time: "02:15 PM", 
      duration: "18 min",
      type: "CBT Session",
      mood: "Anxious",
      rating: 4.0,
      status: "completed"
    },
    {
      id: 3,
      date: "2024-01-13",
      time: "10:00 AM",
      duration: "30 min",
      type: "Breathing",
      mood: "Stressed",
      rating: 4.8,
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">All Sessions</h1>
          <p className="text-muted-foreground">Complete overview of your therapy sessions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Badge variant="outline" className="text-therapy-600">
            <Calendar className="w-4 h-4 mr-1" />
            {sessions.length} Sessions
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">24</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">8.5h</p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">4.4</p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{session.date}</p>
                    <p className="font-medium">{session.time}</p>
                  </div>
                  <div className="border-l pl-4">
                    <h3 className="font-semibold">{session.type}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{session.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Mood</p>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-therapy-500" />
                      <span className="text-sm font-medium">{session.mood}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{session.rating}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllSessions;