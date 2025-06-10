
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  User,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  status: 'open' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high';
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  sentBy: 'user' | 'admin';
  sentAt: string;
  isRead: boolean;
}

const UserConversationManager = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      // Simulated conversation data - in real app, this would come from Supabase
      const mockConversations: Conversation[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Alice Johnson',
          userEmail: 'alice@example.com',
          lastMessage: 'I need help with setting up my goals',
          lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'open',
          priority: 'medium',
          unreadCount: 2
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Bob Smith',
          userEmail: 'bob@example.com',
          lastMessage: 'Thank you for the help!',
          lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'resolved',
          priority: 'low',
          unreadCount: 0
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Carol Brown',
          userEmail: 'carol@example.com',
          lastMessage: 'The app is not working properly',
          lastMessageAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'high',
          unreadCount: 1
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      // Simulated message data
      const mockMessages: Message[] = [
        {
          id: '1',
          conversationId,
          content: 'Hi, I need help with setting up my goals in the app.',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: '2',
          conversationId,
          content: 'Hello! I\'d be happy to help you set up your goals. What specific area would you like to focus on?',
          sentBy: 'admin',
          sentAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: '3',
          conversationId,
          content: 'I want to work on my anxiety management and sleep habits.',
          sentBy: 'user',
          sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsLoading(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        conversationId: selectedConversation.id,
        content: newMessage,
        sentBy: 'admin',
        sentAt: new Date().toISOString(),
        isRead: true
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationStatus = async (conversationId: string, status: 'open' | 'resolved' | 'pending') => {
    try {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, status } : conv
        )
      );

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => prev ? { ...prev, status } : null);
      }

      toast({
        title: "Status updated",
        description: `Conversation marked as ${status}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-[calc(100vh-200px)] space-x-4">
      {/* Conversations List */}
      <Card className="w-1/3 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
            Conversations
          </CardTitle>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'open', 'resolved', 'pending'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status as any)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-700' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {conversation.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-white truncate">
                          {conversation.userName}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {conversation.userEmail}
                      </p>
                      <p className="text-sm text-gray-300 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={`${getStatusColor(conversation.status)} text-white text-xs`}>
                      {conversation.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(conversation.priority)} text-white text-xs`}>
                      {conversation.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.lastMessageAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages Panel */}
      <Card className="flex-1 bg-gray-800 border-gray-700">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">
                      {selectedConversation.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">{selectedConversation.userName}</h3>
                    <p className="text-sm text-gray-400">{selectedConversation.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConversationStatus(selectedConversation.id, 'resolved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConversationStatus(selectedConversation.id, 'pending')}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Pending
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sentBy === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sentBy === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {new Date(message.sentAt).toLocaleTimeString()}
                          </span>
                          {message.sentBy === 'admin' && (
                            <CheckCircle className="h-3 w-3 opacity-70" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <div className="flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border-gray-600"
                  rows={2}
                />
                <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default UserConversationManager;
