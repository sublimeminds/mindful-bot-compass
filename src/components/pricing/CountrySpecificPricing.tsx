import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Check, TrendingDown, Globe } from 'lucide-react';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { enhancedCurrencyService } from '@/services/enhancedCurrencyService';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PricingTier {
  id: string;
  name: string;
  features: string[];
  popular?: boolean;
}

interface CountrySpecificPricingProps {
  tiers: PricingTier[];
  className?: string;
  onPlanSelect?: (tierId: string, price: number, currency: string) => void;
}

const CountrySpecificPricing = ({ 
  tiers, 
  className,
  onPlanSelect 
}: CountrySpecificPricingProps) => {
  const { t } = useTranslation();
  const { countryData, isLoading: countryLoading } = useCountryDetection();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showRegionalDiscount, setShowRegionalDiscount] = useState(false);

  useEffect(() => {
    loadPrices();
  }, [countryData]);

  const loadPrices = async () => {
    if (!countryData) return;
    
    setLoading(true);
    try {
      const priceData: Record<string, number> = {};
      
      for (const tier of tiers) {
        // Try to get country-specific pricing first
        const countryPrice = await enhancedCurrencyService.getCountrySpecificPricing(
          countryData.countryCode, 
          tier.id
        );
        
        if (countryPrice !== null) {
          priceData[tier.id] = countryPrice;
        } else {
          // Fallback to regional pricing
          const basePrice = getBasePriceForTier(tier.id);
          const regionalPrice = await enhancedCurrencyService.getRegionalPricing(
            basePrice, 
            countryData.currency, 
            countryData.region
          );
          priceData[tier.id] = regionalPrice;
        }
      }
      
      setPrices(priceData);
      
      // Check if regional discount applies
      const hasDiscount = ['Asia', 'Africa', 'Middle East'].includes(countryData.region);
      setShowRegionalDiscount(hasDiscount);
      
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBasePriceForTier = (tierId: string): number => {
    const basePrices: Record<string, number> = {
      'free': 0,
      'premium': 19,
      'professional': 49,
      'enterprise': 99
    };
    return basePrices[tierId] || 19;
  };

  const formatPrice = (amount: number) => {
    if (!countryData) return `$${amount}`;
    return enhancedCurrencyService.formatCurrency(amount, countryData.currency);
  };

  const getDiscountPercentage = () => {
    if (!countryData) return 0;
    
    const discountMap: Record<string, number> = {
      'Asia': 30,
      'Africa': 40,
      'Middle East': 20
    };
    
    return discountMap[countryData.region] || 0;
  };

  if (countryLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          {t('pricing.loadingCountrySpecific')}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Regional Discount Banner */}
      {showRegionalDiscount && countryData && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-5 w-5 text-success" />
            <div>
              <div className="font-medium text-success">
                {t('pricing.regionalDiscount', { region: countryData.region })}
              </div>
              <div className="text-sm text-success/80">
                {t('pricing.discountMessage', { 
                  percentage: getDiscountPercentage(),
                  currency: countryData.currency 
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Country Information */}
      {countryData && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {t('pricing.showingPricesFor')}
            </span>
            <Badge variant="outline">
              {countryData.countryName} ({countryData.currency})
            </Badge>
          </div>
          
          <div className="text-muted-foreground">
            {t('pricing.confidenceLevel', { 
              confidence: Math.round(countryData.confidence * 100) 
            })}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const price = prices[tier.id] || 0;
          const basePrice = getBasePriceForTier(tier.id);
          const hasDiscount = price < basePrice && basePrice > 0;
          
          return (
            <Card 
              key={tier.id} 
              className={cn(
                "relative",
                tier.popular && "ring-2 ring-primary shadow-lg"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {t('pricing.mostPopular')}
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t(`pricing.${tier.id}.name`)}
                  {hasDiscount && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(((basePrice - price) / basePrice) * 100)}% {t('common.off')}
                    </Badge>
                  )}
                </CardTitle>
                
                <CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold">
                        {formatPrice(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-muted-foreground">
                          / {t('common.month')}
                        </span>
                      )}
                    </div>
                    
                    {hasDiscount && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="line-through text-muted-foreground">
                          {formatPrice(basePrice)}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          {t('pricing.save')} {formatPrice(basePrice - price)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{t(`pricing.${tier.id}.features.${index}`)}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => onPlanSelect?.(tier.id, price, countryData?.currency || 'USD')}
                >
                  {price === 0 ? t('common.startFree') : t('common.subscribe')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Disclaimer */}
      <div className="text-center text-sm text-muted-foreground">
        {t('pricing.disclaimer')}
      </div>
    </div>
  );
};

export default CountrySpecificPricing;