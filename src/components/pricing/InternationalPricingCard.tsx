
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useEnhancedCurrency } from '@/hooks/useEnhancedCurrency';
import { useTranslation } from 'react-i18next';

interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  yearlyBasePrice: number;
  isPopular?: boolean;
  features: string[];
}

interface InternationalPricingCardProps {
  plan: PricingPlan;
  isYearly?: boolean;
  onSelect: (planId: string) => void;
}

const InternationalPricingCard = ({ plan, isYearly = false, onSelect }: InternationalPricingCardProps) => {
  const { t } = useTranslation();
  const { formatPrice, userLocation, getRegionalPrice } = useEnhancedCurrency();
  const [regionalPrice, setRegionalPrice] = useState<number | null>(null);

  useEffect(() => {
    const calculateRegionalPrice = async () => {
      if (userLocation) {
        const basePrice = isYearly ? plan.yearlyBasePrice : plan.basePrice;
        const adjustedPrice = await getRegionalPrice(basePrice);
        setRegionalPrice(adjustedPrice);
      }
    };

    calculateRegionalPrice();
  }, [plan, isYearly, userLocation, getRegionalPrice]);

  const displayPrice = regionalPrice !== null ? regionalPrice : (isYearly ? plan.yearlyBasePrice : plan.basePrice);
  const formattedPrice = formatPrice(displayPrice);

  return (
    <Card className={`relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground flex items-center space-x-1 px-3 py-1">
            <Star className="h-3 w-3" />
            <span>Most Popular</span>
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">
          {t(`pricing.${plan.name.toLowerCase()}`)}
        </CardTitle>
        <CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold text-foreground">
              {formattedPrice}
            </span>
            <span className="text-muted-foreground ml-1">
              /{t(isYearly ? 'pricing.perYear' : 'pricing.perMonth')}
            </span>
          </div>
          
          {/* Regional Pricing Indicator */}
          {userLocation && regionalPrice !== null && (
            <div className="text-xs text-muted-foreground mt-1">
              Regional pricing for {userLocation.country}
            </div>
          )}
          
          {/* Savings indicator for yearly */}
          {isYearly && (
            <div className="text-xs text-green-600 mt-1">
              Save {Math.round(((plan.basePrice * 12 - plan.yearlyBasePrice) / (plan.basePrice * 12)) * 100)}%
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-foreground">
              {t(`pricing.features.${feature}`)}
            </span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onSelect(plan.id)}
          className={`w-full ${plan.isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
          variant={plan.isPopular ? 'default' : 'outline'}
        >
          {plan.basePrice === 0 ? t('pricing.startTrial') : t('pricing.choosePlan')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InternationalPricingCard;
