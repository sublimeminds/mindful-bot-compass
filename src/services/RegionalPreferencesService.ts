import { supabase } from '@/integrations/supabase/client';
import { countryDetectionService } from './countryDetectionService';
import { enhancedCurrencyService } from './enhancedCurrencyService';
import type { CountryDetectionData } from '@/types/countryDetection';

export interface RegionalPreferences {
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  language: string;
  timezone: string;
  region: string;
  confidence: number;
  detectionMethod: string;
}

export interface TaxCalculationResult {
  rate: number;
  amount: number;
  type: string;
  country: string;
  countryCode: string;
  isEU: boolean;
  isReversed: boolean; // For B2B reverse charge
}

export interface CountryBusinessRules {
  supportsTaxCalculation: boolean;
  requiresVAT: boolean;
  hasDataPrivacyRequirements: boolean;
  supportedPaymentMethods: string[];
  complianceRequirements: string[];
  localizedContent: boolean;
}

export interface RegionalPricing {
  basePrice: number;
  convertedPrice: number;
  currency: string;
  currencySymbol: string;
  purchasingPowerMultiplier: number;
  taxInfo?: TaxCalculationResult;
}

class RegionalPreferencesService {
  private static instance: RegionalPreferencesService;
  
  // EU countries for VAT logic
  private readonly EU_COUNTRIES = [
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 
    'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 
    'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
  ];

  // Purchasing power parity adjustments (relative to USD)
  private readonly PPP_MULTIPLIERS: Record<string, number> = {
    'US': 1.0,
    'GB': 0.75,
    'CA': 0.85,
    'AU': 0.80,
    'DE': 0.70,
    'FR': 0.72,
    'JP': 0.65,
    'IN': 0.25,
    'BR': 0.45,
    'MX': 0.50,
    'RU': 0.35,
    'CN': 0.40,
    'ZA': 0.45,
    'AR': 0.35,
    'TH': 0.40,
    'PH': 0.30,
    'VN': 0.25,
    'ID': 0.30,
    'MY': 0.45,
    'TR': 0.40,
    'EG': 0.25,
    'NG': 0.20,
    'KE': 0.25,
    'PK': 0.20,
    'BD': 0.18
  };

  public static getInstance(): RegionalPreferencesService {
    if (!RegionalPreferencesService.instance) {
      RegionalPreferencesService.instance = new RegionalPreferencesService();
    }
    return RegionalPreferencesService.instance;
  }

  async detectUserRegion(userId?: string): Promise<RegionalPreferences> {
    try {
      const detectionData = await countryDetectionService.detectCountry(userId);
      return this.mapToRegionalPreferences(detectionData);
    } catch (error) {
      console.error('Failed to detect user region:', error);
      return this.getDefaultRegionalPreferences();
    }
  }

  async setUserCountryPreference(userId: string, countryCode: string): Promise<void> {
    await countryDetectionService.setUserPreference(userId, countryCode);
  }

  async calculateTax(
    amount: number, 
    countryCode: string, 
    isBusinessCustomer: boolean = false,
    customerVATNumber?: string
  ): Promise<TaxCalculationResult> {
    try {
      const { data: taxRate, error } = await supabase
        .from('tax_rates')
        .select('*')
        .eq('country_code', countryCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !taxRate) {
        return {
          rate: 0,
          amount: 0,
          type: 'none',
          country: countryCode,
          countryCode,
          isEU: this.isEUCountry(countryCode),
          isReversed: false
        };
      }

      const isEU = this.isEUCountry(countryCode);
      let isReversed = false;
      let finalRate = parseFloat(taxRate.rate.toString());

      // EU B2B Reverse Charge Logic
      if (isEU && isBusinessCustomer && customerVATNumber) {
        // For EU B2B transactions with valid VAT number, reverse charge applies
        isReversed = true;
        finalRate = 0; // Customer pays VAT in their own country
      }

      const taxAmount = amount * finalRate;

      return {
        rate: finalRate,
        amount: Math.round(taxAmount * 100) / 100,
        type: taxRate.tax_type,
        country: countryCode,
        countryCode,
        isEU,
        isReversed
      };
    } catch (error) {
      console.error('Tax calculation failed:', error);
      return {
        rate: 0,
        amount: 0,
        type: 'error',
        country: countryCode,
        countryCode,
        isEU: this.isEUCountry(countryCode),
        isReversed: false
      };
    }
  }

  async getCountryBusinessRules(countryCode: string): Promise<CountryBusinessRules> {
    try {
      // For now, return default rules based on country patterns
      // This will be updated when the table types are generated
      const isEU = this.isEUCountry(countryCode);
      
      return {
        supportsTaxCalculation: true,
        requiresVAT: isEU,
        hasDataPrivacyRequirements: isEU || ['US', 'CA', 'AU', 'JP'].includes(countryCode.toUpperCase()),
        supportedPaymentMethods: this.getSupportedPaymentMethods(countryCode),
        complianceRequirements: this.getComplianceRequirements(countryCode),
        localizedContent: ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'CA', 'AU'].includes(countryCode.toUpperCase())
      };
    } catch (error) {
      console.error('Failed to get business rules:', error);
      return this.getDefaultBusinessRules();
    }
  }

  async calculateRegionalPricing(
    basePrice: number,
    countryCode: string,
    enablePPP: boolean = true,
    isBusinessCustomer: boolean = false,
    customerVATNumber?: string
  ): Promise<RegionalPricing> {
    try {
      // Get country data for currency info
      const { data: countries } = await supabase
        .from('countries')
        .select('*')
        .eq('country_code', countryCode.toUpperCase())
        .single();
      
      // Apply purchasing power parity if enabled
      const pppMultiplier = enablePPP ? (this.PPP_MULTIPLIERS[countryCode] || 1.0) : 1.0;
      const adjustedPrice = basePrice * pppMultiplier;

      // Convert currency using enhanced currency service
      const targetCurrency = countries?.currency_code || 'USD';
      let convertedPrice = adjustedPrice;
      
      if (targetCurrency !== 'USD') {
        try {
          convertedPrice = await enhancedCurrencyService.convertAmount(adjustedPrice, 'USD', targetCurrency);
        } catch (error) {
          console.warn('Currency conversion failed, using PPP-adjusted USD price:', error);
          convertedPrice = adjustedPrice;
        }
      }

      // Calculate tax
      const taxInfo = await this.calculateTax(convertedPrice, countryCode, isBusinessCustomer, customerVATNumber);

      return {
        basePrice,
        convertedPrice,
        currency: targetCurrency,
        currencySymbol: countries?.currency_symbol || '$',
        purchasingPowerMultiplier: pppMultiplier,
        taxInfo
      };
    } catch (error) {
      console.error('Regional pricing calculation failed:', error);
      return {
        basePrice,
        convertedPrice: basePrice,
        currency: 'USD',
        currencySymbol: '$',
        purchasingPowerMultiplier: 1.0
      };
    }
  }

  private mapToRegionalPreferences(detectionData: CountryDetectionData): RegionalPreferences {
    return {
      countryCode: detectionData.countryCode,
      countryName: detectionData.countryName,
      currency: detectionData.currency,
      currencySymbol: detectionData.currencySymbol,
      language: detectionData.language,
      timezone: detectionData.timezone,
      region: detectionData.region,
      confidence: detectionData.confidence,
      detectionMethod: detectionData.detectionMethod
    };
  }

  private getDefaultRegionalPreferences(): RegionalPreferences {
    return {
      countryCode: 'US',
      countryName: 'United States',
      currency: 'USD',
      currencySymbol: '$',
      language: 'en',
      timezone: 'America/New_York',
      region: 'Americas',
      confidence: 0.1,
      detectionMethod: 'default_fallback'
    };
  }

  private getDefaultBusinessRules(): CountryBusinessRules {
    return {
      supportsTaxCalculation: true,
      requiresVAT: false,
      hasDataPrivacyRequirements: true,
      supportedPaymentMethods: ['card', 'bank_transfer'],
      complianceRequirements: [],
      localizedContent: false
    };
  }

  private isEUCountry(countryCode: string): boolean {
    return this.EU_COUNTRIES.includes(countryCode.toUpperCase());
  }

  // Utility methods
  getPPPMultiplier(countryCode: string): number {
    return this.PPP_MULTIPLIERS[countryCode] || 1.0;
  }

  isEligibleForPPP(countryCode: string): boolean {
    const multiplier = this.getPPPMultiplier(countryCode);
    return multiplier < 0.8; // Countries with lower purchasing power
  }

  getSupportedPaymentMethods(countryCode: string): string[] {
    // This could be expanded based on country business rules
    const defaultMethods = ['card'];
    
    switch (countryCode.toUpperCase()) {
      case 'DE':
      case 'NL':
      case 'BE':
      case 'FR':
        return [...defaultMethods, 'sepa', 'paypal'];
      case 'IN':
        return [...defaultMethods, 'upi', 'bank_transfer'];
      case 'BR':
        return [...defaultMethods, 'pix', 'bank_transfer'];
      case 'US':
      case 'CA':
      case 'GB':
      case 'AU':
        return [...defaultMethods, 'paypal', 'bank_transfer'];
      default:
        return defaultMethods;
    }
  }

  private getComplianceRequirements(countryCode: string): string[] {
    switch (countryCode.toUpperCase()) {
      case 'US':
        return ['CCPA'];
      case 'GB':
        return ['GDPR', 'UK_DPA'];
      case 'DE':
        return ['GDPR', 'DSGVO'];
      case 'FR':
      case 'IT':
      case 'ES':
      case 'NL':
      case 'BE':
      case 'AT':
        return ['GDPR'];
      case 'CA':
        return ['PIPEDA'];
      case 'AU':
        return ['Privacy_Act'];
      case 'JP':
        return ['APPI'];
      case 'BR':
        return ['LGPD'];
      default:
        return [];
    }
  }
}

export const regionalPreferencesService = RegionalPreferencesService.getInstance();