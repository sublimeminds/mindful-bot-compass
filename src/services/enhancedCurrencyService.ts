
import { supabase } from '@/integrations/supabase/client';

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  region: string;
}

interface ExchangeRateResponse {
  success: boolean;
  rates: Record<string, number>;
  base: string;
  date: string;
}

interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  timezone: string;
  region: string;
}

class EnhancedCurrencyService {
  private supportedCurrencies: CurrencyData[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1, region: 'Americas' },
    { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.85, region: 'Europe' },
    { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.73, region: 'Europe' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 1.25, region: 'Americas' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', exchangeRate: 1.35, region: 'Oceania' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 110, region: 'Asia' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', exchangeRate: 7.20, region: 'Asia' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 83, region: 'Asia' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', exchangeRate: 1300, region: 'Asia' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso', exchangeRate: 18.50, region: 'Americas' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', exchangeRate: 5.20, region: 'Americas' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', exchangeRate: 0.88, region: 'Europe' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', exchangeRate: 10.50, region: 'Europe' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', exchangeRate: 10.80, region: 'Europe' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone', exchangeRate: 6.35, region: 'Europe' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', exchangeRate: 4.20, region: 'Europe' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', exchangeRate: 1.35, region: 'Asia' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', exchangeRate: 7.80, region: 'Asia' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', exchangeRate: 1.50, region: 'Oceania' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', exchangeRate: 18.70, region: 'Africa' },
  ];

  private currencyByCountry: Record<string, string> = {
    'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'AU': 'AUD', 'NZ': 'NZD',
    'JP': 'JPY', 'CN': 'CNY', 'IN': 'INR', 'KR': 'KRW', 'MX': 'MXN',
    'BR': 'BRL', 'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
    'PL': 'PLN', 'SG': 'SGD', 'HK': 'HKD', 'ZA': 'ZAR',
    'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
    'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR', 'IE': 'EUR', 'FI': 'EUR',
    'GR': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SK': 'EUR',
    'SI': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR'
  };

  async detectUserLocation(): Promise<LocationData | null> {
    try {
      // Try multiple IP geolocation services for reliability
      const services = [
        'https://ipapi.co/json/',
        'https://api.ipgeolocation.io/ipgeo?apiKey=free'
      ];

      for (const service of services) {
        try {
          const response = await fetch(service);
          if (response.ok) {
            const data = await response.json();
            
            if (service.includes('ipapi.co')) {
              return {
                country: data.country_name || 'Unknown',
                countryCode: data.country_code || 'US',
                currency: data.currency || 'USD',
                timezone: data.timezone || 'UTC',
                region: data.continent_code || 'Unknown'
              };
            } else if (service.includes('ipgeolocation.io')) {
              return {
                country: data.country_name || 'Unknown',
                countryCode: data.country_code2 || 'US',
                currency: data.currency?.code || 'USD',
                timezone: data.time_zone?.name || 'UTC',
                region: data.continent_name || 'Unknown'
              };
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${service}:`, error);
          continue;
        }
      }

      // Fallback to browser detection
      return this.detectFromBrowser();
    } catch (error) {
      console.error('Error detecting user location:', error);
      return this.detectFromBrowser();
    }
  }

  private detectFromBrowser(): LocationData {
    const locale = navigator.language || 'en-US';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const region = locale.split('-')[1] || 'US';
    
    return {
      country: this.getCountryName(region),
      countryCode: region,
      currency: this.currencyByCountry[region] || 'USD',
      timezone,
      region: this.getRegionFromCountry(region)
    };
  }

  private getCountryName(code: string): string {
    const countries: Record<string, string> = {
      'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom',
      'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
      'CN': 'China', 'IN': 'India', 'BR': 'Brazil', 'MX': 'Mexico'
    };
    return countries[code] || 'Unknown';
  }

  private getRegionFromCountry(code: string): string {
    const regions: Record<string, string> = {
      'US': 'Americas', 'CA': 'Americas', 'MX': 'Americas', 'BR': 'Americas',
      'GB': 'Europe', 'DE': 'Europe', 'FR': 'Europe', 'IT': 'Europe',
      'JP': 'Asia', 'CN': 'Asia', 'IN': 'Asia', 'KR': 'Asia',
      'AU': 'Oceania', 'NZ': 'Oceania'
    };
    return regions[code] || 'Unknown';
  }

  async updateExchangeRates(): Promise<void> {
    try {
      // Using a free exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data: ExchangeRateResponse = await response.json();
      
      // Update rates in database
      for (const [currency, rate] of Object.entries(data.rates)) {
        if (this.supportedCurrencies.some(c => c.code === currency)) {
          await supabase
            .from('exchange_rates')
            .upsert({
              base_currency: 'USD',
              target_currency: currency,
              rate: rate,
              last_updated: new Date().toISOString(),
              provider: 'exchangerate-api'
            });
        }
      }

      // Update local cache
      this.supportedCurrencies = this.supportedCurrencies.map(currency => ({
        ...currency,
        exchangeRate: data.rates[currency.code] || currency.exchangeRate
      }));

      console.log('Exchange rates updated successfully');
    } catch (error) {
      console.error('Error updating exchange rates:', error);
    }
  }

  async getCurrencyData(code: string): Promise<CurrencyData> {
    // First try to get from database
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('rate')
        .eq('base_currency', 'USD')
        .eq('target_currency', code)
        .single();

      if (!error && data) {
        const currency = this.supportedCurrencies.find(c => c.code === code);
        if (currency) {
          return { ...currency, exchangeRate: data.rate };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch from database, using cached rate');
    }

    // Fallback to cached data
    const currency = this.supportedCurrencies.find(c => c.code === code);
    if (!currency) {
      throw new Error(`Currency ${code} not supported`);
    }
    return currency;
  }

  async getSupportedCurrencies(): Promise<CurrencyData[]> {
    return [...this.supportedCurrencies];
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = this.supportedCurrencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = this.supportedCurrencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }

  formatCurrency(amount: number, currencyCode: string, locale?: string): string {
    try {
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
        maximumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      const currency = this.supportedCurrencies.find(c => c.code === currencyCode);
      const symbol = currency?.symbol || currencyCode;
      return `${symbol}${amount.toFixed(2)}`;
    }
  }

  async getRegionalPricing(basePrice: number, currency: string, region: string): Promise<number> {
    // Apply regional pricing adjustments
    const regionalMultipliers: Record<string, number> = {
      'Americas': 1.0,
      'Europe': 1.1,
      'Asia': 0.8,
      'Oceania': 1.2,
      'Africa': 0.6
    };

    const multiplier = regionalMultipliers[region] || 1.0;
    const adjustedPrice = basePrice * multiplier;
    
    return this.convertAmount(adjustedPrice, 'USD', currency);
  }

  async saveUserCurrencyPreference(userId: string, currency: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({ preferred_currency: currency })
        .eq('id', userId);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  }

  async getUserCurrencyPreference(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferred_currency')
        .eq('id', userId)
        .single();

      if (!error && data?.preferred_currency) {
        return data.preferred_currency;
      }
    } catch (error) {
      console.warn('Could not fetch user currency preference');
    }

    return 'USD';
  }
}

export const enhancedCurrencyService = new EnhancedCurrencyService();
