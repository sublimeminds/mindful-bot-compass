
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  Eye,
  Brain,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';

interface SessionHistoryListProps {
  sessionSummaries: any[];
  isLoading: boolean;
  dateRange: string;
  moodFilter: string;
  sortBy: string;
}

const SessionHistoryList = ({ 
  sessionSummaries, 
  isLoading, 
  dateRange, 
  moodFilter, 
  sortBy 
}: SessionHistoryListProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');

  const handleViewSession = (sessionId: string) => {
    console.log('Viewing session:', sessionId);
    // Navigate to session details
  };

  // Filter and sort sessions based on filters
  const filteredSessions = sessionSummaries
    .filter(session => {
      // Apply mood filter
      if (moodFilter !== 'all') {
        const moodChange = session.mood_after && session.mood_before 
          ? session.mood_after - session.mood_before 
          : 0;
        
        if (moodFilter === 'improved' && moodChange <= 0) return false;
        if (moodFilter === 'declined' && moodChange >= 0) return false;
        if (moodFilter === 'stable' && Math.abs(moodChange) > 1) return false;
      }

      // Apply date range filter
      if (dateRange !== 'all') {
        const sessionDate = new Date(session.start_time);
        const now = new Date();
        const daysDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dateRange === '7d' && daysDiff > 7) return false;
        if (dateRange === '30d' && daysDiff > 30) return false;
        if (dateRange === '90d' && daysDiff > 90) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        case 'mood':
          const moodChangeA = (a.mood_after || 0) - (a.mood_before || 0);
          const moodChangeB = (b.mood_after || 0) - (b.mood_before || 0);
          return moodChangeB - moodChangeA;
        case 'duration':
          const durationA = a.end_time 
            ? (new Date(a.end_time).getTime() - new Date(a.start_time).getTime()) / (1000 * 60)
            : 0;
          const durationB = b.end_time 
            ? (new Date(b.end_time).getTime() - new Date(b.start_time).getTime()) / (1000 * 60)
            : 0;
          return durationB - durationA;
        default: // 'date'
          return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
      }
    });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getSessionSummary = (session: any) => {
    const messageCount = session.session_messages?.length || 0;
    const duration = session.end_time 
      ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
      : null;
    
    const moodChange = session.mood_before && session.mood_after 
      ? session.mood_after - session.mood_before 
      : null;

    const techniques = session.techniques || [];
    
    return { messageCount, duration, moodChange, techniques };
  };

  const getMoodChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const { messageCount, duration, moodChange, techniques } = getSessionSummary(session);
            
            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      {/* Date and Time */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-therapy-600" />
                        <span className="font-medium">
                          {format(new Date(session.start_time), 'EEEE, MMMM d, yyyy')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          at {format(new Date(session.start_time), 'h:mm a')}
                        </span>
                      </div>

                      {/* Session Stats */}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {duration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{duration} minutes</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{messageCount} messages</span>
                        </div>

                        {moodChange !== null && (
                          <div className={`flex items-center space-x-1 ${getMoodChangeColor(moodChange)}`}>
                            <TrendingUp className="h-3 w-3" />
                            <span>
                              {moodChange > 0 ? '+' : ''}{moodChange} mood
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Techniques Used */}
                      {techniques.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Brain className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {techniques.slice(0, 3).map((technique: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {technique}
                              </Badge>
                            ))}
                            {techniques.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{techniques.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes Preview */}
                      {session.notes && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {session.notes}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSession(session.id)}
                      className="ml-4"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>

                  {/* Mood Indicators */}
                  {session.mood_before && session.mood_after && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-3 w-3 text-muted-foreground" />
                          <span>Mood: {session.mood_before} → {session.mood_after}</span>
                        </div>
                        <div className={`font-medium ${getMoodChangeColor(moodChange!)}`}>
                          {moodChange! > 0 ? 'Improved' : moodChange! < 0 ? 'Declined' : 'Stable'}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-4">
              No sessions match your current filters.
            </p>
            <Button onClick={() => window.location.href = '/chat'}>
              Start a New Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionHistoryList;
