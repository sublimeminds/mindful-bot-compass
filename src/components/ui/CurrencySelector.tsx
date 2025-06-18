
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/hooks/useCurrency';
import { Globe } from 'lucide-react';

const CurrencySelector = () => {
  const { currency, supportedCurrencies, changeCurrency } = useCurrency();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currency.code} onValueChange={changeCurrency}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Currency">
            <span className="flex items-center space-x-1">
              <span>{currency.symbol}</span>
              <span>{currency.code}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedCurrencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <div className="flex items-center space-x-2">
                <span>{curr.symbol}</span>
                <span>{curr.code}</span>
                <span className="text-sm text-muted-foreground">- {curr.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
