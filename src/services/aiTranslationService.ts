import { supabase } from '@/integrations/supabase/client';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextType?: 'therapeutic' | 'ui' | 'crisis' | 'cultural' | 'general';
  culturalContext?: string;
  therapeuticContext?: {
    sessionType?: string;
    userMood?: string;
    therapyApproach?: string;
    emotionalState?: string;
  };
  preserveEmotionalContext?: boolean;
  communicationStyle?: 'formal' | 'informal' | 'balanced';
  userId?: string;
  sessionId?: string;
}

export interface TranslationResponse {
  translatedText: string;
  cached: boolean;
  quality: number;
  culturalAdaptations?: string[];
  tokensUsed?: number;
  error?: string;
}

export interface BatchTranslationRequest {
  texts: string[];
  sourceLanguage: string;
  targetLanguage: string;
  contextType?: string;
  preserveContext?: boolean;
}

export interface LanguagePreferences {
  preferredLanguages: string[];
  communicationStyle: 'formal' | 'informal' | 'balanced';
  culturalSensitivityLevel: 'low' | 'medium' | 'high';
  autoTranslate: boolean;
  translateTherapyContent: boolean;
  preserveEmotionalContext: boolean;
  dialectPreference?: string;
}

class AITranslationService {
  private static instance: AITranslationService;
  private translationCache = new Map<string, TranslationResponse>();
  private activeTranslations = new Map<string, Promise<TranslationResponse>>();

  static getInstance(): AITranslationService {
    if (!AITranslationService.instance) {
      AITranslationService.instance = new AITranslationService();
    }
    return AITranslationService.instance;
  }

  // Main translation method
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const cacheKey = this.generateCacheKey(request);
    
    // Check local cache first
    if (this.translationCache.has(cacheKey)) {
      const cached = this.translationCache.get(cacheKey)!;
      console.log('Translation served from local cache');
      return cached;
    }

    // Check if translation is already in progress
    if (this.activeTranslations.has(cacheKey)) {
      console.log('Translation already in progress, waiting...');
      return await this.activeTranslations.get(cacheKey)!;
    }

    // Start new translation
    const translationPromise = this.performTranslation(request);
    this.activeTranslations.set(cacheKey, translationPromise);

