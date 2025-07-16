-- Regional Pricing Fraud Prevention Schema
-- Phase 1: User Verification Tracking

-- Create user verification history table
CREATE TABLE public.user_verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verification_type TEXT NOT NULL,
  data_point TEXT NOT NULL,
  value TEXT NOT NULL,
  confidence_score NUMERIC DEFAULT 0.5,
  detection_method TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create location confidence scores table
CREATE TABLE public.user_location_confidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_country_code TEXT NOT NULL,
  confidence_score NUMERIC NOT NULL DEFAULT 0.5,
  trust_level TEXT NOT NULL DEFAULT 'new' CHECK (trust_level IN ('new', 'building', 'trusted', 'suspicious', 'blocked')),
  verification_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMPTZ,
  ip_consistency_score NUMERIC DEFAULT 0.5,
  behavioral_consistency_score NUMERIC DEFAULT 0.5,
  payment_consistency_score NUMERIC DEFAULT 0.5,
  flags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create behavioral analytics table
CREATE TABLE public.user_behavioral_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT,
  event_type TEXT NOT NULL,
  country_claimed TEXT,
  country_detected TEXT,
  ip_address INET,
  user_agent TEXT,
  timezone_offset INTEGER,
  language_preference TEXT,
  suspicious_patterns JSONB DEFAULT '[]',
  risk_score NUMERIC DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create fraud alerts table
CREATE TABLE public.regional_pricing_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  evidence JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'false_positive')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trust milestones table
CREATE TABLE public.user_trust_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  milestone_type TEXT NOT NULL,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  discount_unlocked NUMERIC,
  requirements_met JSONB NOT NULL,
  notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.user_verification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_location_confidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavioral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_pricing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trust_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User verification history
CREATE POLICY "Users can view their own verification history" 
ON public.user_verification_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create verification records" 
ON public.user_verification_history FOR INSERT 
WITH CHECK (true);

-- Location confidence
CREATE POLICY "Users can view their own confidence scores" 
ON public.user_location_confidence FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage confidence scores" 
ON public.user_location_confidence FOR ALL 
USING (true);

-- Behavioral analytics
CREATE POLICY "System can create behavioral records" 
ON public.user_behavioral_analytics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view behavioral analytics" 
ON public.user_behavioral_analytics FOR SELECT 
USING (is_admin(auth.uid()));

-- Fraud alerts
CREATE POLICY "Users can view their own alerts" 
ON public.regional_pricing_alerts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts" 
ON public.regional_pricing_alerts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage alerts" 
ON public.regional_pricing_alerts FOR ALL 
USING (is_admin(auth.uid()));

-- Trust milestones
CREATE POLICY "Users can view their own milestones" 
ON public.user_trust_milestones FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create milestones" 
ON public.user_trust_milestones FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_verification_history_user_id ON public.user_verification_history(user_id);
CREATE INDEX idx_verification_history_created_at ON public.user_verification_history(created_at);
CREATE INDEX idx_location_confidence_user_id ON public.user_location_confidence(user_id);
CREATE INDEX idx_behavioral_analytics_user_id ON public.user_behavioral_analytics(user_id);
CREATE INDEX idx_behavioral_analytics_created_at ON public.user_behavioral_analytics(created_at);
CREATE INDEX idx_pricing_alerts_user_id ON public.regional_pricing_alerts(user_id);
CREATE INDEX idx_pricing_alerts_status ON public.regional_pricing_alerts(status);
CREATE INDEX idx_trust_milestones_user_id ON public.user_trust_milestones(user_id);

-- Create updated_at trigger for location confidence
CREATE TRIGGER update_location_confidence_updated_at
  BEFORE UPDATE ON public.user_location_confidence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update PPP multipliers to reduce max discount to 60%
-- Adjust the aggressive discounts in regional_pricing table if it exists
-- Create if doesn't exist
CREATE TABLE IF NOT EXISTS public.regional_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  price_tier TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  currency_code TEXT NOT NULL,
  regional_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.regional_pricing ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Regional pricing is viewable by everyone" 
ON public.regional_pricing FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage regional pricing" 
ON public.regional_pricing FOR ALL 
USING (is_admin(auth.uid()));

-- Update PPP multipliers to cap at 60% discount (multiplier minimum 0.4)
-- Insert updated multipliers with better fraud resistance
INSERT INTO public.regional_pricing (country_code, price_tier, base_price, currency_code, regional_multiplier) VALUES
('US', 'standard', 100, 'USD', 1.0),
('GB', 'standard', 100, 'GBP', 0.8),
('CA', 'standard', 100, 'CAD', 0.85),
('AU', 'standard', 100, 'AUD', 0.8),
('DE', 'standard', 100, 'EUR', 0.75),
('FR', 'standard', 100, 'EUR', 0.75),
('JP', 'standard', 100, 'JPY', 0.7),
('IN', 'standard', 100, 'INR', 0.4),
('BR', 'standard', 100, 'BRL', 0.5),
('MX', 'standard', 100, 'MXN', 0.55),
('RU', 'standard', 100, 'RUB', 0.45),
('CN', 'standard', 100, 'CNY', 0.5),
('ZA', 'standard', 100, 'ZAR', 0.5),
('AR', 'standard', 100, 'ARS', 0.45),
('TH', 'standard', 100, 'THB', 0.5),
('PH', 'standard', 100, 'PHP', 0.4),
('VN', 'standard', 100, 'VND', 0.4),
('ID', 'standard', 100, 'IDR', 0.4),
('MY', 'standard', 100, 'MYR', 0.55),
('TR', 'standard', 100, 'TRY', 0.5),
('EG', 'standard', 100, 'EGP', 0.4),
('NG', 'standard', 100, 'NGN', 0.4),
('KE', 'standard', 100, 'KES', 0.4),
('PK', 'standard', 100, 'PKR', 0.4),
('BD', 'standard', 100, 'BDT', 0.4)
ON CONFLICT (country_code) DO UPDATE SET
  regional_multiplier = EXCLUDED.regional_multiplier,
  updated_at = now();