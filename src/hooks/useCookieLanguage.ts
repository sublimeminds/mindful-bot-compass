
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

const LANGUAGE_COOKIE_KEY = 'therapysync_language';
const LANGUAGE_CONFIRMED_KEY = 'therapysync_language_confirmed';

export const useCookieLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageData>(
    supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0]
  );
  const [hasConfirmedLanguage, setHasConfirmedLanguage] = useState(false);

  // Get cookie value
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Set cookie value
  const setCookie = (name: string, value: string, days: number = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  useEffect(() => {
    // Check if language has been previously confirmed
    const confirmedCookie = getCookie(LANGUAGE_CONFIRMED_KEY);
    const savedLanguage = getCookie(LANGUAGE_COOKIE_KEY);
    
    if (confirmedCookie === 'true') {
      setHasConfirmedLanguage(true);
    }
    
    if (savedLanguage) {
      const lang = supportedLanguages.find(l => l.code === savedLanguage);
      if (lang && lang.code !== i18n.language) {
        i18n.changeLanguage(lang.code);
        setCurrentLanguage(lang);
        document.documentElement.dir = lang.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang.code;
      }
    }
  }, [i18n]);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      const newLang = supportedLanguages.find(l => l.code === languageCode);
      if (newLang) {
        setCurrentLanguage(newLang);
        document.documentElement.dir = newLang.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
        
        // Save to cookie
        setCookie(LANGUAGE_COOKIE_KEY, languageCode);
        setCookie(LANGUAGE_CONFIRMED_KEY, 'true');
        setHasConfirmedLanguage(true);
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
    getLanguagesByRegion,
    hasConfirmedLanguage
  };
};
