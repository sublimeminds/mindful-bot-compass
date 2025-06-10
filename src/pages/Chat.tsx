import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTherapist } from "@/contexts/TherapistContext";
import SessionEndModal from "@/components/SessionEndModal";
import LiveSessionIndicator from "@/components/LiveSessionIndicator";
import NotificationCenter from "@/components/NotificationCenter";
import EmotionDisplay from "@/components/emotion/EmotionDisplay";
import VoiceInteraction from "@/components/VoiceInteraction";
import { useEnhancedChat } from "@/hooks/useEnhancedChat";
import { useRealTimeSession } from "@/hooks/useRealTimeSession";
import ChatSessionMetrics from "@/components/session/ChatSessionMetrics";

const Chat = () => {
  const [input, setInput] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentSession, startSession, endSession, addBreakthrough } = useSession();
  const navigate = useNavigate();
  const { currentTherapist, getPersonalityPrompt } = useTherapist();
  
  // Real-time session integration
  const { 
    sessionState, 
    startSession: startRealtimeSession, 
    endSession: endRealtimeSession 
  } = useRealTimeSession();
  
  const {
    messages,
    setMessages,
    isLoading,
    isPlaying,
    sendMessage,
    playMessage,
    stopPlayback,
    loadPreferences,
    userPreferences
  } = useEnhancedChat();

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    // Load session messages when session changes
    if (currentSession && currentSession.messages) {
      const transformedMessages = currentSession.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.sender === 'user',
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(transformedMessages);
    } else {
      setMessages([]);
    }
  }, [currentSession, setMessages]);

  useEffect(() => {
    // Scroll to bottom on message change
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleStartSession = async () => {
    try {
      // Start both regular session and real-time session
      await startSession(7); // Default mood
      await startRealtimeSession();
      
      toast({
        title: "Session Started",
        description: "Your therapy session has begun with real-time tracking enabled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const handleSessionEndSubmit = async (data: {
    moodAfter: number;
    notes: string;
    rating: number;
    breakthroughs: string[];
  }) => {
    if (!currentSession) return;

    try {
      // Add breakthroughs to session
      data.breakthroughs.forEach(breakthrough => {
        addBreakthrough(breakthrough);
      });

      // End both regular session and real-time session
      await endSession(data.moodAfter, data.notes, data.rating);
      await endRealtimeSession();
      
      setMessages([]);
      toast({
        title: "Session Completed",
        description: "Thank you for your feedback. Your progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentSession) return;

    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Enhanced Therapy Session</h1>
              {currentTherapist && (
                <p className="text-sm text-muted-foreground">
                  with {currentTherapist.name} ({currentTherapist.title})
                </p>
              )}
              {userPreferences && (
                <Badge variant="outline" className="text-xs mt-1">
                  {userPreferences.communicationStyle} style
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationCenter />
            {currentSession && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Session Active
                </Badge>
                {sessionState.sessionId && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Real-time: {sessionState.connectionStatus}
                  </Badge>
                )}
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEndSession}
              disabled={!currentSession}
            >
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Session Metrics */}
      {currentSession && sessionState.sessionId && (
        <div className="px-4 pt-4 max-w-4xl mx-auto w-full">
          <ChatSessionMetrics 
            sessionState={sessionState}
            messageCount={messages.length}
            className="mb-4"
          />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col p-4 max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && !currentSession ? (
              <div className="text-center text-muted-foreground mt-8">
                Start a session to begin chatting with your AI therapist.
              </div>
            ) : null}
            
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`mb-2 flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center max-w-[80%]">
                    {!message.isUser && (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <Card className="w-fit">
                      <CardContent className="py-2 px-3">
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {!message.isUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => isPlaying ? stopPlayback() : playMessage(message.content)}
                              className="h-6 w-6 p-0 ml-2"
                            >
                              {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    {message.isUser && (
                      <Avatar className="ml-2 h-8 w-8">
                        {user?.user_metadata?.avatar_url ? (
                          <AvatarImage src={user.user_metadata.avatar_url} alt="User Avatar" />
                        ) : (
                          <AvatarFallback>{user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        )}
                      </Avatar>
                    )}
                  </div>
                </div>
                
                {/* Show emotion analysis for user messages */}
                {message.isUser && message.emotion && (
                  <div className="flex justify-end">
                    <EmotionDisplay emotion={message.emotion} className="max-w-xs" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Voice Interaction */}
      {currentSession && (
        <div className="px-4 max-w-4xl mx-auto w-full">
          <VoiceInteraction 
            text={messages.length > 0 ? messages[messages.length - 1]?.content : undefined}
            className="mb-2"
          />
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          {currentSession ? (
            <>
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                className="flex-grow mr-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? "Sending..." : <Send className="h-4 w-4 mr-2" />}
                Send
              </Button>
            </>
          ) : (
            <Button onClick={handleStartSession} disabled={isLoading}
              className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white"
            >
              {isLoading ? "Starting Session..." : "Start Enhanced Session with Real-time Tracking"}
            </Button>
          )}
        </div>
      </div>

      {/* Live Session Indicator */}
      <LiveSessionIndicator />

      <SessionEndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onSubmit={handleSessionEndSubmit}
      />
    </div>
  );
};

export default Chat;
