import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { cn } from '@/lib/utils';

interface EnhancedRegionalDisplayProps {
  showPricing?: boolean;
  showTimezone?: boolean;
  showLanguage?: boolean;
  className?: string;
  compact?: boolean;
}

const EnhancedRegionalDisplay = ({ 
  showPricing = true, 
  showTimezone = false, 
  showLanguage = false,
  className,
  compact = false
}: EnhancedRegionalDisplayProps) => {
  const { t } = useTranslation();
  const { 
    countryData, 
    isLoading, 
    error,
    confidence,
    detectionMethod 
  } = useCountryDetection();

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{t('common.detecting')}</span>
      </div>
    );
  }

  if (error || !countryData) {
    return (
      <div className={cn("flex items-center space-x-2 text-sm text-destructive", className)}>
        <Globe className="h-4 w-4" />
        <span>{t('common.detectionFailed')}</span>
      </div>
    );
  }

  const confidenceColor = confidence > 0.8 ? 'text-success' : 
                         confidence > 0.5 ? 'text-warning' : 'text-muted-foreground';

  if (compact) {
    return (
      <div className={cn("flex items-center space-x-2 text-sm", className)}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{countryData.countryName}</span>
        {showPricing && (
          <Badge variant="outline" className="text-xs">
            {countryData.currencySymbol} {countryData.currency}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Country Information */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">{countryData.countryName}</div>
            <div className="text-sm text-muted-foreground">
              {countryData.region}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs", confidenceColor)}
          >
            {Math.round(confidence * 100)}% {t('common.confidence')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {t(`detectionMethod.${detectionMethod}`)}
          </Badge>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        {showPricing && (
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              {t('currency.pricesIn', { 
                currency: `${countryData.currency} (${countryData.currencySymbol})` 
              })}
            </span>
          </div>
        )}

        {showTimezone && (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{countryData.timezone}</span>
          </div>
        )}

        {showLanguage && (
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>{t(`language.${countryData.language}`)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRegionalDisplay;