import { useState, useEffect } from 'react';
import { LanguageRouter, SUPPORTED_LANGUAGES } from '@/utils/languageRouting';

export const useLanguageBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [suggestedLanguage, setSuggestedLanguage] = useState<any>(null);

  useEffect(() => {
    const suggestion = LanguageRouter.getLanguageSuggestion();
    if (suggestion) {
      const langData = SUPPORTED_LANGUAGES.find(l => l.code === suggestion.suggestedLanguage);
      if (langData) {
        setSuggestedLanguage({
          ...langData,
          redirect: suggestion.suggestedRedirect,
          flag: getLanguageFlag(langData.code)
        });
        setShowBanner(true);
      }
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    LanguageRouter.dismissLanguageSuggestion();
  };

  const switchLanguage = () => {
    if (suggestedLanguage?.redirect) {
      window.location.href = suggestedLanguage.redirect;
    }
  };

  return {
    showBanner,
    suggestedLanguage,
    dismissBanner,
    switchLanguage
  };
};

function getLanguageFlag(langCode: string): string {
  const flags: Record<string, string> = {
    'en': '🇺🇸',
    'de': '🇩🇪',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'it': '🇮🇹',
    'pt': '🇧🇷',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'zh': '🇨🇳',
    'ar': '🇸🇦'
  };
  return flags[langCode] || '🌐';
}