import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MessageSquare, Play, Star } from 'lucide-react';

const Sessions = () => {
  const sessions = [
    {
      id: 1,
      therapist: 'Dr. Sarah Chen',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '45 min',
      type: 'Individual Therapy',
      status: 'completed',
      rating: 5,
      notes: 'Discussed anxiety management techniques'
    },
    {
      id: 2,
      therapist: 'Dr. Michael Torres',
      date: '2024-01-10',
      time: '10:00 AM',
      duration: '50 min',
      type: 'Cognitive Behavioral Therapy',
      status: 'completed',
      rating: 4,
      notes: 'Worked on thought patterns and coping strategies'
    },
    {
      id: 3,
      therapist: 'Dr. Emily Williams',
      date: '2024-01-18',
      time: '3:00 PM',
      duration: '45 min',
      type: 'Mindfulness Session',
      status: 'scheduled',
      rating: null,
      notes: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-800">Therapy Sessions</h1>
          <p className="text-slate-600 mt-2">View and manage your therapy session history</p>
        </div>
        <Button className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-therapy-600" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-therapy-600" />
              <div>
                <div className="text-2xl font-bold">18h</div>
                <div className="text-sm text-slate-600">Total Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-therapy-600" />
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-slate-600">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-therapy-600" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-slate-600">Therapists</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-therapy-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-therapy-600" />
                    <div>
                      <div className="font-semibold">{session.therapist}</div>
                      <div className="text-sm text-slate-500">{session.type}</div>
                    </div>
                  </div>
                  {getStatusBadge(session.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  {session.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{session.rating}/5</span>
                    </div>
                  )}
                </div>
                
                {session.notes && (
                  <div className="mt-3 p-3 bg-white rounded-md">
                    <div className="text-sm text-slate-600">{session.notes}</div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-3">
                  {session.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Notes
                    </Button>
                  )}
                  {session.status === 'scheduled' && (
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sessions;