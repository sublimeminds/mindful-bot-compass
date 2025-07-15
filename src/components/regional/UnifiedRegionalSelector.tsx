import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Globe, MapPin, DollarSign, Languages, Settings, Zap, AlertCircle } from 'lucide-react';
import { useRegionalPreferences } from '@/hooks/useRegionalPreferences';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';

interface UnifiedRegionalSelectorProps {
  showAdvanced?: boolean;
  onPreferencesChange?: (preferences: any) => void;
  className?: string;
}

const UnifiedRegionalSelector = ({ 
  showAdvanced = false, 
  onPreferencesChange,
  className = "" 
}: UnifiedRegionalSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'country' | 'currency' | 'language'>('country');
  
  const { 
    regionalPreferences, 
    isLoading: regionLoading, 
    setCountryPreference,
    isEUCountry,
    isEligibleForPPP,
    getPPPMultiplier
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
  
  const handleCountryChange = async (countryCode: string) => {
    await setCountryPreference(countryCode);
    onPreferencesChange?.({ countryCode });
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    await changeCurrency(currencyCode);
    onPreferencesChange?.({ currency: currencyCode });
  };

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    onPreferencesChange?.({ language: languageCode });
  };

  const getCountryFlag = (countryCode: string) => {
    return String.fromCodePoint(
      ...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt(0))
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Globe className="h-4 w-4 text-muted-foreground animate-spin" />
        <div className="h-9 w-40 bg-therapy-100 rounded-md animate-pulse" />
      </div>
    );
  }

  const SelectorContent = () => (
    <Card className="w-96 border-therapy-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-therapy-600" />
          Regional Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-therapy-50 p-1 rounded-lg">
          {[
            { id: 'country', icon: MapPin, label: 'Country' },
            { id: 'currency', icon: DollarSign, label: 'Currency' },
            { id: 'language', icon: Languages, label: 'Language' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-therapy-700 shadow-sm'
                    : 'text-therapy-600 hover:text-therapy-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Country Selection */}
        {activeTab === 'country' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Country</label>
              {regionalPreferences && (
                <Badge variant="outline" className="text-xs">
                  {regionalPreferences.detectionMethod === 'user_preference' ? 'Manual' : 'Auto-detected'}
                </Badge>
              )}
            </div>
            <Select 
              value={regionalPreferences?.countryCode || ''} 
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {regionalPreferences && (
                    <div className="flex items-center gap-2">
                      <span>{getCountryFlag(regionalPreferences.countryCode)}</span>
                      <span>{regionalPreferences.countryName}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {availableCountries.map((country) => (
                  <SelectItem key={country.country_code} value={country.country_code}>
                    <div className="flex items-center gap-2">
                      <span>{getCountryFlag(country.country_code)}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {regionalPreferences && showAdvanced && (
              <div className="space-y-2 pt-2 border-t border-therapy-100">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>Region: {regionalPreferences.region}</div>
                  <div>Timezone: {regionalPreferences.timezone}</div>
                </div>
                {isEUCountry() && (
                  <Badge variant="secondary" className="text-xs">
                    EU VAT applies
                  </Badge>
                )}
                {isEligibleForPPP() && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">
                      PPP pricing available (-{Math.round((1 - getPPPMultiplier()) * 100)}%)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Currency Selection */}
        {activeTab === 'currency' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Currency</label>
            <Select 
              value={currency.code || ''} 
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{currency.symbol}</span>
                    <span>{currency.code} - {currency.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {supportedCurrencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <div className="flex items-center gap-2">
                      <span>{curr.symbol}</span>
                      <span>{curr.code} - {curr.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Language Selection */}
        {activeTab === 'language' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Language</label>
            <Select 
              value={currentLanguage.code || ''} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{currentLanguage.flag}</span>
                    <span>{currentLanguage.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <div className="flex flex-col">
                        <span>{lang.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {lang.nativeName}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Current Settings Summary */}
        <div className="pt-3 border-t border-therapy-100">
          <div className="text-xs text-slate-600 space-y-1">
            <div>Current: {regionalPreferences?.countryName} • {currency.code} • {currentLanguage.name}</div>
            {regionalPreferences?.confidence && regionalPreferences.confidence < 0.8 && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                <span>Location detection confidence: {Math.round(regionalPreferences.confidence * 100)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`flex items-center ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-10 px-3 border-therapy-200 hover:border-therapy-300 hover:bg-therapy-50"
          >
            <Globe className="h-4 w-4 text-therapy-600" />
            {regionalPreferences && (
              <>
                <span>{getCountryFlag(regionalPreferences.countryCode)}</span>
                <span className="hidden sm:inline">{regionalPreferences.countryName}</span>
                <span className="sm:hidden">{regionalPreferences.countryCode}</span>
              </>
            )}
            <Settings className="h-3 w-3 text-muted-foreground ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="end"
          side="bottom"
        >
          <SelectorContent />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UnifiedRegionalSelector;