
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Video, Phone, Settings } from 'lucide-react';

const LiveSession = () => {
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'active' | 'paused' | 'ended'>('idle');

  const handleStartSession = () => {
    setSessionStatus('active');
  };

  const handleEndSession = () => {
    setSessionStatus('ended');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Therapy Session</h1>
          <p className="text-muted-foreground">
            Connect with your therapist in real-time
          </p>
        </div>
        <Badge className={getStatusColor(sessionStatus)}>
          {sessionStatus}
        </Badge>
      </div>

      {sessionStatus === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Start Your Session?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your therapist is available and ready to begin your session.
            </p>
            <div className="flex space-x-4">
              <Button onClick={handleStartSession} className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Start Video Session</span>
              </Button>
              <Button variant="outline" onClick={handleStartSession} className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Start Audio Session</span>
              </Button>
              <Button variant="outline" onClick={handleStartSession} className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Start Chat Session</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sessionStatus === 'active' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Session in Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p>Video session would appear here</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button variant="destructive" onClick={handleEndSession}>
                  End Session
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Take notes during your session to remember key insights and action items.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {sessionStatus === 'ended' && (
        <Card>
          <CardHeader>
            <CardTitle>Session Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your session has ended. Thank you for participating in your therapy journey.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                View Session Summary
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Next Session
              </Button>
              <Button onClick={() => setSessionStatus('idle')} className="w-full">
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveSession;
