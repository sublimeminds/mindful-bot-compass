interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  region: string;
  culturalContext: CulturalContext;
  aiModelSupported: boolean;
  voiceSupported: boolean;
  crisis: CrisisResources;
}

interface CulturalContext {
  familyStructure: 'individualistic' | 'collectivistic' | 'mixed';
  communicationStyle: 'direct' | 'indirect' | 'high-context' | 'low-context';
  mentalHealthStigma: 'low' | 'medium' | 'high';
  religiousConsiderations: string[];
  therapyApproach: string[];
  culturalNorms: string[];
}

interface CrisisResources {
  hotlines: { name: string; number: string; availability: string }[];
  emergencyNumber: string;
  onlineResources: { name: string; url: string; language: string }[];
  localServices: string[];
}

interface LocalizedTherapyApproach {
  language: string;
  culturalAdaptations: string[];
  communicationPatterns: string[];
  avoidanceTopics: string[];
  preferredTechniques: string[];
}

class AdvancedLocalizationService {
  private languages: LanguageConfig[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      rtl: false,
      region: 'global',
      culturalContext: {
        familyStructure: 'individualistic',
        communicationStyle: 'direct',
        mentalHealthStigma: 'low',
        religiousConsiderations: ['Christianity', 'Judaism', 'Islam'],
        therapyApproach: ['CBT', 'DBT', 'Psychodynamic'],
        culturalNorms: ['Individual autonomy', 'Self-expression']
      },
      aiModelSupported: true,
      voiceSupported: true,
      crisis: {
        hotlines: [
          { name: 'National Suicide Prevention Lifeline', number: '988', availability: '24/7' },
          { name: 'Crisis Text Line', number: 'Text HOME to 741741', availability: '24/7' }
        ],
        emergencyNumber: '911',
        onlineResources: [
          { name: 'NAMI', url: 'https://nami.org', language: 'en' },
          { name: 'Mental Health America', url: 'https://mhanational.org', language: 'en' }
        ],
        localServices: ['Community mental health centers', 'Employee assistance programs']
      }
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      rtl: false,
      region: 'americas',
      culturalContext: {
        familyStructure: 'collectivistic',
        communicationStyle: 'indirect',
        mentalHealthStigma: 'medium',
        religiousConsiderations: ['Catholicism', 'Christianity'],
        therapyApproach: ['Family therapy', 'Narrative therapy', 'Culturally adapted CBT'],
        culturalNorms: ['Family involvement', 'Respeto', 'Personalismo']
      },
      aiModelSupported: true,
      voiceSupported: true,
      crisis: {
        hotlines: [
          { name: 'Línea Nacional de Prevención del Suicidio', number: '1-888-628-9454', availability: '24/7' },
          { name: 'Crisis Text Line Spanish', number: 'Text HOLA to 741741', availability: '24/7' }
        ],
        emergencyNumber: '911',
        onlineResources: [
          { name: 'NAMI en Español', url: 'https://nami.org/Support-Education/Publications-Reports/Guides/NAMI-en-Espanol', language: 'es' }
        ],
        localServices: ['Centros comunitarios de salud mental', 'Servicios bilingües']
      }
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      rtl: false,
      region: 'asia',
      culturalContext: {
        familyStructure: 'collectivistic',
        communicationStyle: 'high-context',
        mentalHealthStigma: 'high',
        religiousConsiderations: ['Buddhism', 'Taoism', 'Confucianism'],
        therapyApproach: ['Family involvement', 'Harmony-based therapy', 'Traditional healing integration'],
        culturalNorms: ['Face-saving', 'Filial piety', 'Group harmony']
      },
      aiModelSupported: true,
      voiceSupported: true,
      crisis: {
        hotlines: [
          { name: '北京危机干预热线', number: '400-161-9995', availability: '24/7' },
          { name: '上海心理援助热线', number: '021-64383562', availability: '24/7' }
        ],
        emergencyNumber: '120',
        onlineResources: [
          { name: '中国心理卫生协会', url: 'https://www.camh.org.cn', language: 'zh' }
        ],
        localServices: ['社区心理健康中心', '医院心理科']
      }
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      rtl: true,
      region: 'mena',
      culturalContext: {
        familyStructure: 'collectivistic',
        communicationStyle: 'high-context',
        mentalHealthStigma: 'high',
        religiousConsiderations: ['Islam', 'Christianity'],
        therapyApproach: ['Islamic psychology', 'Family therapy', 'Culturally sensitive CBT'],
        culturalNorms: ['Religious guidance', 'Family honor', 'Community support']
      },
      aiModelSupported: true,
      voiceSupported: false,
      crisis: {
        hotlines: [
          { name: 'خط المساعدة النفسية', number: '+971-800-4673', availability: '24/7' },
          { name: 'الخط الساخن للصحة النفسية', number: '+966-920003344', availability: '24/7' }
        ],
        emergencyNumber: '999',
        onlineResources: [
          { name: 'الجمعية السعودية للطب النفسي', url: 'https://sppa.org.sa', language: 'ar' }
        ],
        localServices: ['مراكز الصحة النفسية', 'العيادات المتخصصة']
      }
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      rtl: false,
      region: 'asia',
      culturalContext: {
        familyStructure: 'collectivistic',
        communicationStyle: 'high-context',
        mentalHealthStigma: 'high',
        religiousConsiderations: ['Hinduism', 'Sikhism', 'Buddhism', 'Islam'],
        therapyApproach: ['Yoga therapy', 'Ayurvedic integration', 'Family-centered therapy'],
        culturalNorms: ['Dharma', 'Karma', 'Joint family system']
      },
      aiModelSupported: true,
      voiceSupported: false,
      crisis: {
        hotlines: [
          { name: 'KIRAN Mental Health Helpline', number: '1800-599-0019', availability: '24/7' },
          { name: 'Vandrevala Foundation', number: '+91-9999666555', availability: '24/7' }
        ],
        emergencyNumber: '102',
        onlineResources: [
          { name: 'Indian Psychiatric Society', url: 'https://www.indianpsychiatricsociety.org', language: 'hi' }
        ],
        localServices: ['सामुदायिक स्वास्थ्य केंद्र', 'मानसिक स्वास्थ्य क्लिनिक']
      }
    }
  ];

  private therapyAdaptations: LocalizedTherapyApproach[] = [
    {
      language: 'es',
      culturalAdaptations: [
        'Include family members in therapy discussions',
        'Respect for hierarchy and age',
        'Use of dichos (sayings) and cultural metaphors',
        'Integration of spiritual/religious beliefs'
      ],
      communicationPatterns: [
        'Personalismo - building personal relationships',
        'Indirect communication style',
        'Respecting authority figures',
        'Non-verbal communication awareness'
      ],
      avoidanceTopics: ['Direct criticism of family', 'Individual desires over family needs'],
      preferredTechniques: ['Narrative therapy', 'Family genograms', 'Culturally adapted CBT']
    },
    {
      language: 'zh',
      culturalAdaptations: [
        'Face-saving approaches to sensitive topics',
        'Integration of traditional Chinese medicine concepts',
        'Respect for generational wisdom',
        'Harmony-based conflict resolution'
      ],
      communicationPatterns: [
        'Indirect communication',
        'Non-confrontational approaches',
        'Respect for silence and reflection',
        'Group consensus building'
      ],
      avoidanceTopics: ['Direct family criticism', 'Individual success over group harmony'],
      preferredTechniques: ['Mindfulness integration', 'Traditional healing concepts', 'Family therapy']
    },
    {
      language: 'ar',
      culturalAdaptations: [
        'Integration of Islamic psychological concepts',
        'Respect for religious practices and beliefs',
        'Gender-appropriate therapy approaches',
        'Community and family involvement'
      ],
      communicationPatterns: [
        'Respectful and formal initial interactions',
        'Religious framing of psychological concepts',
        'Storytelling and metaphorical communication',
        'Gender-sensitive communication'
      ],
      avoidanceTopics: ['Religious criticism', 'Gender role challenges'],
      preferredTechniques: ['Islamic psychology', 'Religious counseling integration', 'Family therapy']
    }
  ];

  // Auto-detect user's preferred language and cultural context
  async detectUserLanguageAndCulture(): Promise<{
    language: LanguageConfig;
    confidence: number;
    culturalAdaptations: LocalizedTherapyApproach | null;
  }> {
    try {
      // Browser language detection
      const browserLang = navigator.language.split('-')[0];
      
      // Geolocation-based culture detection
      const geoResponse = await fetch('https://ipapi.co/json/');
      const geoData = await geoResponse.json();
      
      let detectedLanguage = this.languages.find(l => l.code === browserLang) || this.languages[0];
      
      // Refine based on country
      if (geoData.country_code) {
        const countryLanguageMap: Record<string, string> = {
          'MX': 'es', 'AR': 'es', 'CO': 'es', 'ES': 'es',
          'CN': 'zh', 'TW': 'zh', 'HK': 'zh',
          'SA': 'ar', 'AE': 'ar', 'EG': 'ar',
          'IN': 'hi'
        };
        
        const countryLang = countryLanguageMap[geoData.country_code];
        if (countryLang) {
          detectedLanguage = this.languages.find(l => l.code === countryLang) || detectedLanguage;
        }
      }

      const adaptations = this.therapyAdaptations.find(a => a.language === detectedLanguage.code);
      
      return {
        language: detectedLanguage,
        confidence: 0.85,
        culturalAdaptations: adaptations || null
      };
    } catch (error) {
      console.warn('Language detection failed:', error);
      return {
        language: this.languages[0], // Default to English
        confidence: 0.5,
        culturalAdaptations: null
      };
    }
  }

  // Generate culturally-adapted therapy responses
  async adaptTherapyResponse(
    originalResponse: string,
    targetLanguage: string,
    culturalContext: CulturalContext
  ): Promise<string> {
    const adaptations = this.therapyAdaptations.find(a => a.language === targetLanguage);
    
    if (!adaptations) {
      return originalResponse; // No specific adaptations available
    }

    // Apply cultural adaptations
    let adaptedResponse = originalResponse;

    // Adjust communication style
    if (culturalContext.communicationStyle === 'indirect') {
      adaptedResponse = this.makeResponseMoreIndirect(adaptedResponse);
    }

    // Add cultural context
    if (culturalContext.familyStructure === 'collectivistic') {
      adaptedResponse = this.addFamilyContext(adaptedResponse);
    }

    // Consider religious aspects
    if (culturalContext.religiousConsiderations.length > 0) {
      adaptedResponse = this.addReligiousSensitivity(adaptedResponse, culturalContext.religiousConsiderations);
    }

    return adaptedResponse;
  }

  private makeResponseMoreIndirect(response: string): string {
    // Convert direct statements to more indirect suggestions
    return response
      .replace(/You should/g, 'You might consider')
      .replace(/You must/g, 'It could be helpful to')
      .replace(/This is wrong/g, 'This might not be the most helpful approach');
  }

  private addFamilyContext(response: string): string {
    // Add family-oriented perspectives
    const familyContexts = [
      'It might be worth considering how this affects your family as well.',
      'Your family\'s perspective could be valuable in this situation.',
      'Have you thought about discussing this with trusted family members?'
    ];
    
    const randomContext = familyContexts[Math.floor(Math.random() * familyContexts.length)];
    return response + ' ' + randomContext;
  }

  private addReligiousSensitivity(response: string, religions: string[]): string {
    // Add religiously-sensitive framing
    if (religions.includes('Islam')) {
      return response + ' May this guidance bring you peace and well-being, Insha\'Allah.';
    }
    if (religions.includes('Hinduism')) {
      return response + ' May this path lead to inner peace and dharma.';
    }
    if (religions.includes('Buddhism')) {
      return response + ' May this practice bring you closer to inner peace and enlightenment.';
    }
    return response;
  }

  // Get crisis resources for specific language/region
  getCrisisResources(languageCode: string): CrisisResources | null {
    const language = this.languages.find(l => l.code === languageCode);
    return language ? language.crisis : null;
  }

  // Dynamic content localization
  async localizeContent(contentKey: string, language: string, variables?: Record<string, string>): Promise<string> {
    // This would typically fetch from a localization database
    // For now, returning a placeholder implementation
    
    const localizations: Record<string, Record<string, string>> = {
      'welcome_message': {
        'en': 'Welcome to TherapySync',
        'es': 'Bienvenido a TherapySync',
        'zh': '欢迎使用TherapySync',
        'ar': 'مرحباً بك في TherapySync',
        'hi': 'TherapySync में आपका स्वागत है'
      },
      'session_start': {
        'en': 'Let\'s begin your therapy session',
        'es': 'Comencemos tu sesión de terapia',
        'zh': '开始你的治疗会话',
        'ar': 'دعنا نبدأ جلسة العلاج الخاصة بك',
        'hi': 'आइए अपना थेरेपी सेशन शुरू करते हैं'
      }
    };

    let content = localizations[contentKey]?.[language] || localizations[contentKey]?.['en'] || contentKey;
    
    // Replace variables if provided
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{${key}}`, 'g'), value);
      });
    }

    return content;
  }

  // Cultural sensitivity checker
  checkCulturalSensitivity(content: string, targetCulture: CulturalContext): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check for individualistic language in collectivistic cultures
    if (targetCulture.familyStructure === 'collectivistic') {
      const individualisticTerms = ['only you', 'just yourself', 'independent', 'self-reliant'];
      individualisticTerms.forEach(term => {
        if (content.toLowerCase().includes(term)) {
          issues.push(`Potentially inappropriate individualistic language: "${term}"`);
          suggestions.push('Consider family and community context');
          score -= 10;
        }
      });
    }

    // Check for direct communication in high-context cultures
    if (targetCulture.communicationStyle === 'high-context') {
      const directTerms = ['you should', 'you must', 'definitely', 'absolutely'];
      directTerms.forEach(term => {
        if (content.toLowerCase().includes(term)) {
          issues.push(`Potentially too direct: "${term}"`);
          suggestions.push('Use more indirect, suggestive language');
          score -= 5;
        }
      });
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  // Get all supported languages
  getSupportedLanguages(): LanguageConfig[] {
    return [...this.languages];
  }

  // Get therapy adaptations for a language
  getTherapyAdaptations(languageCode: string): LocalizedTherapyApproach | null {
    return this.therapyAdaptations.find(a => a.language === languageCode) || null;
  }

  // Check if language supports AI features
  supportsAI(languageCode: string): boolean {
    const language = this.languages.find(l => l.code === languageCode);
    return language?.aiModelSupported || false;
  }

  // Check if language supports voice features
  supportsVoice(languageCode: string): boolean {
    const language = this.languages.find(l => l.code === languageCode);
    return language?.voiceSupported || false;
  }
}

export const advancedLocalizationService = new AdvancedLocalizationService();