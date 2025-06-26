
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, MessageCircle, Target } from 'lucide-react';

interface SessionProgressIndicatorProps {
  sessionDuration: number; // in minutes
  messageCount: number;
  expectedDuration?: number;
  sessionGoals?: string[];
}

const SessionProgressIndicator = ({ 
  sessionDuration, 
  messageCount, 
  expectedDuration = 45,
  sessionGoals = []
}: SessionProgressIndicatorProps) => {
  const progressPercentage = Math.min((sessionDuration / expectedDuration) * 100, 100);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Session Duration Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-therapy-600" />
                <span className="text-sm font-medium">Session Progress</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {sessionDuration}m / {expectedDuration}m
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Message Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-therapy-600" />
              <span className="text-sm">Messages Exchanged</span>
            </div>
            <span className="text-sm font-medium">{messageCount}</span>
          </div>

          {/* Session Goals */}
          {sessionGoals.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 mr-2 text-therapy-600" />
                <span className="text-sm font-medium">Session Goals</span>
              </div>
              <div className="space-y-1">
                {sessionGoals.map((goal, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center">
                    <div className="w-2 h-2 bg-therapy-300 rounded-full mr-2" />
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionProgressIndicator;
