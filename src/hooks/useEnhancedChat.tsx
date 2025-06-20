import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { chatService } from '@/services/chatService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

export const useEnhancedChat = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const { currentSession, addMessage } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;
    
    try {
      const preferences = await PersonalizationService.getUserProfile(user.id);
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession || isLoading) return;

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
      await addMessage(content, 'user');

      // Get AI response with emotion analysis
      const { response, emotion } = await sendEnhancedMessage(
        content,
        messages,
        undefined,
        userPreferences
      );

      // Create AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        emotion
      };

      setMessages(prev => [...prev, aiMessage]);
      await addMessage(response, 'ai');

      // Track interaction for personalization
      if (user) {
        await PersonalizationService.trackUserInteraction(user.id, 'message_sent', {
          userMessage: content,
          aiResponse: response,
          emotion: emotion,
          timestamp: new Date().toISOString()
        });
      }

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
  }, [currentSession, isLoading, messages, userPreferences, user, addMessage, toast]);

  const playMessage = useCallback(async (content: string) => {
    if (isPlaying || !voiceService.hasApiKey()) return;

    setIsPlaying(true);
    try {
      await voiceService.playText(content);
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
    voiceService.stop();
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
