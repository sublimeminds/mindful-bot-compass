
import { useState, useEffect } from 'react';
import { currencyService } from '@/services/currencyService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
}

export const useCurrency = () => {
  const { user } = useSimpleApp();
  const [currency, setCurrency] = useState<CurrencyData>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1
  });
  const [loading, setLoading] = useState(true);
  const [supportedCurrencies, setSupportedCurrencies] = useState<CurrencyData[]>([]);

  useEffect(() => {
    initializeCurrency();
    loadSupportedCurrencies();
  }, [user]);

  const initializeCurrency = async () => {
    try {
      setLoading(true);
      
      // For now, just use detected currency since we don't have preferred_currency in profiles yet
      const detectedCurrency = await currencyService.detectUserCurrency();
      setCurrency(detectedCurrency);
    } catch (error) {
      console.error('Error initializing currency:', error);
      // Keep default USD
    } finally {
      setLoading(false);
    }
  };

  const loadSupportedCurrencies = async () => {
    try {
      const currencies = await currencyService.getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    } catch (error) {
      console.error('Error loading supported currencies:', error);
    }
  };

  const changeCurrency = async (currencyCode: string) => {
    try {
      const newCurrency = await currencyService.getCurrencyData(currencyCode);
      setCurrency(newCurrency);

      // TODO: Save to user profile when preferred_currency column is added
      // if (user) {
      //   await supabase
      //     .from('profiles')
      //     .update({ preferred_currency: currencyCode })
      //     .eq('id', user.id);
      // }
    } catch (error) {
      console.error('Error changing currency:', error);
    }
  };

  const convertPrice = (amount: number, fromCurrency: string = 'USD') => {
    return currencyService.convertAmount(amount, fromCurrency, currency.code);
  };

  const formatPrice = (amount: number, fromCurrency: string = 'USD') => {
    const convertedAmount = convertPrice(amount, fromCurrency);
    return currencyService.formatCurrency(convertedAmount, currency.code);
  };

  return {
    currency,
    supportedCurrencies,
    loading,
    changeCurrency,
    convertPrice,
    formatPrice
  };
};
