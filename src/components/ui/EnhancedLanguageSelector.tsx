
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本语', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const EnhancedLanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    console.log('Language changed to:', value);
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-therapy-600" />
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-auto min-w-[120px] bg-white border-therapy-200 hover:bg-therapy-50">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{selectedLang?.flag}</span>
              <span className="text-therapy-700">{selectedLang?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-therapy-200 shadow-xl">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="hover:bg-therapy-50 text-therapy-700"
            >
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnhancedLanguageSelector;
