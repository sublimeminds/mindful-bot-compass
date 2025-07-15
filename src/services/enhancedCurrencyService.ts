
import { supabase } from '@/integrations/supabase/client';

interface ExchangeRate {
  base_currency: string;
  target_currency: string;
  rate: number;
  last_updated: string;
}

interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  timezone: string;
  region: string;
}

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  region: string;
}

class EnhancedCurrencyService {
  private exchangeRates: Map<string, number> = new Map();
  private lastUpdate: Date = new Date(0);
  private readonly UPDATE_INTERVAL = 1000 * 60 * 60; // 1 hour
  private isLoading: boolean = false;

  // Expanded currency symbols and names with more major currencies
  private readonly currencyInfo = {
    USD: { symbol: '$', name: 'US Dollar', region: 'Americas' },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', region: 'Asia' },
    EUR: { symbol: '€', name: 'Euro', region: 'Europe' },
    GBP: { symbol: '£', name: 'British Pound', region: 'Europe' },
    JPY: { symbol: '¥', name: 'Japanese Yen', region: 'Asia' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', region: 'Americas' },
    AUD: { symbol: 'A$', name: 'Australian Dollar', region: 'Oceania' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc', region: 'Europe' },
    CNY: { symbol: '¥', name: 'Chinese Yuan', region: 'Asia' },
    INR: { symbol: '₹', name: 'Indian Rupee', region: 'Asia' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', region: 'Asia' },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit', region: 'Asia' },
    THB: { symbol: '฿', name: 'Thai Baht', region: 'Asia' },
    KRW: { symbol: '₩', name: 'South Korean Won', region: 'Asia' },
    BRL: { symbol: 'R$', name: 'Brazilian Real', region: 'Americas' },
    MXN: { symbol: '$', name: 'Mexican Peso', region: 'Americas' },
    ZAR: { symbol: 'R', name: 'South African Rand', region: 'Africa' },
    PLN: { symbol: 'zł', name: 'Polish Zloty', region: 'Europe' },
    SEK: { symbol: 'kr', name: 'Swedish Krona', region: 'Europe' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone', region: 'Europe' },
  };

  async updateExchangeRates(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      // TEMPORARILY DISABLED: API calls causing infinite loading
      // Use static fallback rates instead
      console.log('Using static exchange rates to prevent infinite loading');
      
      // Updated fallback rates with current accurate values
      this.exchangeRates.set('USD', 1.0);
      this.exchangeRates.set('IDR', 15680.0);
      this.exchangeRates.set('EUR', 0.92);
      this.exchangeRates.set('GBP', 0.79);
      this.exchangeRates.set('JPY', 149.0);
      this.exchangeRates.set('CAD', 1.36);
      this.exchangeRates.set('AUD', 1.53);
      this.exchangeRates.set('CHF', 0.90);
      this.exchangeRates.set('CNY', 7.25);
      this.exchangeRates.set('INR', 83.0);
      this.exchangeRates.set('SGD', 1.34);
      this.exchangeRates.set('MYR', 4.47);
      this.exchangeRates.set('THB', 35.5);
      this.exchangeRates.set('KRW', 1320.0);
      this.exchangeRates.set('BRL', 5.9);
      this.exchangeRates.set('MXN', 17.2);
      this.exchangeRates.set('ZAR', 18.5);
      this.exchangeRates.set('PLN', 4.1);
      this.exchangeRates.set('SEK', 10.8);
      this.exchangeRates.set('NOK', 10.9);
      
      this.lastUpdate = new Date();
    } catch (error) {
      console.error('Error in currency service:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async ensureExchangeRatesLoaded(): Promise<void> {
    const now = new Date();
    if (now.getTime() - this.lastUpdate.getTime() > this.UPDATE_INTERVAL || this.exchangeRates.size === 0) {
      await this.updateExchangeRates();
    }
  }

  async detectUserLocation(): Promise<LocationData | null> {
    try {
      // TEMPORARILY DISABLED: Location API calls causing infinite loading
      console.log('Using default location to prevent infinite loading');
      return {
        country: 'United States',
        countryCode: 'US',
        currency: 'USD',
        timezone: 'UTC',
        region: 'Americas'
      };
    } catch (error) {
      console.error('Failed to detect location:', error);
      return {
        country: 'United States',
        countryCode: 'US',
        currency: 'USD',
        timezone: 'UTC',
        region: 'Americas'
      };
    }
  }

  private getRegionFromCountry(countryCode: string): string {
    const regionMap: Record<string, string> = {
      'US': 'Americas', 'CA': 'Americas', 'MX': 'Americas', 'BR': 'Americas',
      'GB': 'Europe', 'DE': 'Europe', 'FR': 'Europe', 'ES': 'Europe', 'IT': 'Europe',
      'ID': 'Asia', 'IN': 'Asia', 'CN': 'Asia', 'JP': 'Asia', 'KR': 'Asia',
      'AU': 'Oceania', 'NZ': 'Oceania'
    };
    return regionMap[countryCode] || 'Americas';
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = this.exchangeRates.get(fromCurrency) || 1;
    const toRate = this.exchangeRates.get(toCurrency) || 1;

    // Convert from source currency to USD first, then to target currency
    let usdAmount: number;
    if (fromCurrency === 'USD') {
      usdAmount = amount;
    } else {
      usdAmount = amount / fromRate; // Convert to USD by dividing by the rate
    }

    // Convert from USD to target currency
    if (toCurrency === 'USD') {
      return usdAmount;
    } else {
      return usdAmount * toRate; // Convert from USD by multiplying by the rate
    }
  }

  formatCurrency(amount: number, currencyCode: string, locale?: string): string {
    const info = this.currencyInfo[currencyCode as keyof typeof this.currencyInfo];
    
    try {
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: ['IDR', 'JPY', 'KRW'].includes(currencyCode) ? 0 : 2,
        maximumFractionDigits: ['IDR', 'JPY', 'KRW'].includes(currencyCode) ? 0 : 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting - prevent double currency code display
      const symbol = info?.symbol || '';
      const formattedAmount = ['IDR', 'JPY', 'KRW'].includes(currencyCode)
        ? Math.round(amount).toLocaleString()
        : amount.toFixed(2);
      return `${symbol}${formattedAmount}`;
    }
  }

  async getCurrencyData(currencyCode: string): Promise<CurrencyData> {
    await this.ensureExchangeRatesLoaded();
    
    const info = this.currencyInfo[currencyCode as keyof typeof this.currencyInfo];
    const exchangeRate = this.exchangeRates.get(currencyCode) || 1;

    return {
      code: currencyCode,
      symbol: info?.symbol || currencyCode,
      name: info?.name || currencyCode,
      exchangeRate,
      region: info?.region || 'Americas'
    };
  }

  async getSupportedCurrencies(): Promise<CurrencyData[]> {
    await this.ensureExchangeRatesLoaded();
    
    return Object.entries(this.currencyInfo).map(([code, info]) => ({
      code,
      symbol: info.symbol,
      name: info.name,
      exchangeRate: this.exchangeRates.get(code) || 1,
      region: info.region
    }));
  }

  async getRegionalPricing(basePrice: number, currency: string, region: string): Promise<number> {
    // Apply regional pricing adjustments
    const regionMultipliers = {
      'Asia': 0.7,      // 30% discount for Asian markets
      'Americas': 1.0,   // Standard pricing
      'Europe': 1.1,     // 10% premium for European markets
      'Oceania': 1.05    // 5% premium for Oceania
    };

    const multiplier = regionMultipliers[region as keyof typeof regionMultipliers] || 1.0;
    return basePrice * multiplier;
  }

  async getUserCurrencyPreference(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferred_currency')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.preferred_currency || 'USD';
    } catch (error) {
      return 'USD';
    }
  }

  async saveUserCurrencyPreference(userId: string, currency: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({ preferred_currency: currency })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to save currency preference:', error);
    }
  }
}

export const enhancedCurrencyService = new EnhancedCurrencyService();
