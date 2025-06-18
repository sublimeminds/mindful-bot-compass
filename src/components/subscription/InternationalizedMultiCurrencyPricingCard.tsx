
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface PricingPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, string>;
  limits: Record<string, number>;
}

interface InternationalizedMultiCurrencyPricingCardProps {
  plan: PricingPlan;
  billingCycle: 'monthly' | 'yearly';
  isPopular?: boolean;
  onSelect: (plan: PricingPlan) => void;
}

const InternationalizedMultiCurrencyPricingCard = ({ 
  plan, 
  billingCycle, 
  isPopular, 
  onSelect 
}: InternationalizedMultiCurrencyPricingCardProps) => {
  const { t } = useTranslation();
  const { formatPrice, currency } = useCurrency();

  const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
  const monthlyPrice = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
  
  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free': return <Zap className="h-6 w-6" />;
      case 'basic': return <Star className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getYearlyDiscount = () => {
    if (!plan.price_monthly || !plan.price_yearly) return 0;
    const yearlyMonthly = plan.price_yearly / 12;
    const discount = ((plan.price_monthly - yearlyMonthly) / plan.price_monthly) * 100;
    return Math.round(discount);
  };

  return (
    <Card 
      className={`relative transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm ${
        isPopular ? 'ring-2 ring-harmony-500 scale-105' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-harmony-500 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className={`p-3 rounded-full ${
            plan.name === 'Free' ? 'bg-slate-100 text-slate-600' :
            plan.name === 'Basic' ? 'bg-balance-100 text-balance-600' :
            'bg-harmony-100 text-harmony-600'
          }`}>
            {getPlanIcon(plan.name)}
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold text-slate-800">
          {plan.name}
        </CardTitle>
        
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-800">
            {formatPrice(monthlyPrice)}
            <span className="text-lg font-normal text-slate-600">/month</span>
          </div>
          {billingCycle === 'yearly' && plan.price_yearly > 0 && (
            <>
              <div className="text-sm text-slate-500">
                Billed annually ({formatPrice(plan.price_yearly)}/year)
              </div>
              <div className="text-sm text-harmony-600 font-medium">
                Save {getYearlyDiscount()}% with yearly billing
              </div>
            </>
          )}
          <div className="text-xs text-muted-foreground">
            {t('currency.pricesIn', { currency: currency.name })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        <div className="space-y-3">
          {Object.entries(plan.features).slice(0, 5).map(([key, value]) => (
            <div key={key} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-harmony-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-600">{String(value)}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            onClick={() => onSelect(plan)}
            className={`w-full ${
              isPopular 
                ? 'bg-gradient-to-r from-harmony-500 to-flow-600 hover:from-harmony-600 hover:to-flow-700 text-white' 
                : plan.name === 'Basic'
                ? 'bg-gradient-to-r from-balance-500 to-balance-600 hover:from-balance-600 hover:to-balance-700 text-white'
                : 'border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            variant={plan.name === 'Free' ? 'outline' : 'default'}
          >
            {plan.name === 'Free' ? 'Get Started' : `Choose ${plan.name}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternationalizedMultiCurrencyPricingCard;
