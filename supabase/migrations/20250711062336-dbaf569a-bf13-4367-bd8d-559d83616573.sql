-- GDPR and Compliance System Database Schema

-- Data export requests table
CREATE TABLE public.data_export_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'full_export',
  status TEXT NOT NULL DEFAULT 'pending',
  export_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  file_size_bytes BIGINT,
  format TEXT NOT NULL DEFAULT 'json'
);

-- User consent management
CREATE TABLE public.user_consent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data deletion requests
CREATE TABLE public.data_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  deletion_type TEXT NOT NULL DEFAULT 'full_account',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  retention_period_days INTEGER DEFAULT 30
);

-- Compliance metrics
CREATE TABLE public.compliance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  compliance_standard TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Privacy preferences (enhanced)
CREATE TABLE public.privacy_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  analytics_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  third_party_sharing BOOLEAN DEFAULT false,
  data_retention_period TEXT DEFAULT '2_years',
  communication_preferences JSONB DEFAULT '{}'::jsonb,
  cookie_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security incident logs
CREATE TABLE public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL,
  affected_users_count INTEGER DEFAULT 0,
  detection_method TEXT,
  status TEXT NOT NULL DEFAULT 'detected',
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  response_actions JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for data export requests
CREATE POLICY "Users can view their own export requests" 
ON public.data_export_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own export requests" 
ON public.data_export_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user consent
CREATE POLICY "Users can manage their own consent" 
ON public.user_consent 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for data deletion requests
CREATE POLICY "Users can view their own deletion requests" 
ON public.data_deletion_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deletion requests" 
ON public.data_deletion_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for privacy preferences
CREATE POLICY "Users can manage their own privacy preferences" 
ON public.privacy_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for compliance metrics (admin only)
CREATE POLICY "Admins can view compliance metrics" 
ON public.compliance_metrics 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "System can create compliance metrics" 
ON public.compliance_metrics 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for security incidents (admin only)
CREATE POLICY "Admins can manage security incidents" 
ON public.security_incidents 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_data_export_requests_user_id ON public.data_export_requests(user_id);
CREATE INDEX idx_user_consent_user_id ON public.user_consent(user_id);
CREATE INDEX idx_data_deletion_requests_user_id ON public.data_deletion_requests(user_id);
CREATE INDEX idx_privacy_preferences_user_id ON public.privacy_preferences(user_id);
CREATE INDEX idx_compliance_metrics_type_date ON public.compliance_metrics(metric_type, recorded_at);
CREATE INDEX idx_security_incidents_severity_status ON public.security_incidents(severity, status);

-- Update triggers
CREATE TRIGGER update_user_consent_updated_at
BEFORE UPDATE ON public.user_consent
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_privacy_preferences_updated_at
BEFORE UPDATE ON public.privacy_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- GDPR compliance functions
CREATE OR REPLACE FUNCTION public.request_data_export(user_id_param UUID, export_type TEXT DEFAULT 'full_export')
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id UUID;
BEGIN
  INSERT INTO public.data_export_requests (user_id, request_type, status)
  VALUES (user_id_param, export_type, 'pending')
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.request_data_deletion(user_id_param UUID, deletion_type TEXT DEFAULT 'full_account', reason_text TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id UUID;
BEGIN
  INSERT INTO public.data_deletion_requests (user_id, deletion_type, reason, scheduled_for)
  VALUES (user_id_param, deletion_type, reason_text, now() + INTERVAL '30 days')
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_consent(user_id_param UUID, consent_type_param TEXT, granted_param BOOLEAN, user_ip INET DEFAULT NULL, user_agent_param TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_consent (user_id, consent_type, granted, granted_at, ip_address, user_agent)
  VALUES (
    user_id_param, 
    consent_type_param, 
    granted_param, 
    CASE WHEN granted_param THEN now() ELSE NULL END,
    user_ip,
    user_agent_param
  )
  ON CONFLICT (user_id, consent_type) 
  DO UPDATE SET 
    granted = granted_param,
    granted_at = CASE WHEN granted_param THEN now() ELSE user_consent.granted_at END,
    withdrawn_at = CASE WHEN NOT granted_param THEN now() ELSE NULL END,
    updated_at = now();
END;
$$;