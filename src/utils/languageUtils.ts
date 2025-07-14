export interface LanguagePreference {
  language: string;
  culturalContext?: string;
}

/**
 * Safely extracts user language preference from profile and personalization data
 */
export function getUserLanguagePreference(
  profile?: any, 
  personalization?: any
): LanguagePreference {
  // Try various fields that might contain language preference
  const language = 
    profile?.language ||
    profile?.preferred_language ||
    profile?.locale?.split('_')[0] ||
    profile?.locale?.split('-')[0] ||
    personalization?.cultural_context?.split('_')[0] ||
    personalization?.cultural_context?.split('-')[0] ||
    'en';

  const culturalContext = 
    personalization?.cultural_context ||
    profile?.cultural_background ||
    profile?.locale ||
    undefined;

  return {
    language: language.toLowerCase(),
    culturalContext
  };
}

/**
 * Checks if translation is needed based on language preference
 */
export function shouldTranslate(userLanguage: string): boolean {
  return userLanguage && userLanguage !== 'en' && userLanguage !== 'english';
}

/**
 * Maps common language codes to full language names
 */
export const languageNames: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'tr': 'Turkish',
  'pl': 'Polish',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'th': 'Thai',
  'vi': 'Vietnamese'
};

/**
 * Gets the display name for a language code
 */
export function getLanguageDisplayName(languageCode: string): string {
  return languageNames[languageCode.toLowerCase()] || languageCode;
}

/**
 * Detects browser language preference
 */
export function getBrowserLanguage(): string {
  // Try various browser language detection methods
  const browserLang = 
    navigator.language ||
    (navigator as any).userLanguage ||
    (navigator as any).browserLanguage ||
    (navigator as any).systemLanguage ||
    'en';
    
  return browserLang.toLowerCase();
}

/**
 * Gets the best matching supported language from browser preferences
 */
export function detectBestLanguageMatch(supportedLanguages: string[]): string {
  const browserLangs = navigator.languages || [getBrowserLanguage()];
  
  for (const browserLang of browserLangs) {
    const langCode = browserLang.split('-')[0].toLowerCase();
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }
  
  return 'en'; // Default fallback
}