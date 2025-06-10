
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  Play, 
  Pause, 
  Square,
  Signal
} from 'lucide-react';

export interface RealTimeSessionState {
  isActive: boolean;
  startTime: Date | null;
  duration: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  connectionQuality: 'excellent' | 'good' | 'poor';
  participantCount: number;
  sessionId: string | null;
}

interface SessionStatusIndicatorProps {
  sessionState: RealTimeSessionState;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
}

const SessionStatusIndicator: React.FC<SessionStatusIndicatorProps> = ({
  sessionState,
  onPause,
  onResume,
  onEnd
}) => {
  if (!sessionState.sessionId) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (sessionState.connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <Signal className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getQualityColor = () => {
    switch (sessionState.connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 w-80 shadow-lg border-therapy-200 bg-gradient-to-r from-therapy-50 to-calm-50 z-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                sessionState.isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`} />
              <span className="text-sm font-medium">
                {sessionState.isActive ? 'Session Active' : 'Session Paused'}
              </span>
            </div>
            
            <Badge variant={sessionState.isActive ? 'default' : 'secondary'}>
              Live
            </Badge>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-mono text-sm font-bold">
                {formatDuration(sessionState.duration)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Participants</div>
              <div className="font-medium text-sm">{sessionState.participantCount}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                {getConnectionIcon()}
              </div>
              <div className="text-xs text-muted-foreground">Connection</div>
              <div className={`text-xs font-medium ${getQualityColor()}`}>
                {sessionState.connectionQuality}
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center justify-center space-x-2 pt-2 border-t">
            {sessionState.isActive ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onPause}
                className="flex items-center space-x-1"
              >
                <Pause className="h-3 w-3" />
                <span>Pause</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onResume}
                className="flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>Resume</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onEnd}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Square className="h-3 w-3" />
              <span>End</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionStatusIndicator;
