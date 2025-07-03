interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
  region: string;
}

interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  timezone: string;
  region: string;
}

class SimpleCurrencyService {
  private readonly currencyInfo = {
    USD: { symbol: '$', name: 'US Dollar', region: 'Americas' },
    EUR: { symbol: '€', name: 'Euro', region: 'Europe' },
    GBP: { symbol: '£', name: 'British Pound', region: 'Europe' },
    JPY: { symbol: '¥', name: 'Japanese Yen', region: 'Asia' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', region: 'Americas' },
    AUD: { symbol: 'A$', name: 'Australian Dollar', region: 'Oceania' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc', region: 'Europe' },
    CNY: { symbol: '¥', name: 'Chinese Yuan', region: 'Asia' },
    INR: { symbol: '₹', name: 'Indian Rupee', region: 'Asia' },
    BRL: { symbol: 'R$', name: 'Brazilian Real', region: 'Americas' },
  };

  // Simple fallback exchange rates
  private readonly exchangeRates = new Map([
    ['USD', 1.0],
    ['EUR', 0.85],
    ['GBP', 0.73],
    ['JPY', 110.0],
    ['CAD', 1.25],
    ['AUD', 1.35],
    ['CHF', 0.92],
    ['CNY', 6.45],
    ['INR', 74.0],
    ['BRL', 5.2]
  ]);

  async updateExchangeRates(): Promise<void> {
    // No-op - using static rates to avoid network dependencies
  }

  async ensureExchangeRatesLoaded(): Promise<void> {
    // No-op - rates are always loaded
  }

  async detectUserLocation(): Promise<LocationData | null> {
    // Return US defaults immediately to avoid async issues
    return {
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      timezone: 'UTC',
      region: 'Americas'
    };
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = this.exchangeRates.get(fromCurrency) || 1;
    const toRate = this.exchangeRates.get(toCurrency) || 1;

    // Convert via USD
    let usdAmount: number;
    if (fromCurrency === 'USD') {
      usdAmount = amount;
    } else {
      usdAmount = amount / fromRate;
    }

    if (toCurrency === 'USD') {
      return usdAmount;
    } else {
      return usdAmount * toRate;
    }
  }

  formatCurrency(amount: number, currencyCode: string, locale?: string): string {
    const info = this.currencyInfo[currencyCode as keyof typeof this.currencyInfo];
    
    try {
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: ['JPY'].includes(currencyCode) ? 0 : 2,
        maximumFractionDigits: ['JPY'].includes(currencyCode) ? 0 : 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      const symbol = info?.symbol || '$';
      const formattedAmount = ['JPY'].includes(currencyCode)
        ? Math.round(amount).toLocaleString()
        : amount.toFixed(2);
      return `${symbol}${formattedAmount}`;
    }
  }

  async getCurrencyData(currencyCode: string): Promise<CurrencyData> {
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
    return Object.entries(this.currencyInfo).map(([code, info]) => ({
      code,
      symbol: info.symbol,
      name: info.name,
      exchangeRate: this.exchangeRates.get(code) || 1,
      region: info.region
    }));
  }

  async getRegionalPricing(basePrice: number, currency: string, region: string): Promise<number> {
    const regionMultipliers = {
      'Asia': 0.7,
      'Americas': 1.0,
      'Europe': 1.1,
      'Oceania': 1.05
    };

    const multiplier = regionMultipliers[region as keyof typeof regionMultipliers] || 1.0;
    return basePrice * multiplier;
  }

  async getUserCurrencyPreference(userId: string): Promise<string> {
    return 'USD'; // Default to USD
  }

  async saveUserCurrencyPreference(userId: string, currency: string): Promise<void> {
    // No-op for simplicity
  }
}

export const simpleCurrencyService = new SimpleCurrencyService();

// Export both names for compatibility
export const enhancedCurrencyService = simpleCurrencyService;