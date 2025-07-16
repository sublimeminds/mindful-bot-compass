import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Globe, Info, Percent } from 'lucide-react';
import { useEnhancedRegionalPreferences } from '@/hooks/useEnhancedRegionalPreferences';
import EnhancedTaxDisplay from '@/components/billing/EnhancedTaxDisplay';
import UnifiedRegionalSelector from '@/components/regional/UnifiedRegionalSelector';
import FraudPreventionNotices from '@/components/regional/FraudPreventionNotices';
import type { RegionalPricing, TaxCalculationResult } from '@/services/RegionalPreferencesService';

interface RegionalPricingContainerProps {
  plans: Array<{
    id: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    popular?: boolean;
  }>;
  billingCycle: 'monthly' | 'yearly';
  onPlanSelect: (planId: string) => void;
  isBusinessCustomer?: boolean;
  customerVATNumber?: string;
  className?: string;
}

const RegionalPricingContainer = ({
  plans,
  billingCycle,
  onPlanSelect,
  isBusinessCustomer = false,
  customerVATNumber,
  className = ""
}: RegionalPricingContainerProps) => {
  const [enablePPP, setEnablePPP] = useState(true);
  const [regionalPricingData, setRegionalPricingData] = useState<Record<string, RegionalPricing>>({});
  const [loading, setLoading] = useState(true);

  const {
    regionalPreferences,
    trustInfo,
    alerts,
    calculateRegionalPricing,
    countryCode,
    countryName,
    currency,
    currencySymbol,
    trustLevel,
    confidenceScore,
    availableDiscount,
    hasAlerts,
    isEligibleForPPP,
    getPPPMultiplier,
    dismissAlert
  } = useEnhancedRegionalPreferences();

  // Helper function for formatting prices
  const formatPrice = (amount: number, currency?: string): string => {
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
      return `${targetSymbol}${amount.toFixed(2)}`;
    }
  };

  // Helper function for EU country check
  const isEUCountry = (countryCode?: string) => {
    const target = countryCode || regionalPreferences?.countryCode;
    if (!target) return false;
    const euCountries = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
    return euCountries.includes(target.toUpperCase());
  };

  useEffect(() => {
    const calculatePricing = async () => {
      if (!regionalPreferences) return;

      setLoading(true);
      const pricingData: Record<string, RegionalPricing> = {};

      for (const plan of plans) {
        const basePrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
        const pricing = await calculateRegionalPricing(
          basePrice,
          regionalPreferences.countryCode,
          enablePPP,
          isBusinessCustomer,
          customerVATNumber
        );
        
        if (pricing) {
          pricingData[plan.id] = pricing;
        }
      }

      setRegionalPricingData(pricingData);
      setLoading(false);
    };

    calculatePricing();
  }, [
    plans,
    billingCycle,
    regionalPreferences,
    enablePPP,
    isBusinessCustomer,
    customerVATNumber,
    calculateRegionalPricing
  ]);

  const getDisplayPrice = (planId: string): string => {
    const pricing = regionalPricingData[planId];
    if (!pricing) return '$0.00';
    
    return formatPrice(pricing.convertedPrice, pricing.currency);
  };

  const getTaxInfo = (planId: string): TaxCalculationResult | null => {
    const pricing = regionalPricingData[planId];
    return pricing?.taxInfo || null;
  };

  const getSavingsInfo = (planId: string) => {
    const pricing = regionalPricingData[planId];
    if (!pricing) return null;

    const pppSavings = pricing.purchasingPowerMultiplier < 1 
      ? Math.round((1 - pricing.purchasingPowerMultiplier) * 100)
      : 0;

    return { pppSavings };
  };

  if (loading || !regionalPreferences) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-therapy-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading regional pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Regional Settings Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-therapy-50 rounded-lg border border-therapy-200">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-therapy-600" />
          <div>
            <h3 className="font-semibold text-slate-900">
              Pricing for {regionalPreferences.countryName}
            </h3>
            <p className="text-sm text-slate-600">
              {regionalPreferences.currency} • {isEUCountry() ? 'EU VAT applies' : 'Local taxes may apply'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEligibleForPPP() && (
            <div className="flex items-center gap-2">
              <Switch
                checked={enablePPP}
                onCheckedChange={setEnablePPP}
                id="ppp-toggle"
              />
              <label htmlFor="ppp-toggle" className="text-sm font-medium text-slate-700">
                PPP Pricing
              </label>
            </div>
          )}
          
          <UnifiedRegionalSelector showAdvanced />
        </div>
      </div>

      {/* Enhanced Fraud Prevention Notices */}
      {isEligibleForPPP() && enablePPP && (
        <div className="mb-6">
          <FraudPreventionNotices
            trustLevel={trustLevel}
            confidenceScore={confidenceScore}
            availableDiscount={availableDiscount}
            alerts={alerts}
            onDismissAlert={dismissAlert}
          />
        </div>
      )}

      {/* Business Customer Alert */}
      {isBusinessCustomer && isEUCountry() && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            <strong className="font-medium text-blue-800">EU Business Customer:</strong>{' '}
            {customerVATNumber 
              ? `VAT reverse charge may apply (VAT ID: ${customerVATNumber})`
              : 'Provide your VAT number for potential reverse charge benefits.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const pricing = regionalPricingData[plan.id];
          const taxInfo = getTaxInfo(plan.id);
          const savings = getSavingsInfo(plan.id);

          return (
            <Card 
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'ring-2 ring-therapy-400 shadow-therapy-500/20 scale-105' 
                  : 'hover:shadow-therapy-500/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-therapy-500 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-slate-900">
                    {getDisplayPrice(plan.id)}
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    per {billingCycle === 'monthly' ? 'month' : 'month (billed yearly)'}
                  </div>

                  {savings?.pppSavings && savings.pppSavings > 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Percent className="h-3 w-3 mr-1" />
                      {savings.pppSavings}% PPP discount
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-therapy-500 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Tax Information */}
                {taxInfo && taxInfo.rate > 0 && (
                  <EnhancedTaxDisplay
                    taxInfo={taxInfo}
                    amount={pricing?.convertedPrice || 0}
                    currency={pricing?.currency || 'USD'}
                    isBusinessCustomer={isBusinessCustomer}
                    customerVATNumber={customerVATNumber}
                  />
                )}

                {/* Select Button */}
                <Button
                  onClick={() => onPlanSelect(plan.id)}
                  className={`w-full font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white'
                      : 'bg-slate-600 hover:bg-slate-700 text-white'
                  }`}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RegionalPricingContainer;