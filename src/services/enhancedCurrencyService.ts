
import { supabase } from '@/integrations/supabase/client';
import { countryDetectionService } from './countryDetectionService';
import type { CountryDetectionData } from '@/types/countryDetection';

interface ExchangeRate {
  base_currency: string;
  target_currency: string;
  rate: number;
  last_updated: string;
}

// Legacy interface for backward compatibility
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

  // Comprehensive major world currencies
  private readonly currencyInfo = {
    // Americas
    USD: { symbol: '$', name: 'US Dollar', region: 'Americas' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', region: 'Americas' },
    BRL: { symbol: 'R$', name: 'Brazilian Real', region: 'Americas' },
    MXN: { symbol: '$', name: 'Mexican Peso', region: 'Americas' },
    ARS: { symbol: '$', name: 'Argentine Peso', region: 'Americas' },
    CLP: { symbol: '$', name: 'Chilean Peso', region: 'Americas' },
    COP: { symbol: '$', name: 'Colombian Peso', region: 'Americas' },
    PEN: { symbol: 'S/', name: 'Peruvian Sol', region: 'Americas' },
    
    // Europe
    EUR: { symbol: '€', name: 'Euro', region: 'Europe' },
    GBP: { symbol: '£', name: 'British Pound', region: 'Europe' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc', region: 'Europe' },
    PLN: { symbol: 'zł', name: 'Polish Zloty', region: 'Europe' },
    SEK: { symbol: 'kr', name: 'Swedish Krona', region: 'Europe' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone', region: 'Europe' },
    DKK: { symbol: 'kr', name: 'Danish Krone', region: 'Europe' },
    CZK: { symbol: 'Kč', name: 'Czech Koruna', region: 'Europe' },
    HUF: { symbol: 'Ft', name: 'Hungarian Forint', region: 'Europe' },
    RUB: { symbol: '₽', name: 'Russian Ruble', region: 'Europe' },
    TRY: { symbol: '₺', name: 'Turkish Lira', region: 'Europe' },
    
    // Asia
    JPY: { symbol: '¥', name: 'Japanese Yen', region: 'Asia' },
    CNY: { symbol: '¥', name: 'Chinese Yuan', region: 'Asia' },
    INR: { symbol: '₹', name: 'Indian Rupee', region: 'Asia' },
    KRW: { symbol: '₩', name: 'South Korean Won', region: 'Asia' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', region: 'Asia' },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', region: 'Asia' },
    TWD: { symbol: 'NT$', name: 'Taiwan Dollar', region: 'Asia' },
    THB: { symbol: '฿', name: 'Thai Baht', region: 'Asia' },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit', region: 'Asia' },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', region: 'Asia' },
    PHP: { symbol: '₱', name: 'Philippine Peso', region: 'Asia' },
    VND: { symbol: '₫', name: 'Vietnamese Dong', region: 'Asia' },
    
    // Middle East
    AED: { symbol: 'د.إ', name: 'UAE Dirham', region: 'Middle East' },
    SAR: { symbol: '﷼', name: 'Saudi Riyal', region: 'Middle East' },
    ILS: { symbol: '₪', name: 'Israeli Shekel', region: 'Middle East' },
    
    // Africa
    ZAR: { symbol: 'R', name: 'South African Rand', region: 'Africa' },
    EGP: { symbol: '£', name: 'Egyptian Pound', region: 'Africa' },
    
    // Oceania
    AUD: { symbol: 'A$', name: 'Australian Dollar', region: 'Oceania' },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', region: 'Oceania' },
  };

  async updateExchangeRates(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      // TEMPORARILY DISABLED: API calls causing infinite loading
      // Use static fallback rates instead
      console.log('Using static exchange rates to prevent infinite loading');
      
      // Updated fallback rates with current accurate values (all vs USD)
      // Americas
      this.exchangeRates.set('USD', 1.0);
      this.exchangeRates.set('CAD', 1.36);
      this.exchangeRates.set('BRL', 5.9);
      this.exchangeRates.set('MXN', 17.2);
      this.exchangeRates.set('ARS', 365.0);
      this.exchangeRates.set('CLP', 950.0);
      this.exchangeRates.set('COP', 3950.0);
      this.exchangeRates.set('PEN', 3.7);
      
      // Europe
      this.exchangeRates.set('EUR', 0.92);
      this.exchangeRates.set('GBP', 0.79);
      this.exchangeRates.set('CHF', 0.90);
      this.exchangeRates.set('PLN', 4.1);
      this.exchangeRates.set('SEK', 10.8);
      this.exchangeRates.set('NOK', 10.9);
      this.exchangeRates.set('DKK', 6.9);
      this.exchangeRates.set('CZK', 23.5);
      this.exchangeRates.set('HUF', 365.0);
      this.exchangeRates.set('RUB', 75.0);
      this.exchangeRates.set('TRY', 29.0);
      
      // Asia
      this.exchangeRates.set('JPY', 149.0);
      this.exchangeRates.set('CNY', 7.25);
      this.exchangeRates.set('INR', 83.0);
      this.exchangeRates.set('KRW', 1320.0);
      this.exchangeRates.set('SGD', 1.34);
      this.exchangeRates.set('HKD', 7.8);
      this.exchangeRates.set('TWD', 31.5);
      this.exchangeRates.set('THB', 35.5);
      this.exchangeRates.set('MYR', 4.47);
      this.exchangeRates.set('IDR', 15680.0);
      this.exchangeRates.set('PHP', 56.0);
      this.exchangeRates.set('VND', 24500.0);
      
      // Middle East
      this.exchangeRates.set('AED', 3.67);
      this.exchangeRates.set('SAR', 3.75);
      this.exchangeRates.set('ILS', 3.7);
      
      // Africa
      this.exchangeRates.set('ZAR', 18.5);
      this.exchangeRates.set('EGP', 31.0);
      
      // Oceania
      this.exchangeRates.set('AUD', 1.53);
      this.exchangeRates.set('NZD', 1.65);
      
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
      const countryData = await countryDetectionService.detectCountry();
      return {
        country: countryData.countryName,
        countryCode: countryData.countryCode,
        currency: countryData.currency,
        timezone: countryData.timezone,
        region: countryData.region
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

  async detectUserLocationEnhanced(): Promise<CountryDetectionData> {
    return await countryDetectionService.detectCountry();
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
      // Currencies that don't use decimal places
      const noDecimalCurrencies = ['IDR', 'JPY', 'KRW', 'VND', 'CLP', 'HUF', 'COP'];
      const useDecimals = !noDecimalCurrencies.includes(currencyCode);
      
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: useDecimals ? 2 : 0,
        maximumFractionDigits: useDecimals ? 2 : 0,
      }).format(amount);
    } catch (error) {
      // Fallback formatting - prevent double currency code display
      const symbol = info?.symbol || '';
      const noDecimalCurrencies = ['IDR', 'JPY', 'KRW', 'VND', 'CLP', 'HUF', 'COP'];
      const formattedAmount = noDecimalCurrencies.includes(currencyCode)
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
      'Oceania': 1.05,   // 5% premium for Oceania
      'Africa': 0.6,     // 40% discount for African markets
      'Middle East': 0.8 // 20% discount for Middle Eastern markets
    };

    const multiplier = regionMultipliers[region as keyof typeof regionMultipliers] || 1.0;
    return basePrice * multiplier;
  }

  async getCountrySpecificPricing(countryCode: string, priceTier: string): Promise<number | null> {
    return await countryDetectionService.getRegionalPricing(countryCode, priceTier);
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
