
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

const CurrencySelector = ({ value, onChange, className }: CurrencySelectorProps) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        await enhancedCurrencyService.ensureExchangeRatesLoaded();
        const supportedCurrencies = await enhancedCurrencyService.getSupportedCurrencies();
        setCurrencies(supportedCurrencies.map(curr => ({
          code: curr.code,
          name: curr.name,
          symbol: curr.symbol,
          region: curr.region
        })));
      } catch (error) {
        console.error('Failed to load currencies:', error);
        // Enhanced fallback currencies with all major currencies
        setCurrencies([
          { code: 'USD', name: 'US Dollar', symbol: '$', region: 'Americas' },
          { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', region: 'Asia' },
          { code: 'EUR', name: 'Euro', symbol: '€', region: 'Europe' },
          { code: 'GBP', name: 'British Pound', symbol: '£', region: 'Europe' },
          { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Asia' },
          { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'Americas' },
          { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Oceania' },
          { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Europe' },
          { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'Asia' },
          { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'Asia' },
          { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'Asia' },
          { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', region: 'Asia' },
          { code: 'THB', name: 'Thai Baht', symbol: '฿', region: 'Asia' },
          { code: 'KRW', name: 'South Korean Won', symbol: '₩', region: 'Asia' },
          { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', region: 'Americas' },
          { code: 'MXN', name: 'Mexican Peso', symbol: '$', region: 'Americas' },
          { code: 'ZAR', name: 'South African Rand', symbol: 'R', region: 'Africa' },
          { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', region: 'Europe' },
          { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', region: 'Europe' },
          { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', region: 'Europe' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 h-10 rounded-md ${className}`} />
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select currency">
          {currencies.find(c => c.code === value)?.symbol} {value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">{currency.symbol}</span>
              <span>{currency.code}</span>
              <span className="text-gray-500">- {currency.name}</span>
              <span className="text-xs text-gray-400">({currency.region})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
