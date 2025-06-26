
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Reply,
  Heart,
  ThumbsUp,
  Phone,
  Video,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: 'therapist' | 'client' | 'observer';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: string;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  role: 'therapist' | 'client' | 'observer';
  status: 'online' | 'away' | 'offline';
  avatar: string;
  lastSeen: Date;
}

const RealTimeChat = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [users] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'therapist',
      status: 'online',
      avatar: '👩‍⚕️',
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'You',
      role: 'client',
      status: 'online',
      avatar: '👤',
      lastSeen: new Date()
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      role: 'observer',
      status: 'away',
      avatar: '👨‍⚕️',
      lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'therapist',
      content: 'Hello! How are you feeling today?',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      type: 'text',
      reactions: [{ emoji: '👍', users: ['2'] }],
      isRead: true
    },
    {
      id: '2',
      userId: '2',
      userName: 'You',
      userRole: 'client',
      content: 'Hi Dr. Johnson! I\'m doing better today, thank you for asking.',
      timestamp: new Date(Date.now() - 1740000), // 29 minutes ago
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      userId: '1',
      userName: 'Dr. Sarah Johnson',
      userRole: 'therapist',
      content: 'That\'s wonderful to hear! What would you like to focus on in today\'s session?',
      timestamp: new Date(Date.now() - 1680000), // 28 minutes ago
      type: 'text',
      isRead: true
    },
    {
      id: '4',
      userId: '3',
      userName: 'Dr. Michael Chen',
      userRole: 'observer',
      content: 'I\'ll be observing today\'s session for supervision purposes.',
      timestamp: new Date(Date.now() - 1620000), // 27 minutes ago
      type: 'text',
      isRead: true
    },
    {
      id: '5',
      userId: '2',
      userName: 'You',
      userRole: 'client',
      content: 'I\'d like to discuss some strategies for managing work stress.',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      type: 'text',
      isRead: false
    }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: '2',
      userName: 'You',
      userRole: 'client',
      content: message,
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate therapist response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        userId: '1',
        userName: 'Dr. Sarah Johnson',
        userRole: 'therapist',
        content: 'That\'s an important topic. Let\'s explore some effective stress management techniques together.',
        timestamp: new Date(),
        type: 'text',
        isRead: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);

    toast({
      title: "Message Sent",
      description: "Your message has been delivered to all participants.",
    });
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes('2')) {
            existingReaction.users = existingReaction.users.filter(u => u !== '2');
          } else {
            existingReaction.users.push('2');
          }
        } else {
          msg.reactions = [...(msg.reactions || []), { emoji, users: ['2'] }];
        }
      }
      return msg;
    }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'therapist': return 'text-blue-600';
      case 'client': return 'text-green-600';
      case 'observer': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || msg.userRole === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-time Chat</h2>
          <p className="text-muted-foreground">Secure messaging during therapy sessions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>
        </div>
      </div>

      {/* Online Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center space-x-2 p-2 border rounded-lg">
                <div className="relative">
                  <div className="w-8 h-8 bg-therapy-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">{user.avatar}</span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                </div>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className={`text-xs ${getRoleColor(user.role)}`}>
                    {user.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-96 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>Session Chat</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md text-sm"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All</option>
                <option value="therapist">Therapist</option>
                <option value="client">Client</option>
                <option value="observer">Observer</option>
              </select>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3 group">
              <div className="w-8 h-8 bg-therapy-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">
                  {msg.userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${getRoleColor(msg.userRole)}`}>
                    {msg.userName}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {msg.userRole}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm mt-1 break-words">{msg.content}</p>
                
                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {msg.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => addReaction(msg.id, reaction.emoji)}
                        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.users.length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Message Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <button
                  onClick={() => addReaction(msg.id, '👍')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => addReaction(msg.id, '❤️')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Heart className="h-3 w-3" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Reply className="h-3 w-3" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">Dr. Sarah is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input */}
        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button className="p-2 hover:bg-gray-100 rounded">
              <Smile className="h-4 w-4" />
            </button>
            <Button onClick={sendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RealTimeChat;
