
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
  const { user } = useSimpleApp();
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
    initializeCurrency();
    loadSupportedCurrencies();
    detectUserLocation();
    
    // Update exchange rates every hour
    const interval = setInterval(() => {
      enhancedCurrencyService.updateExchangeRates();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const detectUserLocation = async () => {
    try {
      const location = await enhancedCurrencyService.detectUserLocation();
      setUserLocation(location);
      
      // If user doesn't have a saved preference, suggest based on location
      if (!user && location) {
        const locationCurrency = await enhancedCurrencyService.getCurrencyData(location.currency);
        setCurrency(locationCurrency);
      }
    } catch (error) {
      console.error('Error detecting user location:', error);
    }
  };

  const initializeCurrency = async () => {
    try {
      setLoading(true);
      
      // Ensure exchange rates are loaded first
      await enhancedCurrencyService.ensureExchangeRatesLoaded();
      
      let selectedCurrency;
      
      if (user) {
        // Get user's saved preference
        const savedCurrency = await enhancedCurrencyService.getUserCurrencyPreference(user.id);
        selectedCurrency = await enhancedCurrencyService.getCurrencyData(savedCurrency);
      } else {
        // Check localStorage for non-authenticated users
        const localCurrency = localStorage.getItem('preferred-currency');
        if (localCurrency) {
          selectedCurrency = await enhancedCurrencyService.getCurrencyData(localCurrency);
        } else {
          // Try to detect from location
          const location = await enhancedCurrencyService.detectUserLocation();
          const currencyCode = location?.currency || 'USD';
          selectedCurrency = await enhancedCurrencyService.getCurrencyData(currencyCode);
        }
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
    isLoadingRates,
    changeCurrency,
    convertPrice,
    formatPrice,
    getRegionalPrice,
    suggestCurrencyFromLocation
  };
};
