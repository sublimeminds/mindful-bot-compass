import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, Clock, Users, MessageCircle, Activity, Pause, Play, Square, Volume2, VolumeX, Heart, Brain, Target, TrendingUp, Zap, Shield, User, Calendar } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useRealTimeSession } from '@/hooks/useRealTimeSession';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionParticipant {
  id: string;
  name: string;
  avatar?: string;
  isTyping: boolean;
  lastSeen: Date;
  role: 'user' | 'ai' | 'therapist';
}

interface SessionProgress {
  duration: number;
  messagesExchanged: number;
  emotionalState: number;
  engagementLevel: number;
  topicsDiscussed: string[];
  milestones: Array<{
    id: string;
    title: string;
    timestamp: Date;
    type: 'breakthrough' | 'insight' | 'technique' | 'goal';
  }>;
}

const RealTimeSessionManager = () => {
  const { user } = useSimpleApp();
  const { currentSession } = useRealTimeSession();
  const { toast } = useToast();
  
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    duration: 0,
    messagesExchanged: 0,
    emotionalState: 7,
    engagementLevel: 85,
    topicsDiscussed: ['Anxiety Management', 'Coping Strategies'],
    milestones: []
  });
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    // Simulate real-time connection
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
      setParticipants([
        {
          id: user?.id || '1',
          name: user?.user_metadata?.name || 'You',
          isTyping: false,
          lastSeen: new Date(),
          role: 'user'
        },
        {
          id: 'ai-therapist',
          name: 'AI Therapist',
          isTyping: false,
          lastSeen: new Date(),
          role: 'ai'
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    // Simulate session progress updates
    const interval = setInterval(() => {
      setSessionProgress(prev => ({
        ...prev,
        duration: prev.duration + 1,
        messagesExchanged: prev.messagesExchanged + Math.random() > 0.7 ? 1 : 0
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Session recording has begun for later analysis.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Session recording saved successfully.",
    });
  };

  const addMilestone = (type: string, title: string) => {
    const newMilestone = {
      id: Date.now().toString(),
      title,
      timestamp: new Date(),
      type: type as any
    };
    
    setSessionProgress(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));

    toast({
      title: "Milestone Reached!",
      description: title,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'breakthrough': return '🎯';
      case 'insight': return '💡';
      case 'technique': return '🧘';
      case 'goal': return '🏆';
      default: return '⭐';
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium">
                {connectionStatus === 'connected' ? 'Real-time session active' :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {participants.length} participants
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(sessionProgress.duration)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Progress Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emotional State</p>
                <p className="text-2xl font-bold">{sessionProgress.emotionalState}/10</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <Progress 
              value={sessionProgress.emotionalState * 10} 
              className="mt-2 h-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">{sessionProgress.engagementLevel}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <Progress 
              value={sessionProgress.engagementLevel} 
              className="mt-2 h-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{sessionProgress.messagesExchanged}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold">{sessionProgress.milestones.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Session Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.map(participant => (
              <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {participant.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {participant.isTyping ? 'Typing...' : 'Active'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={participant.role === 'ai' ? 'default' : 'secondary'}>
                    {participant.role}
                  </Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Session Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className="w-full"
            >
              <Mic className="h-4 w-4 mr-2" />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>

            <Button variant="outline" className="w-full">
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>

            <Button variant="outline" className="w-full">
              <Share className="h-4 w-4 mr-2" />
              Share Screen
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addMilestone('insight', 'Important realization about coping strategies')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Add Insight
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Milestones */}
      {sessionProgress.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Session Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionProgress.milestones.slice(-5).map(milestone => (
                <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-lg">{getMilestoneIcon(milestone.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="outline">{milestone.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topics Being Discussed */}
      <Card>
        <CardHeader>
          <CardTitle>Current Discussion Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sessionProgress.topicsDiscussed.map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeSessionManager;
