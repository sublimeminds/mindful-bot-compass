import { supabase } from '@/integrations/supabase/client';

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

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId?: string;
  sessionId?: string;
  contextType?: 'general' | 'therapeutic' | 'crisis' | 'assessment';
  therapeuticCategory?: string;
  culturalContext?: CulturalContext;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextType: string;
  therapeuticCategory?: string;
  culturalAdaptations?: Record<string, any>;
  qualityScore: number;
  provider: string;
  cached: boolean;
  responseTime: number;
  sessionId?: string;
}

export interface BatchTranslationOptions {
  userId?: string;
  sessionId?: string;
  contextType?: string;
  therapeuticCategory?: string;
}

class EuropeanTranslationService {
  private static instance: EuropeanTranslationService;
  private cache = new Map<string, TranslationResponse>();

  public static readonly SUPPORTED_LANGUAGES = {
    // Germanic Languages
    'de': { name: 'German', nativeName: 'Deutsch', region: 'Central Europe', countries: ['DE', 'AT', 'CH'] },
    'nl': { name: 'Dutch', nativeName: 'Nederlands', region: 'Western Europe', countries: ['NL'] },
    'sv': { name: 'Swedish', nativeName: 'Svenska', region: 'Northern Europe', countries: ['SE'] },
    'no': { name: 'Norwegian', nativeName: 'Norsk', region: 'Northern Europe', countries: ['NO'] },
    'da': { name: 'Danish', nativeName: 'Dansk', region: 'Northern Europe', countries: ['DK'] },
    'is': { name: 'Icelandic', nativeName: 'Íslenska', region: 'Northern Europe', countries: ['IS'] },
    
    // Romance Languages
    'fr': { name: 'French', nativeName: 'Français', region: 'Western Europe', countries: ['FR', 'BE', 'CH'] },
    'es': { name: 'Spanish', nativeName: 'Español', region: 'Southern Europe', countries: ['ES'] },
    'it': { name: 'Italian', nativeName: 'Italiano', region: 'Southern Europe', countries: ['IT'] },
    'pt': { name: 'Portuguese', nativeName: 'Português', region: 'Southern Europe', countries: ['PT'] },
    'ro': { name: 'Romanian', nativeName: 'Română', region: 'Eastern Europe', countries: ['RO'] },
    
    // Slavic Languages
    'pl': { name: 'Polish', nativeName: 'Polski', region: 'Eastern Europe', countries: ['PL'] },
    'cs': { name: 'Czech', nativeName: 'Čeština', region: 'Central Europe', countries: ['CZ'] },
    'sk': { name: 'Slovak', nativeName: 'Slovenčina', region: 'Central Europe', countries: ['SK'] },
    'hu': { name: 'Hungarian', nativeName: 'Magyar', region: 'Central Europe', countries: ['HU'] },
    'hr': { name: 'Croatian', nativeName: 'Hrvatski', region: 'Southern Europe', countries: ['HR'] },
    'sr': { name: 'Serbian', nativeName: 'Српски', region: 'Southern Europe', countries: ['RS'] },
    'bg': { name: 'Bulgarian', nativeName: 'Български', region: 'Eastern Europe', countries: ['BG'] },
    'ru': { name: 'Russian', nativeName: 'Русский', region: 'Eastern Europe', countries: ['RU'] },
    'uk': { name: 'Ukrainian', nativeName: 'Українська', region: 'Eastern Europe', countries: ['UA'] },
    
    // Other European Languages
    'fi': { name: 'Finnish', nativeName: 'Suomi', region: 'Northern Europe', countries: ['FI'] },
    'et': { name: 'Estonian', nativeName: 'Eesti', region: 'Northern Europe', countries: ['EE'] },
    'lv': { name: 'Latvian', nativeName: 'Latviešu', region: 'Northern Europe', countries: ['LV'] },
    'lt': { name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Northern Europe', countries: ['LT'] },
    'el': { name: 'Greek', nativeName: 'Ελληνικά', region: 'Southern Europe', countries: ['GR'] },
    'mt': { name: 'Maltese', nativeName: 'Malti', region: 'Southern Europe', countries: ['MT'] },
    
    // English for reference
    'en': { name: 'English', nativeName: 'English', region: 'Western Europe', countries: ['GB', 'IE'] }
  };

  static getInstance(): EuropeanTranslationService {
    if (!EuropeanTranslationService.instance) {
      EuropeanTranslationService.instance = new EuropeanTranslationService();
    }
    return EuropeanTranslationService.instance;
  }

  static getLanguageName(code: string): string {
    return this.SUPPORTED_LANGUAGES[code as keyof typeof this.SUPPORTED_LANGUAGES]?.name || code;
  }

  static getLanguagesByRegion(): Record<string, Array<{ code: string; name: string; nativeName: string }>> {
    const regions: Record<string, Array<{ code: string; name: string; nativeName: string }>> = {};
    
    Object.entries(this.SUPPORTED_LANGUAGES).forEach(([code, info]) => {
      if (!regions[info.region]) {
        regions[info.region] = [];
      }
      regions[info.region].push({
        code,
        name: info.name,
        nativeName: info.nativeName
      });
    });
    
    return regions;
  }

  private getCacheKey(request: TranslationRequest): string {
    return `${request.sourceLanguage}-${request.targetLanguage}-${request.contextType}-${request.text.substring(0, 100)}`;
  }

  async getCulturalContext(countryCode: string, languageCode: string): Promise<CulturalContext | null> {
    try {
      const { data, error } = await supabase
        .from('european_cultural_contexts')
        .select('*')
        .eq('country_code', countryCode)
        .eq('language_code', languageCode)
        .single();

      if (error || !data) {
        console.warn(`No cultural context found for ${countryCode}-${languageCode}`);
        return null;
      }

      return {
        countryCode: data.country_code,
        countryName: data.country_name,
        languageCode: data.language_code,
        culturalProfile: data.cultural_profile as Record<string, any>,
        communicationStyle: data.communication_style,
        therapyPreferences: data.therapy_preferences as Record<string, any>,
        mentalHealthStigmaLevel: data.mental_health_stigma_level,
        familyStructureImportance: data.family_structure_importance,
        privacyExpectations: data.privacy_expectations,
        crisisSupportInfo: data.crisis_support_info as Record<string, any>
      };
    } catch (error) {
      console.error('Error fetching cultural context:', error);
      return null;
    }
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(request);

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return { ...cached, cached: true, responseTime: 0 };
    }

    // Check database cache
    const { data: cachedTranslation } = await supabase
      .from('european_translation_memory')
      .select('*')
      .eq('source_text', request.text)
      .eq('source_language', request.sourceLanguage)
      .eq('target_language', request.targetLanguage)
      .eq('context_type', request.contextType || 'general')
      .single();

    if (cachedTranslation) {
      const response: TranslationResponse = {
        translatedText: cachedTranslation.translated_text,
        sourceLanguage: cachedTranslation.source_language,
        targetLanguage: cachedTranslation.target_language,
        contextType: cachedTranslation.context_type,
        therapeuticCategory: cachedTranslation.therapeutic_category,
        culturalAdaptations: cachedTranslation.cultural_adaptations as Record<string, any>,
        qualityScore: Number(cachedTranslation.quality_score),
        provider: cachedTranslation.translation_provider,
        cached: true,
        responseTime: Date.now() - startTime,
        sessionId: request.sessionId
      };

      this.cache.set(cacheKey, response);
      return response;
    }

    // Get cultural context
    const culturalContext = await this.getCulturalContext(
      request.culturalContext?.countryCode || 'DE',
      request.targetLanguage
    );

    // Perform translation using edge function
    const { data, error } = await supabase.functions.invoke('european-translation', {
      body: {
        ...request,
        culturalContext
      }
    });

    if (error) {
      throw new Error(`Translation failed: ${error.message}`);
    }

    const response: TranslationResponse = {
      ...data,
      cached: false,
      responseTime: Date.now() - startTime
    };

    // Cache the response
    this.cache.set(cacheKey, response);

    // Store in database
    await supabase.from('european_translation_memory').insert({
      source_text: request.text,
      source_language: request.sourceLanguage,
      target_language: request.targetLanguage,
      translated_text: response.translatedText,
      context_type: request.contextType || 'general',
      therapeutic_category: request.therapeuticCategory,
      cultural_adaptations: response.culturalAdaptations,
      translation_provider: response.provider,
      quality_score: response.qualityScore
    });

    return response;
  }

  async batchTranslate(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    options: BatchTranslationOptions = {}
  ): Promise<TranslationResponse[]> {
    const promises = texts.map(text =>
      this.translate({
        text,
        sourceLanguage,
        targetLanguage,
        ...options
      })
    );

    return Promise.all(promises);
  }

  async translateInSession(
    sessionId: string,
    text: string,
    request: TranslationRequest
  ): Promise<TranslationResponse> {
    const response = await this.translate({ ...request, sessionId });
    
    // Update session statistics
    await supabase.from('realtime_translation_sessions')
      .update({
        translation_count: supabase.sql`translation_count + 1`,
        avg_response_time_ms: supabase.sql`(avg_response_time_ms + ${response.responseTime}) / 2`
      })
      .eq('session_id', sessionId);

    return response;
  }

  async startTranslationSession(
    sourceLanguage: string,
    targetLanguage: string,
    userId?: string
  ): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase.from('realtime_translation_sessions').insert({
      user_id: userId,
      session_id: sessionId,
      source_language: sourceLanguage,
      target_language: targetLanguage
    });

    if (error) {
      throw new Error(`Failed to start session: ${error.message}`);
    }

    return sessionId;
  }

  async endTranslationSession(sessionId: string): Promise<void> {
    const { error } = await supabase.from('realtime_translation_sessions')
      .update({
        is_active: false,
        ended_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    if (error) {
      throw new Error(`Failed to end session: ${error.message}`);
    }
  }
}

export const europeanTranslationService = EuropeanTranslationService.getInstance();
export { EuropeanTranslationService };
