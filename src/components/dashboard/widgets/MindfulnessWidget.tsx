import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MindfulnessSession {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  type: 'breathing' | 'meditation' | 'visualization';
}

const MINDFULNESS_SESSIONS: MindfulnessSession[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    duration: 300, // 5 minutes
    description: 'Focus on your breath to center yourself',
    type: 'breathing'
  },
  {
    id: '2',
    title: 'Body Scan',
    duration: 600, // 10 minutes
    description: 'Progressive relaxation of your entire body',
    type: 'meditation'
  },
  {
    id: '3',
    title: 'Peaceful Place',
    duration: 480, // 8 minutes
    description: 'Visualize your calm, safe space',
    type: 'visualization'
  }
];

const MINDFUL_REMINDERS = [
  "Take three deep breaths right now 🌬️",
  "Notice five things you can see around you 👀",
  "Feel your feet on the ground 🦶",
  "What sounds can you hear? 👂",
  "How does your body feel in this moment? 💫",
  "Send loving-kindness to yourself ❤️"
];

const MindfulnessWidget = () => {
  const [currentSession, setCurrentSession] = useState<MindfulnessSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(MINDFUL_REMINDERS[0]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCurrentSession(null);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Change reminder every 30 seconds
  useEffect(() => {
    const reminderInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MINDFUL_REMINDERS.length);
      setCurrentReminder(MINDFUL_REMINDERS[randomIndex]);
    }, 30000);

    return () => clearInterval(reminderInterval);
  }, []);

  const startSession = (session: MindfulnessSession) => {
    setCurrentSession(session);
    setTimeLeft(session.duration);
    setIsActive(true);
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    if (currentSession) {
      setTimeLeft(currentSession.duration);
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'breathing': return '🌬️';
      case 'meditation': return '🧘';
      case 'visualization': return '🌅';
      default: return '💫';
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-harmony-50 to-balance-50">
        <CardTitle className="text-base font-semibold text-harmony-800 flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          Mindfulness
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 flex-1 space-y-4">
        {!currentSession ? (
          <>
            {/* Mindful Reminder */}
            <div className="bg-gradient-to-r from-harmony-25 to-balance-25 border border-harmony-200 rounded-lg p-3 text-center">
              <Sparkles className="h-5 w-5 text-harmony-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-harmony-800 mb-1">
                Mindful Moment
              </p>
              <p className="text-xs text-harmony-600 leading-relaxed">
                {currentReminder}
              </p>
            </div>

            {/* Quick Sessions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Quick Sessions</h4>
              
              {MINDFULNESS_SESSIONS.map((session) => (
                <Button
                  key={session.id}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3 hover:bg-harmony-50"
                  onClick={() => startSession(session)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="text-lg">
                      {getSessionIcon(session.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm text-gray-900">
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {session.description}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(session.duration / 60)}m
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Active Session */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-2xl">
                  {getSessionIcon(currentSession.type)}
                </div>
                <h3 className="font-semibold text-gray-900">
                  {currentSession.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentSession.description}
                </p>
              </div>

              {/* Timer */}
              <div className="space-y-3">
                <div className={cn(
                  "text-4xl font-mono font-bold",
                  isActive ? "text-harmony-600" : "text-gray-600"
                )}>
                  {formatTime(timeLeft)}
                </div>

                {/* Progress Circle */}
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-gray-200"
                    />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-harmony-500"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - (currentSession.duration - timeLeft) / currentSession.duration)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSession}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={toggleSession}
                  className="bg-harmony-600 hover:bg-harmony-700 text-white"
                >
                  {isActive ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isActive ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentSession(null);
                    setIsActive(false);
                    setTimeLeft(0);
                  }}
                >
                  End
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MindfulnessWidget;