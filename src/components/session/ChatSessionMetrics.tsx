import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  Signal,
  Activity,
  Zap
} from 'lucide-react';
import { RealTimeSessionState } from './SessionStatusIndicator';

interface ChatSessionMetricsProps {
  sessionState: RealTimeSessionState;
  messageCount: number;
  className?: string;
}

const ChatSessionMetrics: React.FC<ChatSessionMetricsProps> = ({
  sessionState,
  messageCount,
  className = ""
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
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <Signal className="h-3 w-3 text-yellow-500 animate-pulse" />;
      default:
        return <WifiOff className="h-3 w-3 text-red-500" />;
    }
  };

  const getQualityColor = () => {
    switch (sessionState.connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`border-therapy-200 bg-gradient-to-r from-therapy-50/50 to-calm-50/50 ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              sessionState.isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`} />
            <span className="text-xs font-medium">
              {sessionState.isActive ? 'Live Session' : 'Session Paused'}
            </span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            Real-time
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Clock className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">Duration</div>
            <div className="font-mono text-xs font-bold">
              {formatDuration(sessionState.duration)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Activity className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">Messages</div>
            <div className="font-medium text-xs">{messageCount}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Users className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">Participants</div>
            <div className="font-medium text-xs">{sessionState.participantCount}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              {getConnectionIcon()}
            </div>
            <div className="text-xs text-muted-foreground">Quality</div>
            <div className={`text-xs font-medium ${getQualityColor()}`}>
              {sessionState.connectionQuality}
            </div>
          </div>
        </div>

        {/* Connection Status Bar */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Connection</span>
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span className="text-xs font-medium capitalize">
                {sessionState.connectionStatus}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSessionMetrics;
