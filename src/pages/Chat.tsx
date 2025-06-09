
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "@/services/aiService";
import { Badge } from "@/components/ui/badge";
import { useTherapist } from "@/contexts/TherapistContext";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentSession, startSession, endSession } = useSession();
  const navigate = useNavigate();
  const { currentTherapist, getPersonalityPrompt } = useTherapist();

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
  }, [currentSession]);

  useEffect(() => {
    // Scroll to bottom on message change
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleStartSession = async () => {
    try {
      await startSession();
      toast({
        title: "Session Started",
        description: "Your therapy session has begun. Share what's on your mind.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      await endSession();
      setMessages([]);
      toast({
        title: "Session Ended",
        description: "Your therapy session has ended. Feel free to start a new one anytime.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !currentSession) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Add user message
      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: new Date()
      };

      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);

      // Get AI response with personality prompt
      const aiResponse = await sendMessage(
        userMessage, 
        messages,
        getPersonalityPrompt()
      );

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-xl font-semibold">Therapy Session</h1>
              {currentTherapist && (
                <p className="text-sm text-muted-foreground">
                  with {currentTherapist.name} ({currentTherapist.title})
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentSession && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Session Active
              </Badge>
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

      {/* Chat Messages */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col p-4 max-w-4xl mx-auto">
            {messages.length === 0 && !currentSession ? (
              <div className="text-center text-muted-foreground mt-8">
                Start a session to begin chatting with your AI therapist.
              </div>
            ) : null}
            
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`mb-2 flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center">
                  {!message.isUser && (
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <Card className="w-fit max-w-[80%]">
                    <CardContent className="py-2 px-3">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
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
            ))}
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>
      </div>

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
              {isLoading ? "Starting Session..." : "Start New Session"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
