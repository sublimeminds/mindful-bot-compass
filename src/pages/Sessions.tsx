
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MessageSquare, Brain, Video, Phone, Filter, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';

const Sessions = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useSafeSEO({
    title: 'Session History - TherapySync',
    description: 'View and manage your therapy session history and analytics.',
    keywords: 'therapy sessions, session history, mental health tracking, AI therapy'
  });

  // Mock session data
  const sessions = [
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30',
      duration: 45,
      type: 'AI Chat',
      mood_before: 6,
      mood_after: 8,
      techniques: ['CBT', 'Mindfulness'],
      notes: 'Great session focusing on anxiety management techniques.',
      effectiveness: 9
    },
    {
      id: '2',
      date: '2024-01-12',
      time: '10:00',
      duration: 60,
      type: 'Voice Call',
      mood_before: 4,
      mood_after: 7,
      techniques: ['DBT', 'Breathing'],
      notes: 'Worked on emotional regulation strategies.',
      effectiveness: 8
    },
    {
      id: '3',
      date: '2024-01-10',
      time: '16:15',
      duration: 30,
      type: 'Text Chat',
      mood_before: 7,
      mood_after: 8,
      techniques: ['Solution-Focused'],
      notes: 'Quick check-in and goal setting.',
      effectiveness: 7
    }
  ];

  const sessionStats = {
    totalSessions: 156,
    averageDuration: 48,
    totalHours: 124,
    averageEffectiveness: 8.6,
    mostUsedTechnique: 'CBT',
    longestStreak: 23
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold therapy-text-gradient">Session History</h1>
            <p className="text-slate-600 mt-2">Track your therapy sessions and progress over time</p>
          </div>
          <Button className="therapy-gradient-bg text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold therapy-text-gradient">{sessionStats.totalSessions}</div>
              <div className="text-sm text-slate-600">Total Sessions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold therapy-text-gradient">{sessionStats.totalHours}h</div>
              <div className="text-sm text-slate-600">Total Hours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold therapy-text-gradient">{sessionStats.averageEffectiveness}/10</div>
              <div className="text-sm text-slate-600">Avg Effectiveness</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold therapy-text-gradient">{sessionStats.longestStreak}</div>
              <div className="text-sm text-slate-600">Longest Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="chat">AI Chat</SelectItem>
              <SelectItem value="voice">Voice Call</SelectItem>
              <SelectItem value="video">Video Call</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="effectiveness">Effectiveness</SelectItem>
              <SelectItem value="mood">Mood Improvement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {session.date}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.time} ({session.duration} min)
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {session.type === 'AI Chat' && <MessageSquare className="h-3 w-3 mr-1" />}
                        {session.type === 'Voice Call' && <Phone className="h-3 w-3 mr-1" />}
                        {session.type === 'Video Call' && <Video className="h-3 w-3 mr-1" />}
                        {session.type}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-700 mb-3">{session.notes}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">Mood:</span>
                        <span className="font-medium">{session.mood_before} → {session.mood_after}</span>
                        <Badge className={`text-xs ${
                          session.mood_after > session.mood_before 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.mood_after > session.mood_before ? '+' : ''}{session.mood_after - session.mood_before}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">Techniques:</span>
                        <div className="flex space-x-1">
                          {session.techniques.map((technique) => (
                            <Badge key={technique} variant="secondary" className="text-xs">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold therapy-text-gradient mb-1">
                      {session.effectiveness}/10
                    </div>
                    <div className="text-xs text-slate-600">Effectiveness</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Sessions;
