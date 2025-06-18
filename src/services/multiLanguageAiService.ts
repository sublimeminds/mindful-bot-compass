
import { CulturallyAwareAIService, CulturalContext } from './culturallyAwareAiService';
import { enhancedCacheService } from './enhancedCachingService';

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
  dialect?: string;
  region?: string;
}

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context: 'therapy' | 'crisis' | 'general';
  culturalAdaptation: boolean;
}

export interface TherapyContent {
  id: string;
  content: string;
  language: string;
  culturalContext: string;
  therapeuticValue: number;
  appropriateness: number;
}

const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', regions: ['US', 'UK', 'AU', 'CA'] },
  'es': { name: 'Spanish', regions: ['ES', 'MX', 'AR', 'CL', 'CO'] },
  'fr': { name: 'French', regions: ['FR', 'CA', 'BE', 'CH'] },
  'de': { name: 'German', regions: ['DE', 'AT', 'CH'] },
  'ar': { name: 'Arabic', regions: ['SA', 'AE', 'EG', 'JO'] },
  'pt': { name: 'Portuguese', regions: ['PT', 'BR'] },
  'it': { name: 'Italian', regions: ['IT', 'CH'] },
  'nl': { name: 'Dutch', regions: ['NL', 'BE'] },
  'ru': { name: 'Russian', regions: ['RU', 'BY', 'KZ'] },
  'zh': { name: 'Chinese', regions: ['CN', 'TW', 'HK', 'SG'] },
  'ja': { name: 'Japanese', regions: ['JP'] },
  'ko': { name: 'Korean', regions: ['KR'] },
  'hi': { name: 'Hindi', regions: ['IN'] },
  'tr': { name: 'Turkish', regions: ['TR'] },
  'he': { name: 'Hebrew', regions: ['IL'] }
};

const THERAPY_TERMINOLOGY = {
  'en': {
    'anxiety': 'anxiety',
    'depression': 'depression',
    'trauma': 'trauma',
    'healing': 'healing',
    'mindfulness': 'mindfulness'
  },
  'es': {
    'anxiety': 'ansiedad',
    'depression': 'depresión',
    'trauma': 'trauma',
    'healing': 'sanación',
    'mindfulness': 'atención plena'
  },
  'ar': {
    'anxiety': 'القلق',
    'depression': 'الاكتئاب',
    'trauma': 'الصدمة',
    'healing': 'الشفاء',
    'mindfulness': 'اليقظة الذهنية'
  },
  'zh': {
    'anxiety': '焦虑',
    'depression': '抑郁',
    'trauma': '创伤',
    'healing': '康复',
    'mindfulness': '正念'
  }
};

export class MultiLanguageAIService {
  private static cache = new Map<string, any>();

