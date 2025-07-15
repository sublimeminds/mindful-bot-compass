import { supabase } from '@/integrations/supabase/client';
import type { 
  CountryDetectionData, 
  CountryData, 
  DetectionResult, 
  DetectionMethod,
  UserCountryPreference,
  CountryBusinessRules
} from '@/types/countryDetection';

class CountryDetectionService {
  private cache: Map<string, CountryData> = new Map();
  private cacheExpiry: number = 1000 * 60 * 60; // 1 hour
  private lastCacheUpdate: number = 0;

  async detectCountry(userId?: string): Promise<CountryDetectionData> {
    try {
      // Check user preference first if userId provided
      if (userId) {
        const userPreference = await this.getUserPreference(userId);
        if (userPreference) {
          const countryData = await this.getCountryData(userPreference.countryCode);
          if (countryData) {
            return {
              countryCode: countryData.country_code,
              countryName: countryData.name,
              currency: countryData.currency_code,
              currencySymbol: countryData.currency_symbol,
              language: countryData.language_code,
              region: countryData.region,
              timezone: countryData.timezone,
              callingCode: countryData.calling_code,
              confidence: userPreference.confidence,
              detectionMethod: userPreference.method
            };
          }
        }
      }

      const detectionResults = await this.runDetectionMethods();
      
      // Sort by confidence and priority
      detectionResults.sort((a, b) => {
        const priorityMap: Record<DetectionMethod, number> = {
          'user_preference': 100,
          'ip_geolocation': 80,
          'browser_language': 60,
          'timezone': 40,
          'default_fallback': 10
        };
        
        const scoreDiff = (b.confidence * priorityMap[b.method]) - (a.confidence * priorityMap[a.method]);
        return scoreDiff;
      });

      const bestResult = detectionResults[0];
      const countryData = await this.getCountryData(bestResult.countryCode);
      
      if (!countryData) {
        console.warn('Country data not found for:', bestResult.countryCode);
        return this.getDefaultCountryData();
      }

      // Save detection result for user if provided (non-blocking)
      if (userId) {
        this.saveUserDetection(userId, bestResult).catch(error => {
          console.warn('Failed to save user detection (non-blocking):', error);
        });
      }

      return {
        countryCode: countryData.country_code,
        countryName: countryData.name,
        currency: countryData.currency_code,
        currencySymbol: countryData.currency_symbol,
        language: countryData.language_code,
        region: countryData.region,
        timezone: countryData.timezone,
        callingCode: countryData.calling_code,
        confidence: bestResult.confidence,
        detectionMethod: bestResult.method
      };
    } catch (error) {
      console.error('Country detection failed, using fallback:', error);
      return this.getDefaultCountryData();
    }
  }

