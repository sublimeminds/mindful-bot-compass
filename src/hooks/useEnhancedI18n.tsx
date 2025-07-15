import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useEnhancedLanguage } from './useEnhancedLanguage';

export function useEnhancedI18n() {
  const { t, i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useEnhancedLanguage();

  // Enhanced translation with fallback to the key
  const tWithFallback = useCallback((
    key: string, 
    options?: any
  ): string => {
    const result = t(key, { ...options, lng: currentLanguage.code });
    return typeof result === 'string' ? result : key;
  }, [t, currentLanguage.code]);

  return {
    // Enhanced translation functions
    t: tWithFallback,
    tWithFallback,
    
    // Standard i18n functions
    translate: t,
    changeLanguage,
    
    // Current state
    currentLanguage,
    language: i18n.language,
    isRTL: currentLanguage.isRTL
  };
};