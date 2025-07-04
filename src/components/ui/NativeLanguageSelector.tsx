import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageData {
  code: string;
  name: string;
  flag: string;
}

const supportedLanguages: LanguageData[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

// Hook-free language selector using browser APIs
const NativeLanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageData>(() => {
    // Detect browser language
    const browserLang = navigator.language?.split('-')[0] || 'en';
    return supportedLanguages.find(lang => lang.code === browserLang) || supportedLanguages[0];
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLanguageChange = (languageCode: string) => {
    const newLang = supportedLanguages.find(lang => lang.code === languageCode);
    if (newLang) {
      setCurrentLang(newLang);
      setIsOpen(false);
      
      // Update localStorage for persistence
      try {
        localStorage.setItem('preferred-language', languageCode);
        document.documentElement.lang = languageCode;
      } catch (error) {
        console.warn('Language persistence failed:', error);
      }
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
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-therapy-50 transition-colors duration-150 ${
                language.code === currentLang.code ? 'bg-therapy-100 text-therapy-800' : 'text-gray-700'
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

export default NativeLanguageSelector;