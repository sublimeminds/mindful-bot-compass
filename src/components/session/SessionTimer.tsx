
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, StopCircle } from "lucide-react";
import { format } from "date-fns";

interface SessionTimerProps {
  startTime: Date;
  onEndSession?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ startTime, onEndSession }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
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

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <Clock className="h-3 w-3 mr-1" />
        {formatTime(elapsed)}
      </Badge>
      {onEndSession && (
        <Button
          onClick={onEndSession}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <StopCircle className="h-4 w-4 mr-1" />
          End
        </Button>
      )}
    </div>
  );
};

export default SessionTimer;
