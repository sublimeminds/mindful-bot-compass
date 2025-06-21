
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, MapPin, Info } from 'lucide-react';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

const EnhancedCurrencySelector = () => {
  const { t } = useTranslation();
  const {
    currency,
    supportedCurrencies,
    userLocation,
    loading,
    changeCurrency,
    suggestCurrencyFromLocation
  } = useEnhancedCurrency();

  const suggestion = suggestCurrencyFromLocation();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <div className="w-20 h-8 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <Select value={currency.code} onValueChange={changeCurrency}>
          <SelectTrigger className="w-36">
            <SelectValue>
              <div className="flex items-center space-x-2">
                <span>{currency.symbol}</span>
                <span>{currency.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50 max-h-64 overflow-y-auto">
            {supportedCurrencies.map((curr) => (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{curr.symbol}</span>
                    <span className="font-medium">{curr.code}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    {curr.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Detection Info */}
      {userLocation && (
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>
            {t('currency.detected', { 
              currency: userLocation.currency, 
              country: userLocation.country 
            })}
          </span>
        </div>
      )}

      {/* Currency Suggestion */}
      {suggestion.suggested && (
        <Alert className="p-2">
          <Info className="h-3 w-3" />
          <AlertDescription className="text-xs">
            {t('currency.suggestion', { 
              currency: suggestion.currency, 
              country: suggestion.country 
            })}
            <button
              onClick={() => changeCurrency(suggestion.currency)}
              className="ml-2 text-primary hover:underline font-medium"
            >
              {t('currency.change')}
            </button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedCurrencySelector;
