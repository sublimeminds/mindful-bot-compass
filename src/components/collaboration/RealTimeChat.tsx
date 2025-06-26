
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Users,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'therapist' | 'system';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  isEncrypted: boolean;
}

interface ChatParticipant {
  id: string;
  name: string;
  role: 'user' | 'therapist';
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

const RealTimeChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock initial data
    const mockParticipants: ChatParticipant[] = [
      {
        id: 'user-1',
        name: 'You',
        role: 'user',
        avatar: '/placeholder.svg',
        isOnline: true
      },
      {
        id: 'therapist-1',
        name: 'Dr. Sarah Chen',
        role: 'therapist',
        avatar: '/placeholder.svg',
        isOnline: true
      }
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        content: 'This is a secure, encrypted therapy session. All messages are confidential.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'system',
        isEncrypted: true
      },
      {
        id: '2',
        senderId: 'therapist-1',
        senderName: 'Dr. Sarah Chen',
        senderRole: 'therapist',
        content: 'Hello! I\'m glad you could join today\'s session. How are you feeling right now?',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'text',
        isEncrypted: true
      },
      {
        id: '3',
        senderId: 'user-1',
        senderName: 'You',
        senderRole: 'user',
        content: 'Hi Dr. Chen. I\'ve been feeling a bit anxious lately, especially about work.',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        type: 'text',
        isEncrypted: true
      }
    ];

    setParticipants(mockParticipants);
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user-1',
      senderName: 'You',
      senderRole: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isEncrypted: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate therapist response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'therapist-1',
        senderName: 'Dr. Sarah Chen',
        senderRole: 'therapist',
        content: 'I understand that work anxiety can be really challenging. Can you tell me more about what specifically at work is causing you to feel this way?',
        timestamp: new Date().toISOString(),
        type: 'text',
        isEncrypted: true
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'therapist':
        return 'text-therapy-600';
      case 'system':
        return 'text-gray-500';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Secure Therapy Chat</span>
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                End-to-End Encrypted
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Participants */}
          <div className="flex items-center space-x-3 pt-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{participant.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {participant.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderRole === 'user' ? 'justify-end' : 'justify-start'} ${
                  message.type === 'system' ? 'justify-center' : ''
                }`}
              >
                {message.type === 'system' ? (
                  <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-md text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-start space-x-3 max-w-md ${
                    message.senderRole === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={getRoleColor(message.senderRole)}>
                        {message.senderName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.senderRole === 'user' 
                        ? 'bg-therapy-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${
                          message.senderRole === 'user' ? 'text-therapy-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                        {message.isEncrypted && (
                          <Shield className={`h-3 w-3 ml-2 ${
                            message.senderRole === 'user' ? 'text-therapy-200' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-therapy-600">DC</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send)"
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeChat;
