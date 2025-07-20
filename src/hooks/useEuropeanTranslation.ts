
import { useState, useCallback, useEffect } from 'react';
import { europeanTranslationService, TranslationRequest, TranslationResponse } from '@/services/europeanTranslationService';

export interface UseTranslationOptions {
  autoDetectLanguage?: boolean;
  cacheEnabled?: boolean;
  sessionId?: string;
  contextType?: TranslationRequest['contextType'];
  therapeuticCategory?: TranslationRequest['therapeuticCategory'];
}

export interface UseTranslationResult {
  translate: (text: string, targetLanguage: string, sourceLanguage?: string) => Promise<string>;
  translateBatch: (texts: string[], targetLanguage: string, sourceLanguage?: string) => Promise<string[]>;
  isTranslating: boolean;
  error: string | null;
  lastResponse: TranslationResponse | null;
  startSession: (sourceLanguage: string, targetLanguage: string) => Promise<string>;
  endSession: () => Promise<void>;
  currentSessionId: string | null;
}

export function useEuropeanTranslation(
  userId?: string,
  options: UseTranslationOptions = {}
): UseTranslationResult {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<TranslationResponse | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string> => {
    if (!text.trim()) return text;

    setIsTranslating(true);
    setError(null);

    try {
      const request: TranslationRequest = {
        text,
        sourceLanguage,
        targetLanguage,
        userId,
        sessionId: options.sessionId || currentSessionId || undefined,
        contextType: options.contextType || 'general',
        therapeuticCategory: options.therapeuticCategory
      };

      let response: TranslationResponse;

      if (currentSessionId && options.sessionId !== undefined) {
        response = await europeanTranslationService.translateInSession(
          currentSessionId,
          text,
          request
        );
      } else {
        response = await europeanTranslationService.translate(request);
      }

      setLastResponse(response);
      return response.translatedText;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      console.error('Translation error:', err);
      
      // Return original text as fallback
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [userId, options.sessionId, options.contextType, options.therapeuticCategory, currentSessionId]);

  const translateBatch = useCallback(async (
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string[]> => {
    if (texts.length === 0) return [];

    setIsTranslating(true);
    setError(null);

    try {
      const responses = await europeanTranslationService.batchTranslate(
        texts,
        sourceLanguage,
        targetLanguage,
        {
          userId,
          sessionId: options.sessionId || currentSessionId || undefined,
          contextType: options.contextType || 'general',
          therapeuticCategory: options.therapeuticCategory
        }
      );

      setLastResponse(responses[responses.length - 1] || null);
      return responses.map(r => r.translatedText);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch translation failed';
      setError(errorMessage);
      console.error('Batch translation error:', err);
      
      // Return original texts as fallback
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [userId, options.sessionId, options.contextType, options.therapeuticCategory, currentSessionId]);

  const startSession = useCallback(async (
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> => {
    try {
      const sessionId = await europeanTranslationService.startTranslationSession(
        sourceLanguage,
        targetLanguage,
        userId
      );
      
      setCurrentSessionId(sessionId);
      return sessionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start session';
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  const endSession = useCallback(async (): Promise<void> => {
    if (!currentSessionId) return;

    try {
      await europeanTranslationService.endTranslationSession(currentSessionId);
      setCurrentSessionId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
      setError(errorMessage);
      console.error('Session end error:', err);
    }
  }, [currentSessionId]);

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (currentSessionId) {
        europeanTranslationService.endTranslationSession(currentSessionId).catch(console.error);
      }
    };
  }, [currentSessionId]);

  return {
    translate,
    translateBatch,
    isTranslating,
    error,
    lastResponse,
    startSession,
    endSession,
    currentSessionId
  };
}

// Hook for real-time translation with WebSocket support
export function useRealTimeTranslation(
  sourceLanguage: string,
  targetLanguage: string,
  userId?: string
) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const translation = useEuropeanTranslation(userId, {
    sessionId: sessionId || undefined,
    contextType: 'therapeutic'
  });

  const connect = useCallback(async () => {
    try {
      const newSessionId = await translation.startSession(sourceLanguage, targetLanguage);
      setSessionId(newSessionId);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect real-time translation:', error);
      setIsConnected(false);
    }
  }, [sourceLanguage, targetLanguage, translation]);

  const disconnect = useCallback(async () => {
    if (sessionId) {
      await translation.endSession();
      setSessionId(null);
      setIsConnected(false);
    }
  }, [sessionId, translation]);

  // Auto-connect on language change
  useEffect(() => {
    if (sourceLanguage && targetLanguage && sourceLanguage !== targetLanguage) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [sourceLanguage, targetLanguage]);

  return {
    ...translation,
    connect,
    disconnect,
    isConnected,
    sessionId
  };
}
