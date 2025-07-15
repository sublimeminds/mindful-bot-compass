-- Create country master data table
CREATE TABLE public.countries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code text NOT NULL UNIQUE,
  name text NOT NULL,
  currency_code text NOT NULL,
  currency_symbol text NOT NULL,
  language_code text NOT NULL,
  region text NOT NULL,
  timezone text NOT NULL,
  calling_code text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on countries table
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Create policy for countries (readable by everyone)
CREATE POLICY "Countries are readable by everyone" 
ON public.countries 
FOR SELECT 
USING (is_active = true);

-- Create regional pricing table
CREATE TABLE public.regional_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code text NOT NULL REFERENCES public.countries(country_code),
  price_tier text NOT NULL,
  base_price numeric NOT NULL,
  currency_code text NOT NULL,
  regional_multiplier numeric NOT NULL DEFAULT 1.0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(country_code, price_tier)
);

-- Enable RLS on regional pricing
ALTER TABLE public.regional_pricing ENABLE ROW LEVEL SECURITY;

-- Create policy for regional pricing (readable by everyone)
CREATE POLICY "Regional pricing is readable by everyone" 
ON public.regional_pricing 
FOR SELECT 
USING (is_active = true);

-- Add country detection preferences to profiles (if profiles table exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS detected_country_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_country_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS detection_confidence numeric DEFAULT 0.0;

-- Create user country preferences table for better tracking
CREATE TABLE public.user_country_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  detected_country_code text,
  preferred_country_code text,
  detection_method text,
  detection_confidence numeric DEFAULT 0.0,
  ip_address inet,
  user_agent text,
  browser_language text,
  timezone text,
  is_manual_override boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user country preferences
ALTER TABLE public.user_country_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user country preferences
CREATE POLICY "Users can view their own country preferences" 
ON public.user_country_preferences 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own country preferences" 
ON public.user_country_preferences 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own country preferences" 
ON public.user_country_preferences 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_user_country_preferences_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_country_preferences_updated_at
BEFORE UPDATE ON public.user_country_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_user_country_preferences_updated_at();

-- Insert initial country data
INSERT INTO public.countries (country_code, name, currency_code, currency_symbol, language_code, region, timezone, calling_code) VALUES
('US', 'United States', 'USD', '$', 'en', 'Americas', 'UTC-5', '+1'),
('CA', 'Canada', 'CAD', 'C$', 'en', 'Americas', 'UTC-5', '+1'),
('MX', 'Mexico', 'MXN', '$', 'es', 'Americas', 'UTC-6', '+52'),
('BR', 'Brazil', 'BRL', 'R$', 'pt', 'Americas', 'UTC-3', '+55'),
('GB', 'United Kingdom', 'GBP', '£', 'en', 'Europe', 'UTC+0', '+44'),
('DE', 'Germany', 'EUR', '€', 'de', 'Europe', 'UTC+1', '+49'),
('FR', 'France', 'EUR', '€', 'fr', 'Europe', 'UTC+1', '+33'),
('ES', 'Spain', 'EUR', '€', 'es', 'Europe', 'UTC+1', '+34'),
('IT', 'Italy', 'EUR', '€', 'it', 'Europe', 'UTC+1', '+39'),
('NL', 'Netherlands', 'EUR', '€', 'nl', 'Europe', 'UTC+1', '+31'),
('CH', 'Switzerland', 'CHF', 'CHF', 'de', 'Europe', 'UTC+1', '+41'),
('SE', 'Sweden', 'SEK', 'kr', 'sv', 'Europe', 'UTC+1', '+46'),
('NO', 'Norway', 'NOK', 'kr', 'no', 'Europe', 'UTC+1', '+47'),
('PL', 'Poland', 'PLN', 'zł', 'pl', 'Europe', 'UTC+1', '+48'),
('JP', 'Japan', 'JPY', '¥', 'ja', 'Asia', 'UTC+9', '+81'),
('KR', 'South Korea', 'KRW', '₩', 'ko', 'Asia', 'UTC+9', '+82'),
('CN', 'China', 'CNY', '¥', 'zh', 'Asia', 'UTC+8', '+86'),
('IN', 'India', 'INR', '₹', 'hi', 'Asia', 'UTC+5:30', '+91'),
('ID', 'Indonesia', 'IDR', 'Rp', 'id', 'Asia', 'UTC+7', '+62'),
('SG', 'Singapore', 'SGD', 'S$', 'en', 'Asia', 'UTC+8', '+65'),
('MY', 'Malaysia', 'MYR', 'RM', 'ms', 'Asia', 'UTC+8', '+60'),
('TH', 'Thailand', 'THB', '฿', 'th', 'Asia', 'UTC+7', '+66'),
('AU', 'Australia', 'AUD', 'A$', 'en', 'Oceania', 'UTC+10', '+61'),
('NZ', 'New Zealand', 'NZD', 'NZ$', 'en', 'Oceania', 'UTC+12', '+64'),
('ZA', 'South Africa', 'ZAR', 'R', 'en', 'Africa', 'UTC+2', '+27'),
('SA', 'Saudi Arabia', 'SAR', 'SR', 'ar', 'Middle East', 'UTC+3', '+966'),
('AE', 'United Arab Emirates', 'AED', 'د.إ', 'ar', 'Middle East', 'UTC+4', '+971'),
('EG', 'Egypt', 'EGP', '£', 'ar', 'Middle East', 'UTC+2', '+20'),
('RU', 'Russia', 'RUB', '₽', 'ru', 'Europe', 'UTC+3', '+7');

-- Insert regional pricing data
INSERT INTO public.regional_pricing (country_code, price_tier, base_price, currency_code, regional_multiplier) VALUES
-- Americas pricing
('US', 'free', 0, 'USD', 1.0),
('US', 'premium', 19, 'USD', 1.0),
('US', 'professional', 49, 'USD', 1.0),
('CA', 'free', 0, 'CAD', 1.0),
('CA', 'premium', 25, 'CAD', 1.0),
('CA', 'professional', 65, 'CAD', 1.0),
('MX', 'free', 0, 'MXN', 0.7),
('MX', 'premium', 349, 'MXN', 0.7),
('MX', 'professional', 899, 'MXN', 0.7),
('BR', 'free', 0, 'BRL', 0.7),
('BR', 'premium', 95, 'BRL', 0.7),
('BR', 'professional', 245, 'BRL', 0.7),

-- Europe pricing
('GB', 'free', 0, 'GBP', 1.1),
('GB', 'premium', 15, 'GBP', 1.1),
('GB', 'professional', 39, 'GBP', 1.1),
('DE', 'free', 0, 'EUR', 1.1),
('DE', 'premium', 17, 'EUR', 1.1),
('DE', 'professional', 42, 'EUR', 1.1),
('FR', 'free', 0, 'EUR', 1.1),
('FR', 'premium', 17, 'EUR', 1.1),
('FR', 'professional', 42, 'EUR', 1.1),

-- Asia pricing (reduced for market penetration)
('JP', 'free', 0, 'JPY', 0.8),
('JP', 'premium', 2800, 'JPY', 0.8),
('JP', 'professional', 7200, 'JPY', 0.8),
('IN', 'free', 0, 'INR', 0.6),
('IN', 'premium', 1499, 'INR', 0.6),
('IN', 'professional', 3999, 'INR', 0.6),
('ID', 'free', 0, 'IDR', 0.5),
('ID', 'premium', 299000, 'IDR', 0.5),
('ID', 'professional', 769000, 'IDR', 0.5),
('SG', 'free', 0, 'SGD', 1.0),
('SG', 'premium', 25, 'SGD', 1.0),
('SG', 'professional', 65, 'SGD', 1.0),

-- Oceania pricing
('AU', 'free', 0, 'AUD', 1.05),
('AU', 'premium', 29, 'AUD', 1.05),
('AU', 'professional', 75, 'AUD', 1.05),
('NZ', 'free', 0, 'NZD', 1.05),
('NZ', 'premium', 32, 'NZD', 1.05),
('NZ', 'professional', 82, 'NZD', 1.05);