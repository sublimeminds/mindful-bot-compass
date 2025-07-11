import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Clock, Users, Target, Zap, Command } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import EnhancedSearch from '@/components/search/EnhancedSearch';

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
  const [showEnhancedSearch, setShowEnhancedSearch] = useState(false);
  const { user } = useAuth();

  // Load real therapy sessions data
  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('therapy_sessions')
          .select('id, type, created_at, updated_at')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(10);

        if (error) throw error;

        const sessionsData = data?.map(session => ({
          id: session.id,
          title: `Therapy Session`,
          date: new Date(session.created_at).toLocaleDateString(),
          duration: 60,
          participants: 1,
          status: 'completed' as 'completed'
        })) || [];

        setSessions(sessionsData);
        setFilteredSessions(sessionsData);
      } catch (error) {
        console.error('Error loading sessions:', error);
        // Fallback to empty array if error
        setSessions([]);
        setFilteredSessions([]);
      }
    };

    loadSessions();
  }, [user]);

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

  // Keyboard shortcut for enhanced search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowEnhancedSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Quick Search</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEnhancedSearch(true)}
              className="flex items-center gap-1"
            >
              <Command className="h-3 w-3" />
              Enhanced Search
            </Button>
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
            placeholder="Search sessions... (Cmd+K for advanced search)"
            value={searchTerm}
            onChange={handleSearch}
            className="pr-10"
            onFocus={() => {
              // Show enhanced search on focus for better UX
              if (!searchTerm) {
                setShowEnhancedSearch(true);
              }
            }}
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
          {filteredSessions.length === 0 && searchTerm ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No sessions found.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEnhancedSearch(true)}
                className="mt-2"
              >
                Try Advanced Search
              </Button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No therapy sessions yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your sessions will appear here once you start therapy.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.date} | {session.duration} minutes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.duration}m
                    </Badge>
                    <Badge variant={session.status === 'completed' ? 'default' : session.status === 'scheduled' ? 'secondary' : 'outline'}>
                      {session.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Enhanced Search Modal */}
    <EnhancedSearch 
      isOpen={showEnhancedSearch} 
      onClose={() => setShowEnhancedSearch(false)} 
    />
    </>
  );
};

export default FunctionalSearch;
