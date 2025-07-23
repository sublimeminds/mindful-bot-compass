
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useRegionalPreferences } from '@/hooks/useRegionalPreferences';
import { useOptimizedCurrency } from '@/hooks/useOptimizedCurrency';

const CompactRegionalSelector = () => {
  const { regionalPreferences, setCountryPreference } = useRegionalPreferences();
  const { currency, changeCurrency, supportedCurrencies } = useOptimizedCurrency();

  const handleCountryChange = (countryCode: string) => {
    setCountryPreference(countryCode);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    changeCurrency(currencyCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-10 hover:bg-therapy-50/80 text-gray-900 transition-all duration-200 ease-out hover:scale-105 transform-gpu group/trigger">
          <Globe className="h-4 w-4 text-therapy-500 group-hover/trigger:text-therapy-600 transition-colors" />
          <span className="font-medium text-sm">
            {regionalPreferences?.countryCode || 'US'} • {currency.code}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-500 group-hover/trigger:text-gray-600 transition-all duration-200 group-hover/trigger:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Region & Currency
        </div>
        <DropdownMenuSeparator />
        
        {/* Countries */}
        <div className="space-y-1">
          <DropdownMenuItem onClick={() => handleCountryChange('US')} className="cursor-pointer">
            🇺🇸 United States
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCountryChange('CA')} className="cursor-pointer">
            🇨🇦 Canada
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCountryChange('GB')} className="cursor-pointer">
            🇬🇧 United Kingdom
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCountryChange('AU')} className="cursor-pointer">
            🇦🇺 Australia
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Currencies */}
        <div className="space-y-1">
          {supportedCurrencies.slice(0, 4).map((curr) => (
            <DropdownMenuItem 
              key={curr.code} 
              onClick={() => handleCurrencyChange(curr.code)}
              className="cursor-pointer"
            >
              {curr.symbol} {curr.code} - {curr.name}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompactRegionalSelector;
