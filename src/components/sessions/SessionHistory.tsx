
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Video, Phone, MessageSquare, Search, Filter, Star, BarChart3 } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  therapist: string;
  notes: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  rating?: number;
  summary?: string;
}

const SessionHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Load sessions from localStorage and add some demo data
    const storedSessions = JSON.parse(localStorage.getItem('scheduledSessions') || '[]');
    const demoSessions: Session[] = [
      {
        id: '1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00',
        type: 'individual',
        duration: 60,
        therapist: 'Dr. Sarah Smith',
        notes: 'Discussed anxiety management techniques',
        status: 'completed',
        rating: 5,
        summary: 'Great progress on breathing exercises. Homework: Practice daily mindfulness for 10 minutes.'
      },
      {
        id: '2',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: '14:30',
        type: 'video',
        duration: 45,
        therapist: 'Dr. Michael Jones',
        notes: 'Family relationship discussion',
        status: 'completed',
        rating: 4,
        summary: 'Explored communication patterns. Next session: Role-playing exercises.'
      },
      {
        id: '3',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        time: '16:00',
        type: 'group',
        duration: 90,
        therapist: 'Dr. Emily Brown',
        notes: 'Group therapy session on coping strategies',
        status: 'completed',
        rating: 5,
        summary: 'Valuable peer support and shared experiences. Continue with group sessions.'
      }
    ];

    const allSessions = [...demoSessions, ...storedSessions];
    setSessions(allSessions);
    setFilteredSessions(allSessions);
  }, []);

  useEffect(() => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.therapist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(session => session.type === typeFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter, typeFilter]);

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return User;
      case 'group': return MessageSquare;
      case 'video': return Video;
      case 'phone': return Phone;
      default: return User;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-therapy-600">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Completed Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => s.status === 'scheduled').length}
            </div>
            <p className="text-sm text-gray-600">Upcoming Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.rating).reduce((acc, s) => acc + (s.rating || 0), 0) / sessions.filter(s => s.rating).length || 0}
            </div>
            <p className="text-sm text-gray-600">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sessions.reduce((acc, s) => acc + s.duration, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No sessions found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => {
            const IconComponent = getSessionTypeIcon(session.type);
            return (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-therapy-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-therapy-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold capitalize">{session.type} Session</h3>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{session.time} ({session.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-2 md:col-span-2">
                            <User className="h-4 w-4" />
                            <span>{session.therapist}</span>
                          </div>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Notes:</strong> {session.notes}
                          </p>
                        )}
                        {session.summary && (
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Summary:</strong> {session.summary}
                          </p>
                        )}
                        {session.rating && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Rating:</span>
                            <div className="flex">{renderStars(session.rating)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {session.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
