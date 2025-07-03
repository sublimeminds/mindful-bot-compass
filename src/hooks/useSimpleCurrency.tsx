import { useState, useEffect } from 'react';
import { simpleCurrencyService } from '@/services/simpleCurrencyService';
import { useAuth } from '@/hooks/useAuth';

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  region: string;
}

interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  timezone: string;
  region: string;
}

// Simple currency hook without complex async operations
export const useSimpleCurrency = () => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState<CurrencyData>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1,
    region: 'Americas'
  });
  const [loading, setLoading] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState<CurrencyData[]>([]);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    initializeCurrency();
    loadSupportedCurrencies();
  }, [user]);

  const initializeCurrency = async () => {
    try {
      setLoading(true);
      
      // Get saved preference from localStorage (no DB calls)
      const localCurrency = localStorage.getItem('preferred-currency') || 'USD';
      const selectedCurrency = await simpleCurrencyService.getCurrencyData(localCurrency);
      setCurrency(selectedCurrency);
      
      // Set default location
      setUserLocation({
        country: 'United States',
        countryCode: 'US',
        currency: 'USD',
        timezone: 'UTC',
        region: 'Americas'
      });
    } catch (error) {
      console.error('Error initializing currency:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSupportedCurrencies = async () => {
    try {
      const currencies = await simpleCurrencyService.getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    } catch (error) {
      console.error('Error loading supported currencies:', error);
    }
  };

  const changeCurrency = async (currencyCode: string) => {
    try {
      setIsLoadingRates(true);
      const newCurrency = await simpleCurrencyService.getCurrencyData(currencyCode);
      setCurrency(newCurrency);
      
      // Save to localStorage only
      localStorage.setItem('preferred-currency', currencyCode);
    } catch (error) {
      console.error('Error changing currency:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const convertPrice = (amount: number, fromCurrency: string = 'USD') => {
    return simpleCurrencyService.convertAmount(amount, fromCurrency, currency.code);
  };

  const formatPrice = (amount: number, fromCurrency: string = 'USD', locale?: string) => {
    try {
      if (loading || isLoadingRates) {
        return `${currency.symbol}${amount.toFixed(2)}`;
      }
      
      const convertedAmount = convertPrice(amount, fromCurrency);
      return simpleCurrencyService.formatCurrency(convertedAmount, currency.code, locale);
    } catch (error) {
      return `$${amount.toFixed(2)}`;
    }
  };

  const getRegionalPrice = async (basePrice: number, region?: string) => {
    const targetRegion = region || userLocation?.region || currency.region;
    return simpleCurrencyService.getRegionalPricing(basePrice, currency.code, targetRegion);
  };

  const suggestCurrencyFromLocation = () => {
    return { suggested: false }; // Simplified - no suggestions
  };

  return {
    currency,
    selectedCurrency: currency.code,
    setSelectedCurrency: changeCurrency,
    supportedCurrencies,
    userLocation,
    loading,
    isLoadingRates,
    changeCurrency,
    convertPrice,
    formatPrice,
    getRegionalPrice,
    suggestCurrencyFromLocation
  };
};

// Export both names for compatibility
export const useEnhancedCurrency = useSimpleCurrency;