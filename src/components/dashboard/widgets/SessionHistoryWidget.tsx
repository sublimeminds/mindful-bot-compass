import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const SessionHistoryWidget = () => {
  // Mock session data - in real app, fetch from API
  const recentSessions = [
    {
      id: 1,
      type: 'Anxiety Management',
      date: '2024-01-15',
      duration: 45,
      status: 'completed',
      rating: 4
    },
    {
      id: 2,
      type: 'Mindfulness Practice',
      date: '2024-01-14',
      duration: 30,
      status: 'completed',
      rating: 5
    },
    {
      id: 3,
      type: 'Stress Relief',
      date: '2024-01-13',
      duration: 35,
      status: 'completed',
      rating: 4
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeComponentWrapper name="SessionHistoryWidget">
      <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-therapy-50 to-calm-50">
          <CardTitle className="flex items-center justify-between text-therapy-800">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Sessions
            </div>
            <Badge variant="secondary" className="text-xs">
              {recentSessions.length} sessions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-therapy-25 to-calm-25 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-therapy-800">
                        {session.type}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(session.status)}`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration}min
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">⭐</span>
                        {session.rating}/5
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => window.location.href = '/session-analytics'}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-therapy-600 border-therapy-200 hover:bg-therapy-50"
                onClick={() => window.location.href = '/session-analytics'}
              >
                View Session Analytics
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground mb-3">
                No sessions yet
              </p>
              <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                Start Your First Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </SafeComponentWrapper>
  );
};

export default SessionHistoryWidget;