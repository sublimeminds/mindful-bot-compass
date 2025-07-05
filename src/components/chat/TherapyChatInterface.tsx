
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Mic, MicOff, Volume2, VolumeX, Brain, Heart, Lightbulb } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';

const TherapyChatInterface = () => {
  const { user } = useSimpleApp();
  const {
    messages,
    isLoading,
    sendMessage,
    playMessage,
    stopPlayback,
    isPlaying,
    loadPreferences,
    userPreferences
  } = useEnhancedChat();
  const [input, setInput] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    // Scroll to bottom when messages change
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  const handlePlayMessage = async (messageContent: string) => {
    await playMessage(messageContent);
  };

  const handleStopPlayback = () => {
    stopPlayback();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          <Brain className="mr-2 h-5 w-5" />
          AI Therapy Chat
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Lightbulb className="mr-2 h-4 w-4" />
            AI Enhanced
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-full flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="max-w-sm rounded-md border px-4 py-2 text-sm">
                  {message.content}
                  {message.emotion && (
                    <Badge variant="outline" className="ml-2">
                      {message.emotion}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <div className="m-4 flex items-center space-x-4">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? (
            <>
              <Brain className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              Send
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default TherapyChatInterface;
