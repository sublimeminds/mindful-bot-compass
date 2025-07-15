
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCountryDetection } from '@/hooks/useCountryDetection';

interface RegionalPricing {
  currency: string;
  symbol: string;
  free: string;
  premium: string;
  professional: string;
  region: string;
  country: string;
}

const RegionalPricingDisplay = () => {
  const { t } = useTranslation();
  const { countryData, isLoading, error } = useCountryDetection();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{t('common.detecting')}</span>
      </div>
    );
  }

  if (error || !countryData) {
    return (
      <div className="flex items-center space-x-2 text-sm text-destructive">
        <Globe className="h-4 w-4" />
        <span>{t('common.detectionFailed')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {countryData.countryName}
        </span>
      </div>
      <Badge variant="outline">
        {t('currency.pricesIn', { 
          currency: `${countryData.currency} (${countryData.currencySymbol})` 
        })}
      </Badge>
    </div>
  );
};

export default RegionalPricingDisplay;
