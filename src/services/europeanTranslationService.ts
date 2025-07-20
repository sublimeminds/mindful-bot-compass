import { supabase } from '@/integrations/supabase/client';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextType?: 'general' | 'therapeutic' | 'crisis' | 'assessment' | 'goals' | 'progress';
  therapeuticCategory?: 'cbt' | 'dbt' | 'trauma' | 'family' | 'mindfulness' | 'adhd';
  culturalAdaptations?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface TranslationResponse {
  translatedText: string;
  provider: 'claude' | 'openai' | 'cache';
  qualityScore: number;
  responseTime: number;
  culturalAdaptations?: Record<string, any>;
  cached?: boolean;
}

export interface CulturalContext {
  countryCode: string;
  countryName: string;
  languageCode: string;
  culturalProfile: Record<string, any>;
  communicationStyle: string;
  therapyPreferences: Record<string, any>;
  mentalHealthStigmaLevel: string;
  familyStructureImportance: string;
  privacyExpectations: string;
  crisisSupportInfo: Record<string, any>;
}

export interface TranslationSession {
  id: string;
  userId?: string;
  sourceLanguage: string;
  targetLanguage: string;
  culturalContext: Record<string, any>;
  translationCount: number;
  avgResponseTime: number;
  qualityScore: number;
  isActive: boolean;
}

export class EuropeanTranslationService {
  private static instance: EuropeanTranslationService;
  private activeSessions = new Map<string, TranslationSession>();

  static getInstance(): EuropeanTranslationService {
    if (!EuropeanTranslationService.instance) {
      EuropeanTranslationService.instance = new EuropeanTranslationService();
    }
    return EuropeanTranslationService.instance;
  }

  /**
   * Supported European languages
   */
  static readonly SUPPORTED_LANGUAGES = {
    // Germanic
    'de': { name: 'German', region: 'Germanic' },
    'nl': { name: 'Dutch', region: 'Germanic' },
    'sv': { name: 'Swedish', region: 'Nordic' },
    'no': { name: 'Norwegian', region: 'Nordic' },
    'da': { name: 'Danish', region: 'Nordic' },
    'fi': { name: 'Finnish', region: 'Nordic' },
    
    // Romance
    'fr': { name: 'French', region: 'Romance' },
    'es': { name: 'Spanish', region: 'Romance' },
    'it': { name: 'Italian', region: 'Romance' },
    'pt': { name: 'Portuguese', region: 'Romance' },
    'ro': { name: 'Romanian', region: 'Romance' },
    
    // Slavic
    'pl': { name: 'Polish', region: 'Slavic' },
    'cs': { name: 'Czech', region: 'Slavic' },
    'hu': { name: 'Hungarian', region: 'Slavic' },
    'hr': { name: 'Croatian', region: 'Slavic' },
    
    // Other
    'el': { name: 'Greek', region: 'Mediterranean' },
    'et': { name: 'Estonian', region: 'Baltic' },
    'lv': { name: 'Latvian', region: 'Baltic' },
    'lt': { name: 'Lithuanian', region: 'Baltic' },
    
    // Base
    'en': { name: 'English', region: 'Base' }
  };

  /**
   * Translate text with cultural adaptation
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('european-translation', {
        body: request
      });

      if (error) {
        throw new Error(`Translation failed: ${error.message}`);
      }

      return data as TranslationResponse;
    } catch (error) {
      console.error('Translation service error:', error);
      throw error;
    }
  }

  /**
   * Batch translate multiple texts
   */
  async batchTranslate(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    options?: Partial<TranslationRequest>
  ): Promise<TranslationResponse[]> {
    const results = await Promise.all(
      texts.map(text => 
        this.translate({
          text,
          sourceLanguage,
          targetLanguage,
          ...options
        })
      )
    );

    return results;
  }

  /**
   * Get cultural context for a language
   */
  async getCulturalContext(languageCode: string): Promise<CulturalContext | null> {
    try {
      const { data, error } = await supabase
        .from('european_cultural_contexts')
        .select('*')
        .eq('language_code', languageCode)
        .maybeSingle();

      if (error) {
        console.error('Cultural context error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cultural context service error:', error);
      return null;
    }
  }

  /**
   * Start a real-time translation session
   */
  async startTranslationSession(
    sourceLanguage: string,
    targetLanguage: string,
    userId?: string
  ): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const culturalContext = await this.getCulturalContext(targetLanguage);
      
      const { data, error } = await supabase
        .from('realtime_translation_sessions')
        .insert({
          user_id: userId,
          session_id: sessionId,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          cultural_context: culturalContext || {},
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Session creation failed: ${error.message}`);
      }

      // Store in local cache
      this.activeSessions.set(sessionId, {
        id: data.id,
        userId,
        sourceLanguage,
        targetLanguage,
        culturalContext: culturalContext || {},
        translationCount: 0,
        avgResponseTime: 0,
        qualityScore: 0.95,
        isActive: true
      });

      return sessionId;
    } catch (error) {
      console.error('Session start error:', error);
      throw error;
    }
  }

  /**
   * End a translation session
   */
  async endTranslationSession(sessionId: string): Promise<void> {
    try {
      await supabase
        .from('realtime_translation_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      this.activeSessions.delete(sessionId);
    } catch (error) {
      console.error('Session end error:', error);
    }
  }

  /**
   * Translate with session context
   */
  async translateInSession(
    sessionId: string,
    text: string,
    options?: Partial<TranslationRequest>
  ): Promise<TranslationResponse> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Invalid or expired session');
    }

    const result = await this.translate({
      text,
      sourceLanguage: session.sourceLanguage,
      targetLanguage: session.targetLanguage,
      sessionId,
      userId: session.userId,
      culturalAdaptations: session.culturalContext,
      ...options
    });

    // Update session metrics
    session.translationCount++;
    session.avgResponseTime = (session.avgResponseTime + result.responseTime) / session.translationCount;
    session.qualityScore = (session.qualityScore + result.qualityScore) / 2;

    return result;
  }

  /**
   * Get translation quality metrics
   */
  async getQualityMetrics(
    languagePair?: string,
    provider?: string,
    timeRange?: { start: Date; end: Date }
  ) {
    try {
      let query = supabase
        .from('translation_quality_metrics')
        .select('*');

      if (languagePair) {
        query = query.eq('language_pair', languagePair);
      }

      if (provider) {
        query = query.eq('provider', provider);
      }

      if (timeRange) {
        query = query
          .gte('created_at', timeRange.start.toISOString())
          .lte('created_at', timeRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Metrics query failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Quality metrics error:', error);
      return [];
    }
  }

  /**
   * Get user's preferred language from cultural context
   */
  async getUserPreferredLanguage(userId: string): Promise<string> {
    try {
      // Try to get from user cultural profiles
      const { data } = await supabase
        .from('user_cultural_profiles')
        .select('primary_language')
        .eq('user_id', userId)
        .maybeSingle();

      return data?.primary_language || 'en';
    } catch (error) {
      console.error('User language preference error:', error);
      return 'en';
    }
  }

  /**
   * Check if a language is supported
   */
  static isLanguageSupported(languageCode: string): boolean {
    return languageCode in EuropeanTranslationService.SUPPORTED_LANGUAGES;
  }

  /**
   * Get language display name
   */
  static getLanguageName(languageCode: string): string {
    const lang = EuropeanTranslationService.SUPPORTED_LANGUAGES[languageCode as keyof typeof EuropeanTranslationService.SUPPORTED_LANGUAGES];
    return lang?.name || languageCode;
  }

  /**
   * Get all supported languages grouped by region
   */
  static getLanguagesByRegion(): Record<string, Array<{ code: string; name: string }>> {
    const regions: Record<string, Array<{ code: string; name: string }>> = {};
    
    Object.entries(EuropeanTranslationService.SUPPORTED_LANGUAGES).forEach(([code, info]) => {
      if (!regions[info.region]) {
        regions[info.region] = [];
      }
      regions[info.region].push({ code, name: info.name });
    });

    return regions;
  }
}

// Export singleton instance
export const europeanTranslationService = EuropeanTranslationService.getInstance();
