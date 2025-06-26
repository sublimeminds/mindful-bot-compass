
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  MessageCircle,
  Share2,
  Settings,
  Clock,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveSession {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistAvatar: string;
  startTime: string;
  duration: number;
  status: 'waiting' | 'active' | 'ended';
  participants: number;
  sessionType: 'individual' | 'group' | 'crisis';
}

const LiveSessionManager = () => {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Mock current session
  useEffect(() => {
    const mockSession: LiveSession = {
      id: 'session-123',
      therapistId: 'therapist-1',
      therapistName: 'Dr. Sarah Chen',
      therapistAvatar: '/placeholder.svg',
      startTime: new Date().toISOString(),
      duration: 50,
      status: 'active',
      participants: 2,
      sessionType: 'individual'
    };
    setCurrentSession(mockSession);
    setConnectionStatus('connected');
  }, []);

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? "Camera turned off" : "Camera turned on",
      description: `Video is now ${isVideoEnabled ? 'disabled' : 'enabled'}`,
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? "Microphone muted" : "Microphone unmuted",
      description: `Audio is now ${isAudioEnabled ? 'muted' : 'enabled'}`,
    });
  };

  const endSession = () => {
    toast({
      title: "Session Ended",
      description: "Thank you for your session. Session summary will be available shortly.",
    });
    setCurrentSession(null);
  };

  const shareScreen = () => {
    toast({
      title: "Screen Sharing",
      description: "Screen sharing initiated",
    });
  };

  if (!currentSession) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Video className="h-16 w-16 text-therapy-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Session</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any active therapy sessions right now.
          </p>
          <Button>Schedule a Session</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentSession.therapistAvatar} />
                <AvatarFallback>{currentSession.therapistName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{currentSession.therapistName}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                    {currentSession.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {currentSession.duration} min session
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <div className={`h-2 w-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="capitalize">{connectionStatus}</span>
              </Badge>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {currentSession.participants}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video Session Area */}
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video bg-gradient-to-br from-therapy-100 to-calm-100 rounded-lg mb-6 flex items-center justify-center relative">
            {isVideoEnabled ? (
              <div className="text-center">
                <Video className="h-16 w-16 text-therapy-600 mx-auto mb-4" />
                <p className="text-therapy-800 font-medium">Video Session Active</p>
                <p className="text-therapy-600 text-sm">Connected with {currentSession.therapistName}</p>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Camera Off</p>
                <p className="text-gray-500 text-sm">Click the camera button to turn on video</p>
              </div>
            )}
            
            {/* Floating Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
              <Button
                size="sm"
                variant={isVideoEnabled ? "default" : "outline"}
                onClick={toggleVideo}
                className="rounded-full w-10 h-10 p-2"
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={isAudioEnabled ? "default" : "outline"}
                onClick={toggleAudio}
                className="rounded-full w-10 h-10 p-2"
              >
                {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={shareScreen}
                className="rounded-full w-10 h-10 p-2"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full w-10 h-10 p-2"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={endSession}
                className="rounded-full w-10 h-10 p-2"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Session Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Mood Check</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Session Notes</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSessionManager;
