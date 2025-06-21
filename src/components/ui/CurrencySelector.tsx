
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const supportedCurrencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
];

const CurrencySelector = () => {
  const [currentCurrency, setCurrentCurrency] = React.useState<Currency>(supportedCurrencies[0]);

  const changeCurrency = (currencyCode: string) => {
    const currency = supportedCurrencies.find(c => c.code === currencyCode);
    if (currency) {
      setCurrentCurrency(currency);
      // Store in localStorage for persistence
      localStorage.setItem('preferred-currency', currencyCode);
    }
  };

  React.useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency) {
      const currency = supportedCurrencies.find(c => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <DollarSign className="h-4 w-4 text-muted-foreground" />
      <Select value={currentCurrency.code} onValueChange={changeCurrency}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentCurrency.symbol}</span>
              <span>{currentCurrency.code}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50">
          {supportedCurrencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center space-x-2">
                <span>{currency.symbol}</span>
                <span>{currency.code}</span>
                <span className="text-sm text-muted-foreground">({currency.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
