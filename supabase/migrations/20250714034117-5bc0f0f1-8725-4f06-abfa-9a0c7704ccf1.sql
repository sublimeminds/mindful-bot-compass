-- Email PIN Authentication System
CREATE TABLE public.email_pin_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Device Fingerprinting and Management
CREATE TABLE public.user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT, -- mobile, desktop, tablet
  os TEXT,
  browser TEXT,
  ip_address INET,
  location_data JSONB DEFAULT '{}',
  is_trusted BOOLEAN DEFAULT false,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, device_fingerprint)
);

-- Enhanced Session Tracking
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  device_id UUID REFERENCES public.user_devices(id),
  ip_address INET,
  location_data JSONB DEFAULT '{}',
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  terminated_at TIMESTAMP WITH TIME ZONE NULL,
  termination_reason TEXT,
  is_active BOOLEAN DEFAULT true,
  session_metadata JSONB DEFAULT '{}'
);

-- Security Incidents and Alerts
CREATE TABLE public.security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  incident_type TEXT NOT NULL, -- account_sharing, suspicious_login, device_mismatch, etc.
  severity TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  description TEXT NOT NULL,
  detection_method TEXT, -- automated, manual, user_report
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'detected', -- detected, investigating, resolved, false_positive
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE NULL,
  affected_users_count INTEGER DEFAULT 1,
  response_actions JSONB DEFAULT '[]'
);

-- Account Sharing Detection
CREATE TABLE public.account_sharing_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL, -- simultaneous_sessions, impossible_travel, unusual_pattern
  confidence_score DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
  evidence JSONB DEFAULT '{}',
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE NULL,
  acknowledged_by UUID NULL,
  action_taken TEXT NULL,
  is_resolved BOOLEAN DEFAULT false
);

-- Security Audit Logs (HIPAA Compliance)
CREATE TABLE public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  admin_user_id UUID NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  compliance_category TEXT, -- hipaa, gdpr, security, access_control
  risk_level TEXT DEFAULT 'low' -- low, medium, high, critical
);

-- Security Configuration Settings
CREATE TABLE public.security_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL, -- NULL for global configs
  config_type TEXT NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  UNIQUE(user_id, config_type, config_key)
);

-- Enable RLS on all tables
ALTER TABLE public.email_pin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_sharing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Email PIN Auth
CREATE POLICY "Users can manage their own PIN auth" ON public.email_pin_auth
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for User Devices
CREATE POLICY "Users can manage their own devices" ON public.user_devices
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for User Sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can terminate their own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Security Incidents
CREATE POLICY "Users can view their own security incidents" ON public.security_incidents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage security incidents" ON public.security_incidents
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "System can create security incidents" ON public.security_incidents
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Account Sharing Alerts
CREATE POLICY "Users can view their own sharing alerts" ON public.account_sharing_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage sharing alerts" ON public.account_sharing_alerts
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "System can create sharing alerts" ON public.account_sharing_alerts
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Security Audit Logs
CREATE POLICY "Users can view their own audit logs" ON public.security_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.security_audit_logs
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can create audit logs" ON public.security_audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Security Configs
CREATE POLICY "Users can view their own security configs" ON public.security_configs
  FOR SELECT USING ((auth.uid() = user_id) OR (is_global = true));

CREATE POLICY "Users can manage their own security configs" ON public.security_configs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage security configs" ON public.security_configs
  FOR ALL USING (is_admin(auth.uid()));

-- Functions for security operations
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark sessions as terminated if inactive for 30 days
  UPDATE public.user_sessions
  SET terminated_at = now()
  WHERE terminated_at IS NULL 
    AND last_activity < now() - INTERVAL '30 days';
    
  -- Delete terminated sessions older than 90 days
  DELETE FROM public.user_sessions
  WHERE terminated_at IS NOT NULL 
    AND terminated_at < now() - INTERVAL '90 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.detect_account_sharing(user_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  active_sessions INTEGER;
  unique_locations INTEGER;
  sharing_indicators JSONB := '[]'::JSONB;
  confidence_score DECIMAL := 0.0;
BEGIN
  -- Count active sessions
  SELECT COUNT(*) INTO active_sessions
  FROM public.user_sessions
  WHERE user_id = user_id_param 
    AND is_active = true
    AND started_at > now() - INTERVAL '24 hours';
  
  -- Count unique locations in last 24 hours
  SELECT COUNT(DISTINCT location_data->>'country') INTO unique_locations
  FROM public.user_sessions
  WHERE user_id = user_id_param 
    AND started_at > now() - INTERVAL '24 hours';
  
  -- Analyze sharing indicators
  IF active_sessions > 3 THEN
    sharing_indicators := sharing_indicators || '"multiple_simultaneous_sessions"'::JSONB;
    confidence_score := confidence_score + 0.4;
  END IF;
  
  IF unique_locations > 2 THEN
    sharing_indicators := sharing_indicators || '"multiple_locations"'::JSONB;
    confidence_score := confidence_score + 0.3;
  END IF;
  
  -- Check for impossible travel (simplified)
  IF EXISTS (
    SELECT 1 FROM public.user_sessions s1, public.user_sessions s2
    WHERE s1.user_id = user_id_param AND s2.user_id = user_id_param
      AND s1.id != s2.id
      AND ABS(EXTRACT(EPOCH FROM (s2.started_at - s1.started_at))) < 3600 -- within 1 hour
      AND s1.location_data->>'country' != s2.location_data->>'country'
  ) THEN
    sharing_indicators := sharing_indicators || '"impossible_travel"'::JSONB;
    confidence_score := confidence_score + 0.5;
  END IF;
  
  RETURN jsonb_build_object(
    'confidence_score', LEAST(confidence_score, 1.0),
    'indicators', sharing_indicators,
    'active_sessions', active_sessions,
    'unique_locations', unique_locations,
    'requires_action', confidence_score > 0.7
  );
END;
$$;

-- Insert default security configurations
INSERT INTO public.security_configs (config_type, config_key, config_value, is_global) VALUES
('session_limits', 'max_concurrent_sessions', '{"free": 2, "premium": 5, "professional": 10}'::JSONB, true),
('pin_auth', 'pin_expiry_minutes', '10'::JSONB, true),
('pin_auth', 'max_attempts', '3'::JSONB, true),
('device_trust', 'trust_duration_days', '30'::JSONB, true),
('sharing_detection', 'confidence_threshold', '0.7'::JSONB, true),
('audit_retention', 'days_to_keep', '2555'::JSONB, true); -- 7 years for HIPAA

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_active ON public.user_sessions(user_id, is_active);
CREATE INDEX idx_user_sessions_activity ON public.user_sessions(last_activity);
CREATE INDEX idx_user_devices_fingerprint ON public.user_devices(device_fingerprint);
CREATE INDEX idx_security_incidents_user_type ON public.security_incidents(user_id, incident_type);
CREATE INDEX idx_audit_logs_timestamp ON public.security_audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user_action ON public.security_audit_logs(user_id, action);