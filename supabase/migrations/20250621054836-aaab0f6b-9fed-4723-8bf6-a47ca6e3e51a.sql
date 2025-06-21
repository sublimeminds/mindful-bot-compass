
-- Create user_cultural_profiles table
CREATE TABLE public.user_cultural_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  primary_language TEXT NOT NULL DEFAULT 'en',
  cultural_background TEXT,
  family_structure TEXT NOT NULL DEFAULT 'individual' CHECK (family_structure IN ('individual', 'family-centered', 'community-based', 'collective')),
  communication_style TEXT NOT NULL DEFAULT 'direct' CHECK (communication_style IN ('direct', 'indirect', 'high-context', 'low-context')),
  religious_considerations BOOLEAN NOT NULL DEFAULT false,
  religious_details TEXT,
  therapy_approach_preferences TEXT[] NOT NULL DEFAULT '{}',
  cultural_sensitivities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add RLS policies for user_cultural_profiles
ALTER TABLE public.user_cultural_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cultural profiles" 
  ON public.user_cultural_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cultural profiles" 
  ON public.user_cultural_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cultural profiles" 
  ON public.user_cultural_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cultural profiles" 
  ON public.user_cultural_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create cultural_interactions table for tracking
CREATE TABLE public.cultural_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  interaction_type TEXT NOT NULL,
  cultural_context JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for cultural_interactions
ALTER TABLE public.cultural_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cultural interactions" 
  ON public.cultural_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cultural interactions" 
  ON public.cultural_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add preferred_currency column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Create exchange_rates table for real-time currency data
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  provider TEXT NOT NULL DEFAULT 'manual',
  UNIQUE(base_currency, target_currency)
);

-- Insert initial exchange rates (these will be updated by the service)
INSERT INTO public.exchange_rates (base_currency, target_currency, rate) VALUES
('USD', 'EUR', 0.85),
('USD', 'GBP', 0.73),
('USD', 'CAD', 1.25),
('USD', 'AUD', 1.35),
('USD', 'JPY', 110.00),
('USD', 'CNY', 7.20),
('USD', 'INR', 83.00),
('USD', 'KRW', 1300.00),
('USD', 'MXN', 18.50),
('USD', 'BRL', 5.20),
('USD', 'CHF', 0.88),
('USD', 'SEK', 10.50),
('USD', 'NOK', 10.80),
('USD', 'DKK', 6.35),
('USD', 'PLN', 4.20)
ON CONFLICT (base_currency, target_currency) DO NOTHING;

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_cultural_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cultural_profiles_updated_at_trigger
    BEFORE UPDATE ON public.user_cultural_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_cultural_profiles_updated_at();
