import { useState, useEffect, useCallback, useRef } from 'react';
import { useAITranslation } from './useAITranslation';
import { TranslationResponse } from '@/services/aiTranslationService';

interface RealTimeTranslationMessage {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  isTranslating: boolean;
  error?: string;
  quality?: number;
}

interface UseRealTimeTranslationOptions {
  sessionId: string;
  sessionType: 'therapy' | 'chat' | 'crisis';
  targetLanguage: string;
  sourceLanguage?: string;
  autoTranslate?: boolean;
  preserveEmotionalContext?: boolean;
  debounceDelay?: number;
}

export function useRealTimeTranslation(options: UseRealTimeTranslationOptions) {
  const {
    translateMessage,
    translateTextDebounced,
    isTranslating: globalIsTranslating,
    userPreferences
  } = useAITranslation({
    contextType: options.sessionType === 'therapy' ? 'therapeutic' : 
                options.sessionType === 'crisis' ? 'crisis' : 'general',
    sessionId: options.sessionId,
    realTimeTranslation: true
  });

  const [messages, setMessages] = useState<RealTimeTranslationMessage[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationSession, setTranslationSession] = useState<string | null>(null);
  
  const messageCountRef = useRef(0);
  const translationQueueRef = useRef<Map<string, Promise<TranslationResponse>>>(new Map());

  // Start translation session
  const startTranslationSession = useCallback(async () => {
    try {
      // You could create a translation session record here
      const sessionId = `translation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTranslationSession(sessionId);
      console.log('Translation session started:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to start translation session:', error);
      return null;
    }
  }, []);

  // End translation session
  const endTranslationSession = useCallback(async () => {
    if (translationSession) {
      console.log('Translation session ended:', translationSession);
      setTranslationSession(null);
    }
  }, [translationSession]);

  // Add message and translate if needed
  const addMessage = useCallback(async (
    text: string,
    shouldTranslate: boolean = true,
    messageContext?: {
      userMood?: string;
      therapyApproach?: string;
    }
  ): Promise<string> => {
    const messageId = `msg-${Date.now()}-${++messageCountRef.current}`;
    
    // Create initial message
    const initialMessage: RealTimeTranslationMessage = {
      id: messageId,
      originalText: text,
      translatedText: text, // Initially same as original
      sourceLanguage: options.sourceLanguage || 'en',
      targetLanguage: options.targetLanguage,
      timestamp: new Date(),
      isTranslating: shouldTranslate && options.autoTranslate !== false,
      quality: 1.0
    };

    setMessages(prev => [...prev, initialMessage]);

    // Translate if needed
    if (shouldTranslate && options.autoTranslate !== false && 
        initialMessage.sourceLanguage !== initialMessage.targetLanguage) {
      
      setIsTranslating(true);
      
      try {
        // Check if translation is already in progress
        const queueKey = `${text}-${options.targetLanguage}`;
        let translationPromise = translationQueueRef.current.get(queueKey);
        
        if (!translationPromise) {
          translationPromise = translateMessage(
            text,
            {
              sessionType: options.sessionType,
              userMood: messageContext?.userMood,
              therapyApproach: messageContext?.therapyApproach
            },
            options.targetLanguage
          );
          translationQueueRef.current.set(queueKey, translationPromise);
        }

        const result = await translationPromise;
        translationQueueRef.current.delete(queueKey);

        // Update message with translation
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                translatedText: result.translatedText,
                isTranslating: false,
                error: result.error,
                quality: result.quality
              }
            : msg
        ));

        setIsTranslating(false);
        return result.translatedText;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Translation failed';
        
        // Update message with error
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                isTranslating: false,
                error: errorMessage
              }
            : msg
        ));

        setIsTranslating(false);
        console.error('Real-time translation failed:', error);
        return text; // Return original text on error
      }
    }

    return text;
  }, [options, translateMessage]);

  // Translate existing message
  const translateExistingMessage = useCallback(async (
    messageId: string,
    newTargetLanguage?: string
  ): Promise<void> => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const targetLang = newTargetLanguage || options.targetLanguage;
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isTranslating: true, error: undefined }
        : msg
    ));

    try {
      const result = await translateMessage(
        message.originalText,
        { sessionType: options.sessionType },
        targetLang
      );

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              translatedText: result.translatedText,
              targetLanguage: targetLang,
              isTranslating: false,
              error: result.error,
              quality: result.quality
            }
          : msg
      ));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              isTranslating: false,
              error: errorMessage
            }
          : msg
      ));
    }
  }, [messages, options.targetLanguage, translateMessage, options.sessionType]);

  // Batch translate all messages
  const retranslateAll = useCallback(async (newTargetLanguage?: string): Promise<void> => {
    const targetLang = newTargetLanguage || options.targetLanguage;
    
    setIsTranslating(true);
    
    // Mark all messages as translating
    setMessages(prev => prev.map(msg => ({ 
      ...msg, 
      isTranslating: true, 
      error: undefined,
      targetLanguage: targetLang
    })));

    try {
      const translationPromises = messages.map(async (message) => {
        try {
          const result = await translateMessage(
            message.originalText,
            { sessionType: options.sessionType },
            targetLang
          );
          
          return {
            id: message.id,
            translatedText: result.translatedText,
            error: result.error,
            quality: result.quality
          };
        } catch (error) {
          return {
            id: message.id,
            translatedText: message.originalText,
            error: error instanceof Error ? error.message : 'Translation failed',
            quality: 0
          };
        }
      });

      const results = await Promise.all(translationPromises);
      
      // Update all messages with results
      setMessages(prev => prev.map(msg => {
        const result = results.find(r => r.id === msg.id);
        return result ? {
          ...msg,
          translatedText: result.translatedText,
          targetLanguage: targetLang,
          isTranslating: false,
          error: result.error,
          quality: result.quality
        } : {
          ...msg,
          isTranslating: false
        };
      }));

    } catch (error) {
      console.error('Batch retranslation failed:', error);
      
      // Mark all as not translating
      setMessages(prev => prev.map(msg => ({ 
        ...msg, 
        isTranslating: false,
        error: 'Batch translation failed'
      })));
    }

    setIsTranslating(false);
  }, [messages, options.targetLanguage, translateMessage, options.sessionType]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    translationQueueRef.current.clear();
  }, []);

  // Get translation statistics
  const getStats = useCallback(() => {
    const totalMessages = messages.length;
    const translatedMessages = messages.filter(m => m.translatedText !== m.originalText).length;
    const errorMessages = messages.filter(m => m.error).length;
    const averageQuality = messages.reduce((sum, m) => sum + (m.quality || 0), 0) / totalMessages || 0;

    return {
      totalMessages,
      translatedMessages,
      errorMessages,
      averageQuality,
      translationRate: totalMessages > 0 ? translatedMessages / totalMessages : 0
    };
  }, [messages]);

  // Auto-start session if needed
  useEffect(() => {
    if (options.autoTranslate !== false && !translationSession) {
      startTranslationSession();
    }
  }, [options.autoTranslate, translationSession, startTranslationSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endTranslationSession();
      translationQueueRef.current.clear();
    };
  }, [endTranslationSession]);

  return {
    // Messages
    messages,
    addMessage,
    translateExistingMessage,
    retranslateAll,
    clearMessages,

    // Session management
    translationSession,
    startTranslationSession,
    endTranslationSession,

    // State
    isTranslating: isTranslating || globalIsTranslating,
    
    // Statistics
    getStats,

    // Configuration
    userPreferences
  };
}