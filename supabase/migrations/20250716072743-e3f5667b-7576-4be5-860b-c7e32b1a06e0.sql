-- Regional Pricing Fraud Prevention Schema - Fixed Version
-- Phase 1: Create verification and fraud detection tables

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