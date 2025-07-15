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
      setError('Failed to detect country');
      console.error('Country detection error:', err);
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