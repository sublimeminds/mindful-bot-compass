
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter, Calendar, MessageCircle, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { format, startOfWeek, startOfMonth, isAfter, isBefore } from "date-fns";

const SessionHistory = () => {
  const navigate = useNavigate();
  const { getSessions, loadSessions } = useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      await loadSessions();
      const allSessions = getSessions();
      setSessions(allSessions);
      setFilteredSessions(allSessions);
      setIsLoading(false);
    };
    
    fetchSessions();
  }, [loadSessions, getSessions]);

  useEffect(() => {
    let filtered = [...sessions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.techniques.some((tech: string) => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply period filter
    const now = new Date();
    if (filterPeriod === 'week') {
      const weekStart = startOfWeek(now);
      filtered = filtered.filter(session => isAfter(session.startTime, weekStart));
    } else if (filterPeriod === 'month') {
      const monthStart = startOfMonth(now);
      filtered = filtered.filter(session => isAfter(session.startTime, monthStart));
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    } else if (sortBy === 'longest') {
      filtered.sort((a, b) => {
        const aDuration = a.endTime ? a.endTime.getTime() - a.startTime.getTime() : 0;
        const bDuration = b.endTime ? b.endTime.getTime() - b.startTime.getTime() : 0;
        return bDuration - aDuration;
      });
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, filterPeriod, sortBy]);

  const getSessionDuration = (session: any) => {
    if (!session.endTime) return 'In Progress';
    const duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60));
    return `${duration} min`;
  };

  const getMoodChange = (session: any) => {
    if (!session.mood.before || !session.mood.after) return null;
    const change = session.mood.after - session.mood.before;
    return change;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading session history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Session History</h1>
              <p className="text-muted-foreground">{sessions.length} total sessions</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions by notes or techniques..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="longest">Longest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No sessions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterPeriod !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Start your first therapy session to see it here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSessions.map((session) => {
              const moodChange = getMoodChange(session);
              return (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {format(session.startTime, 'EEEE, MMMM d, yyyy')}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(session.startTime, 'h:mm a')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {getSessionDuration(session)}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {session.messages.length} messages
                          </div>
                        </div>
                      </div>
                      <Badge variant={session.endTime ? 'default' : 'secondary'}>
                        {session.endTime ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {moodChange !== null && (
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className={moodChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                          Mood {moodChange >= 0 ? 'improved' : 'declined'} by {Math.abs(moodChange)} points
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          ({session.mood.before} → {session.mood.after})
                        </span>
                      </div>
                    )}

                    {session.techniques.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Techniques Used:</p>
                        <div className="flex flex-wrap gap-2">
                          {session.techniques.map((technique: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.notes && (
                      <div>
                        <p className="text-sm font-medium mb-1">Session Notes:</p>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
