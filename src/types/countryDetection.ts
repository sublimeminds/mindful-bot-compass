// Country Detection Types
export interface CountryDetectionData {
  countryCode: string;
  countryName: string;
  currency: string;
  currencySymbol: string;
  language: string;
  region: string;
  timezone: string;
  callingCode: string;
  confidence: number;
  detectionMethod: DetectionMethod;
}

export interface CountryData {
  country_code: string;
  name: string;
  currency_code: string;
  currency_symbol: string;
  language_code: string;
  region: string;
  timezone: string;
  calling_code: string;
  is_active: boolean;
}

export interface RegionalPricing {
  country_code: string;
  price_tier: string;
  base_price: number;
  currency_code: string;
  regional_multiplier: number;
}

export interface UserCountryPreference {
  id: string;
  user_id: string;
  detected_country_code?: string;
  preferred_country_code?: string;
  detection_method?: string;
  detection_confidence: number;
  ip_address?: string;
  user_agent?: string;
  browser_language?: string;
  timezone?: string;
  is_manual_override: boolean;
  created_at: string;
  updated_at: string;
}

export type DetectionMethod = 
  | 'user_preference'
  | 'ip_geolocation'
  | 'browser_language'
  | 'timezone'
  | 'default_fallback';

export interface DetectionResult {
  countryCode: string;
  confidence: number;
  method: DetectionMethod;
  metadata?: {
    ip?: string;
    language?: string;
    timezone?: string;
    userAgent?: string;
  };
}

export interface CountryBusinessRules {
  supportsTaxCalculation: boolean;
  requiresVAT: boolean;
  hasDataPrivacyRequirements: boolean;
  supportedPaymentMethods: string[];
  complianceRequirements: string[];
  localizedContent: boolean;
}