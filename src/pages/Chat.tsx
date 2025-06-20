
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { chatService, ChatMessage } from '@/services/chatService';
import { ChatState } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [chatState, setChatState] = useState<ChatState>({
    currentSession: null,
    messages: [],
    isLoading: false,
    error: null
  });
  const [messageInput, setMessageInput] = useState('');

  const startSession = async () => {
    if (!user) return;

    setChatState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const session = await chatService.createSession(user.id);
      if (session) {
        setChatState(prev => ({
          ...prev,
          currentSession: session,
          messages: [],
          isLoading: false
        }));
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start chat session'
      }));
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !chatState.currentSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'user',
      timestamp: new Date(),
      sessionId: chatState.currentSession.id
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setMessageInput('');

    // Send to backend
    await chatService.sendMessage(chatState.currentSession.id, messageInput, 'user');

    // Mock AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're saying: "${messageInput}". How can I help you with that?`,
        sender: 'ai',
        timestamp: new Date(),
        sessionId: chatState.currentSession!.id
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage]
      }));

      chatService.sendMessage(chatState.currentSession!.id, aiMessage.content, 'ai');
    }, 1000);
  };

  const endSession = async () => {
    if (!chatState.currentSession) return;

    await chatService.endSession(chatState.currentSession.id);
    setChatState({
      currentSession: null,
      messages: [],
      isLoading: false,
      error: null
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Please sign in to start a chat session.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Therapy Chat
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          {!chatState.currentSession ? (
            <div className="flex-1 flex items-center justify-center">
              <Button onClick={startSession} disabled={chatState.isLoading}>
                {chatState.isLoading ? 'Starting...' : 'Start Therapy Session'}
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {chatState.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-therapy-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={endSession}>
                  End Session
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
