import React, { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  region: string;
  exchangeRate: number;
}

interface CurrencySelectorProps {
  currencies: CurrencyData[];
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  autoDetectedCurrency?: string;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  autoDetectedCurrency,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find(c => c.code === selectedCurrency);
  const groupedCurrencies = currencies.reduce((acc, currency) => {
    if (!acc[currency.region]) {
      acc[currency.region] = [];
    }
    acc[currency.region].push(currency);
    return acc;
  }, {} as Record<string, CurrencyData[]>);

  const regionOrder = ['Americas', 'Europe', 'Asia', 'Oceania', 'Africa'];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 h-10 px-4 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-therapy-300 transition-all ${className}`}
        >
          <Globe className="h-4 w-4 text-therapy-600" />
          <span className="font-medium text-slate-700">
            {currentCurrency?.symbol} {currentCurrency?.code}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 max-h-80 overflow-y-auto bg-white/95 backdrop-blur-sm border-slate-200"
      >
        <div className="p-2">
          <div className="text-xs font-medium text-slate-500 mb-2 px-2">
            Select Currency
          </div>
          
          {autoDetectedCurrency && autoDetectedCurrency !== selectedCurrency && (
            <div className="mb-2 p-2 bg-therapy-50 rounded-md border border-therapy-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-therapy-600">
                  Auto-detected: {autoDetectedCurrency}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-therapy-600 hover:bg-therapy-100"
                  onClick={() => onCurrencyChange(autoDetectedCurrency)}
                >
                  Use
                </Button>
              </div>
            </div>
          )}

          {regionOrder.map(region => {
            const regionCurrencies = groupedCurrencies[region];
            if (!regionCurrencies) return null;

            return (
              <div key={region} className="mb-3">
                <div className="text-xs font-medium text-slate-500 mb-1 px-2">
                  {region}
                </div>
                {regionCurrencies.map(currency => (
                  <DropdownMenuItem
                    key={currency.code}
                    className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-therapy-50"
                    onClick={() => {
                      onCurrencyChange(currency.code);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-700 w-8">
                        {currency.symbol}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {currency.code}
                        </div>
                        <div className="text-xs text-slate-500">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                    {currency.code === selectedCurrency && (
                      <Check className="h-4 w-4 text-therapy-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;