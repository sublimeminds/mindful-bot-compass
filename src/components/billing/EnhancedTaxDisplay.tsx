import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';
import type { TaxCalculationResult } from '@/services/RegionalPreferencesService';

interface EnhancedTaxDisplayProps {
  taxInfo: TaxCalculationResult;
  amount: number;
  currency: string;
  isBusinessCustomer?: boolean;
  customerVATNumber?: string;
  className?: string;
}

const EnhancedTaxDisplay = ({ 
  taxInfo, 
  amount, 
  currency, 
  isBusinessCustomer = false,
  customerVATNumber,
  className = "" 
}: EnhancedTaxDisplayProps) => {
  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const getTaxTypeDisplay = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vat':
        return 'VAT';
      case 'gst':
        return 'GST';
      case 'sales_tax':
        return 'Sales Tax';
      case 'consumption_tax':
        return 'Consumption Tax';
      case 'iva':
        return 'IVA';
      default:
        return type.toUpperCase();
    }
  };

  const getTaxExplanation = () => {
    if (taxInfo.isReversed) {
      return "VAT will be charged by your local tax authority using the reverse charge mechanism.";
    }
    
    if (taxInfo.isEU && isBusinessCustomer && !customerVATNumber) {
      return "As an EU business customer, you may be eligible for reverse charge. Please provide your VAT number.";
    }
    
    if (taxInfo.rate === 0) {
      return "No tax applies to this transaction.";
    }
    
    return `${getTaxTypeDisplay(taxInfo.type)} will be added to your total.`;
  };

  const totalWithTax = amount + taxInfo.amount;

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="border-therapy-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Tax Calculation */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Subtotal</span>
              <span className="text-sm text-slate-600">{formatCurrency(amount)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">
                  {getTaxTypeDisplay(taxInfo.type)}
                </span>
                {taxInfo.rate > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {(taxInfo.rate * 100).toFixed(1)}%
                  </Badge>
                )}
                {taxInfo.isEU && (
                  <Badge variant="secondary" className="text-xs">
                    EU
                  </Badge>
                )}
              </div>
              <span className="text-sm text-slate-600">
                {taxInfo.isReversed ? 'Reverse Charge' : formatCurrency(taxInfo.amount)}
              </span>
            </div>

            <div className="border-t border-therapy-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(taxInfo.isReversed ? amount : totalWithTax)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information Alert */}
      <Alert className={`${
        taxInfo.isReversed 
          ? 'border-amber-200 bg-amber-50' 
          : taxInfo.rate === 0 
            ? 'border-green-200 bg-green-50'
            : 'border-blue-200 bg-blue-50'
      }`}>
        <div className="flex items-start gap-2">
          {taxInfo.isReversed ? (
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          ) : taxInfo.rate === 0 ? (
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <AlertDescription className="text-sm">
              <strong className="font-medium">
                {taxInfo.country} Tax Information:
              </strong>{' '}
              {getTaxExplanation()}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Business Customer Information */}
      {isBusinessCustomer && (
        <Alert className="border-purple-200 bg-purple-50">
          <Building2 className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-sm">
            <strong className="font-medium">Business Customer:</strong>{' '}
            {customerVATNumber ? (
              <>
                VAT Number: {customerVATNumber}
                {taxInfo.isEU && taxInfo.isReversed && (
                  <span className="text-purple-700 font-medium">
                    {' '}• Reverse charge applies
                  </span>
                )}
              </>
            ) : (
              'Please provide your VAT number for potential tax benefits.'
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Country-specific notes */}
      {taxInfo.countryCode === 'CH' && (
        <Alert className="border-slate-200 bg-slate-50">
          <Info className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-sm">
            Swiss VAT rate may vary depending on the type of service. The displayed rate is indicative.
          </AlertDescription>
        </Alert>
      )}

      {taxInfo.countryCode === 'US' && (
        <Alert className="border-slate-200 bg-slate-50">
          <Info className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-sm">
            US sales tax rates vary by state and locality. The exact rate will be calculated at checkout.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedTaxDisplay;