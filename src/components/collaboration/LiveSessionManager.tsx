
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  Settings,
  Share2,
  MessageSquare,
  FileText,
  Timer,
  Activity,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionParticipant {
  id: string;
  name: string;
  role: 'therapist' | 'client' | 'observer';
  status: 'connected' | 'connecting' | 'disconnected';
  videoEnabled: boolean;
  audioEnabled: boolean;
  lastSeen: string;
}

interface SessionMetrics {
  duration: number;
  participants: number;
  messages: number;
  activities: number;
  qualityScore: number;
}

const LiveSessionManager = () => {
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(1847); // seconds
  const [participants, setParticipants] = useState<SessionParticipant[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'therapist',
      status: 'connected',
      videoEnabled: true,
      audioEnabled: true,
      lastSeen: 'now'
    },
    {
      id: '2',
      name: 'You',
      role: 'client',
      status: 'connected',
      videoEnabled: true,
      audioEnabled: true,
      lastSeen: 'now'
    },
    {
      id: '3',
      name: 'Dr. Michael Chen (Supervisor)',
      role: 'observer',
      status: 'connected',
      videoEnabled: false,
      audioEnabled: false,
      lastSeen: 'now'
    }
  ]);

  const [metrics, setMetrics] = useState<SessionMetrics>({
    duration: 1847,
    participants: 3,
    messages: 24,
    activities: 8,
    qualityScore: 95
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSessionActive) {
        setSessionDuration(prev => prev + 1);
        setMetrics(prev => ({ ...prev, duration: prev.duration + 1 }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? "Video Disabled" : "Video Enabled",
      description: `Your camera is now ${isVideoEnabled ? 'off' : 'on'}.`,
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? "Microphone Muted" : "Microphone Unmuted",
      description: `Your microphone is now ${isAudioEnabled ? 'muted' : 'unmuted'}.`,
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    toast({
      title: isSpeakerEnabled ? "Speaker Muted" : "Speaker Unmuted",
      description: `Audio output is now ${isSpeakerEnabled ? 'muted' : 'unmuted'}.`,
    });
  };

  const endSession = () => {
    setIsSessionActive(false);
    toast({
      title: "Session Ended",
      description: "The therapy session has been ended. Summary will be generated.",
    });
  };

  const shareScreen = () => {
    toast({
      title: "Screen Sharing Started",
      description: "Your screen is now being shared with participants.",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'therapist': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      case 'observer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Video className="h-7 w-7 mr-2 text-therapy-600" />
            Live Therapy Session
          </h2>
          <p className="text-muted-foreground">
            Session Duration: {formatDuration(sessionDuration)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isSessionActive ? "default" : "secondary"}>
            {isSessionActive ? "Active" : "Ended"}
          </Badge>
          <Button variant="outline" onClick={shareScreen}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Screen
          </Button>
        </div>
      </div>

      {/* Session Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isVideoEnabled ? "default" : "secondary"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full h-12 w-12"
            >
              {isVideoEnabled ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant={isAudioEnabled ? "default" : "secondary"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full h-12 w-12"
            >
              {isAudioEnabled ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant={isSpeakerEnabled ? "default" : "secondary"}
              size="lg"
              onClick={toggleSpeaker}
              className="rounded-full h-12 w-12"
            >
              {isSpeakerEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={endSession}
              className="rounded-full h-12 w-12"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-12 w-12"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="participants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Session Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-therapy-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-therapy-600">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(participant.role)} variant="secondary">
                            {participant.role}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Last seen: {participant.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded ${participant.videoEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                        {participant.videoEnabled ? (
                          <Video className="h-4 w-4 text-green-600" />
                        ) : (
                          <VideoOff className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className={`p-2 rounded ${participant.audioEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                        {participant.audioEnabled ? (
                          <Mic className="h-4 w-4 text-green-600" />
                        ) : (
                          <MicOff className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Session Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-64 overflow-y-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">DS</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Dr. Sarah Johnson</span>
                      <span className="text-xs text-muted-foreground">2:30 PM</span>
                    </div>
                    <p className="text-sm mt-1">Let's start with how you've been feeling this week.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">Y</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">You</span>
                      <span className="text-xs text-muted-foreground">2:31 PM</span>
                    </div>
                    <p className="text-sm mt-1">I've had some ups and downs, but overall better than last week.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Session Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-48 p-3 border rounded-md resize-none"
                placeholder="Take notes during the session..."
                defaultValue="Client reports improved mood and sleep patterns. Discussed coping strategies for work stress. Homework: Practice mindfulness exercises daily."
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Auto-saved at 2:35 PM
                </p>
                <Button variant="outline" size="sm">
                  Export Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Timer className="h-4 w-4 mr-2" />
                  Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(metrics.duration)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.participants}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.messages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.qualityScore}%</div>
                <Progress value={metrics.qualityScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveSessionManager;
