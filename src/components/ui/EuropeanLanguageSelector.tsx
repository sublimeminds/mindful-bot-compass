import React, { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { EuropeanTranslationService } from '@/services/europeanTranslationService';

interface EuropeanLanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  showRegions?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function EuropeanLanguageSelector({
  selectedLanguage,
  onLanguageChange,
  showRegions = true,
  disabled = false,
  placeholder = "Select language...",
  className = ""
}: EuropeanLanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const languagesByRegion = EuropeanTranslationService.getLanguagesByRegion();
  const selectedLanguageName = EuropeanTranslationService.getLanguageName(selectedLanguage);

  const handleSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setOpen(false);
  };

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
            {selectedLanguage ? selectedLanguageName : placeholder}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search languages..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            {showRegions ? (
              Object.entries(languagesByRegion).map(([region, languages]) => (
                <CommandGroup key={region} heading={region}>
                  {languages.map(({ code, name }) => (
                    <CommandItem
                      key={code}
                      value={`${name} ${code}`}
                      onSelect={() => handleSelect(code)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Check
                            className={`h-4 w-4 ${
                              selectedLanguage === code ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <span>{name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {code.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup>
                {Object.entries(EuropeanTranslationService.SUPPORTED_LANGUAGES).map(([code, info]) => (
                  <CommandItem
                    key={code}
                    value={`${info.name} ${code}`}
                    onSelect={() => handleSelect(code)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Check
                          className={`h-4 w-4 ${
                            selectedLanguage === code ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span>{info.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {code.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {info.region}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}