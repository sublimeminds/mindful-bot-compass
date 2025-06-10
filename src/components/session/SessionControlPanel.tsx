
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Settings,
  Users
} from 'lucide-react';
import { RealTimeSessionState } from './SessionStatusIndicator';

interface SessionControlPanelProps {
  sessionState: RealTimeSessionState;
  onStartSession: () => void;
  onEndSession: () => void;
}

const SessionControlPanel: React.FC<SessionControlPanelProps> = ({
  sessionState,
  onStartSession,
  onEndSession
}) => {
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isVideoOn, setIsVideoOn] = React.useState(false);

  const getConnectionStatusColor = () => {
    switch (sessionState.connectionStatus) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'connecting': return 'bg-yellow-100 text-yellow-800';
      case 'reconnecting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Session Controls</CardTitle>
          <Badge className={getConnectionStatusColor()}>
            {sessionState.connectionStatus}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Connection Status</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                sessionState.connectionStatus === 'connected' ? 'bg-green-500' : 
                sessionState.connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-xs text-muted-foreground">
                {sessionState.connectionStatus}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Quality: {sessionState.connectionQuality} • 
            Participants: {sessionState.participantCount}
          </div>
        </div>

        {/* Main Session Control */}
        <div className="space-y-3">
          {!sessionState.sessionId ? (
            <Button 
              onClick={onStartSession}
              className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button 
              onClick={onEndSession}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              size="lg"
            >
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          )}
        </div>

        {/* Media Controls */}
        {sessionState.sessionId && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Media Controls</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isMicOn ? "default" : "outline"}
                onClick={() => setIsMicOn(!isMicOn)}
                className="w-full"
              >
                {isMicOn ? (
                  <><Mic className="h-4 w-4 mr-2" /> Mic On</>
                ) : (
                  <><MicOff className="h-4 w-4 mr-2" /> Mic Off</>
                )}
              </Button>
              
              <Button
                variant={isVideoOn ? "default" : "outline"}
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="w-full"
              >
                {isVideoOn ? (
                  <><Video className="h-4 w-4 mr-2" /> Video On</>
                ) : (
                  <><VideoOff className="h-4 w-4 mr-2" /> Video Off</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Additional Controls */}
        {sessionState.sessionId && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Session Tools</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionControlPanel;
