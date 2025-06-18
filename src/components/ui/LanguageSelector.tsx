
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { currentLanguage, supportedLanguages, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage.code} onValueChange={changeLanguage}>
        <SelectTrigger className="w-40">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50">
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.nativeName}</span>
                <span className="text-sm text-muted-foreground">({language.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
