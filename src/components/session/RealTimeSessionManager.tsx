
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  Share,
  Phone,
  PhoneOff,
  MessageSquare,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import { useRealTimeSession } from '@/hooks/useRealTimeSession';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const RealTimeSessionManager = () => {
  const { user } = useSimpleApp();
  const {
    messages,
    loading,
    error,
    sessionState,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    sendMessage
  } = useRealTimeSession();

  const [messageInput, setMessageInput] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCallOngoing, setIsCallOngoing] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);

  useEffect(() => {
    // Load session data or perform initial setup
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const shareSession = () => {
    setIsSharing(!isSharing);
  };

  const stopSession = async () => {
    await endSession();
  };

  const endCall = () => {
    setIsCallOngoing(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          <MessageSquare className="mr-2 h-5 w-5" />
          Real-Time Therapy Session
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Clock className="mr-2 h-4 w-4" />
            {sessionState}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-full flex-1 flex flex-col">
        {/* Session Controls */}
        <div className="mb-4 flex justify-around">
          <Button variant="outline" onClick={startSession} disabled={sessionState !== 'idle'}>
            <Play className="mr-2 h-4 w-4" />
            Start Session
          </Button>
          <Button variant="outline" onClick={pauseSession} disabled={sessionState !== 'active'}>
            <Pause className="mr-2 h-4 w-4" />
            Pause Session
          </Button>
          <Button variant="destructive" onClick={stopSession} disabled={sessionState === 'idle'}>
            <Square className="mr-2 h-4 w-4" />
            Stop Session
          </Button>
        </div>

        {/* Media Controls */}
        <div className="mb-4 flex justify-around">
          <Button variant="ghost" onClick={toggleAudio}>
            {isAudioEnabled ? (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Mute
              </>
            ) : (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Unmute
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={toggleVideo}>
            {isVideoEnabled ? (
              <>
                <Video className="mr-2 h-4 w-4" />
                Hide Video
              </>
            ) : (
              <>
                <VideoOff className="mr-2 h-4 w-4" />
                Show Video
              </>
            )}
          </Button>
        </div>

        {/* Communication Controls */}
        <div className="mb-4 flex justify-around">
          <Button variant="ghost" onClick={shareSession} disabled={isSharing}>
            <Share className="mr-2 h-4 w-4" />
            Share Session
          </Button>
          <Button variant="destructive" onClick={endCall} disabled={!isCallOngoing}>
            <PhoneOff className="mr-2 h-4 w-4" />
            End Call
          </Button>
        </div>

        {/* Session Progress */}
        <div className="mb-4">
          <p className="text-sm font-medium">Session Progress: {sessionProgress}%</p>
          <Progress value={sessionProgress} />
        </div>

        {/* Message Input */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 rounded-md border border-gray-200 px-3 py-2"
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            Send
          </Button>
        </div>

        {/* Display Session Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="mb-2 p-2 rounded-md bg-gray-100">
              {message.content}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeSessionManager;
