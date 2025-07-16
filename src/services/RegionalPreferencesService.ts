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

  // Purchasing power parity adjustments with fraud-resistant multipliers (max 60% discount)
  private readonly PPP_MULTIPLIERS: Record<string, number> = {
    'US': 1.0,
    'GB': 0.80,
    'CA': 0.85,
    'AU': 0.80,
    'DE': 0.75,
    'FR': 0.75,
    'JP': 0.70,
    'IN': 0.40,
    'BR': 0.50,
    'MX': 0.55,
    'RU': 0.45,
    'CN': 0.50,
    'ZA': 0.50,
    'AR': 0.45,
    'TH': 0.50,
    'PH': 0.40,
    'VN': 0.40,
    'ID': 0.40,
    'MY': 0.55,
    'TR': 0.50,
    'EG': 0.40,
    'NG': 0.40,
    'KE': 0.40,
    'PK': 0.40,
    'BD': 0.40
  };

  // Trust-based progressive discount levels
  private readonly TRUST_MULTIPLIERS: Record<string, number> = {
    'new': 0.3, // 30% discount initially
    'building': 0.5, // 50% discount after some verification
    'trusted': 1.0, // Full regional discount
    'suspicious': 0.8, // Reduced discount
    'blocked': 1.0 // No discount
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
    customerVATNumber?: string,
    userId?: string
  ): Promise<RegionalPricing> {
    try {
      // Get country data for currency info
      const { data: countries } = await supabase
        .from('countries')
        .select('*')
        .eq('country_code', countryCode.toUpperCase())
        .single();
      
      // Get user trust level if userId provided
      let trustLevel = 'new';
      if (userId && enablePPP) {
        const { data: trustData } = await supabase
          .from('user_location_confidence')
          .select('trust_level')
          .eq('user_id', userId)
          .single();
        
        trustLevel = trustData?.trust_level || 'new';
      }

      // Apply fraud-resistant pricing with trust-based progression
      let pppMultiplier = 1.0;
      if (enablePPP) {
        const basePPP = this.PPP_MULTIPLIERS[countryCode] || 1.0;
        const trustMultiplier = this.TRUST_MULTIPLIERS[trustLevel] || 0.3;
        
        // Progressive discount: start at 30%, build to full regional pricing
        if (basePPP < 1.0) {
          const discountAmount = (1.0 - basePPP) * trustMultiplier;
          pppMultiplier = 1.0 - discountAmount;
        } else {
          pppMultiplier = basePPP;
        }
      }

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

      // Log pricing calculation for analytics
      if (userId) {
        await this.logPricingEvent(userId, countryCode, basePrice, convertedPrice, pppMultiplier, trustLevel);
      }

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

  // New fraud prevention methods
  async recordVerificationData(
    userId: string, 
    verificationType: string, 
    dataPoint: string, 
    value: string, 
    confidence: number,
    method: string,
    metadata: any = {}
  ): Promise<void> {
    try {
      await supabase.from('user_verification_history').insert({
        user_id: userId,
        verification_type: verificationType,
        data_point: dataPoint,
        value,
        confidence_score: confidence,
        detection_method: method,
        metadata
      });
    } catch (error) {
      console.error('Failed to record verification data:', error);
    }
  }

  async updateLocationConfidence(userId: string, countryCode: string, verificationData: any): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('user_location_confidence')
        .select('*')
        .eq('user_id', userId)
        .single();

      const confidenceScore = this.calculateConfidenceScore(verificationData);
      const trustLevel = this.determineTrustLevel(confidenceScore, existing?.verification_count || 0);

      if (existing) {
        await supabase
          .from('user_location_confidence')
          .update({
            current_country_code: countryCode,
            confidence_score: confidenceScore,
            trust_level: trustLevel,
            verification_count: (existing.verification_count || 0) + 1,
            last_verified_at: new Date().toISOString(),
            ip_consistency_score: verificationData.ipConsistency || 0.5,
            behavioral_consistency_score: verificationData.behavioralConsistency || 0.5,
            payment_consistency_score: verificationData.paymentConsistency || 0.5
          })
          .eq('user_id', userId);
      } else {
        await supabase.from('user_location_confidence').insert({
          user_id: userId,
          current_country_code: countryCode,
          confidence_score: confidenceScore,
          trust_level: trustLevel,
          verification_count: 1,
          last_verified_at: new Date().toISOString(),
          ip_consistency_score: verificationData.ipConsistency || 0.5,
          behavioral_consistency_score: verificationData.behavioralConsistency || 0.5,
          payment_consistency_score: verificationData.paymentConsistency || 0.5
        });
      }
    } catch (error) {
      console.error('Failed to update location confidence:', error);
    }
  }

  private calculateConfidenceScore(verificationData: any): number {
    let score = 0;
    let factors = 0;

    if (verificationData.ipConsistency !== undefined) {
      score += verificationData.ipConsistency * 0.3;
      factors += 0.3;
    }
    if (verificationData.behavioralConsistency !== undefined) {
      score += verificationData.behavioralConsistency * 0.3;
      factors += 0.3;
    }
    if (verificationData.paymentConsistency !== undefined) {
      score += verificationData.paymentConsistency * 0.4;
      factors += 0.4;
    }

    return factors > 0 ? Math.min(score / factors, 1.0) : 0.5;
  }

  private determineTrustLevel(confidenceScore: number, verificationCount: number): string {
    if (confidenceScore < 0.3) return 'suspicious';
    if (confidenceScore < 0.5 || verificationCount < 3) return 'new';
    if (confidenceScore < 0.7 || verificationCount < 10) return 'building';
    return 'trusted';
  }

  private async logPricingEvent(
    userId: string, 
    countryCode: string, 
    basePrice: number, 
    finalPrice: number, 
    multiplier: number, 
    trustLevel: string
  ): Promise<void> {
    try {
      await supabase.from('user_behavioral_analytics').insert({
        user_id: userId,
        event_type: 'pricing_calculation',
        country_claimed: countryCode,
        country_detected: countryCode,
        suspicious_patterns: [],
        risk_score: trustLevel === 'suspicious' ? 0.8 : trustLevel === 'new' ? 0.4 : 0.1
      });
    } catch (error) {
      console.error('Failed to log pricing event:', error);
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