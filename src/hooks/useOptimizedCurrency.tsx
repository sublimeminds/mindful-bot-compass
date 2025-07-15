import { useState, useEffect, useCallback, useMemo } from 'react';
import { cacheService } from '@/services/cachingService';

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

// Static currency data to prevent API calls during initialization
const DEFAULT_CURRENCIES: CurrencyData[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1, region: 'Americas' },
  { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.85, region: 'Europe' },
  { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.75, region: 'Europe' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 110, region: 'Asia' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 1.25, region: 'Americas' },
];

export const useOptimizedCurrency = () => {
  const [currency, setCurrency] = useState<CurrencyData>(DEFAULT_CURRENCIES[0]);
  const [loading, setLoading] = useState(false);
  const [supportedCurrencies] = useState<CurrencyData[]>(DEFAULT_CURRENCIES);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  // Memoize currency lookup
  const getCurrencyByCode = useCallback((code: string): CurrencyData => {
    return supportedCurrencies.find(c => c.code === code) || DEFAULT_CURRENCIES[0];
  }, [supportedCurrencies]);

  // Initialize currency from cache or localStorage
  useEffect(() => {
    const initializeCurrency = () => {
      try {
        // Check cache first
        const cachedCurrency = cacheService.get<string>('user-currency');
        const preferredCode = cachedCurrency || localStorage.getItem('preferred-currency') || 'USD';
        
        const selectedCurrency = getCurrencyByCode(preferredCode);
        setCurrency(selectedCurrency);
        
        // Cache the selection
        cacheService.set('user-currency', preferredCode, 3600000); // 1 hour cache
      } catch (error) {
        console.warn('Currency initialization failed, using USD:', error);
        setCurrency(DEFAULT_CURRENCIES[0]);
      }
    };

    initializeCurrency();
  }, [getCurrencyByCode]);

  // Optimized currency change with caching
  const changeCurrency = useCallback(async (currencyCode: string) => {
    try {
      setLoading(true);
      
      const newCurrency = getCurrencyByCode(currencyCode);
      setCurrency(newCurrency);

      // Save preference
      localStorage.setItem('preferred-currency', currencyCode);
      cacheService.set('user-currency', currencyCode, 3600000); // 1 hour cache
      
    } catch (error) {
      console.error('Error changing currency:', error);
    } finally {
      setLoading(false);
    }
  }, [getCurrencyByCode]);

  // Optimized price conversion with caching
  const convertPrice = useCallback((amount: number, fromCurrency: string = 'USD'): number => {
    try {
      const cacheKey = `convert-${amount}-${fromCurrency}-${currency.code}`;
      const cached = cacheService.get<number>(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const fromRate = getCurrencyByCode(fromCurrency).exchangeRate;
      const toRate = currency.exchangeRate;
      const converted = (amount / fromRate) * toRate;
      
      // Cache conversion for 30 minutes
      cacheService.set(cacheKey, converted, 1800000);
      return converted;
    } catch (error) {
      console.warn('Currency conversion failed:', error);
      return amount;
    }
  }, [currency, getCurrencyByCode]);

  // Optimized price formatting
  const formatPrice = useCallback((amount: number, fromCurrency: string = 'USD', locale?: string): string => {
    try {
      const convertedAmount = convertPrice(amount, fromCurrency);
      
      const formatter = new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatter.format(convertedAmount);
    } catch (error) {
      console.warn('Price formatting failed:', error);
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  }, [currency, convertPrice]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    currency,
    selectedCurrency: currency.code,
    supportedCurrencies,
    userLocation,
    loading,
    loadingCurrencies: false,
    isLoadingRates: loading,
    changeCurrency,
    setSelectedCurrency: changeCurrency,
    convertPrice,
    formatPrice,
    getRegionalPrice: async (basePrice: number) => basePrice, // Simplified
    suggestCurrencyFromLocation: () => ({ 
      suggested: false, 
      currency: undefined as string | undefined,
      country: undefined as string | undefined
    })
  }), [currency, supportedCurrencies, userLocation, loading, changeCurrency, convertPrice, formatPrice]);
};