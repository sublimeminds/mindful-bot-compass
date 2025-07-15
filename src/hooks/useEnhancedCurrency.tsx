
import { useState, useEffect } from 'react';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

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

export const useEnhancedCurrency = () => {
  // Safe hook initialization with error boundary
  const [hookError, setHookError] = useState<Error | null>(null);
  
  let user: any = null;
  try {
    const simpleApp = useSimpleApp();
    user = simpleApp?.user || null;
  } catch (error) {
    console.warn('useSimpleApp failed in useEnhancedCurrency:', error);
  }

  const [currency, setCurrency] = useState<CurrencyData>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1,
    region: 'Americas'
  });
  const [loading, setLoading] = useState(true);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState<CurrencyData[]>([]);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    // CIRCUIT BREAKER: Only initialize if not already loading
    let mounted = true;
    
    if (loading && mounted) {
      const initializeWithTimeout = async () => {
        try {
          await Promise.race([
            initializeCurrency(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Currency init timeout')), 5000))
          ]);
          if (mounted) {
            loadSupportedCurrencies();
          }
        } catch (error) {
          console.warn('Currency initialization failed, using defaults:', error);
          if (mounted) {
            setLoading(false);
          }
        }
      };
      
      initializeWithTimeout();
    }
    
    return () => {
      mounted = false;
    };
  }, []);

  const detectUserLocation = async () => {
    // DISABLED: Location detection causing infinite loading
    console.log('Location detection disabled to prevent infinite loading');
    setUserLocation({
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      timezone: 'UTC',
      region: 'Americas'
    });
  };

  const initializeCurrency = async () => {
    try {
      setLoading(true);
      
      // SIMPLIFIED: Use static rates to prevent infinite loading
      await enhancedCurrencyService.ensureExchangeRatesLoaded();
      
      let selectedCurrency;
      
      // Check localStorage first for both auth and non-auth users
      const localCurrency = localStorage.getItem('preferred-currency');
      if (localCurrency) {
        selectedCurrency = await enhancedCurrencyService.getCurrencyData(localCurrency);
      } else {
        // Default to USD to prevent API calls
        selectedCurrency = await enhancedCurrencyService.getCurrencyData('USD');
      }
      
      setCurrency(selectedCurrency);
    } catch (error) {
      console.error('Error initializing currency:', error);
      // Keep default USD
    } finally {
      setLoading(false);
    }
  };

  const loadSupportedCurrencies = async () => {
    try {
      const currencies = await enhancedCurrencyService.getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    } catch (error) {
      console.error('Error loading supported currencies:', error);
    }
  };

  const changeCurrency = async (currencyCode: string) => {
    try {
      setIsLoadingRates(true);
      await enhancedCurrencyService.ensureExchangeRatesLoaded();
      const newCurrency = await enhancedCurrencyService.getCurrencyData(currencyCode);
      setCurrency(newCurrency);

      // Save preference if user is logged in
      if (user) {
        await enhancedCurrencyService.saveUserCurrencyPreference(user.id, currencyCode);
      } else {
        // Save to localStorage for non-authenticated users
        localStorage.setItem('preferred-currency', currencyCode);
      }
    } catch (error) {
      console.error('Error changing currency:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const convertPrice = (amount: number, fromCurrency: string = 'USD') => {
    return enhancedCurrencyService.convertAmount(amount, fromCurrency, currency.code);
  };

  const formatPrice = (amount: number, fromCurrency: string = 'USD', locale?: string) => {
    if (loading || isLoadingRates) {
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
    
    const convertedAmount = convertPrice(amount, fromCurrency);
    return enhancedCurrencyService.formatCurrency(convertedAmount, currency.code, locale);
  };

  const getRegionalPrice = async (basePrice: number, region?: string) => {
    const targetRegion = region || userLocation?.region || currency.region;
    return enhancedCurrencyService.getRegionalPricing(basePrice, currency.code, targetRegion);
  };

  const suggestCurrencyFromLocation = () => {
    if (userLocation && userLocation.currency !== currency.code) {
      return {
        suggested: true,
        currency: userLocation.currency,
        country: userLocation.country
      };
    }
    return { suggested: false };
  };

  return {
    currency,
    selectedCurrency: currency.code,
    setSelectedCurrency: changeCurrency,
    supportedCurrencies,
    userLocation,
    loading,
    loadingCurrencies: loading,
    isLoadingRates,
    changeCurrency,
    convertPrice,
    formatPrice,
    getRegionalPrice,
    suggestCurrencyFromLocation
  };
};
