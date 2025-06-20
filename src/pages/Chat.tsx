import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Mic, MicOff, Brain, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { chatService } from '@/services/chatService';
import { Message } from '@/types/chat';

const Chat = () => {
  const { user } = useSimpleApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      loadInitialMessages();
    }
  }, [user, navigate]);

  const loadInitialMessages = async () => {
    setIsLoading(true);
    try {
      const initialMessages = await chatService.getInitialMessages(user!.id);
      setMessages(initialMessages);
    } catch (error) {
      toast({
        title: 'Error loading messages',
        description: 'Failed to load initial messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageToSend: Message = {
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      userId: user!.id,
    };

    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage('');

    try {
      await chatService.sendMessage(messageToSend);
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Implement stop recording and send voice message logic here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="p-6">
            <Brain className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-center text-lg font-medium">Loading messages...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
        <CardTitle className="text-2xl font-bold">
          <MessageCircle className="mr-2 h-5 w-5 inline-block align-middle" />
          Therapy Chat
        </CardTitle>
        <Badge variant="secondary">AI Powered</Badge>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-2/3 ${message.sender === 'user'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {message.text}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-full"
          />
          <Button onClick={handleSendMessage} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
          {isRecording ? (
            <Button variant="destructive" onClick={handleStopRecording} aria-label="Stop recording">
              <MicOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleStartRecording} aria-label="Start recording">
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
