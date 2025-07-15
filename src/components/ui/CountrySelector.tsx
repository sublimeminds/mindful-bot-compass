import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Globe, Check } from 'lucide-react';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  onCountryChange?: (countryCode: string) => void;
  showDetected?: boolean;
  showRegions?: boolean;
  className?: string;
}

const CountrySelector = ({ 
  onCountryChange, 
  showDetected = true,
  showRegions = true,
  className 
}: CountrySelectorProps) => {
  const { t } = useTranslation();
  const { 
    countryData, 
    availableCountries, 
    setUserCountryPreference,
    getCountriesByRegion 
  } = useCountryDetection();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const handleCountrySelect = async (countryCode: string) => {
    await setUserCountryPreference(countryCode);
    onCountryChange?.(countryCode);
  };

  const useDetectedCountry = async () => {
    if (countryData) {
      await handleCountrySelect(countryData.countryCode);
    }
  };

  const filteredCountries = availableCountries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.country_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = [...new Set(availableCountries.map(c => c.region))];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Detected Country Suggestion */}
      {showDetected && countryData && countryData.detectionMethod !== 'user_preference' && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">
                  {t('country.detectedAs', { country: countryData.countryName })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('country.basedOn', { method: t(`detectionMethod.${countryData.detectionMethod}`) })}
                </div>
              </div>
            </div>
            <Button onClick={useDetectedCountry} size="sm">
              <Check className="h-4 w-4 mr-2" />
              {t('common.use')}
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('country.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {showRegions && (
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder={t('country.selectRegion')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{t('common.allRegions')}</span>
                </div>
              </SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>
                  {t(`region.${region}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Country List */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredCountries.map(country => (
          <div
            key={country.country_code}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors",
              countryData?.countryCode === country.country_code && "ring-2 ring-primary"
            )}
            onClick={() => handleCountrySelect(country.country_code)}
          >
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-medium">{country.name}</div>
                <div className="text-sm text-muted-foreground">
                  {country.region} • {country.currency_code}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {country.currency_symbol}
              </Badge>
              {countryData?.countryCode === country.country_code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <div>{t('country.noCountriesFound')}</div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;