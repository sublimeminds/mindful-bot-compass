
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { countryDetectionService } from '@/services/countryDetectionService';

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

const languageByCountry: Record<string, string> = {
  'US': 'en', 'GB': 'en', 'AU': 'en', 'NZ': 'en',
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es',
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr',
  'DE': 'de', 'AT': 'de',
  'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'MA': 'ar',
  'BR': 'pt', 'PT': 'pt',
  'IT': 'it',
  'NL': 'nl',
  'RU': 'ru',
  'JP': 'ja',
  'KR': 'ko',
  'IN': 'hi',
  'CN': 'zh'
};

export const useEnhancedLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageData>(
    supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0]
  );
  const [suggestedLanguage, setSuggestedLanguage] = useState<string | null>(null);

  useEffect(() => {
    const lang = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0];
    setCurrentLanguage(lang);
    
    // Apply RTL styling
    document.documentElement.dir = lang.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    detectLocationLanguage();
  }, [i18n.language]);

  const detectLocationLanguage = async () => {
    try {
      const countryData = await countryDetectionService.detectCountry();
      if (countryData && countryData.countryCode) {
        const suggestedLang = languageByCountry[countryData.countryCode] || countryData.language;
        if (suggestedLang && suggestedLang !== i18n.language) {
          setSuggestedLanguage(suggestedLang);
        }
      }
    } catch (error) {
      console.warn('Could not detect location for language suggestion');
    }
  };

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      const newLang = supportedLanguages.find(l => l.code === languageCode);
      if (newLang) {
        setCurrentLanguage(newLang);
        document.documentElement.dir = newLang.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
        
        // Clear suggestion once user makes a choice
        setSuggestedLanguage(null);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getSuggestedLanguage = () => {
    if (suggestedLanguage) {
      const lang = supportedLanguages.find(l => l.code === suggestedLanguage);
      return lang;
    }
    return null;
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
    suggestedLanguage: getSuggestedLanguage(),
    getLanguagesByRegion
  };
};
