
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Activity, Zap } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { format } from "date-fns";

const LiveSessionIndicator = () => {
  const { currentSession } = useSession();
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentSession) {
      setIsVisible(true);
      const interval = setInterval(() => {
        const duration = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000);
        setSessionDuration(duration);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [currentSession]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionProgress = () => {
    // Assume ideal session length is 30 minutes (1800 seconds)
    const idealDuration = 1800;
    return Math.min((sessionDuration / idealDuration) * 100, 100);
  };

  if (!isVisible || !currentSession) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-therapy-200 bg-gradient-to-r from-therapy-50 to-calm-50 z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            Live Session
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Session Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Duration</span>
          </div>
          <div className="font-mono text-lg font-bold text-therapy-600">
            {formatDuration(sessionDuration)}
          </div>
        </div>

        {/* Session Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Session Progress</span>
            <span className="text-xs text-muted-foreground">
              {Math.round(getSessionProgress())}%
            </span>
          </div>
          <Progress value={getSessionProgress()} className="h-2" />
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">Messages</div>
            <div className="font-medium">{currentSession.messages.length}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">Techniques</div>
            <div className="font-medium">{currentSession.techniques.length}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">Mood</div>
            <div className="font-medium">
              {currentSession.mood.before || '-'}
            </div>
          </div>
        </div>

        {/* Session Start Time */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Started at {format(currentSession.startTime, 'HH:mm')}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveSessionIndicator;
