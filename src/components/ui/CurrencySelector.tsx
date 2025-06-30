
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Info } from 'lucide-react';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, className = '' }) => {
  const { currentLanguage } = useEnhancedLanguage();

  const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', symbol: '₣', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  ];

  const currentCurrency = supportedCurrencies.find(c => c.code === value) || supportedCurrencies[0];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4 text-therapy-500" />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-44 border-therapy-200 hover:border-therapy-300 focus:border-therapy-500 focus:ring-therapy-500/20">
            <SelectValue>
              <div className="flex items-center space-x-2">
                <span>{currentCurrency.flag}</span>
                <span className="font-medium">{currentCurrency.code}</span>
                <span className="text-sm text-slate-500">({currentCurrency.symbol})</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            {supportedCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center space-x-2">
                  <span>{currency.flag}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-sm text-slate-500">({currency.symbol})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{currency.name}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {value !== 'USD' && (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-therapy-50/50 p-2 rounded-lg">
          <Info className="h-3 w-3 flex-shrink-0" />
          <span>Prices converted from USD base pricing</span>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
