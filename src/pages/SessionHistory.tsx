import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Filter, Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SessionDetailsModal from "@/components/session/SessionDetailsModal";
import EnhancedSessionCard from "@/components/session/EnhancedSessionCard";
import SessionFilters from "@/components/session/SessionFilters";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { SessionSummary } from "@/services/sessionHistoryService";
import { useToast } from "@/hooks/use-toast";

const SessionHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    sessionSummaries, 
    isLoading, 
    error, 
    getSessionStats, 
    filterSessions, 
    exportSessions 
  } = useSessionHistory();
  
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState<SessionSummary[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    setFilteredSessions(sessionSummaries);
  }, [sessionSummaries]);

  const stats = getSessionStats();

  const handleViewDetails = (session: SessionSummary) => {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  };

  const handleFilterChange = (filter: any) => {
    const filtered = filterSessions(filter);
    setFilteredSessions(filtered);
  };

  const handleExport = () => {
    try {
      const csvData = exportSessions();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `therapy-sessions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your session data has been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Error Loading Sessions</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
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
              <h1 className="text-2xl font-bold flex items-center">
                <CalendarIcon className="h-6 w-6 mr-2" />
                Session History
              </h1>
              <p className="text-muted-foreground">
                Review your therapy sessions and track your progress over time
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={sessionSummaries.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageDuration} min</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Mood Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.averageMoodImprovement > 0 ? '+' : ''}{stats.averageMoodImprovement}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top Technique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium truncate">
                  {stats.mostUsedTechnique || 'None yet'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <SessionFilters 
            onFilterChange={handleFilterChange}
            onClearFilters={() => setFilteredSessions(sessionSummaries)}
          />
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Session List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading your session history...</div>
              </div>
            ) : filteredSessions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSessions.map((session) => (
                  <EnhancedSessionCard
                    key={session.id}
                    session={session}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {sessionSummaries.length === 0 ? 'No sessions yet' : 'No sessions match your filters'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {sessionSummaries.length === 0 
                      ? 'Start your first therapy session to begin tracking your progress'
                      : 'Try adjusting your filters to see more sessions'
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Session Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Effectiveness Distribution</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>High</span>
                        <span>{stats.effectivenessDistribution.high} sessions</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medium</span>
                        <span>{stats.effectivenessDistribution.medium} sessions</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Low</span>
                        <span>{stats.effectivenessDistribution.low} sessions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Most Used Technique</h4>
                    <p className="text-2xl font-bold">{stats.mostUsedTechnique || 'None yet'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Average Improvement</h4>
                    <p className="text-2xl font-bold">
                      {stats.averageMoodImprovement > 0 ? '+' : ''}{stats.averageMoodImprovement} points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Session Details Modal */}
        <SessionDetailsModal
          session={selectedSession}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedSession(null);
          }}
        />
      </div>
    </div>
  );
};

export default SessionHistory;
