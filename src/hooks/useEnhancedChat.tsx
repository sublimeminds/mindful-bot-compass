
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
}

export const useEnhancedChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  const loadPreferences = useCallback(async () => {
    if (!user) return;
    
    try {
      // Mock preferences loading
      setUserPreferences({ theme: 'default' });
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Mock AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're saying: "${content}". How can I help you further?`,
        isUser: false,
        timestamp: new Date(),
        emotion: 'supportive'
      };

      setMessages(prev => [...prev, aiMessage]);

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
  }, [isLoading, toast]);

  const playMessage = useCallback(async (content: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      // Mock voice playback
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error playing message:', error);
      toast({
        title: "Playback Error",
        description: "Failed to play message audio.",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying, toast]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    isPlaying,
    sendMessage,
    playMessage,
    stopPlayback,
    loadPreferences,
    userPreferences
  };
};
