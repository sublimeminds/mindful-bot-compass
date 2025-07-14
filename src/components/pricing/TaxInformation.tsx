import React from 'react';
import { Info, Shield, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TaxInfoProps {
  country: string;
  countryCode: string;
  taxRate: number;
  taxType: string;
  isBusinessCustomer?: boolean;
  hasValidVatNumber?: boolean;
  amount: number;
  currency: string;
}

const TaxInformation: React.FC<TaxInfoProps> = ({
  country,
  countryCode,
  taxRate,
  taxType,
  isBusinessCustomer = false,
  hasValidVatNumber = false,
  amount,
  currency
}) => {
  const isEU = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'].includes(countryCode);
  const isReverseCharge = isEU && isBusinessCustomer && hasValidVatNumber;
  const effectiveTaxRate = isReverseCharge ? 0 : taxRate;
  const taxAmount = amount * effectiveTaxRate;

  return (
    <Card className="bg-slate-50/50 border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Tax Information for {country}
              </span>
              {isEU && (
                <Badge variant="outline" className="text-xs">
                  EU Member
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Tax Type:</span>
                <span className="ml-2 font-medium text-slate-700">
                  {taxType}
                </span>
              </div>
              
              <div>
                <span className="text-slate-500">Rate:</span>
                <span className={`ml-2 font-medium ${isReverseCharge ? 'text-green-600' : 'text-slate-700'}`}>
                  {effectiveTaxRate * 100}%
                  {isReverseCharge && (
                    <span className="text-xs text-green-600 ml-1">(Reverse Charge)</span>
                  )}
                </span>
              </div>

              {taxAmount > 0 && (
                <div>
                  <span className="text-slate-500">Tax Amount:</span>
                  <span className="ml-2 font-medium text-slate-700">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency
                    }).format(taxAmount)}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-500">Total:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                  }).format(amount + taxAmount)}
                </span>
              </div>
            </div>

            {isReverseCharge && (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-green-700">
                  <div className="font-medium mb-1">B2B Reverse Charge Applied</div>
                  <div>
                    As a business customer with a valid VAT number, you'll charge yourself the applicable VAT rate and report it in your VAT return according to your local tax regulations.
                  </div>
                </div>
              </div>
            )}

            {isEU && !isBusinessCustomer && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Building className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <div className="font-medium mb-1">Business Customer?</div>
                  <div>
                    Business customers with valid VAT numbers may be eligible for reverse charge (0% VAT). Contact support to verify your business status.
                  </div>
                </div>
              </div>
            )}

            {countryCode === 'US' && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                US sales tax may apply based on your state and local regulations.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxInformation;