
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useCookieLanguage } from '@/hooks/useCookieLanguage';

const EnhancedLanguageSelector = () => {
  const {
    currentLanguage,
    changeLanguage,
    getLanguagesByRegion,
    hasConfirmedLanguage,
    isI18nReady
  } = useCookieLanguage();

  // Don't show language suggestion dialog if already confirmed
  const languagesByRegion = getLanguagesByRegion();

  // Show simplified version if i18n isn't ready
  if (!isI18nReady) {
    return (
      <div className="flex items-center space-x-2 opacity-50">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <div className="w-40 h-9 bg-therapy-100 rounded-md animate-pulse flex items-center px-3">
          <span className="text-sm text-therapy-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage.code} onValueChange={changeLanguage}>
        <SelectTrigger className="w-40 border-therapy-200 hover:border-therapy-300 focus:border-therapy-500 focus:ring-therapy-500/20">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentLanguage.flag}</span>
              <span className="hidden sm:inline">{currentLanguage.name}</span>
              <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50 max-h-80 overflow-y-auto">
          {Object.entries(languagesByRegion).map(([region, languages]) => (
            <div key={region}>
              <div className="px-2 py-1 text-xs font-semibold text-therapy-600 border-b border-therapy-100">
                {region}
              </div>
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  <div className="flex items-center space-x-2">
                    <span>{language.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{language.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {language.nativeName}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnhancedLanguageSelector;
