import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ChevronDown } from 'lucide-react';
import { useRegionalPreferences } from '@/hooks/useRegionalPreferences';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';

interface CompactRegionalSelectorProps {
  className?: string;
}

const CompactRegionalSelector = ({ className = "" }: CompactRegionalSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
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

  return (
    <div className={`flex items-center ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs gap-1 hover:bg-therapy-50"
          >
            <span>{getCountryFlag(displayCountryCode)}</span>
            <span className="hidden sm:inline">{displayCurrency}</span>
            <span className="hidden sm:inline">{displayLanguage.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-therapy-600" />
              <h3 className="font-medium text-sm">Regional Preferences</h3>
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Country</label>
              <Select 
                value={displayCountryCode} 
                onValueChange={setCountryPreference}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{getCountryFlag(displayCountryCode)}</span>
                      <span>{regionalPreferences?.countryName || 'Select Country'}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableCountries.map((country) => (
                    <SelectItem key={country.country_code} value={country.country_code}>
                      <div className="flex items-center gap-2 text-xs">
                        <span>{getCountryFlag(country.country_code)}</span>
                        <span>{country.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Currency</label>
              <Select 
                value={displayCurrency} 
                onValueChange={changeCurrency}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{currency?.symbol || '$'}</span>
                      <span>{displayCurrency}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {supportedCurrencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <div className="flex items-center gap-2 text-xs">
                        <span>{curr.symbol}</span>
                        <span>{curr.code} - {curr.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Language</label>
              <Select 
                value={displayLanguage} 
                onValueChange={changeLanguage}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{currentLanguage?.flag || '🌍'}</span>
                      <span>{currentLanguage?.name || 'English'}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2 text-xs">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Summary */}
            <div className="pt-2 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Current: {getCountryFlag(displayCountryCode)} {displayCurrency} {displayLanguage.toUpperCase()}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompactRegionalSelector;