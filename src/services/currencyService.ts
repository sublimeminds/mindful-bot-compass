
interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number;
}

class CurrencyService {
  private supportedCurrencies: CurrencyData[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1 },
    { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.85 },
    { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.73 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 1.25 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', exchangeRate: 1.35 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 110 },
  ];

  async detectUserCurrency(): Promise<CurrencyData> {
    try {
      // Try to detect from browser locale
      const locale = navigator.language || 'en-US';
      const region = locale.split('-')[1];
      
      const currencyMap: Record<string, string> = {
        'US': 'USD',
        'GB': 'GBP',
        'CA': 'CAD',
        'AU': 'AUD',
        'JP': 'JPY',
        'DE': 'EUR',
        'FR': 'EUR',
        'ES': 'EUR',
        'IT': 'EUR',
      };

      const detectedCode = currencyMap[region] || 'USD';
      return this.getCurrencyData(detectedCode);
    } catch (error) {
      console.error('Error detecting currency:', error);
      return this.getCurrencyData('USD');
    }
  }

  async getCurrencyData(code: string): Promise<CurrencyData> {
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

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.supportedCurrencies.find(c => c.code === currencyCode);
    if (!currency) return `$${amount.toFixed(2)}`;
    
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}

export const currencyService = new CurrencyService();
