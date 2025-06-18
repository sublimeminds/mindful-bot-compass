import { useState, useEffect } from 'react';
import { currencyService } from '@/services/currencyService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
}

export const useCurrency = () => {
  const { user } = useAuth();
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
      
      // Try to get user's preferred currency from profile
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferred_currency')
          .eq('id', user.id)
          .single();
        
        if (profile?.preferred_currency) {
          const currencyData = await currencyService.getCurrencyData(profile.preferred_currency);
          setCurrency(currencyData);
          return;
        }
      }

      // Fall back to detected currency
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

      // Save to user profile if authenticated
      if (user) {
        await supabase
          .from('profiles')
          .update({ preferred_currency: currencyCode })
          .eq('id', user.id);
      }
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
