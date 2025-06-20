
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RegionalPricing {
  currency: string;
  symbol: string;
  free: string;
  premium: string;
  professional: string;
  region: string;
  country: string;
}

const RegionalPricingDisplay = () => {
  const { t, i18n } = useTranslation();
  const [regionalPricing, setRegionalPricing] = useState<RegionalPricing | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  const pricingByRegion: Record<string, RegionalPricing> = {
    'US': { currency: 'USD', symbol: '$', free: '0', premium: '19', professional: '49', region: 'North America', country: 'United States' },
    'GB': { currency: 'GBP', symbol: '£', free: '0', premium: '15', professional: '39', region: 'Europe', country: 'United Kingdom' },
    'EU': { currency: 'EUR', symbol: '€', free: '0', premium: '17', professional: '42', region: 'Europe', country: 'European Union' },
    'CA': { currency: 'CAD', symbol: 'C$', free: '0', premium: '25', professional: '65', region: 'North America', country: 'Canada' },
    'AU': { currency: 'AUD', symbol: 'A$', free: '0', premium: '29', professional: '75', region: 'Asia Pacific', country: 'Australia' },
    'IN': { currency: 'INR', symbol: '₹', free: '0', premium: '1499', professional: '3999', region: 'Asia', country: 'India' },
    'BR': { currency: 'BRL', symbol: 'R$', free: '0', premium: '95', professional: '245', region: 'South America', country: 'Brazil' },
    'MX': { currency: 'MXN', symbol: '$', free: '0', premium: '349', professional: '899', region: 'North America', country: 'Mexico' },
    'JP': { currency: 'JPY', symbol: '¥', free: '0', premium: '2800', professional: '7200', region: 'Asia', country: 'Japan' },
  };

  useEffect(() => {
    detectUserRegion();
  }, []);

  const detectUserRegion = async () => {
    setIsDetecting(true);
    try {
      // Try to detect region using multiple methods
      const region = await detectRegionFromIP();
      
      if (region && pricingByRegion[region]) {
        setRegionalPricing(pricingByRegion[region]);
      } else {
        // Fallback to US pricing
        setRegionalPricing(pricingByRegion['US']);
      }
    } catch (error) {
      console.error('Region detection failed:', error);
      // Fallback to US pricing
      setRegionalPricing(pricingByRegion['US']);
    } finally {
      setIsDetecting(false);
    }
  };

  const detectRegionFromIP = async (): Promise<string | null> => {
    try {
      // Try multiple IP geolocation services
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code) {
        console.log('Detected country:', data.country_code, data.country_name);
        return data.country_code;
      }
    } catch (error) {
      console.log('IP detection failed, trying fallback...');
    }

    try {
      // Fallback: try to detect from browser language
      const browserLang = navigator.language || navigator.languages[0];
      const countryCode = browserLang.split('-')[1];
      
      if (countryCode && pricingByRegion[countryCode.toUpperCase()]) {
        return countryCode.toUpperCase();
      }
    } catch (error) {
      console.log('Browser language detection failed');
    }

    return null;
  };

  if (isDetecting) {
    return (
      <div className="flex items-center space-x-2 text-sm text-therapy-600">
        <Globe className="h-4 w-4 animate-spin" />
        <span>Detecting your region...</span>
      </div>
    );
  }

  if (!regionalPricing) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-therapy-500" />
        <span className="text-therapy-600">
          {regionalPricing.country}
        </span>
      </div>
      <Badge variant="outline" className="text-therapy-700">
        {t('currency.pricesIn', { currency: regionalPricing.currency })}
      </Badge>
    </div>
  );
};

export default RegionalPricingDisplay;
