import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Clock, Users, Target, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Session {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: number;
  status: 'active' | 'completed' | 'scheduled';
}

const FunctionalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Mock data for demonstration
    const mockSessions: Session[] = [
      {
        id: '1',
        title: 'Anxiety Management Session',
        date: '2024-01-20',
        duration: 45,
        participants: 2,
        status: 'active',
      },
      {
        id: '2',
        title: 'Depression Support Group',
        date: '2024-01-18',
        duration: 60,
        participants: 5,
        status: 'completed',
      },
      {
        id: '3',
        title: 'Stress Reduction Workshop',
        date: '2024-01-25',
        duration: 90,
        participants: 10,
        status: 'scheduled',
      },
    ];
    setSessions(mockSessions);
    setFilteredSessions(mockSessions);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    const results = sessions.filter((session) =>
      session.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSessions(results);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredSessions(sessions);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Search Sessions</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          {searchTerm && (
            <Button variant="outline" size="sm" onClick={clearSearch}>
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for sessions..."
            value={searchTerm}
            onChange={handleSearch}
            className="pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 space-y-2">
            <Badge variant="secondary">Date: Last 30 days</Badge>
            <Badge variant="secondary">Participants: Any</Badge>
            <Badge variant="secondary">Status: All</Badge>
          </div>
        )}

        <div className="mt-6">
          {filteredSessions.length === 0 ? (
            <p className="text-muted-foreground">No sessions found.</p>
          ) : (
            <ul className="space-y-2">
              {filteredSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.date} | {session.duration} minutes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {session.participants}
                    </Badge>
                    <Badge variant="default">{session.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionalSearch;
