
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  MessageSquare,
  Clock,
  Send
} from 'lucide-react';
import { useRealTimeSession } from '@/hooks/useRealTimeSession';
import { useAuth } from '@/hooks/useAuth';
import SessionProgressIndicator from './SessionProgressIndicator';
import SessionRating from './SessionRating';

const RealTimeSessionManager = () => {
  const { user } = useAuth();
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
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      await sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleEndSession = async () => {
    await endSession();
    setShowRating(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Session Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Therapy Session
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={sessionState === 'active' ? 'default' : 'secondary'}>
              <Clock className="mr-1 h-3 w-3" />
              {sessionState}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Conversation</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {messages.length === 0 && sessionState === 'idle' && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                      <p>Start a session to begin your therapy conversation</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-therapy-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              {sessionState === 'active' && (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <Button onClick={handleSendMessage} disabled={loading || !messageInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionState === 'idle' && (
                <Button onClick={startSession} className="w-full" disabled={loading}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Session
                </Button>
              )}
              {sessionState === 'active' && (
                <>
                  <Button onClick={pauseSession} variant="outline" className="w-full">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                  <Button onClick={handleEndSession} variant="destructive" className="w-full">
                    <Square className="mr-2 h-4 w-4" />
                    End Session
                  </Button>
                </>
              )}
              {sessionState === 'paused' && (
                <>
                  <Button onClick={resumeSession} className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                  <Button onClick={handleEndSession} variant="destructive" className="w-full">
                    <Square className="mr-2 h-4 w-4" />
                    End Session
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Session Progress */}
          {sessionState !== 'idle' && (
            <SessionProgressIndicator
              sessionDuration={sessionDuration}
              messageCount={messages.length}
              sessionGoals={['Discuss daily stress', 'Practice coping techniques']}
            />
          )}

          {/* Session Rating */}
          {showRating && (
            <SessionRating
              sessionId="current-session"
              onSubmit={(rating, feedback) => {
                console.log('Session rated:', rating, feedback);
                setShowRating(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeSessionManager;
