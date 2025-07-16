import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { regionalPreferencesService } from '@/services/RegionalPreferencesService';
import { supabase } from '@/integrations/supabase/client';
import type { 
  RegionalPreferences, 
  TaxCalculationResult, 
  CountryBusinessRules, 
  RegionalPricing 
} from '@/services/RegionalPreferencesService';

interface LocationAlert {
  id: string;
  alert_type: string;
  severity: string;
  description: string;
  evidence: any;
  status: string;
  created_at: string;
}

interface TrustInfo {
  trust_level: string;
  confidence_score: number;
  verification_count: number;
  available_discount: number;
}

export const useEnhancedRegionalPreferences = () => {
  const { user } = useAuth();
  const [regionalPreferences, setRegionalPreferences] = useState<RegionalPreferences | null>(null);
  const [trustInfo, setTrustInfo] = useState<TrustInfo | null>(null);
  const [alerts, setAlerts] = useState<LocationAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectRegion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const preferences = await regionalPreferencesService.detectUserRegion(user?.id);
      setRegionalPreferences(preferences);

      // Record behavioral analytics
      if (user?.id && preferences) {
        await recordBehavioralData('region_detection', preferences.countryCode);
      }
    } catch (err) {
      setError('Failed to detect region');
      console.error('Region detection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const loadTrustInfo = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('user_location_confidence')
        .select('trust_level, confidence_score, verification_count')
        .eq('user_id', user.id)
        .single();

      if (data) {
        const trustMultiplier = getTrustMultiplier(data.trust_level);
        setTrustInfo({
          ...data,
          available_discount: Math.round((1 - trustMultiplier) * 60) // Max 60% discount
        });
      }
    } catch (err) {
      console.error('Failed to load trust info:', err);
    }
  }, [user?.id]);

  const loadAlerts = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('regional_pricing_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      setAlerts(data || []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  }, [user?.id]);

  const recordBehavioralData = useCallback(async (eventType: string, countryCode: string) => {
    if (!user?.id) return;

    try {
      const timeZoneOffset = new Date().getTimezoneOffset();
      const userAgent = navigator.userAgent;
      const language = navigator.language;

      await supabase.from('user_behavioral_analytics').insert({
        user_id: user.id,
        event_type: eventType,
        country_claimed: countryCode,
        country_detected: countryCode, // Would be different if using IP detection
        timezone_offset: timeZoneOffset,
        language_preference: language,
        user_agent: userAgent,
        suspicious_patterns: [],
        risk_score: 0.1
      });
    } catch (err) {
      console.error('Failed to record behavioral data:', err);
    }
  }, [user?.id]);

  const setCountryPreference = useCallback(async (countryCode: string) => {
    if (!user?.id) return;
    
    try {
      await regionalPreferencesService.setUserCountryPreference(user.id, countryCode);
      
      // Record verification data
      await regionalPreferencesService.recordVerificationData(
        user.id,
        'manual_selection',
        'country_code',
        countryCode,
        0.7, // Medium confidence for manual selection
        'user_input'
      );

      // Update location confidence
      await regionalPreferencesService.updateLocationConfidence(user.id, countryCode, {
        ipConsistency: 0.5,
        behavioralConsistency: 0.7,
        paymentConsistency: 0.5
      });

      await detectRegion();
      await loadTrustInfo();
    } catch (err) {
      setError('Failed to save country preference');
      console.error('Error setting country preference:', err);
    }
  }, [user?.id, detectRegion, loadTrustInfo]);

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
        customerVATNumber,
        user?.id
      );
    } catch (err) {
      console.error('Error calculating regional pricing:', err);
      return null;
    }
  }, [regionalPreferences?.countryCode, user?.id]);

  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      await supabase
        .from('regional_pricing_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId);
      
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  }, []);

  const getTrustMultiplier = (trustLevel: string): number => {
    const multipliers: Record<string, number> = {
      'new': 0.7, // 30% discount
      'building': 0.5, // 50% discount
      'trusted': 0.4, // 60% discount
      'suspicious': 0.8, // 20% discount
      'blocked': 1.0 // No discount
    };
    return multipliers[trustLevel] || 0.7;
  };

  useEffect(() => {
    detectRegion();
    loadTrustInfo();
    loadAlerts();
  }, [detectRegion, loadTrustInfo, loadAlerts]);

  return {
    // Core data
    regionalPreferences,
    trustInfo,
    alerts,
    isLoading,
    error,
    
    // Actions
    detectRegion,
    setCountryPreference,
    dismissAlert,
    
    // Calculations
    calculateRegionalPricing,
    
    // Convenience getters
    countryCode: regionalPreferences?.countryCode,
    countryName: regionalPreferences?.countryName,
    currency: regionalPreferences?.currency,
    currencySymbol: regionalPreferences?.currencySymbol,
    trustLevel: trustInfo?.trust_level || 'new',
    confidenceScore: trustInfo?.confidence_score || 0,
    availableDiscount: trustInfo?.available_discount || 30,
    hasAlerts: alerts.length > 0,
    
    // Utility methods
    isEligibleForPPP: (countryCode?: string) => {
      const target = countryCode || regionalPreferences?.countryCode;
      if (!target) return false;
      return regionalPreferencesService.isEligibleForPPP(target);
    },
    
    getPPPMultiplier: (countryCode?: string) => {
      const target = countryCode || regionalPreferences?.countryCode;
      if (!target) return 1.0;
      const basePPP = regionalPreferencesService.getPPPMultiplier(target);
      const trustMultiplier = getTrustMultiplier(trustInfo?.trust_level || 'new');
      
      if (basePPP < 1.0) {
        const discountAmount = (1.0 - basePPP) * (1 - trustMultiplier);
        return 1.0 - discountAmount;
      }
      return basePPP;
    }
  };
};