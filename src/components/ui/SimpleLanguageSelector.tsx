import React, { useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import SafeHookWrapper from '@/components/SafeHookWrapper';

// Simple language data without external dependencies
const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const SimpleLanguageSelectorContent = () => {
  const [currentLang, setCurrentLang] = useState(supportedLanguages[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: typeof supportedLanguages[0]) => {
    setCurrentLang(language);
    setIsOpen(false);
    
    // Try to change i18n language if available, but don't break if it fails
    try {
      if (typeof window !== 'undefined' && (window as any).i18n) {
        (window as any).i18n.changeLanguage(language.code);
      }
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.code === 'ar' ? 'rtl' : 'ltr';
    } catch (error) {
      console.debug('i18n not available, using simple fallback');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        aria-label="Select language"
      >
        <Languages className="h-4 w-4 text-gray-500" />
        <span className="flex items-center space-x-1">
          <span>{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
          <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        </span>
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              <span>{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const SimpleLanguageSelector = () => {
  return (
    <SafeHookWrapper
      componentName="SimpleLanguageSelector"
      fallback={
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-gray-500" />
          <span className="text-sm">EN</span>
        </div>
      }
    >
      <SimpleLanguageSelectorContent />
    </SafeHookWrapper>
  );
};

export default SimpleLanguageSelector;