  private async runDetectionMethods(): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];

    // Method 1: IP Geolocation
    try {
      const ipResult = await this.detectFromIP();
      if (ipResult) results.push(ipResult);
    } catch (error) {
      console.log('IP detection failed:', error);
    }

    // Method 2: Browser Language
    try {
      const langResult = this.detectFromBrowserLanguage();
      if (langResult) results.push(langResult);
    } catch (error) {
      console.log('Language detection failed:', error);
    }

    // Method 3: Timezone
    try {
      const timezoneResult = this.detectFromTimezone();
      if (timezoneResult) results.push(timezoneResult);
    } catch (error) {
      console.log('Timezone detection failed:', error);
    }

    // Method 4: Default fallback
    results.push({
      countryCode: 'US',
      confidence: 0.1,
      method: 'default_fallback'
    });

    return results;
  }

  private async detectFromIP(): Promise<DetectionResult | null> {
    try {
      // Try multiple IP geolocation services with better error handling
      const services = [
        { url: 'https://ipinfo.io/json', name: 'ipinfo' },
        { url: 'https://api.ipify.org/?format=json', name: 'ipify' },
        { url: 'https://httpbin.org/ip', name: 'httpbin' }
      ];

      for (const service of services) {
        try {
          console.log(`Trying IP service: ${service.name}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          const response = await fetch(service.url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
          });
          
          clearTimeout(timeoutId);

          if (!response.ok) {
            console.log(`IP service ${service.name} returned ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          let countryCode: string | null = null;
          if (data.country_code) countryCode = data.country_code;
          else if (data.countryCode) countryCode = data.countryCode;
          else if (data.country) countryCode = data.country;

          if (countryCode && await this.isValidCountryCode(countryCode)) {
            console.log(`Successfully detected country from ${service.name}: ${countryCode}`);
            return {
              countryCode: countryCode.toUpperCase(),
              confidence: 0.8, // Reduced confidence due to API reliability issues
              method: 'ip_geolocation',
              metadata: { ip: data.ip }
            };
          }
        } catch (serviceError) {
          console.log(`IP service ${service.name} failed:`, serviceError);
          continue;
        }
      }

      console.log('All IP geolocation services failed, using fallback detection');
    } catch (error) {
      console.log('IP detection completely failed, using other methods');
    }
    return null;
  }

  private detectFromBrowserLanguage(): DetectionResult | null {
    try {
      const languages = navigator.languages || [navigator.language];
      
      for (const lang of languages) {
        const parts = lang.split('-');
        if (parts.length > 1) {
          const countryCode = parts[1].toUpperCase();
          return {
            countryCode,
            confidence: 0.6,
            method: 'browser_language',
            metadata: { language: lang }
          };
        }
      }
    } catch (error) {
      console.log('Browser language detection failed:', error);
    }
    return null;
  }

  private detectFromTimezone(): DetectionResult | null {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Basic timezone to country mapping
      const timezoneMap: Record<string, string> = {
        'America/New_York': 'US',
        'America/Los_Angeles': 'US',
        'America/Chicago': 'US',
        'America/Denver': 'US',
        'America/Toronto': 'CA',
        'America/Vancouver': 'CA',
        'Europe/London': 'GB',
        'Europe/Berlin': 'DE',
        'Europe/Paris': 'FR',
        'Europe/Madrid': 'ES',
        'Europe/Rome': 'IT',
        'Europe/Amsterdam': 'NL',
        'Asia/Tokyo': 'JP',
        'Asia/Seoul': 'KR',
        'Asia/Shanghai': 'CN',
        'Asia/Kolkata': 'IN',
        'Asia/Jakarta': 'ID',
        'Asia/Singapore': 'SG',
        'Australia/Sydney': 'AU',
        'Australia/Melbourne': 'AU'
      };

      const countryCode = timezoneMap[timezone];
      if (countryCode) {
        return {
          countryCode,
          confidence: 0.5,
          method: 'timezone',
          metadata: { timezone }
        };
      }
    } catch (error) {
      console.log('Timezone detection failed:', error);
    }
    return null;
  }

  async getUserPreference(userId: string): Promise<DetectionResult | null> {
    try {
      const { data, error } = await supabase
        .from('user_country_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      const countryCode = data.preferred_country_code || data.detected_country_code;
      if (!countryCode) return null;

      return {
        countryCode,
        confidence: data.is_manual_override ? 1.0 : data.detection_confidence,
        method: 'user_preference'
      };
    } catch (error) {
      console.error('Error getting user preference:', error);
      return null;
    }
  }

  private async saveUserDetection(userId: string, result: DetectionResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_country_preferences')
        .upsert({
          user_id: userId,
          detected_country_code: result.countryCode,
          detection_method: result.method,
          detection_confidence: result.confidence,
          ip_address: result.metadata?.ip,
          user_agent: navigator.userAgent,
          browser_language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          is_manual_override: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving user detection:', error);
      }
    } catch (error) {
      console.error('Error in saveUserDetection:', error);
    }
  }

  async setUserPreference(userId: string, countryCode: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_country_preferences')
        .upsert({
          user_id: userId,
          preferred_country_code: countryCode,
          detection_method: 'user_preference',
          detection_confidence: 1.0,
          is_manual_override: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error setting user preference:', error);
      }
    } catch (error) {
      console.error('Error in setUserPreference:', error);
    }
  }

  private async loadCountriesFromDB(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (data) {
        this.cache.clear();
        data.forEach(country => {
          this.cache.set(country.country_code, country);
        });
        this.lastCacheUpdate = Date.now();
      }
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  }

  async getCountryData(countryCode: string): Promise<CountryData | null> {
    await this.ensureCacheLoaded();
    return this.cache.get(countryCode.toUpperCase()) || null;
  }

  async getAllCountries(): Promise<CountryData[]> {
    await this.ensureCacheLoaded();
    return Array.from(this.cache.values());
  }

  async getCountriesByRegion(region: string): Promise<CountryData[]> {
    await this.ensureCacheLoaded();
    return Array.from(this.cache.values()).filter(country => country.region === region);
  }

  private async ensureCacheLoaded(): Promise<void> {
    const now = Date.now();
    if (this.cache.size === 0 || (now - this.lastCacheUpdate) > this.cacheExpiry) {
      await this.loadCountriesFromDB();
    }
  }

  private async isValidCountryCode(countryCode: string): Promise<boolean> {
    const country = await this.getCountryData(countryCode);
    return country !== null;
  }

  private getDefaultCountryData(): CountryDetectionData {
    return {
      countryCode: 'US',
      countryName: 'United States',
      currency: 'USD',
      currencySymbol: '$',
      language: 'en',
      region: 'Americas',
      timezone: 'UTC-5',
      callingCode: '+1',
      confidence: 0.1,
      detectionMethod: 'default_fallback'
    };
  }

  async getRegionalPricing(countryCode: string, priceTier: string): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('regional_pricing')
        .select('base_price')
        .eq('country_code', countryCode.toUpperCase())
        .eq('price_tier', priceTier)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) return null;
      return data.base_price;
    } catch (error) {
      console.error('Error getting regional pricing:', error);
      return null;
    }
  }

  async getCountryBusinessRules(countryCode: string): Promise<CountryBusinessRules> {
    // This could be extended to load from database or config
    const rules: Record<string, CountryBusinessRules> = {
      'US': {
        supportsTaxCalculation: true,
        requiresVAT: false,
        hasDataPrivacyRequirements: false,
        supportedPaymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
        complianceRequirements: ['HIPAA'],
        localizedContent: true
      },
      'GB': {
        supportsTaxCalculation: true,
        requiresVAT: true,
        hasDataPrivacyRequirements: true,
        supportedPaymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
        complianceRequirements: ['GDPR', 'UK_DPA'],
        localizedContent: true
      },
      'DE': {
        supportsTaxCalculation: true,
        requiresVAT: true,
        hasDataPrivacyRequirements: true,
        supportedPaymentMethods: ['credit_card', 'paypal', 'sepa', 'bank_transfer'],
        complianceRequirements: ['GDPR'],
        localizedContent: true
      }
    };

    return rules[countryCode] || {
      supportsTaxCalculation: false,
      requiresVAT: false,
      hasDataPrivacyRequirements: false,
      supportedPaymentMethods: ['credit_card'],
      complianceRequirements: [],
      localizedContent: false
    };
  }
}

export const countryDetectionService = new CountryDetectionService();