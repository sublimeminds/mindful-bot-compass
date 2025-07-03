import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageData {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
  region: string;
}

const supportedLanguages: LanguageData[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isRTL: false, region: 'Americas' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false, region: 'Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false, region: 'Europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false, region: 'Europe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true, region: 'Middle East' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', isRTL: false, region: 'Americas' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isRTL: false, region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', isRTL: false, region: 'Europe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isRTL: false, region: 'Europe' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isRTL: false, region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isRTL: false, region: 'Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isRTL: false, region: 'Asia' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isRTL: false, region: 'Asia' },
];

// Simple language hook without external service dependencies
export const useSimpleLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageData>(
    supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0]
  );

  useEffect(() => {
    const lang = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0];
    setCurrentLanguage(lang);
    
    // Basic DOM updates only
    if (typeof document !== 'undefined') {
      try {
        document.documentElement.dir = lang.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
      } catch (error) {
        // Silent fail
      }
    }
  }, [i18n.language]);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      const newLang = supportedLanguages.find(l => l.code === languageCode);
      if (newLang) {
        setCurrentLanguage(newLang);
        if (typeof document !== 'undefined') {
          document.documentElement.dir = newLang.isRTL ? 'rtl' : 'ltr';
          document.documentElement.lang = languageCode;
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getLanguagesByRegion = () => {
    const regions: Record<string, LanguageData[]> = {};
    supportedLanguages.forEach(lang => {
      if (!regions[lang.region]) {
        regions[lang.region] = [];
      }
      regions[lang.region].push(lang);
    });
    return regions;
  };

  return {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    isRTL: currentLanguage.isRTL,
    suggestedLanguage: null, // Simplified - no async detection
    getLanguagesByRegion
  };
};

// Export both names for compatibility
export const useEnhancedLanguage = useSimpleLanguage;