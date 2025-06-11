
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Square } from "lucide-react";

interface SessionTimerProps {
  startTime: Date;
  onEndSession: () => void;
  canEnd?: boolean;
}

const SessionTimer = ({ startTime, onEndSession, canEnd = true }: SessionTimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMs = now.getTime() - startTime.getTime();
      setElapsed(Math.floor(elapsedMs / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const minutes = Math.floor(elapsed / 60);
    if (minutes < 15) return 'text-amber-600';
    if (minutes < 30) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Clock className={`h-4 w-4 ${getTimerColor()}`} />
        <span className={`font-mono text-sm ${getTimerColor()}`}>
          {formatTime(elapsed)}
        </span>
      </div>
      <Button
        onClick={onEndSession}
        variant={canEnd ? "destructive" : "outline"}
        size="sm"
        disabled={!canEnd}
        className={!canEnd ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Square className="h-4 w-4 mr-1" />
        {canEnd ? "End Session" : "Continue"}
      </Button>
    </div>
  );
};

export default SessionTimer;
