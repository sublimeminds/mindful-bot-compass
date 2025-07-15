-- Create tax_rates table for tax calculations
CREATE TABLE IF NOT EXISTS public.tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  state_code TEXT,
  tax_type TEXT NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT now(),
  effective_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on tax_rates
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read active tax rates
CREATE POLICY "Anyone can read active tax rates" ON public.tax_rates
  FOR SELECT USING (is_active = true);

-- Policy for admins to manage tax rates
CREATE POLICY "Admins can manage tax rates" ON public.tax_rates
  FOR ALL USING (is_admin(auth.uid()));

-- Insert initial tax rates for EU countries and common jurisdictions
INSERT INTO public.tax_rates (country_code, tax_type, rate, description) VALUES
  ('US', 'sales_tax', 0.0000, 'No federal sales tax'),
  ('CA', 'sales_tax', 0.1300, 'HST/GST + PST average'),
  ('GB', 'vat', 0.2000, 'UK VAT'),
  ('DE', 'vat', 0.1900, 'German VAT'),
  ('FR', 'vat', 0.2000, 'French VAT'),
  ('IT', 'vat', 0.2200, 'Italian VAT'),
  ('ES', 'vat', 0.2100, 'Spanish VAT'),
  ('NL', 'vat', 0.2100, 'Dutch VAT'),
  ('BE', 'vat', 0.2100, 'Belgian VAT'),
  ('AT', 'vat', 0.2000, 'Austrian VAT'),
  ('DK', 'vat', 0.2500, 'Danish VAT'),
  ('SE', 'vat', 0.2500, 'Swedish VAT'),
  ('FI', 'vat', 0.2400, 'Finnish VAT'),
  ('NO', 'vat', 0.2500, 'Norwegian VAT'),
  ('CH', 'vat', 0.0770, 'Swiss VAT'),
  ('AU', 'gst', 0.1000, 'Australian GST'),
  ('NZ', 'gst', 0.1500, 'New Zealand GST'),
  ('JP', 'consumption_tax', 0.1000, 'Japanese Consumption Tax'),
  ('SG', 'gst', 0.0800, 'Singapore GST'),
  ('IN', 'gst', 0.1800, 'Indian GST (average)'),
  ('BR', 'tax', 0.1700, 'Brazilian tax (average)'),
  ('MX', 'iva', 0.1600, 'Mexican IVA');

-- Create country_business_rules table for compliance and business logic
CREATE TABLE IF NOT EXISTS public.country_business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  supports_tax_calculation BOOLEAN DEFAULT true,
  requires_vat BOOLEAN DEFAULT false,
  has_data_privacy_requirements BOOLEAN DEFAULT false,
  supported_payment_methods TEXT[] DEFAULT ARRAY['card', 'bank_transfer'],
  compliance_requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  localized_content BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on country_business_rules
ALTER TABLE public.country_business_rules ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read country business rules
CREATE POLICY "Anyone can read country business rules" ON public.country_business_rules
  FOR SELECT USING (true);

-- Policy for admins to manage country business rules
CREATE POLICY "Admins can manage country business rules" ON public.country_business_rules
  FOR ALL USING (is_admin(auth.uid()));

-- Insert business rules for key countries
INSERT INTO public.country_business_rules (
  country_code, supports_tax_calculation, requires_vat, has_data_privacy_requirements, 
  supported_payment_methods, compliance_requirements, localized_content
) VALUES
  ('US', true, false, true, ARRAY['card', 'bank_transfer', 'paypal'], ARRAY['CCPA'], true),
  ('GB', true, true, true, ARRAY['card', 'bank_transfer', 'paypal'], ARRAY['GDPR', 'UK_DPA'], true),
  ('DE', true, true, true, ARRAY['card', 'sepa', 'paypal'], ARRAY['GDPR', 'DSGVO'], true),
  ('FR', true, true, true, ARRAY['card', 'sepa', 'paypal'], ARRAY['GDPR'], true),
  ('CA', true, false, true, ARRAY['card', 'bank_transfer', 'paypal'], ARRAY['PIPEDA'], true),
  ('AU', true, false, true, ARRAY['card', 'bank_transfer', 'paypal'], ARRAY['Privacy_Act'], true),
  ('JP', true, false, true, ARRAY['card', 'bank_transfer'], ARRAY['APPI'], true),
  ('SG', true, false, false, ARRAY['card', 'bank_transfer'], ARRAY[], false),
  ('IN', true, false, false, ARRAY['card', 'upi', 'bank_transfer'], ARRAY[], false),
  ('BR', true, false, true, ARRAY['card', 'pix', 'bank_transfer'], ARRAY['LGPD'], false);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tax_rates_country_active ON public.tax_rates(country_code, is_active);
CREATE INDEX IF NOT EXISTS idx_tax_rates_effective_dates ON public.tax_rates(effective_from, effective_until);
CREATE INDEX IF NOT EXISTS idx_country_business_rules_country ON public.country_business_rules(country_code);