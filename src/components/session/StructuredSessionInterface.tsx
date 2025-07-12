import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Clock, 
  MessageCircle, 
  Target, 
  CheckCircle,
  Send,
  Pause,
  Play,
  Square,
  ChevronRight
} from 'lucide-react';
import { AISessionConductor, SessionState, SessionMessage } from '@/services/aiSessionConductor';
import { toast } from 'sonner';

interface StructuredSessionInterfaceProps {
  therapyApproach: string;
  initialMood?: number;
  onSessionEnd: (summary: any) => void;
}

const StructuredSessionInterface = ({ 
  therapyApproach, 
  initialMood, 
  onSessionEnd 
}: StructuredSessionInterfaceProps) => {
  const [conductor] = useState(() => new AISessionConductor());
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  // Using sonner toast
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startSession();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (sessionState && sessionStarted && !isPaused) {
      intervalRef.current = setInterval(updateSessionTime, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionState, sessionStarted, isPaused]);

  const startSession = async () => {
    try {
      setIsLoading(true);
      const newSessionState = await conductor.startSession(
        'current-user', // Replace with actual user ID
        therapyApproach,
        initialMood
      );
      setSessionState(newSessionState);
      setSessionStarted(true);
      
      // Send welcome message
      const welcomeResponse = await conductor.sendMessage(
        `Hello, I'm ready to start my ${therapyApproach} therapy session.`
      );
      
      const updatedMessages = conductor.getMessages();
      setMessages([...updatedMessages]);
      
      toast({
        title: "Session Started",
        description: `Your ${therapyApproach} therapy session has begun.`
      });
      
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start therapy session.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionTime = () => {
    if (!sessionState) return;
    
    const currentSession = conductor.getCurrentSession();
    if (currentSession) {
      const remainingMinutes = Math.max(0, 
        currentSession.playbook.totalDuration - currentSession.elapsedMinutes
      );
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      setTimeLeft(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
      
      // Update session state
      setSessionState({ ...currentSession });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !sessionStarted) return;

    try {
      setIsLoading(true);
      const userMessage = input;
      setInput('');

      // Add user message immediately for better UX
      const tempUserMessage: SessionMessage = {
        id: 'temp-' + Date.now(),
        content: userMessage,
        sender: 'user',
        timestamp: new Date(),
        phaseId: sessionState?.currentPhase.id || ''
      };
      setMessages(prev => [...prev, tempUserMessage]);

      const response = await conductor.sendMessage(userMessage);
      const updatedMessages = conductor.getMessages();
      const updatedSession = conductor.getCurrentSession();
      
      setMessages([...updatedMessages]);
      if (updatedSession) {
        setSessionState({ ...updatedSession });
      }

      // Show phase transition notification
      if (response.nextAction === 'transition') {
        toast({
          title: "Session Phase Update",
          description: `Moving to: ${updatedSession?.currentPhase.name}`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Session Resumed" : "Session Paused",
      description: isPaused ? "Your therapy session has resumed." : "Your therapy session is paused."
    });
  };

  const handleEndSession = async () => {
    try {
      setIsLoading(true);
      const summary = await conductor.endSession();
      onSessionEnd(summary);
      
      toast({
        title: "Session Complete",
        description: "Your therapy session has ended successfully."
      });
      
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session properly.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSessionStarted(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!sessionState) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-spin mx-auto mb-4 text-therapy-600" />
          <p className="text-lg font-medium">Starting your therapy session...</p>
        </div>
      </div>
    );
  }

  const sessionProgress = conductor.getSessionProgress();
  const phaseProgress = conductor.getPhaseProgress();

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chat Area */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-therapy-600" />
                {sessionState.playbook.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeLeft}
                </Badge>
                <Badge variant={isPaused ? "secondary" : "default"}>
                  {isPaused ? "Paused" : "Active"}
                </Badge>
              </div>
            </div>
            
            {/* Session Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Session Progress</span>
                <span>{Math.round(sessionProgress)}%</span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-therapy-600 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-therapy-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-therapy-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-therapy-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="ml-2 text-sm text-muted-foreground">Therapist is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Share your thoughts..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || isPaused || !sessionStarted}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || isPaused || !sessionStarted || !input.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Current Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current Phase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{sessionState.currentPhase.name}</h4>
                <Badge variant="outline">{Math.round(phaseProgress)}%</Badge>
              </div>
              <Progress value={phaseProgress} className="h-1 mb-2" />
              <p className="text-sm text-muted-foreground">
                {sessionState.currentPhase.description}
              </p>
            </div>
            
            {/* Phase Objectives */}
            <div>
              <h5 className="font-medium text-sm mb-2">Objectives:</h5>
              <ul className="space-y-1">
                {sessionState.currentPhase.objectives.slice(0, 3).map((objective, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-therapy-600" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Session Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={handlePauseResume} 
              variant="outline" 
              className="w-full"
              disabled={!sessionStarted}
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleEndSession} 
              variant="destructive" 
              className="w-full"
              disabled={!sessionStarted || isLoading}
            >
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </CardContent>
        </Card>

        {/* Session Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Messages:</span>
              <span>{sessionState.messageCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Engagement:</span>
              <Badge variant="outline" className="text-xs">
                {sessionState.userEngagement}
              </Badge>
            </div>
            {sessionState.mood.current && (
              <div className="flex justify-between text-sm">
                <span>Current Mood:</span>
                <span>{sessionState.mood.current}/10</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Criteria Met:</span>
              <span>{sessionState.criteriaMet.length}/{sessionState.currentPhase.transitionCriteria.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StructuredSessionInterface;