import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Users, Clock, Zap } from 'lucide-react';

const LiveSessions = () => {
  const liveSessions = [
    {
      id: 1,
      type: "Group Therapy",
      participants: 8,
      duration: "45 min",
      status: "active",
      therapist: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      type: "Mindfulness",
      participants: 12,
      duration: "30 min", 
      status: "starting",
      therapist: "Dr. Michael Chen"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Live Sessions</h1>
          <p className="text-muted-foreground">Join ongoing therapy sessions in real-time</p>
        </div>
        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
          <Activity className="w-4 h-4 mr-2" />
          Join Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">3</p>
            <p className="text-sm text-muted-foreground">Active Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">47</p>
            <p className="text-sm text-muted-foreground">Participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">2h 15m</p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">92%</p>
            <p className="text-sm text-muted-foreground">Engagement</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {liveSessions.map((session) => (
          <Card key={session.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{session.type}</CardTitle>
                <Badge className={session.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {session.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-therapy-500" />
                  <span className="text-sm">{session.participants} participants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-calm-500" />
                  <span className="text-sm">{session.duration}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Led by {session.therapist}</p>
              <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                Join Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveSessions;