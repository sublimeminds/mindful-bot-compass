
import { supabase } from '@/integrations/supabase/client';

export interface GlobalCulturalContext {
  countryCode: string;
  countryName: string;
  languageCode: string;
  region: string;
  culturalProfile: Record<string, any>;
  communicationStyle: string;
  therapyPreferences: Record<string, any>;
  mentalHealthStigmaLevel: string;
  familyStructureImportance: string;
  privacyExpectations: string;
  religiousCulturalFactors: Record<string, any>;
  crisisSupportInfo: Record<string, any>;
}

export interface GlobalTranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId?: string;
  sessionId?: string;
  contextType?: 'general' | 'therapeutic' | 'crisis' | 'assessment' | 'spiritual' | 'cultural';
  therapeuticCategory?: string;
  culturalContext?: GlobalCulturalContext;
  voiceEnabled?: boolean;
  preserveFormality?: boolean;
}

export interface GlobalTranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextType: string;
  therapeuticCategory?: string;
  culturalAdaptations?: Record<string, any>;
  formalityLevel?: string;
  voiceContent?: string;
  qualityScore: number;
  culturalAccuracyScore: number;
  provider: string;
  cached: boolean;
  responseTime: number;
  sessionId?: string;
  regionalVariations?: Record<string, string>;
}

class GlobalTranslationService {
  private static instance: GlobalTranslationService;
  private cache = new Map<string, GlobalTranslationResponse>();

  public static readonly GLOBAL_LANGUAGES = {
    // European Languages (extended from European service)
    'en': { name: 'English', nativeName: 'English', region: 'Global', family: 'Germanic', countries: ['US', 'GB', 'AU', 'CA', 'NZ', 'IE'] },
    'de': { name: 'German', nativeName: 'Deutsch', region: 'Europe', family: 'Germanic', countries: ['DE', 'AT', 'CH'] },
    'fr': { name: 'French', nativeName: 'Français', region: 'Europe/Africa', family: 'Romance', countries: ['FR', 'BE', 'CH', 'CA', 'SN', 'CI'] },
    'es': { name: 'Spanish', nativeName: 'Español', region: 'Europe/Americas', family: 'Romance', countries: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL'] },
    'it': { name: 'Italian', nativeName: 'Italiano', region: 'Europe', family: 'Romance', countries: ['IT', 'CH'] },
    'pt': { name: 'Portuguese', nativeName: 'Português', region: 'Europe/Americas/Africa', family: 'Romance', countries: ['PT', 'BR', 'AO', 'MZ'] },
    'ru': { name: 'Russian', nativeName: 'Русский', region: 'Europe/Asia', family: 'Slavic', countries: ['RU', 'BY', 'KZ', 'KG'] },
    'pl': { name: 'Polish', nativeName: 'Polski', region: 'Europe', family: 'Slavic', countries: ['PL'] },
    'nl': { name: 'Dutch', nativeName: 'Nederlands', region: 'Europe', family: 'Germanic', countries: ['NL', 'BE'] },
    'sv': { name: 'Swedish', nativeName: 'Svenska', region: 'Europe', family: 'Germanic', countries: ['SE'] },
    'no': { name: 'Norwegian', nativeName: 'Norsk', region: 'Europe', family: 'Germanic', countries: ['NO'] },
    'da': { name: 'Danish', nativeName: 'Dansk', region: 'Europe', family: 'Germanic', countries: ['DK'] },
    'fi': { name: 'Finnish', nativeName: 'Suomi', region: 'Europe', family: 'Finno-Ugric', countries: ['FI'] },
    'cs': { name: 'Czech', nativeName: 'Čeština', region: 'Europe', family: 'Slavic', countries: ['CZ'] },
    'hu': { name: 'Hungarian', nativeName: 'Magyar', region: 'Europe', family: 'Finno-Ugric', countries: ['HU'] },
    'el': { name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe', family: 'Hellenic', countries: ['GR', 'CY'] },
    'ro': { name: 'Romanian', nativeName: 'Română', region: 'Europe', family: 'Romance', countries: ['RO', 'MD'] },
    'hr': { name: 'Croatian', nativeName: 'Hrvatski', region: 'Europe', family: 'Slavic', countries: ['HR'] },
    'sr': { name: 'Serbian', nativeName: 'Српски', region: 'Europe', family: 'Slavic', countries: ['RS'] },
    'bg': { name: 'Bulgarian', nativeName: 'Български', region: 'Europe', family: 'Slavic', countries: ['BG'] },
    'sk': { name: 'Slovak', nativeName: 'Slovenčina', region: 'Europe', family: 'Slavic', countries: ['SK'] },
    'et': { name: 'Estonian', nativeName: 'Eesti', region: 'Europe', family: 'Finno-Ugric', countries: ['EE'] },
    'lv': { name: 'Latvian', nativeName: 'Latviešu', region: 'Europe', family: 'Baltic', countries: ['LV'] },
    'lt': { name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Europe', family: 'Baltic', countries: ['LT'] },
    'uk': { name: 'Ukrainian', nativeName: 'Українська', region: 'Europe', family: 'Slavic', countries: ['UA'] },
    
    // Asian Languages
    'zh': { name: 'Chinese (Simplified)', nativeName: '中文', region: 'Asia', family: 'Sino-Tibetan', countries: ['CN', 'SG'] },
    'zh-tw': { name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'Asia', family: 'Sino-Tibetan', countries: ['TW', 'HK', 'MO'] },
    'ja': { name: 'Japanese', nativeName: '日本語', region: 'Asia', family: 'Japonic', countries: ['JP'] },
    'ko': { name: 'Korean', nativeName: '한국어', region: 'Asia', family: 'Koreanic', countries: ['KR', 'KP'] },
    'hi': { name: 'Hindi', nativeName: 'हिन्दी', region: 'Asia', family: 'Indo-European', countries: ['IN'] },
    'bn': { name: 'Bengali', nativeName: 'বাংলা', region: 'Asia', family: 'Indo-European', countries: ['BD', 'IN'] },
    'ur': { name: 'Urdu', nativeName: 'اردو', region: 'Asia', family: 'Indo-European', countries: ['PK', 'IN'] },
    'pa': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Asia', family: 'Indo-European', countries: ['IN', 'PK'] },
    'te': { name: 'Telugu', nativeName: 'తెలుగు', region: 'Asia', family: 'Dravidian', countries: ['IN'] },
    'mr': { name: 'Marathi', nativeName: 'मराठी', region: 'Asia', family: 'Indo-European', countries: ['IN'] },
    'ta': { name: 'Tamil', nativeName: 'தமிழ்', region: 'Asia', family: 'Dravidian', countries: ['IN', 'LK', 'SG'] },
    'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Asia', family: 'Indo-European', countries: ['IN'] },
    'kn': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Asia', family: 'Dravidian', countries: ['IN'] },
    'ml': { name: 'Malayalam', nativeName: 'മലയാളം', region: 'Asia', family: 'Dravidian', countries: ['IN'] },
    'th': { name: 'Thai', nativeName: 'ไทย', region: 'Asia', family: 'Tai-Kadai', countries: ['TH'] },
    'vi': { name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia', family: 'Austroasiatic', countries: ['VN'] },
    'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia', family: 'Austronesian', countries: ['ID'] },
    'ms': { name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Asia', family: 'Austronesian', countries: ['MY', 'BN'] },
    'tl': { name: 'Filipino', nativeName: 'Filipino', region: 'Asia', family: 'Austronesian', countries: ['PH'] },
    'my': { name: 'Burmese', nativeName: 'မြန်မာ', region: 'Asia', family: 'Sino-Tibetan', countries: ['MM'] },
    'km': { name: 'Khmer', nativeName: 'ខ្មែរ', region: 'Asia', family: 'Austroasiatic', countries: ['KH'] },
    'lo': { name: 'Lao', nativeName: 'ລາວ', region: 'Asia', family: 'Tai-Kadai', countries: ['LA'] },
    
    // Middle Eastern & North African Languages
    'ar': { name: 'Arabic', nativeName: 'العربية', region: 'MENA', family: 'Semitic', countries: ['SA', 'EG', 'AE', 'MA', 'DZ', 'TN', 'LY', 'SD'] },
    'he': { name: 'Hebrew', nativeName: 'עברית', region: 'MENA', family: 'Semitic', countries: ['IL'] },
    'fa': { name: 'Persian', nativeName: 'فارسی', region: 'MENA', family: 'Indo-European', countries: ['IR', 'AF', 'TJ'] },
    'tr': { name: 'Turkish', nativeName: 'Türkçe', region: 'MENA/Europe', family: 'Turkic', countries: ['TR', 'CY'] },
    'ku': { name: 'Kurdish', nativeName: 'کوردی', region: 'MENA', family: 'Indo-European', countries: ['IQ', 'IR', 'TR', 'SY'] },
    'az': { name: 'Azerbaijani', nativeName: 'Azərbaycan', region: 'MENA/Asia', family: 'Turkic', countries: ['AZ', 'IR'] },
    
    // African Languages
    'sw': { name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa', family: 'Niger-Congo', countries: ['KE', 'TZ', 'UG', 'CD'] },
    'am': { name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa', family: 'Semitic', countries: ['ET'] },
    'ha': { name: 'Hausa', nativeName: 'Hausa', region: 'Africa', family: 'Afro-Asiatic', countries: ['NG', 'NE', 'GH'] },
    'yo': { name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa', family: 'Niger-Congo', countries: ['NG', 'BJ'] },
    'ig': { name: 'Igbo', nativeName: 'Igbo', region: 'Africa', family: 'Niger-Congo', countries: ['NG'] },
    'zu': { name: 'Zulu', nativeName: 'isiZulu', region: 'Africa', family: 'Niger-Congo', countries: ['ZA'] },
    'xh': { name: 'Xhosa', nativeName: 'isiXhosa', region: 'Africa', family: 'Niger-Congo', countries: ['ZA'] },
    'af': { name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa', family: 'Germanic', countries: ['ZA', 'NA'] }
  };

  static getInstance(): GlobalTranslationService {
    if (!GlobalTranslationService.instance) {
      GlobalTranslationService.instance = new GlobalTranslationService();
    }
    return GlobalTranslationService.instance;
  }

  static getLanguagesByRegion(): Record<string, Array<{ code: string; name: string; nativeName: string; family: string }>> {
    const regions: Record<string, Array<{ code: string; name: string; nativeName: string; family: string }>> = {};
    
    Object.entries(this.GLOBAL_LANGUAGES).forEach(([code, info]) => {
      if (!regions[info.region]) {
        regions[info.region] = [];
      }
      regions[info.region].push({
        code,
        name: info.name,
        nativeName: info.nativeName,
        family: info.family
      });
    });
    
    return regions;
  }

  static getLanguageFamilies(): Record<string, string[]> {
    const families: Record<string, string[]> = {};
    
    Object.entries(this.GLOBAL_LANGUAGES).forEach(([code, info]) => {
      if (!families[info.family]) {
        families[info.family] = [];
      }
      families[info.family].push(code);
    });
    
    return families;
  }

  private getCacheKey(request: GlobalTranslationRequest): string {
    return `global_${request.sourceLanguage}-${request.targetLanguage}-${request.contextType}-${request.text.substring(0, 100)}`;
  }

  async getCulturalContext(countryCode: string, languageCode: string): Promise<GlobalCulturalContext | null> {
    try {
      // Try specific country-language combination first
      let { data, error } = await supabase
        .from('global_cultural_contexts')
        .select('*')
        .eq('country_code', countryCode)
        .eq('language_code', languageCode)
        .single();

      // Fallback to language-only match
      if (!data && !error) {
        const result = await supabase
          .from('global_cultural_contexts')
          .select('*')
          .eq('language_code', languageCode)
          .limit(1)
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error || !data) {
        console.warn(`No cultural context found for ${countryCode}-${languageCode}`);
        return null;
      }

      return {
        countryCode: data.country_code,
        countryName: data.country_name,
        languageCode: data.language_code,
        region: data.region,
        culturalProfile: data.cultural_profile as Record<string, any>,
        communicationStyle: data.communication_style,
        therapyPreferences: data.therapy_preferences as Record<string, any>,
        mentalHealthStigmaLevel: data.mental_health_stigma_level,
        familyStructureImportance: data.family_structure_importance,
        privacyExpectations: data.privacy_expectations,
        religiousCulturalFactors: data.religious_cultural_factors as Record<string, any>,
        crisisSupportInfo: data.crisis_support_info as Record<string, any>
      };
    } catch (error) {
      console.error('Error fetching global cultural context:', error);
      return null;
    }
  }

  async translate(request: GlobalTranslationRequest): Promise<GlobalTranslationResponse> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(request);

    // Check memory cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return { ...cached, cached: true, responseTime: 0 };
    }

    // Check database cache
    const { data: cachedTranslation } = await supabase
      .from('global_translation_memory')
      .select('*')
      .eq('source_text', request.text)
      .eq('source_language', request.sourceLanguage)
      .eq('target_language', request.targetLanguage)
      .eq('context_type', request.contextType || 'general')
      .single();

    if (cachedTranslation) {
      const response: GlobalTranslationResponse = {
        translatedText: cachedTranslation.translated_text,
        sourceLanguage: cachedTranslation.source_language,
        targetLanguage: cachedTranslation.target_language,
        contextType: cachedTranslation.context_type,
        therapeuticCategory: cachedTranslation.therapeutic_category,
        culturalAdaptations: cachedTranslation.cultural_adaptations as Record<string, any>,
        formalityLevel: 'neutral',
        voiceContent: undefined,
        qualityScore: Number(cachedTranslation.quality_score),
        culturalAccuracyScore: 0.95,
        provider: 'cached',
        cached: true,
        responseTime: Date.now() - startTime,
        sessionId: request.sessionId,
        regionalVariations: {}
      };

      this.cache.set(cacheKey, response);
      return response;
    }

    // Get cultural context
    const culturalContext = await this.getCulturalContext(
      request.culturalContext?.countryCode || 'US',
      request.targetLanguage
    );

    // Perform translation using global translation edge function
    const { data, error } = await supabase.functions.invoke('global-translation', {
      body: {
        ...request,
        culturalContext
      }
    });

    if (error) {
      throw new Error(`Global translation failed: ${error.message}`);
    }

    const response: GlobalTranslationResponse = {
      ...data,
      cached: false,
      responseTime: Date.now() - startTime
    };

    // Cache the response
    this.cache.set(cacheKey, response);

    return response;
  }

  async translateWithVoice(request: GlobalTranslationRequest): Promise<GlobalTranslationResponse> {
    const response = await this.translate({ ...request, voiceEnabled: true });
    
    if (response.voiceContent) {
      // Voice content is already included
      return response;
    }

    // Generate voice if not cached
    const { data: voiceData, error: voiceError } = await supabase.functions.invoke('text-to-speech-global', {
      body: {
        text: response.translatedText,
        language: response.targetLanguage,
        culturalContext: request.culturalContext
      }
    });

    if (!voiceError && voiceData?.audioContent) {
      response.voiceContent = voiceData.audioContent;
    }

    return response;
  }

  async batchTranslate(
    requests: GlobalTranslationRequest[]
  ): Promise<GlobalTranslationResponse[]> {
    const promises = requests.map(request => this.translate(request));
    return Promise.all(promises);
  }

  async startGlobalSession(
    sourceLanguage: string,
    targetLanguage: string,
    userId?: string,
    culturalContext?: GlobalCulturalContext
  ): Promise<string> {
    const sessionId = `global_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Session tracking would be implemented when global_translation_sessions table is created
    // For now, we'll just return the sessionId without database storage


    return sessionId;
  }

  async detectLanguage(text: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('language-detection', {
      body: { text }
    });

    if (error) {
      console.warn('Language detection failed, defaulting to English');
      return 'en';
    }

    return data.language || 'en';
  }

  async getRegionalVariations(
    text: string,
    language: string,
    regions: string[]
  ): Promise<Record<string, string>> {
    const { data, error } = await supabase.functions.invoke('regional-variations', {
      body: { text, language, regions }
    });

    if (error) {
      console.warn('Regional variations failed');
      return {};
    }

    return data.variations || {};
  }
}

export const globalTranslationService = GlobalTranslationService.getInstance();
export { GlobalTranslationService };
