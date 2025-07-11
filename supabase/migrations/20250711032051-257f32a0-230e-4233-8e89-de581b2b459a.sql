-- Add comprehensive billing and invoice system with VAT support

-- Create invoices table for detailed billing records
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  stripe_invoice_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, open, paid, void, uncollectible
  amount_subtotal DECIMAL(10,2) NOT NULL,
  amount_tax DECIMAL(10,2) DEFAULT 0,
  amount_total DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  tax_rate DECIMAL(5,4) DEFAULT 0, -- e.g., 0.2100 for 21% VAT
  tax_country TEXT,
  tax_type TEXT, -- vat, sales_tax, gst, etc.
  billing_address JSONB,
  line_items JSONB NOT NULL DEFAULT '[]',
  payment_due_date DATE,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  voided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- card, bank_account, sepa_debit, etc.
  is_default BOOLEAN DEFAULT FALSE,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  bank_account_last4 TEXT,
  bank_account_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create billing addresses table
CREATE TABLE public.billing_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  tax_id TEXT, -- VAT number, SSN, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription change history table
CREATE TABLE public.subscription_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL, -- upgrade, downgrade, pause, resume, cancel
  from_plan_id UUID,
  to_plan_id UUID,
  proration_amount DECIMAL(10,2),
  effective_date TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create failed payments table for dunning management
CREATE TABLE public.failed_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tax rates table for different regions
CREATE TABLE public.tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  state_code TEXT,
  tax_type TEXT NOT NULL, -- vat, sales_tax, gst
  rate DECIMAL(5,4) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  effective_from DATE NOT NULL,
  effective_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage invoices" ON public.invoices
  FOR ALL USING (true);

-- Create RLS policies for payment methods
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for billing addresses
CREATE POLICY "Users can manage their own billing addresses" ON public.billing_addresses
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for subscription changes
CREATE POLICY "Users can view their own subscription changes" ON public.subscription_changes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create subscription changes" ON public.subscription_changes
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for failed payments
CREATE POLICY "Users can view their own failed payments" ON public.failed_payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage failed payments" ON public.failed_payments
  FOR ALL USING (true);

-- Create RLS policies for tax rates
CREATE POLICY "Anyone can view active tax rates" ON public.tax_rates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tax rates" ON public.tax_rates
  FOR ALL USING (is_admin(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_addresses_updated_at
  BEFORE UPDATE ON public.billing_addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_failed_payments_updated_at
  BEFORE UPDATE ON public.failed_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.payment_methods 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_default_payment_method
  AFTER INSERT OR UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment_method();

-- Create function to ensure only one default billing address per user
CREATE OR REPLACE FUNCTION ensure_single_default_billing_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.billing_addresses 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_default_billing_address
  AFTER INSERT OR UPDATE ON public.billing_addresses
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_billing_address();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  invoice_num TEXT;
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(RIGHT(invoice_number, 6) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_part || '-%';
  
  invoice_num := 'INV-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Insert some common tax rates
INSERT INTO public.tax_rates (country_code, tax_type, rate, description, effective_from) VALUES
('US', 'sales_tax', 0.0875, 'New York Sales Tax', '2024-01-01'),
('GB', 'vat', 0.2000, 'UK VAT Standard Rate', '2024-01-01'),
('DE', 'vat', 0.1900, 'Germany VAT Standard Rate', '2024-01-01'),
('FR', 'vat', 0.2000, 'France VAT Standard Rate', '2024-01-01'),
('NL', 'vat', 0.2100, 'Netherlands VAT Standard Rate', '2024-01-01'),
('ES', 'vat', 0.2100, 'Spain VAT Standard Rate', '2024-01-01'),
('IT', 'vat', 0.2200, 'Italy VAT Standard Rate', '2024-01-01'),
('CA', 'gst', 0.0500, 'Canada GST', '2024-01-01'),
('AU', 'gst', 0.1000, 'Australia GST', '2024-01-01');