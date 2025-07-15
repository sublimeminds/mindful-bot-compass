import { useState, useEffect, useCallback, useMemo } from 'react';
import { cacheService } from '@/services/cachingService';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import { useCountryDetection } from '@/hooks/useCountryDetection';

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

// Default fallback currency
const DEFAULT_CURRENCY: CurrencyData = { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1, region: 'Americas' };

export const useOptimizedCurrency = () => {
  const [currency, setCurrency] = useState<CurrencyData>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState<CurrencyData[]>([]);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  
  // Use country detection hook
  const { countryData, countryCode } = useCountryDetection();

  // Load currencies from enhanced service
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currencies = await enhancedCurrencyService.getSupportedCurrencies();
        setSupportedCurrencies(currencies);
      } catch (error) {
        console.warn('Failed to load currencies, using default:', error);
        setSupportedCurrencies([DEFAULT_CURRENCY]);
      }
    };
    loadCurrencies();
  }, []);

  // Memoize currency lookup
  const getCurrencyByCode = useCallback((code: string): CurrencyData => {
    return supportedCurrencies.find(c => c.code === code) || DEFAULT_CURRENCY;
  }, [supportedCurrencies]);

  // Initialize currency with auto-detection
  useEffect(() => {
    if (supportedCurrencies.length === 0) return; // Wait for currencies to load
    
    const initializeCurrency = () => {
      try {
        // Check cache first
        const cachedCurrency = cacheService.get<string>('user-currency');
        const storedCurrency = localStorage.getItem('preferred-currency');
        
        // Auto-detect currency from country if no preference exists
        let preferredCode = cachedCurrency || storedCurrency;
        
        if (!preferredCode && countryData?.currency) {
          preferredCode = countryData.currency;
          console.log(`Auto-detected currency ${preferredCode} for country ${countryData.countryCode}`);
        }
        
        preferredCode = preferredCode || 'USD';
        
        const selectedCurrency = getCurrencyByCode(preferredCode);
        setCurrency(selectedCurrency);
        
        // Cache the selection
        cacheService.set('user-currency', preferredCode, 3600000); // 1 hour cache
      } catch (error) {
        console.warn('Currency initialization failed, using USD:', error);
        setCurrency(DEFAULT_CURRENCY);
      }
    };

    initializeCurrency();
  }, [getCurrencyByCode, supportedCurrencies, countryData]);

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

  // Optimized price formatting with proper decimal handling
  const formatPrice = useCallback((amount: number, fromCurrency: string = 'USD', locale?: string): string => {
    try {
      const convertedAmount = convertPrice(amount, fromCurrency);
      
      // Handle currencies that don't use decimals
      const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'HUF'];
      const useDecimals = !noDecimalCurrencies.includes(currency.code);
      
      const formatter = new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: useDecimals ? 2 : 0,
        maximumFractionDigits: useDecimals ? 2 : 0,
      });
      
      return formatter.format(convertedAmount);
    } catch (error) {
      console.warn('Price formatting failed:', error);
      const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'HUF'];
      const useDecimals = !noDecimalCurrencies.includes(currency.code);
      return `${currency.symbol}${useDecimals ? amount.toFixed(2) : Math.round(amount)}`;
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
      suggested: !!countryData?.currency,
      currency: countryData?.currency,
      country: countryData?.countryName
    })
  }), [currency, supportedCurrencies, userLocation, loading, changeCurrency, convertPrice, formatPrice]);
};