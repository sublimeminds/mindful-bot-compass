
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageData {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

const supportedLanguages: LanguageData[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true }
];

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageData>(
    supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0]
  );

  useEffect(() => {
    const lang = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0];
    setCurrentLanguage(lang);
    
    // Apply RTL styling
    document.documentElement.dir = lang.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      const newLang = supportedLanguages.find(l => l.code === languageCode);
      if (newLang) {
        setCurrentLanguage(newLang);
        document.documentElement.dir = newLang.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    isRTL: currentLanguage.isRTL
  };
};
