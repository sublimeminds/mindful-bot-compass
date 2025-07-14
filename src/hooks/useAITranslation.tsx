import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { aiTranslationService, TranslationRequest, TranslationResponse, LanguagePreferences } from '@/services/aiTranslationService';
import { useBulletproofAuth } from '@/components/bulletproof/BulletproofAuthProvider';
import { useEnhancedLanguage } from './useEnhancedLanguage';

interface UseAITranslationOptions {
  autoTranslate?: boolean;
  contextType?: 'therapeutic' | 'ui' | 'crisis' | 'cultural' | 'general';
  preserveEmotionalContext?: boolean;
  realTimeTranslation?: boolean;
  sessionId?: string;
}

interface TranslationState {
  isTranslating: boolean;
  error: string | null;
  lastTranslation: TranslationResponse | null;
  cacheStats: { size: number; activeTranslations: number };
}

export function useAITranslation(options: UseAITranslationOptions = {}) {
  const { user } = useBulletproofAuth();
  const { i18n } = useTranslation();
  const { currentLanguage } = useEnhancedLanguage();
  
  const [state, setState] = useState<TranslationState>({
    isTranslating: false,
    error: null,
    lastTranslation: null,
    cacheStats: { size: 0, activeTranslations: 0 }
  });

  const [userPreferences, setUserPreferences] = useState<LanguagePreferences | null>(null);
  const translationQueueRef = useRef<Map<string, TranslationRequest>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Load user preferences on mount
  useEffect(() => {
    if (user?.id) {
      loadUserPreferences();
    }
  }, [user?.id]);

  const loadUserPreferences = async () => {
    if (!user?.id) return;
    
    try {
      const preferences = await aiTranslationService.getUserLanguagePreferences(user.id);
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  // Main translation function
  const translateText = useCallback(async (
    text: string,
    targetLanguage?: string,
    customOptions?: Partial<TranslationRequest>
  ): Promise<TranslationResponse> => {
    setState(prev => ({ ...prev, isTranslating: true, error: null }));

    try {
      const request: TranslationRequest = {
        text,
        sourceLanguage: customOptions?.sourceLanguage || i18n.language,
        targetLanguage: targetLanguage || currentLanguage.code,
        contextType: customOptions?.contextType || options.contextType || 'general',
        preserveEmotionalContext: customOptions?.preserveEmotionalContext ?? options.preserveEmotionalContext ?? true,
        communicationStyle: userPreferences?.communicationStyle || 'balanced',
        userId: user?.id,
        sessionId: options.sessionId,
        ...customOptions
      };

      const result = await aiTranslationService.translate(request);
      
      setState(prev => ({
        ...prev,
        isTranslating: false,
        lastTranslation: result,
        error: result.error || null,
        cacheStats: aiTranslationService.getCacheStats()
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setState(prev => ({
        ...prev,
        isTranslating: false,
        error: errorMessage
      }));
      
      // Return fallback response
      return {
        translatedText: text,
        cached: false,
        quality: 0,
        error: errorMessage
      };
    }
  }, [i18n.language, currentLanguage.code, options, userPreferences, user?.id]);

  // Debounced translation for real-time use
  const translateTextDebounced = useCallback((
    text: string,
    targetLanguage?: string,
    customOptions?: Partial<TranslationRequest>,
    delay: number = 300
  ): Promise<TranslationResponse> => {
    return new Promise((resolve) => {
      const key = `${text}-${targetLanguage}-${JSON.stringify(customOptions)}`;
      
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Store request
      translationQueueRef.current.set(key, {
        text,
        sourceLanguage: i18n.language,
        targetLanguage: targetLanguage || currentLanguage.code,
        ...customOptions
      } as TranslationRequest);
      
      // Set new timer
      debounceTimerRef.current = setTimeout(async () => {
        const request = translationQueueRef.current.get(key);
        if (request) {
          const result = await translateText(request.text, request.targetLanguage, request);
          resolve(result);
        }
      }, delay);
    });
  }, [translateText, i18n.language, currentLanguage.code]);

  // Batch translation
  const translateBatch = useCallback(async (
    texts: string[],
    targetLanguage?: string,
    contextType?: string
  ): Promise<TranslationResponse[]> => {
    setState(prev => ({ ...prev, isTranslating: true, error: null }));

    try {
      const results = await aiTranslationService.batchTranslate({
        texts,
        sourceLanguage: i18n.language,
        targetLanguage: targetLanguage || currentLanguage.code,
        contextType: contextType || options.contextType,
        preserveContext: options.preserveEmotionalContext
      });

      setState(prev => ({
        ...prev,
        isTranslating: false,
        cacheStats: aiTranslationService.getCacheStats()
      }));

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Batch translation failed';
      setState(prev => ({
        ...prev,
        isTranslating: false,
        error: errorMessage
      }));
      
      // Return fallback responses
      return texts.map(text => ({
        translatedText: text,
        cached: false,
        quality: 0,
        error: errorMessage
      }));
    }
  }, [i18n.language, currentLanguage.code, options]);

  // Therapy-specific translation
  const translateTherapeuticContent = useCallback(async (
    content: string,
    therapyContext: {
      approach: string;
      technique: string;
      userBackground?: string;
    },
    targetLanguage?: string
  ): Promise<TranslationResponse> => {
    return aiTranslationService.translateTherapeuticContent(
      content,
      i18n.language,
      targetLanguage || currentLanguage.code,
      therapyContext
    );
  }, [i18n.language, currentLanguage.code]);

  // Real-time message translation for chat/therapy
  const translateMessage = useCallback(async (
    message: string,
    sessionContext?: {
      sessionType: 'therapy' | 'chat' | 'crisis';
      userMood?: string;
      therapyApproach?: string;
    },
    targetLanguage?: string
  ): Promise<TranslationResponse> => {
    return aiTranslationService.translateMessage(
      message,
      i18n.language,
      targetLanguage || currentLanguage.code,
      sessionContext
    );
  }, [i18n.language, currentLanguage.code]);

  // Crisis content translation
  const translateCrisisContent = useCallback(async (
    content: string,
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical',
    targetLanguage?: string
  ): Promise<TranslationResponse> => {
    return aiTranslationService.translateCrisisContent(
      content,
      i18n.language,
      targetLanguage || currentLanguage.code,
      urgencyLevel
    );
  }, [i18n.language, currentLanguage.code]);

  // Update user preferences
  const updatePreferences = useCallback(async (
    preferences: Partial<LanguagePreferences>
  ): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const success = await aiTranslationService.updateUserLanguagePreferences(
        user.id,
        preferences
      );
      
      if (success) {
        setUserPreferences(prev => prev ? { ...prev, ...preferences } : null);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }, [user?.id]);

  // Submit feedback
  const submitFeedback = useCallback(async (
    translationId: string,
    rating: number,
    feedbackType: 'accuracy' | 'cultural' | 'therapeutic' | 'technical',
    comments?: string,
    improvements?: any
  ): Promise<boolean> => {
    if (!user?.id) return false;

    return aiTranslationService.submitTranslationFeedback(
      translationId,
      user.id,
      rating,
      feedbackType,
      comments,
      improvements
    );
  }, [user?.id]);

  // Auto-translate content based on user preferences
  const autoTranslate = useCallback(async (
    content: string,
    contextType?: 'therapeutic' | 'ui' | 'crisis' | 'cultural' | 'general'
  ): Promise<string> => {
    if (!userPreferences?.autoTranslate) {
      return content;
    }

    if (contextType === 'therapeutic' && !userPreferences.translateTherapyContent) {
      return content;
    }

    try {
      const result = await translateText(content, undefined, { contextType });
      return result.translatedText;
    } catch (error) {
      console.error('Auto-translation failed:', error);
      return content;
    }
  }, [userPreferences, translateText]);

  // Get translation analytics
  const getAnalytics = useCallback(async (
    languagePair?: string,
    contextType?: string,
    dateRange?: { start: string; end: string }
  ) => {
    return aiTranslationService.getTranslationAnalytics(languagePair, contextType, dateRange);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    aiTranslationService.clearCache();
    setState(prev => ({
      ...prev,
      cacheStats: { size: 0, activeTranslations: 0 }
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    // Translation functions
    translateText,
    translateTextDebounced,
    translateBatch,
    translateTherapeuticContent,
    translateMessage,
    translateCrisisContent,
    autoTranslate,

    // State
    isTranslating: state.isTranslating,
    error: state.error,
    lastTranslation: state.lastTranslation,
    cacheStats: state.cacheStats,

    // User preferences
    userPreferences,
    updatePreferences,
    loadUserPreferences,

    // Feedback and analytics
    submitFeedback,
    getAnalytics,

    // Utilities
    clearCache
  };
}