  static async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    try {
      const cacheKey = `lang_detect_${text.substring(0, 100)}`;
      
      return await enhancedCacheService.get(cacheKey, async () => {
        // Implementation would use advanced language detection
        // For now, return mock detection
        const detectedLang = this.simpleLanguageDetection(text);
        
        return {
          language: detectedLang,
          confidence: 0.95,
          dialect: this.detectDialect(text, detectedLang),
          region: this.inferRegion(detectedLang)
        };
      });
    } catch (error) {
      console.error('Language detection error:', error);
      return { language: 'en', confidence: 0.5 };
    }
  }

  static async translateWithTherapyContext(request: TranslationRequest): Promise<string> {
    try {
      const cacheKey = `translate_${request.fromLanguage}_${request.toLanguage}_${request.text.substring(0, 50)}`;
      
      return await enhancedCacheService.get(cacheKey, async () => {
        // First, translate the base text
        let translation = await this.performTranslation(request);
        
        // Then apply therapy-specific adaptations
        if (request.context === 'therapy') {
          translation = this.adaptTherapyTerminology(translation, request.toLanguage);
        }
        
        // Apply cultural adaptations if requested
        if (request.culturalAdaptation) {
          translation = this.applyCulturalAdaptations(translation, request.toLanguage);
        }
        
        return translation;
      });
    } catch (error) {
      console.error('Translation error:', error);
      return request.text; // Return original text as fallback
    }
  }

  static async generateMultiLanguageResponse(
    message: string,
    targetLanguage: string,
    culturalContext: CulturalContext,
    preserveContext: boolean = true
  ): Promise<string> {
    try {
      // Detect source language if not provided
      const detection = await this.detectLanguage(message);
      
      // Generate response in the target language
      const response = await CulturallyAwareAIService.generateCulturallyAdaptedResponse(
        message,
        { ...culturalContext, language: targetLanguage },
        await CulturallyAwareAIService.analyzeEmotionWithCulture(message, culturalContext)
      );
      
      // If preserving context and languages differ, add transition language
      if (preserveContext && detection.language !== targetLanguage) {
        return this.addLanguageTransitionContext(response, detection.language, targetLanguage);
      }
      
      return response;
    } catch (error) {
      console.error('Multi-language response generation error:', error);
      return this.getFallbackResponse(targetLanguage);
    }
  }

  static async createCulturallyAdaptedContent(
    baseContent: string,
    targetLanguage: string,
    culturalAdaptations: string[]
  ): Promise<TherapyContent> {
    try {
      let adaptedContent = await this.translateWithTherapyContext({
        text: baseContent,
        fromLanguage: 'en',
        toLanguage: targetLanguage,
        context: 'therapy',
        culturalAdaptation: true
      });
      
      // Apply specific cultural adaptations
      for (const adaptation of culturalAdaptations) {
        adaptedContent = this.applyCulturalAdaptation(adaptedContent, adaptation, targetLanguage);
      }
      
      return {
        id: `content_${Date.now()}`,
        content: adaptedContent,
        language: targetLanguage,
        culturalContext: culturalAdaptations.join(','),
        therapeuticValue: await this.assessTherapeuticValue(adaptedContent),
        appropriateness: await this.assessCulturalAppropriateness(adaptedContent, targetLanguage)
      };
    } catch (error) {
      console.error('Content adaptation error:', error);
      throw error;
    }
  }

  static getSupportedLanguages(): typeof SUPPORTED_LANGUAGES {
    return SUPPORTED_LANGUAGES;
  }

  static getTherapyTerminology(language: string): Record<string, string> {
    return THERAPY_TERMINOLOGY[language] || THERAPY_TERMINOLOGY['en'];
  }

  // Private helper methods
  private static simpleLanguageDetection(text: string): string {
    // Simple pattern matching for demo purposes
    // Real implementation would use advanced ML models
    
    const patterns = {
      'ar': /[\u0600-\u06FF]/,
      'zh': /[\u4e00-\u9fff]/,
      'ja': /[\u3040-\u309f\u30a0-\u30ff]/,
      'ko': /[\uac00-\ud7af]/,
      'ru': /[\u0400-\u04FF]/,
      'he': /[\u0590-\u05FF]/
    };
    
    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) return lang;
    }
    
    // Default to English for Latin scripts
    return 'en';
  }

  private static detectDialect(text: string, language: string): string | undefined {
    // Implementation would detect regional dialects
    // For now, return undefined
    return undefined;
  }

  private static inferRegion(language: string): string | undefined {
    const regions = SUPPORTED_LANGUAGES[language]?.regions;
    return regions?.[0]; // Return primary region
  }

  private static async performTranslation(request: TranslationRequest): Promise<string> {
    // Integration with translation service (Google Translate, DeepL, etc.)
    // For demo, return mock translation
    return `[Translated from ${request.fromLanguage} to ${request.toLanguage}]: ${request.text}`;
  }

  private static adaptTherapyTerminology(text: string, language: string): string {
    const terminology = THERAPY_TERMINOLOGY[language];
    if (!terminology) return text;
    
    let adaptedText = text;
    for (const [english, translated] of Object.entries(terminology)) {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      adaptedText = adaptedText.replace(regex, translated);
    }
    
    return adaptedText;
  }

  private static applyCulturalAdaptations(text: string, language: string): string {
    // Apply language-specific cultural adaptations
    switch (language) {
      case 'ar':
        return this.applyArabicCulturalAdaptations(text);
      case 'zh':
        return this.applyChineseCulturalAdaptations(text);
      case 'es':
        return this.applySpanishCulturalAdaptations(text);
      default:
        return text;
    }
  }

  private static applyArabicCulturalAdaptations(text: string): string {
    // Add Islamic cultural considerations
    return text + " (مع مراعاة القيم الثقافية والدينية)";
  }

  private static applyChineseCulturalAdaptations(text: string): string {
    // Add harmony and family considerations
    return text + " (考虑和谐与家庭价值观)";
  }

  private static applySpanishCulturalAdaptations(text: string): string {
    // Add family and community considerations
    return text + " (considerando valores familiares y comunitarios)";
  }

  private static addLanguageTransitionContext(
    response: string,
    fromLang: string,
    toLang: string
  ): string {
    const transitions = {
      'en': `I'll continue our conversation in ${SUPPORTED_LANGUAGES[toLang]?.name || toLang}.`,
      'es': `Continuaré nuestra conversación en ${SUPPORTED_LANGUAGES[toLang]?.name || toLang}.`,
      'ar': `سأواصل محادثتنا باللغة ${SUPPORTED_LANGUAGES[toLang]?.name || toLang}.`
    };
    
    const transition = transitions[fromLang] || transitions['en'];
    return `${transition}\n\n${response}`;
  }

  private static applyCulturalAdaptation(
    content: string,
    adaptation: string,
    language: string
  ): string {
    // Apply specific cultural adaptation based on type
    switch (adaptation) {
      case 'family-centered':
        return this.addFamilyContext(content, language);
      case 'religious-sensitive':
        return this.addReligiousContext(content, language);
      case 'collectivist':
        return this.addCollectivistContext(content, language);
      default:
        return content;
    }
  }

  private static addFamilyContext(content: string, language: string): string {
    const familyContexts = {
      'es': ' Considera también el impacto en tu familia.',
      'ar': ' ضع في اعتبارك أيضاً تأثير ذلك على عائلتك.',
      'zh': ' 也要考虑对家庭的影响。'
    };
    
    return content + (familyContexts[language] || '');
  }

  private static addReligiousContext(content: string, language: string): string {
    const religiousContexts = {
      'ar': ' مع مراعاة معتقداتك الدينية.',
      'es': ' considerando tus creencias religiosas.'
    };
    
    return content + (religiousContexts[language] || '');
  }

  private static addCollectivistContext(content: string, language: string): string {
    const collectivistContexts = {
      'zh': ' 从集体和谐的角度考虑。',
      'ar': ' من منظور الانسجام الجماعي.'
    };
    
    return content + (collectivistContexts[language] || '');
  }

  private static async assessTherapeuticValue(content: string): Promise<number> {
    // Implementation would assess therapeutic value using ML models
    return 0.8; // Mock value
  }

  private static async assessCulturalAppropriateness(content: string, language: string): Promise<number> {
    // Implementation would assess cultural appropriateness
    return 0.9; // Mock value
  }

  private static getFallbackResponse(language: string): string {
    const fallbacks = {
      'en': 'I want to make sure I understand you correctly. Could you tell me more?',
      'es': 'Quiero asegurarme de entenderte correctamente. ¿Podrías contarme más?',
      'fr': 'Je veux m\'assurer de bien vous comprendre. Pouvez-vous m\'en dire plus?',
      'ar': 'أريد التأكد من فهمي لك بشكل صحيح. هل يمكنك إخباري المزيد؟',
      'zh': '我想确保我正确理解你的意思。你能告诉我更多吗？'
    };
    
    return fallbacks[language] || fallbacks['en'];
  }
}
