import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { regionalPreferencesService } from '@/services/RegionalPreferencesService';
import type { 
  RegionalPreferences, 
  TaxCalculationResult, 
  CountryBusinessRules, 
  RegionalPricing 
} from '@/services/RegionalPreferencesService';

export const useRegionalPreferences = () => {
  const { user } = useAuth();
  const [regionalPreferences, setRegionalPreferences] = useState<RegionalPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectRegion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const preferences = await regionalPreferencesService.detectUserRegion(user?.id);
      setRegionalPreferences(preferences);
    } catch (err) {
      setError('Failed to detect region');
      console.error('Region detection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const setCountryPreference = useCallback(async (countryCode: string) => {
    if (!user?.id) return;
    
    try {
      await regionalPreferencesService.setUserCountryPreference(user.id, countryCode);
      await detectRegion(); // Re-detect to get updated data
    } catch (err) {
      setError('Failed to save country preference');
      console.error('Error setting country preference:', err);
    }
  }, [user?.id, detectRegion]);

  const calculateTax = useCallback(async (
    amount: number, 
    countryCode?: string,
    isBusinessCustomer: boolean = false,
    customerVATNumber?: string
  ): Promise<TaxCalculationResult | null> => {
    const targetCountry = countryCode || regionalPreferences?.countryCode;
    if (!targetCountry) return null;
    
    try {
      return await regionalPreferencesService.calculateTax(amount, targetCountry, isBusinessCustomer, customerVATNumber);
    } catch (err) {
      console.error('Error calculating tax:', err);
      return null;
    }
  }, [regionalPreferences?.countryCode]);

  const getBusinessRules = useCallback(async (countryCode?: string): Promise<CountryBusinessRules | null> => {
    const targetCountry = countryCode || regionalPreferences?.countryCode;
    if (!targetCountry) return null;
    
    try {
      return await regionalPreferencesService.getCountryBusinessRules(targetCountry);
    } catch (err) {
      console.error('Error getting business rules:', err);
      return null;
    }
  }, [regionalPreferences?.countryCode]);

  const calculateRegionalPricing = useCallback(async (
    basePrice: number,
    countryCode?: string,
    enablePPP: boolean = true,
    isBusinessCustomer: boolean = false,
    customerVATNumber?: string
  ): Promise<RegionalPricing | null> => {
    const targetCountry = countryCode || regionalPreferences?.countryCode;
    if (!targetCountry) return null;
    
    try {
      return await regionalPreferencesService.calculateRegionalPricing(
        basePrice, 
        targetCountry, 
        enablePPP, 
        isBusinessCustomer, 
        customerVATNumber
      );
    } catch (err) {
      console.error('Error calculating regional pricing:', err);
      return null;
    }
  }, [regionalPreferences?.countryCode]);

  const formatPrice = useCallback((amount: number, currency?: string): string => {
    const targetCurrency = currency || regionalPreferences?.currency || 'USD';
    const targetSymbol = regionalPreferences?.currencySymbol || '$';
    
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatter.format(amount);
    } catch (error) {
      // Fallback to symbol + amount if Intl.NumberFormat fails
      return `${targetSymbol}${amount.toFixed(2)}`;
    }
  }, [regionalPreferences?.currency, regionalPreferences?.currencySymbol]);

  useEffect(() => {
    detectRegion();
  }, [detectRegion]);

  return {
    // Core data
    regionalPreferences,
    isLoading,
    error,
    
    // Actions
    detectRegion,
    setCountryPreference,
    
    // Calculations
    calculateTax,
    getBusinessRules,
    calculateRegionalPricing,
    formatPrice,
    
    // Convenience getters
    countryCode: regionalPreferences?.countryCode,
    countryName: regionalPreferences?.countryName,
    currency: regionalPreferences?.currency,
    currencySymbol: regionalPreferences?.currencySymbol,
    language: regionalPreferences?.language,
    region: regionalPreferences?.region,
    timezone: regionalPreferences?.timezone,
    confidence: regionalPreferences?.confidence,
    detectionMethod: regionalPreferences?.detectionMethod,
    
    // Utility methods
    isEUCountry: (countryCode?: string) => {
      const target = countryCode || regionalPreferences?.countryCode;
      if (!target) return false;
      const euCountries = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
      return euCountries.includes(target.toUpperCase());
    },
    
    isEligibleForPPP: (countryCode?: string) => {
      const target = countryCode || regionalPreferences?.countryCode;
      if (!target) return false;
      return regionalPreferencesService.isEligibleForPPP(target);
    },
    
    getPPPMultiplier: (countryCode?: string) => {
      const target = countryCode || regionalPreferences?.countryCode;
      if (!target) return 1.0;
      return regionalPreferencesService.getPPPMultiplier(target);
    }
  };
};