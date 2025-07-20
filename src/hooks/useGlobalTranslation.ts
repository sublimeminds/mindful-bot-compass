
import { useState, useCallback, useEffect } from 'react';
import { globalTranslationService, GlobalTranslationService, GlobalTranslationRequest, GlobalTranslationResponse, GlobalCulturalContext } from '@/services/globalTranslationService';

export interface UseGlobalTranslationOptions {
  autoDetectLanguage?: boolean;
  cacheEnabled?: boolean;
  sessionId?: string;
  contextType?: GlobalTranslationRequest['contextType'];
  therapeuticCategory?: string;
  voiceEnabled?: boolean;
  preserveFormality?: boolean;
  culturalContext?: GlobalCulturalContext;
}

export interface UseGlobalTranslationResult {
  translate: (text: string, targetLanguage: string, sourceLanguage?: string) => Promise<string>;
  translateWithVoice: (text: string, targetLanguage: string, sourceLanguage?: string) => Promise<{ text: string; voice?: string }>;
  translateBatch: (requests: GlobalTranslationRequest[]) => Promise<GlobalTranslationResponse[]>;
  detectLanguage: (text: string) => Promise<string>;
  getRegionalVariations: (text: string, language: string, regions: string[]) => Promise<Record<string, string>>;
  isTranslating: boolean;
  error: string | null;
  lastResponse: GlobalTranslationResponse | null;
  startSession: (sourceLanguage: string, targetLanguage: string) => Promise<string>;
  endSession: () => Promise<void>;
  currentSessionId: string | null;
  supportedLanguages: typeof GlobalTranslationService.GLOBAL_LANGUAGES;
  languagesByRegion: Record<string, Array<{ code: string; name: string; nativeName: string; family: string }>>;
}

export function useGlobalTranslation(
  userId?: string,
  options: UseGlobalTranslationOptions = {}
): UseGlobalTranslationResult {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<GlobalTranslationResponse | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> => {
    if (!text.trim()) return text;

    setIsTranslating(true);
    setError(null);

    try {
      let detectedSourceLanguage = sourceLanguage;
      
      if (!detectedSourceLanguage && options.autoDetectLanguage) {
        detectedSourceLanguage = await globalTranslationService.detectLanguage(text);
      }

      const request: GlobalTranslationRequest = {
        text,
        sourceLanguage: detectedSourceLanguage || 'en',
        targetLanguage,
        userId,
        sessionId: options.sessionId || currentSessionId || undefined,
        contextType: options.contextType || 'general',
        therapeuticCategory: options.therapeuticCategory,
        voiceEnabled: options.voiceEnabled,
        preserveFormality: options.preserveFormality,
        culturalContext: options.culturalContext
      };

      const response = await globalTranslationService.translate(request);
      setLastResponse(response);
      return response.translatedText;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      console.error('Global translation error:', err);
      
      // Return original text as fallback
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [userId, options, currentSessionId]);

  const translateWithVoice = useCallback(async (
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<{ text: string; voice?: string }> => {
    if (!text.trim()) return { text };

    setIsTranslating(true);
    setError(null);

    try {
      let detectedSourceLanguage = sourceLanguage;
      
      if (!detectedSourceLanguage && options.autoDetectLanguage) {
        detectedSourceLanguage = await globalTranslationService.detectLanguage(text);
      }

      const request: GlobalTranslationRequest = {
        text,
        sourceLanguage: detectedSourceLanguage || 'en',
        targetLanguage,
        userId,
        sessionId: options.sessionId || currentSessionId || undefined,
        contextType: options.contextType || 'general',
        therapeuticCategory: options.therapeuticCategory,
        voiceEnabled: true,
        preserveFormality: options.preserveFormality,
        culturalContext: options.culturalContext
      };

      const response = await globalTranslationService.translateWithVoice(request);
      setLastResponse(response);
      return {
        text: response.translatedText,
        voice: response.voiceContent
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation with voice failed';
      setError(errorMessage);
      console.error('Global translation with voice error:', err);
      
      return { text };
    } finally {
      setIsTranslating(false);
    }
  }, [userId, options, currentSessionId]);

  const translateBatch = useCallback(async (
    requests: GlobalTranslationRequest[]
  ): Promise<GlobalTranslationResponse[]> => {
    if (requests.length === 0) return [];

    setIsTranslating(true);
    setError(null);

    try {
      const responses = await globalTranslationService.batchTranslate(requests);
      setLastResponse(responses[responses.length - 1] || null);
      return responses;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch translation failed';
      setError(errorMessage);
      console.error('Global batch translation error:', err);
      return [];
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const detectLanguage = useCallback(async (text: string): Promise<string> => {
    try {
      return await globalTranslationService.detectLanguage(text);
    } catch (err) {
      console.error('Language detection error:', err);
      return 'en';
    }
  }, []);

  const getRegionalVariations = useCallback(async (
    text: string,
    language: string,
    regions: string[]
  ): Promise<Record<string, string>> => {
    try {
      return await globalTranslationService.getRegionalVariations(text, language, regions);
    } catch (err) {
      console.error('Regional variations error:', err);
      return {};
    }
  }, []);

  const startSession = useCallback(async (
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> => {
    try {
      const sessionId = await globalTranslationService.startGlobalSession(
        sourceLanguage,
        targetLanguage,
        userId,
        options.culturalContext
      );
      
      setCurrentSessionId(sessionId);
      return sessionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start session';
      setError(errorMessage);
      throw err;
    }
  }, [userId, options.culturalContext]);

  const endSession = useCallback(async (): Promise<void> => {
    if (!currentSessionId) return;

    try {
      // Update session end time
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
        endSession().catch(console.error);
      }
    };
  }, [currentSessionId, endSession]);

  return {
    translate,
    translateWithVoice,
    translateBatch,
    detectLanguage,
    getRegionalVariations,
    isTranslating,
    error,
    lastResponse,
    startSession,
    endSession,
    currentSessionId,
    supportedLanguages: GlobalTranslationService.GLOBAL_LANGUAGES,
    languagesByRegion: GlobalTranslationService.getLanguagesByRegion()
  };
}
