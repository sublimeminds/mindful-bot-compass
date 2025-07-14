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

-- Enable RLS on all new tables
ALTER TABLE public.email_pin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_sharing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Email PIN Auth
CREATE POLICY "Users can manage their own PIN auth" ON public.email_pin_auth
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for User Devices
CREATE POLICY "Users can manage their own devices" ON public.user_devices
  FOR ALL USING (auth.uid() = user_id);

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

-- Enhanced functions for security operations
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
    AND status = 'active'
    AND last_activity > now() - INTERVAL '24 hours';
  
  -- Count unique IP addresses in last 24 hours  
  SELECT COUNT(DISTINCT ip_address) INTO unique_locations
  FROM public.user_sessions
  WHERE user_id = user_id_param 
    AND last_activity > now() - INTERVAL '24 hours';
  
  -- Analyze sharing indicators
  IF active_sessions > 3 THEN
    sharing_indicators := sharing_indicators || '"multiple_simultaneous_sessions"'::JSONB;
    confidence_score := confidence_score + 0.4;
  END IF;
  
  IF unique_locations > 2 THEN
    sharing_indicators := sharing_indicators || '"multiple_locations"'::JSONB;
    confidence_score := confidence_score + 0.3;
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
CREATE INDEX idx_user_devices_fingerprint ON public.user_devices(device_fingerprint);
CREATE INDEX idx_security_audit_logs_timestamp ON public.security_audit_logs(timestamp);
CREATE INDEX idx_security_audit_logs_user_action ON public.security_audit_logs(user_id, action);
CREATE INDEX idx_account_sharing_alerts_user ON public.account_sharing_alerts(user_id, triggered_at);
CREATE INDEX idx_email_pin_auth_user_expires ON public.email_pin_auth(user_id, expires_at);