import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { countryDetectionService } from '@/services/countryDetectionService';
import type { CountryDetectionData, CountryData } from '@/types/countryDetection';

export const useCountryDetection = () => {
  const { user } = useAuth();
  const [countryData, setCountryData] = useState<CountryDetectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCountries, setAvailableCountries] = useState<CountryData[]>([]);

  const detectCountry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const detected = await countryDetectionService.detectCountry(user?.id);
      setCountryData(detected);
    } catch (err) {
      console.warn('Country detection failed, using fallback:', err);
      // Set a fallback instead of showing an error to user
      setCountryData({
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
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const setUserCountryPreference = useCallback(async (countryCode: string) => {
    if (!user?.id) return;
    
    try {
      await countryDetectionService.setUserPreference(user.id, countryCode);
      // Re-detect to get updated data
      await detectCountry();
    } catch (err) {
      setError('Failed to save country preference');
      console.error('Error setting country preference:', err);
    }
  }, [user?.id, detectCountry]);

  const getRegionalPrice = useCallback(async (priceTier: string): Promise<number | null> => {
    if (!countryData) return null;
    
    try {
      return await countryDetectionService.getRegionalPricing(countryData.countryCode, priceTier);
    } catch (err) {
      console.error('Error getting regional price:', err);
      return null;
    }
  }, [countryData]);

  const getCountriesByRegion = useCallback((region: string): CountryData[] => {
    return availableCountries.filter(country => country.region === region);
  }, [availableCountries]);

  const loadAvailableCountries = useCallback(async () => {
    try {
      const countries = await countryDetectionService.getAllCountries();
      setAvailableCountries(countries);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  }, []);

  useEffect(() => {
    detectCountry();
    loadAvailableCountries();
  }, [detectCountry, loadAvailableCountries]);

  return {
    countryData,
    isLoading,
    error,
    availableCountries,
    detectCountry,
    setUserCountryPreference,
    getRegionalPrice,
    getCountriesByRegion,
    // Convenience getters
    countryCode: countryData?.countryCode,
    countryName: countryData?.countryName,
    currency: countryData?.currency,
    currencySymbol: countryData?.currencySymbol,
    language: countryData?.language,
    region: countryData?.region,
    timezone: countryData?.timezone,
    confidence: countryData?.confidence,
    detectionMethod: countryData?.detectionMethod
  };
};