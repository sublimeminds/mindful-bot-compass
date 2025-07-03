
import React, { useState, useRef, useEffect } from 'react';
import { useSimpleLanguage } from '@/hooks/useSimpleLanguage';
import { Globe, ChevronDown } from 'lucide-react';

const CleanLanguageSelector = () => {
  const { currentLanguage, supportedLanguages, changeLanguage } = useSimpleLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = supportedLanguages.map(lang => ({
    code: lang.code,
    name: lang.name,
    flag: lang.flag
  }));

  const currentLang = languages.find(lang => lang.code === currentLanguage.code) || languages[0];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      setIsOpen(false);
      
      // Simple URL update without complex path manipulation
      if (typeof window !== 'undefined' && window.history) {
        try {
          const currentPath = window.location.pathname;
          const languagePrefixes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'nl'];
          
          // Remove existing language prefix if present
          let cleanPath = currentPath;
          for (const prefix of languagePrefixes) {
            if (currentPath.startsWith(`/${prefix}/`) || currentPath === `/${prefix}`) {
              cleanPath = currentPath.substring(`/${prefix}`.length) || '/';
              break;
            }
          }
          
          // Add new language prefix if not English
          const newPath = languageCode === 'en' ? cleanPath : `/${languageCode}${cleanPath}`;
          
          // Update URL without page reload
          if (newPath !== currentPath) {
            window.history.pushState({}, '', newPath);
          }
        } catch (urlError) {
          // Silent fail on URL update
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md hover:bg-therapy-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-therapy-300"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 text-therapy-600" />
        <span className="text-therapy-700">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 text-therapy-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-therapy-200 rounded-lg shadow-lg z-50 min-w-[180px] py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-therapy-50 transition-colors duration-150 ${
                language.code === currentLanguage.code ? 'bg-therapy-100 text-therapy-800' : 'text-gray-700'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CleanLanguageSelector;
