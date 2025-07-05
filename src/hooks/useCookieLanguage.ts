
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

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
  const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageData>(
    supportedLanguages.find(lang => lang.code === (i18n.isInitialized ? i18n.language : 'en')) || supportedLanguages[0]
  );
  const [hasConfirmedLanguage, setHasConfirmedLanguage] = useState(false);

  // Safe wrapper for useTranslation - only use when i18n is ready
  let i18nInstance = i18n;
  try {
    // Only call useTranslation if i18n is ready
    if (isI18nReady) {
      const translation = useTranslation();
      i18nInstance = translation.i18n;
    }
  } catch (error) {
    console.warn('useTranslation not ready, using fallback i18n instance');
  }

  // Monitor i18n initialization
  useEffect(() => {
    const checkI18nReady = () => {
      if (i18n.isInitialized && !isI18nReady) {
        setIsI18nReady(true);
      }
    };

    // Check immediately
    checkI18nReady();

    // Set up listener for i18n initialization
    if (!i18n.isInitialized) {
      const handleInitialized = () => {
        setIsI18nReady(true);
      };
      
      i18n.on('initialized', handleInitialized);
      return () => i18n.off('initialized', handleInitialized);
    }
  }, [isI18nReady]);

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
    // Only proceed if i18n is ready
    if (!isI18nReady) return;

    // Check if language has been previously confirmed
    const confirmedCookie = getCookie(LANGUAGE_CONFIRMED_KEY);
    const savedLanguage = getCookie(LANGUAGE_COOKIE_KEY);
    
    if (confirmedCookie === 'true') {
      setHasConfirmedLanguage(true);
    }
    
    if (savedLanguage) {
      const lang = supportedLanguages.find(l => l.code === savedLanguage);
      if (lang && lang.code !== i18nInstance.language) {
        i18nInstance.changeLanguage(lang.code);
        setCurrentLanguage(lang);
        document.documentElement.dir = lang.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang.code;
      }
    }
  }, [isI18nReady, i18nInstance]);

  const changeLanguage = async (languageCode: string) => {
    if (!isI18nReady) {
      console.warn('Cannot change language: i18n not ready yet');
      return;
    }

    try {
      await i18nInstance.changeLanguage(languageCode);
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
    hasConfirmedLanguage,
    isI18nReady
  };
};
