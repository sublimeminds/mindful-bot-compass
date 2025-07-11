import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Mic, 
  Video, 
  Users, 
  Settings, 
  Brain,
  Heart,
  Zap,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTherapistSelection } from '@/hooks/useTherapistSelection';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'therapist';
  timestamp: Date;
  therapistId?: string;
  therapistName?: string;
  emotion?: string;
  sessionContext?: string;
}

interface TherapistContext {
  id: string;
  name: string;
  specialty: string;
  approach: string;
  status: 'active' | 'available' | 'busy';
  currentMood?: string;
  lastInteraction?: Date;
}

const UnifiedTherapyChat = () => {
  const { user } = useSimpleApp();
  const { currentSelection } = useTherapistSelection();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTherapist, setActiveTherapist] = useState<string>('primary');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionMode, setSessionMode] = useState<'text' | 'voice' | 'video'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock therapist contexts for multi-therapist support
  const therapistContexts: TherapistContext[] = [
    {
      id: 'primary',
      name: 'Dr. Sarah Chen',
      specialty: 'Anxiety & Depression',
      approach: 'CBT',
      status: 'active',
      currentMood: 'supportive',
      lastInteraction: new Date()
    },
    {
      id: 'adhd-specialist',
      name: 'Dr. Maya Patel',
      specialty: 'ADHD & Focus',
      approach: 'Mindfulness',
      status: 'available',
      lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ];

  // Mock conversation history
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: "Hello! I'm Dr. Sarah Chen, your anxiety specialist. How are you feeling today?",
        sender: 'therapist',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        therapistId: 'primary',
        therapistName: 'Dr. Sarah Chen',
        sessionContext: 'anxiety-support'
      },
      {
        id: '2',
        content: "Hi Dr. Chen. I've been feeling quite anxious about work lately.",
        sender: 'user',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        emotion: 'anxious'
      },
      {
        id: '3',
        content: "I understand. Let's explore those work-related feelings. Can you tell me what specifically about work is causing you anxiety?",
        sender: 'therapist',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        therapistId: 'primary',
        therapistName: 'Dr. Sarah Chen'
      }
    ];
    setMessages(mockMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate therapist response
    setTimeout(() => {
      const activeTherapistContext = therapistContexts.find(t => t.id === activeTherapist);
      const therapistResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateTherapistResponse(newMessage, activeTherapistContext),
        sender: 'therapist',
        timestamp: new Date(),
        therapistId: activeTherapist,
        therapistName: activeTherapistContext?.name
      };
      
      setMessages(prev => [...prev, therapistResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateTherapistResponse = (userMessage: string, therapist?: TherapistContext) => {
    // Simple response generation based on therapist specialty
    if (therapist?.specialty.includes('ADHD')) {
      return "I hear you're dealing with focus challenges. Let's work on some mindfulness techniques that can help improve your concentration.";
    } else if (therapist?.specialty.includes('Anxiety')) {
      return "Thank you for sharing that with me. Let's explore some coping strategies that might help with your anxiety.";
    }
    return "I understand what you're going through. How can I best support you right now?";
  };

  const switchTherapist = (therapistId: string) => {
    setActiveTherapist(therapistId);
    const therapist = therapistContexts.find(t => t.id === therapistId);
    if (therapist) {
      const contextSwitchMessage: Message = {
        id: Date.now().toString(),
        content: `You're now chatting with ${therapist.name}, specializing in ${therapist.specialty}.`,
        sender: 'therapist',
        timestamp: new Date(),
        therapistId: therapistId,
        therapistName: therapist.name,
        sessionContext: 'context-switch'
      };
      setMessages(prev => [...prev, contextSwitchMessage]);
    }
  };

  const currentTherapist = therapistContexts.find(t => t.id === activeTherapist);

  return (
    <div className="h-full flex flex-col space-y-4 p-6">
      {/* Header with Therapist Selection */}
      <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-harmony-25">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-therapy-300">
                <AvatarFallback className="bg-therapy-500 text-white">
                  {currentTherapist?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{currentTherapist?.name}</h2>
                <p className="text-sm text-muted-foreground">{currentTherapist?.specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={currentTherapist?.status === 'active' ? 'default' : 'secondary'}>
                {currentTherapist?.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Switch
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Therapist Selection Tabs */}
      <Tabs value={activeTherapist} onValueChange={switchTherapist} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {therapistContexts.map((therapist) => (
            <TabsTrigger key={therapist.id} value={therapist.id} className="text-sm">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  therapist.status === 'active' ? 'bg-green-500' : 
                  therapist.status === 'available' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <span>{therapist.name.split(' ')[1]}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Session Mode Selector */}
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <div className="flex items-center space-x-2">
              <Button
                variant={sessionMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionMode('text')}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Text
              </Button>
              <Button
                variant={sessionMode === 'voice' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionMode('voice')}
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice
              </Button>
              <Button
                variant={sessionMode === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSessionMode('video')}
              >
                <Video className="h-4 w-4 mr-1" />
                Video
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Session: 23 min</span>
            </div>
          </div>

          {/* Messages Area */}
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
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
                    {message.sender === 'therapist' && message.therapistName && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {message.therapistName}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t border-border/40 p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${currentTherapist?.name}...`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="flex items-center justify-center">
          <Heart className="h-4 w-4 mr-1" />
          Mood Check
        </Button>
        <Button variant="outline" size="sm" className="flex items-center justify-center">
          <Brain className="h-4 w-4 mr-1" />
          Coping Skills
        </Button>
        <Button variant="outline" size="sm" className="flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Crisis Help
        </Button>
      </div>
    </div>
  );
};

export default UnifiedTherapyChat;