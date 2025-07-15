import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegionalPreferences } from '@/hooks/useRegionalPreferences';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';

interface CompactRegionalSelectorProps {
  className?: string;
}

const CompactRegionalSelector = ({ className = "" }: CompactRegionalSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  
  const { 
    regionalPreferences, 
    isLoading: regionLoading, 
    setCountryPreference 
  } = useRegionalPreferences();
  
  const { 
    availableCountries, 
    isLoading: countryLoading 
  } = useCountryDetection();
  
  const { 
    currentLanguage, 
    changeLanguage, 
    supportedLanguages 
  } = useEnhancedLanguage();
  
  const { 
    currency, 
    supportedCurrencies, 
    changeCurrency 
  } = useEnhancedCurrency();

  const isLoading = regionLoading || countryLoading;

  // Debug logging
  console.log('CompactRegionalSelector Debug:', {
    regionalPreferences,
    regionLoading,
    availableCountries: availableCountries?.length,
    countryLoading,
    currentLanguage,
    currency,
    supportedLanguages: supportedLanguages?.length,
    supportedCurrencies: supportedCurrencies?.length,
    isLoading
  });

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    try {
      return String.fromCodePoint(
        ...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt(0))
      );
    } catch {
      return '🌍';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Button variant="ghost" size="sm" disabled className="text-xs">
          <Globe className="h-3 w-3 mr-1 animate-spin" />
          Loading...
        </Button>
      </div>
    );
  }

  // Default values if no preferences detected
  const displayCountryCode = regionalPreferences?.countryCode || 'US';
  const displayCurrency = currency?.code || 'USD';
  const displayLanguage = currentLanguage?.code || 'en';

  // Smart suggestions based on country
  const getCountrySuggestions = (countryCode: string) => {
    const suggestions = {
      // Americas
      US: { currency: 'USD', language: 'en' },
      CA: { currency: 'CAD', language: 'en' },
      BR: { currency: 'BRL', language: 'pt' },
      MX: { currency: 'MXN', language: 'es' },
      AR: { currency: 'ARS', language: 'es' },
      CL: { currency: 'CLP', language: 'es' },
      CO: { currency: 'COP', language: 'es' },
      PE: { currency: 'PEN', language: 'es' },
      
      // Europe
      GB: { currency: 'GBP', language: 'en' },
      DE: { currency: 'EUR', language: 'de' },
      FR: { currency: 'EUR', language: 'fr' },
      ES: { currency: 'EUR', language: 'es' },
      IT: { currency: 'EUR', language: 'it' },
      CH: { currency: 'CHF', language: 'de' },
      PL: { currency: 'PLN', language: 'pl' },
      SE: { currency: 'SEK', language: 'sv' },
      NO: { currency: 'NOK', language: 'no' },
      DK: { currency: 'DKK', language: 'da' },
      CZ: { currency: 'CZK', language: 'cs' },
      HU: { currency: 'HUF', language: 'hu' },
      RU: { currency: 'RUB', language: 'ru' },
      TR: { currency: 'TRY', language: 'tr' },
      
      // Asia
      JP: { currency: 'JPY', language: 'ja' },
      CN: { currency: 'CNY', language: 'zh' },
      IN: { currency: 'INR', language: 'en' },
      KR: { currency: 'KRW', language: 'ko' },
      SG: { currency: 'SGD', language: 'en' },
      HK: { currency: 'HKD', language: 'en' },
      TW: { currency: 'TWD', language: 'zh' },
      TH: { currency: 'THB', language: 'th' },
      MY: { currency: 'MYR', language: 'en' },
      ID: { currency: 'IDR', language: 'id' },
      PH: { currency: 'PHP', language: 'en' },
      VN: { currency: 'VND', language: 'vi' },
      
      // Middle East
      AE: { currency: 'AED', language: 'ar' },
      SA: { currency: 'SAR', language: 'ar' },
      IL: { currency: 'ILS', language: 'he' },
      
      // Africa
      ZA: { currency: 'ZAR', language: 'en' },
      EG: { currency: 'EGP', language: 'ar' },
      
      // Oceania
      AU: { currency: 'AUD', language: 'en' },
      NZ: { currency: 'NZD', language: 'en' },
    };
    return suggestions[countryCode as keyof typeof suggestions];
  };

  const handleCountryChange = (newCountryCode: string) => {
    setCountryPreference(newCountryCode);
    const suggestions = getCountrySuggestions(newCountryCode);
    if (suggestions) {
      // Auto-suggest but don't force
      if (supportedCurrencies.find(c => c.code === suggestions.currency)) {
        changeCurrency(suggestions.currency);
      }
      if (supportedLanguages.find(l => l.code === suggestions.language)) {
        changeLanguage(suggestions.language);
      }
    }
    setCountryOpen(false);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-xs gap-2 hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all duration-200"
          >
            <span className="text-base">{currentLanguage?.flag || getCountryFlag(displayCountryCode)}</span>
            <span className="hidden sm:inline font-medium">{currentLanguage?.name || 'English'}</span>
            <span className="hidden lg:inline text-muted-foreground">•</span>
            <span className="font-mono font-semibold">{currency?.symbol || '$'}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end" sideOffset={4}>
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Regional Preferences</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Customize your language, currency and region
            </p>
          </div>

          <div className="p-4 space-y-6">
            {/* Language Selection - Primary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">🗣️</span>
                <label className="text-sm font-medium">Language (Interface)</label>
              </div>
              <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox"
                    aria-expanded={languageOpen}
                    className="w-full justify-between h-10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{currentLanguage?.flag || '🌍'}</span>
                      <span className="font-medium">{currentLanguage?.name || 'English'}</span>
                      <span className="text-xs text-muted-foreground uppercase">{displayLanguage}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search languages..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {supportedLanguages.map((lang) => (
                          <CommandItem
                            key={lang.code}
                            value={`${lang.name} ${lang.nativeName} ${lang.code}`}
                            onSelect={() => {
                              changeLanguage(lang.code);
                              setLanguageOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-lg">{lang.flag}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">{lang.name}</span>
                                <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                displayLanguage === lang.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Currency Selection - Secondary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">💰</span>
                <label className="text-sm font-medium">Currency (Pricing)</label>
              </div>
              <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox"
                    aria-expanded={currencyOpen}
                    className="w-full justify-between h-10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base">{currency?.symbol || '$'}</span>
                      <span className="font-medium">{currency?.name || 'US Dollar'}</span>
                      <span className="text-xs text-muted-foreground uppercase">{displayCurrency}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search currencies..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No currency found.</CommandEmpty>
                      
                      {/* Popular Currencies */}
                      <CommandGroup heading="Popular">
                        {supportedCurrencies
                          .filter(curr => ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'].includes(curr.code))
                          .map((curr) => (
                            <CommandItem
                              key={curr.code}
                              value={`${curr.name} ${curr.code} ${curr.symbol}`}
                              onSelect={() => {
                                changeCurrency(curr.code);
                                setCurrencyOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className="font-mono font-bold text-lg w-6 text-center">{curr.symbol}</span>
                                <div className="flex flex-col">
                                  <span className="font-medium">{curr.name}</span>
                                  <span className="text-xs text-muted-foreground uppercase">{curr.code}</span>
                                </div>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  displayCurrency === curr.code ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>

                      {/* Regional Groups */}
                      {['Americas', 'Europe', 'Asia', 'Middle East', 'Africa', 'Oceania'].map((region) => {
                        const regionCurrencies = supportedCurrencies
                          .filter(curr => curr.region === region && !['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'].includes(curr.code));
                        
                        if (regionCurrencies.length === 0) return null;
                        
                        return (
                          <CommandGroup key={region} heading={region}>
                            {regionCurrencies.map((curr) => (
                              <CommandItem
                                key={curr.code}
                                value={`${curr.name} ${curr.code} ${curr.symbol} ${region}`}
                                onSelect={() => {
                                  changeCurrency(curr.code);
                                  setCurrencyOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="font-mono font-bold text-lg w-6 text-center">{curr.symbol}</span>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{curr.name}</span>
                                    <span className="text-xs text-muted-foreground uppercase">{curr.code}</span>
                                  </div>
                                </div>
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    displayCurrency === curr.code ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        );
                      })}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Country Selection - Tertiary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">🌍</span>
                <label className="text-sm font-medium">Region (Content)</label>
              </div>
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-full justify-between h-10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getCountryFlag(displayCountryCode)}</span>
                      <span className="font-medium">{regionalPreferences?.countryName || 'United States'}</span>
                      <span className="text-xs text-muted-foreground uppercase">{displayCountryCode}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {availableCountries.map((country) => (
                          <CommandItem
                            key={country.country_code}
                            value={`${country.name} ${country.country_code}`}
                            onSelect={() => handleCountryChange(country.country_code)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-lg">{getCountryFlag(country.country_code)}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">{country.name}</span>
                                <span className="text-xs text-muted-foreground uppercase">{country.country_code}</span>
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                displayCountryCode === country.country_code ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="p-4 border-t border-border/50 bg-muted/30">
            <div className="flex items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-base">{currentLanguage?.flag || getCountryFlag(displayCountryCode)}</span>
                <span className="font-medium">{currentLanguage?.name || 'English'}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold">{currency?.symbol || '$'}</span>
                <span className="font-medium">{currency?.name || 'US Dollar'}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <span className="text-base">{getCountryFlag(displayCountryCode)}</span>
                <span className="font-medium">{regionalPreferences?.countryName || 'United States'}</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompactRegionalSelector;