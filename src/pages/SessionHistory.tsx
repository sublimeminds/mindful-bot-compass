
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Search, BarChart3, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { SessionHistoryService, SessionSummary, SessionFilter } from "@/services/sessionHistoryService";
import SessionFilters from "@/components/session/SessionFilters";
import SessionCard from "@/components/session/SessionCard";
import SessionDetailsModal from "@/components/session/SessionDetailsModal";
import { useToast } from "@/hooks/use-toast";

const SessionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions } = useSession();
  const { toast } = useToast();
  
  const [sessionSummaries, setSessionSummaries] = useState<SessionSummary[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'effectiveness'>('date');
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (sessions.length > 0) {
      const summaries = SessionHistoryService.generateSessionSummaries(sessions);
      setSessionSummaries(summaries);
      setFilteredSessions(summaries);
    }
  }, [sessions]);

  const handleFilterChange = (filter: SessionFilter) => {
    const filtered = SessionHistoryService.filterSessions(sessionSummaries, filter);
    setFilteredSessions(filtered);
  };

  const handleClearFilters = () => {
    setFilteredSessions(sessionSummaries);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSessions(sessionSummaries);
      return;
    }

    const searchFiltered = sessionSummaries.filter(session =>
      session.notes.toLowerCase().includes(term.toLowerCase()) ||
      session.techniques.some(technique => 
        technique.toLowerCase().includes(term.toLowerCase())
      ) ||
      session.keyInsights.some(insight =>
        insight.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredSessions(searchFiltered);
  };

  const handleSort = (sortType: 'date' | 'duration' | 'effectiveness') => {
    setSortBy(sortType);
    const sorted = [...filteredSessions].sort((a, b) => {
      switch (sortType) {
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'effectiveness':
          const effectivenessOrder = { high: 3, medium: 2, low: 1 };
          return effectivenessOrder[b.effectiveness] - effectivenessOrder[a.effectiveness];
        default:
          return 0;
      }
    });
    setFilteredSessions(sorted);
  };

  const handleExportData = () => {
    if (filteredSessions.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please ensure you have sessions to export.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = SessionHistoryService.exportSessionData(filteredSessions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `therapy-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Your session data has been downloaded as a CSV file.",
    });
  };

  const handleViewDetails = (session: SessionSummary) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const stats = SessionHistoryService.getSessionStats(filteredSessions);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Please log in to view your session history.</p>
          </CardContent>
        </Card>
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
              <h1 className="text-2xl font-bold flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Session History
              </h1>
              <p className="text-muted-foreground">
                Review and analyze your therapy session progress
              </p>
            </div>
          </div>
          <Button onClick={handleExportData} disabled={filteredSessions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Total Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{stats.averageDuration}m</div>
                  <div className="text-xs text-muted-foreground">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">+{stats.averageMoodImprovement}</div>
                  <div className="text-xs text-muted-foreground">Avg Mood Boost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-green-500 rounded-full" />
                <div>
                  <div className="text-2xl font-bold">{stats.effectivenessDistribution.high}</div>
                  <div className="text-xs text-muted-foreground">High Effectiveness</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions, techniques, or insights..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => handleSort(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="effectiveness">Effectiveness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters */}
        <SessionFilters 
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {sessionSummaries.length === 0 ? 'No sessions yet' : 'No sessions match your filters'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {sessionSummaries.length === 0 
                  ? 'Start your first therapy session to see your progress here'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {sessionSummaries.length === 0 && (
                <Button onClick={() => navigate('/chat')}>
                  Start Your First Session
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Session Details Modal */}
        <SessionDetailsModal
          session={selectedSession}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      </div>
    </div>
  );
};

export default SessionHistory;
