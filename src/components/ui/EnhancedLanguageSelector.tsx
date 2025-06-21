
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Globe, Info } from 'lucide-react';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

const EnhancedLanguageSelector = () => {
  const { t } = useTranslation();
  const {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    suggestedLanguage,
    getLanguagesByRegion
  } = useEnhancedLanguage();

  const languagesByRegion = getLanguagesByRegion();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <Select value={currentLanguage.code} onValueChange={changeLanguage}>
          <SelectTrigger className="w-40">
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
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b">
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

      {/* Language Suggestion */}
      {suggestedLanguage && (
        <Alert className="p-2">
          <Globe className="h-3 w-3" />
          <AlertDescription className="text-xs">
            We detected you might prefer {suggestedLanguage.name} ({suggestedLanguage.nativeName})
            <button
              onClick={() => changeLanguage(suggestedLanguage.code)}
              className="ml-2 text-primary hover:underline font-medium"
            >
              Switch
            </button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedLanguageSelector;
