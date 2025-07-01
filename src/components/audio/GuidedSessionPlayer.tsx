
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface GuidedSessionPlayerProps {
  className?: string;
}

const GuidedSessionPlayer = ({ className }: GuidedSessionPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);

  const guidedSessions = [
    { id: 1, title: "Breathing Meditation", duration: "10 min", type: "Relaxation" },
    { id: 2, title: "Progressive Muscle Relaxation", duration: "15 min", type: "Stress Relief" },
    { id: 3, title: "Mindfulness Practice", duration: "12 min", type: "Mindfulness" },
    { id: 4, title: "Sleep Preparation", duration: "20 min", type: "Sleep" }
  ];

  const currentSessionData = guidedSessions[currentSession];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSession = () => {
    setCurrentSession((prev) => (prev + 1) % guidedSessions.length);
  };

  const previousSession = () => {
    setCurrentSession((prev) => (prev - 1 + guidedSessions.length) % guidedSessions.length);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="h-5 w-5 mr-2" />
          Guided Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg">{currentSessionData.title}</h3>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant="outline">{currentSessionData.type}</Badge>
            <Badge variant="secondary">{currentSessionData.duration}</Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={previousSession}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button onClick={togglePlayback} size="lg" className="rounded-full w-12 h-12">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={nextSession}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Session {currentSession + 1} of {guidedSessions.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidedSessionPlayer;
