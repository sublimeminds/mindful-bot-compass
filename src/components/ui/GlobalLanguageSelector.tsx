
import React, { useState } from 'react';
import { Check, ChevronDown, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GlobalTranslationService } from '@/services/globalTranslationService';

interface GlobalLanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  showRegions?: boolean;
  showLanguageFamilies?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  filterByRegion?: string;
  compact?: boolean;
}

export function GlobalLanguageSelector({
  selectedLanguage,
  onLanguageChange,
  showRegions = true,
  showLanguageFamilies = false,
  disabled = false,
  placeholder = "Select language...",
  className = "",
  filterByRegion,
  compact = false
}: GlobalLanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const languagesByRegion = GlobalTranslationService.getLanguagesByRegion();
  const selectedLanguageInfo = GlobalTranslationService.GLOBAL_LANGUAGES[selectedLanguage as keyof typeof GlobalTranslationService.GLOBAL_LANGUAGES];

  const handleSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setOpen(false);
    setSearchQuery("");
  };

  const filteredLanguagesByRegion = React.useMemo(() => {
    let filtered = languagesByRegion;
    
    if (filterByRegion) {
      filtered = { [filterByRegion]: languagesByRegion[filterByRegion] || [] };
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const result: typeof filtered = {};
      
      Object.entries(filtered).forEach(([region, languages]) => {
        const matchingLanguages = languages.filter(lang => 
          lang.name.toLowerCase().includes(query) || 
          lang.nativeName.toLowerCase().includes(query) ||
          lang.code.toLowerCase().includes(query) ||
          lang.family.toLowerCase().includes(query)
        );
        
        if (matchingLanguages.length > 0) {
          result[region] = matchingLanguages;
        }
      });
      
      return result;
    }
    
    return filtered;
  }, [languagesByRegion, filterByRegion, searchQuery]);

  const getLanguageStats = () => {
    const totalLanguages = Object.keys(GlobalTranslationService.GLOBAL_LANGUAGES).length;
    const totalRegions = Object.keys(languagesByRegion).length;
    return { totalLanguages, totalRegions };
  };

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-32 justify-between ${className}`}
            disabled={disabled}
          >
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span className="text-xs">
                {selectedLanguageInfo?.name.substring(0, 8) || selectedLanguage.toUpperCase()}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Command>
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              {Object.entries(filteredLanguagesByRegion).map(([region, languages]) => (
                <CommandGroup key={region} heading={region}>
                  {languages.map(({ code, name, nativeName, family }) => (
                    <CommandItem
                      key={code}
                      value={`${name} ${nativeName} ${code}`}
                      onSelect={() => handleSelect(code)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          className={`h-4 w-4 ${
                            selectedLanguage === code ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{name}</span>
                          <span className="text-xs text-muted-foreground">{nativeName}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {code.toUpperCase()}
                        </Badge>
                        {showLanguageFamilies && (
                          <Badge variant="outline" className="text-xs">
                            {family}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  const { totalLanguages, totalRegions } = getLanguageStats();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {selectedLanguageInfo ? selectedLanguageInfo.name : placeholder}
              </span>
              {selectedLanguageInfo && (
                <span className="text-xs text-muted-foreground">
                  {selectedLanguageInfo.nativeName} • {selectedLanguageInfo.region}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Global Languages</h4>
            <Badge variant="secondary">
              {totalLanguages} languages • {totalRegions} regions
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, native name, or family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Command>
          <CommandList className="max-h-80">
            <CommandEmpty>No language found.</CommandEmpty>
            {Object.entries(filteredLanguagesByRegion).map(([region, languages]) => (
              <CommandGroup key={region} heading={region}>
                {languages.map(({ code, name, nativeName, family }) => (
                  <CommandItem
                    key={code}
                    value={`${name} ${nativeName} ${code} ${family}`}
                    onSelect={() => handleSelect(code)}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Check
                        className={`h-4 w-4 ${
                          selectedLanguage === code ? "opacity-100 text-primary" : "opacity-0"
                        }`}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{name}</span>
                        <span className="text-sm text-muted-foreground">{nativeName}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge variant="secondary" className="text-xs">
                        {code.toUpperCase()}
                      </Badge>
                      {showLanguageFamilies && (
                        <Badge variant="outline" className="text-xs">
                          {family}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