    try {
      const result = await translationPromise;
      
      // Cache successful translations
      if (!result.error) {
        this.translationCache.set(cacheKey, result);
        // Clean up old cache entries (keep last 100)
        if (this.translationCache.size > 100) {
          const firstKey = this.translationCache.keys().next().value;
          this.translationCache.delete(firstKey);
        }
      }

      return result;
    } finally {
      this.activeTranslations.delete(cacheKey);
    }
  }

  private async performTranslation(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      console.log(`Translating from ${request.sourceLanguage} to ${request.targetLanguage}`);
      
      const { data, error } = await supabase.functions.invoke('ai-translate', {
        body: request
      });

      if (error) {
        console.error('Translation error:', error);
        return {
          translatedText: request.text, // Fallback to original
          cached: false,
          quality: 0,
          error: error.message || 'Translation failed'
        };
      }

      return data;
    } catch (error) {
      console.error('Translation service error:', error);
      return {
        translatedText: request.text, // Fallback to original
        cached: false,
        quality: 0,
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  // Batch translation for multiple texts
  async batchTranslate(request: BatchTranslationRequest): Promise<TranslationResponse[]> {
    const promises = request.texts.map(text => 
      this.translate({
        text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        contextType: request.contextType as any || 'general',
        preserveEmotionalContext: request.preserveContext
      })
    );

    return Promise.all(promises);
  }

  // Real-time translation for chat/therapy sessions
  async translateMessage(
    message: string,
    sourceLanguage: string,
    targetLanguage: string,
    sessionContext?: {
      sessionType: 'therapy' | 'chat' | 'crisis';
      userMood?: string;
      therapyApproach?: string;
    }
  ): Promise<TranslationResponse> {
    return this.translate({
      text: message,
      sourceLanguage,
      targetLanguage,
      contextType: sessionContext?.sessionType === 'therapy' ? 'therapeutic' : 
                  sessionContext?.sessionType === 'crisis' ? 'crisis' : 'general',
      therapeuticContext: sessionContext,
      preserveEmotionalContext: true
    });
  }

  // Translate therapeutic content with cultural adaptation
  async translateTherapeuticContent(
    content: string,
    sourceLanguage: string,
    targetLanguage: string,
    therapyContext: {
      approach: string;
      technique: string;
      userBackground?: string;
    }
  ): Promise<TranslationResponse> {
    return this.translate({
      text: content,
      sourceLanguage,
      targetLanguage,
      contextType: 'therapeutic',
      therapeuticContext: {
        therapyApproach: therapyContext.approach,
        sessionType: therapyContext.technique
      },
      culturalContext: therapyContext.userBackground,
      preserveEmotionalContext: true
    });
  }

  // UI element translation
  async translateUI(
    uiText: string,
    sourceLanguage: string,
    targetLanguage: string,
    uiContext?: string
  ): Promise<TranslationResponse> {
    return this.translate({
      text: uiText,
      sourceLanguage,
      targetLanguage,
      contextType: 'ui',
      culturalContext: uiContext,
      preserveEmotionalContext: false
    });
  }

  // Crisis content translation
  async translateCrisisContent(
    content: string,
    sourceLanguage: string,
    targetLanguage: string,
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<TranslationResponse> {
    return this.translate({
      text: content,
      sourceLanguage,
      targetLanguage,
      contextType: 'crisis',
      therapeuticContext: {
        emotionalState: urgencyLevel
      },
      preserveEmotionalContext: true,
      communicationStyle: 'balanced'
    });
  }

  // User language preferences management
  async getUserLanguagePreferences(userId: string): Promise<LanguagePreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching language preferences:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        preferredLanguages: data.preferred_languages,
        communicationStyle: data.communication_style as 'formal' | 'informal' | 'balanced',
        culturalSensitivityLevel: data.cultural_sensitivity_level as 'low' | 'medium' | 'high',
        autoTranslate: data.auto_translate,
        translateTherapyContent: data.translate_therapy_content,
        preserveEmotionalContext: data.preserve_emotional_context,
        dialectPreference: data.dialect_preference
      };
    } catch (error) {
      console.error('Error getting language preferences:', error);
      return null;
    }
  }

  async updateUserLanguagePreferences(
    userId: string,
    preferences: Partial<LanguagePreferences>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: userId,
          preferred_languages: preferences.preferredLanguages,
          communication_style: preferences.communicationStyle,
          cultural_sensitivity_level: preferences.culturalSensitivityLevel,
          auto_translate: preferences.autoTranslate,
          translate_therapy_content: preferences.translateTherapyContent,
          preserve_emotional_context: preferences.preserveEmotionalContext,
          dialect_preference: preferences.dialectPreference
        });

      if (error) {
        console.error('Error updating language preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating language preferences:', error);
      return false;
    }
  }

  // Translation quality feedback
  async submitTranslationFeedback(
    translationId: string,
    userId: string,
    rating: number,
    feedbackType: 'accuracy' | 'cultural' | 'therapeutic' | 'technical',
    comments?: string,
    improvements?: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('translation_feedback')
        .insert({
          translation_id: translationId,
          user_id: userId,
          quality_rating: rating,
          feedback_type: feedbackType,
          comments,
          improvements_suggested: improvements
        });

      return !error;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }

  // Get translation analytics
  async getTranslationAnalytics(
    languagePair?: string,
    contextType?: string,
    dateRange?: { start: string; end: string }
  ): Promise<any[]> {
    try {
      let query = supabase
        .from('translation_analytics')
        .select('*');

      if (languagePair) {
        query = query.eq('language_pair', languagePair);
      }

      if (contextType) {
        query = query.eq('context_type', contextType);
      }

      if (dateRange) {
        query = query
          .gte('date', dateRange.start)
          .lte('date', dateRange.end);
      }

      const { data, error } = await query
        .order('date', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting translation analytics:', error);
      return [];
    }
  }

  private generateCacheKey(request: TranslationRequest): string {
    return `${request.sourceLanguage}-${request.targetLanguage}-${request.contextType}-${request.text.substring(0, 50)}`;
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    this.translationCache.clear();
    this.activeTranslations.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; activeTranslations: number } {
    return {
      size: this.translationCache.size,
      activeTranslations: this.activeTranslations.size
    };
  }
}

export const aiTranslationService = AITranslationService.getInstance();
