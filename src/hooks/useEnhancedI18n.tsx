import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAITranslation } from './useAITranslation';
import { useEnhancedLanguage } from './useEnhancedLanguage';

export function useEnhancedI18n() {
  const { t, i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useEnhancedLanguage();
  const { 
    translateText, 
    autoTranslate, 
    userPreferences,
    updatePreferences 
  } = useAITranslation();

  // Enhanced translation with AI fallback
  const smartTranslate = useCallback(async (
    key: string, 
    options?: any,
    contextType?: 'therapeutic' | 'ui' | 'crisis' | 'general'
  ): Promise<string> => {
    // First try regular i18n translation
    const translated = t(key, options);
    const translatedStr = typeof translated === 'string' ? translated : key;
    
    // If translation key is not found (returns the key), use AI translation
    if (translatedStr === key && userPreferences?.autoTranslate) {
      try {
        const result = await translateText(key, currentLanguage.code, {
          contextType: contextType || 'ui'
        });
        return result.translatedText;
      } catch (error) {
        console.warn('AI translation fallback failed:', error);
        return translatedStr;
      }
    }
    
    return translatedStr;
  }, [t, translateText, currentLanguage.code, userPreferences]);

  // Smart language switching with AI support
  const smartChangeLanguage = useCallback(async (
    languageCode: string,
    translateMissingKeys: boolean = true
  ) => {
    await changeLanguage(languageCode);
    
    if (translateMissingKeys && userPreferences?.autoTranslate) {
      // Could trigger background translation of missing keys
      console.log('Language changed, AI translation available for missing keys');
    }
  }, [changeLanguage, userPreferences]);

  return {
    // Enhanced translation functions
    t: smartTranslate,
    smartTranslate,
    
    // Standard i18n functions
    translate: t,
    changeLanguage: smartChangeLanguage,
    
    // AI translation functions
    autoTranslate,
    
    // Current state
    currentLanguage,
    language: i18n.language,
    isRTL: currentLanguage.isRTL,
    
    // User preferences
    userPreferences,
    updatePreferences
  };
}