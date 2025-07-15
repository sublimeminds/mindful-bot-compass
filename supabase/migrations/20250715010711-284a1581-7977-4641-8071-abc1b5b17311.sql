-- Enhanced MFA System for Super Admins
ALTER TABLE public.two_factor_auth 
ADD COLUMN IF NOT EXISTS backup_codes_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS backup_codes_remaining INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS device_trust_tokens JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS recovery_email TEXT,
ADD COLUMN IF NOT EXISTS emergency_recovery_code TEXT,
ADD COLUMN IF NOT EXISTS trusted_devices JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS rate_limit_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rate_limit_reset_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS security_notifications_enabled BOOLEAN DEFAULT true;

-- MFA Recovery Attempts tracking
CREATE TABLE IF NOT EXISTS public.mfa_recovery_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('backup_code', 'emergency_recovery', 'device_trust')),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trusted devices for super-admins
CREATE TABLE IF NOT EXISTS public.mfa_trusted_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_name TEXT NOT NULL,
  device_fingerprint TEXT NOT NULL,
  trust_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security alerts for monitoring
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('suspicious_login', 'mfa_bypass_attempt', 'admin_access_violation', 'rate_limit_exceeded', 'device_change')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  ip_address INET,
  user_agent TEXT,
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.mfa_recovery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for MFA Recovery Attempts
CREATE POLICY "Users can view their own MFA recovery attempts" 
ON public.mfa_recovery_attempts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all MFA recovery attempts" 
ON public.mfa_recovery_attempts FOR SELECT 
USING (is_super_admin(auth.uid()));

CREATE POLICY "System can create MFA recovery attempts" 
ON public.mfa_recovery_attempts FOR INSERT 
WITH CHECK (true);

-- RLS Policies for Trusted Devices
CREATE POLICY "Users can manage their own trusted devices" 
ON public.mfa_trusted_devices FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for Security Alerts
CREATE POLICY "Users can view their own security alerts" 
ON public.security_alerts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all security alerts" 
ON public.security_alerts FOR ALL 
USING (is_super_admin(auth.uid()));

CREATE POLICY "System can create security alerts" 
ON public.security_alerts FOR INSERT 
WITH CHECK (true);

-- Enhanced MFA Functions for Super Admins
CREATE OR REPLACE FUNCTION public.generate_enhanced_backup_codes()
RETURNS TEXT[]
LANGUAGE plpgsql
AS $$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    codes := array_append(codes, upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 12)));
  END LOOP;
  RETURN codes;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_emergency_recovery_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN upper(substr(encode(gen_random_bytes(16), 'hex'), 1, 32));
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_device_trust_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_backup_code(user_id_param UUID, code_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_codes JSONB;
  updated_codes JSONB := '[]'::JSONB;
  code_found BOOLEAN := false;
  i INTEGER;
BEGIN
  -- Get current backup codes
  SELECT backup_codes INTO stored_codes
  FROM public.two_factor_auth
  WHERE user_id = user_id_param AND is_active = true;
  
  IF stored_codes IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if code exists and remove it
  FOR i IN 0..jsonb_array_length(stored_codes) - 1 LOOP
    IF stored_codes->i->>'code' = upper(code_param) THEN
      code_found := true;
    ELSE
      updated_codes := updated_codes || (stored_codes->i);
    END IF;
  END LOOP;
  
  -- Update backup codes if code was found
  IF code_found THEN
    UPDATE public.two_factor_auth
    SET backup_codes = updated_codes,
        backup_codes_remaining = backup_codes_remaining - 1,
        last_used_at = now()
    WHERE user_id = user_id_param AND is_active = true;
    
    -- Log recovery attempt
    INSERT INTO public.mfa_recovery_attempts (user_id, attempt_type, success)
    VALUES (user_id_param, 'backup_code', true);
  ELSE
    -- Log failed attempt
    INSERT INTO public.mfa_recovery_attempts (user_id, attempt_type, success)
    VALUES (user_id_param, 'backup_code', false);
  END IF;
  
  RETURN code_found;
END;
$$;

CREATE OR REPLACE FUNCTION public.regenerate_backup_codes(user_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_codes TEXT[];
  formatted_codes JSONB := '[]'::JSONB;
  code TEXT;
BEGIN
  -- Only allow super admins to regenerate codes
  IF NOT is_super_admin(user_id_param) THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can regenerate backup codes';
  END IF;
  
  new_codes := generate_enhanced_backup_codes();
  
  FOREACH code IN ARRAY new_codes LOOP
    formatted_codes := formatted_codes || jsonb_build_object('code', code, 'used', false);
  END LOOP;
  
  UPDATE public.two_factor_auth
  SET backup_codes = formatted_codes,
      backup_codes_remaining = 10,
      backup_codes_generated_at = now()
  WHERE user_id = user_id_param AND is_active = true;
  
  -- Create security alert
  INSERT INTO public.security_alerts (user_id, alert_type, severity, title, description)
  VALUES (user_id_param, 'device_change', 'medium', 'Backup Codes Regenerated', 'MFA backup codes have been regenerated');
  
  RETURN formatted_codes;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_trusted_device(
  user_id_param UUID, 
  device_name_param TEXT, 
  device_fingerprint_param TEXT,
  user_agent_param TEXT DEFAULT NULL,
  ip_address_param INET DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  trust_token TEXT;
BEGIN
  -- Only allow super admins to create trusted devices
  IF NOT is_super_admin(user_id_param) THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can create trusted devices';
  END IF;
  
  trust_token := generate_device_trust_token();
  
  INSERT INTO public.mfa_trusted_devices (
    user_id, device_name, device_fingerprint, trust_token,
    user_agent, ip_address, expires_at
  ) VALUES (
    user_id_param, device_name_param, device_fingerprint_param, trust_token,
    user_agent_param, ip_address_param, now() + INTERVAL '30 days'
  );
  
  -- Log recovery attempt
  INSERT INTO public.mfa_recovery_attempts (user_id, attempt_type, success, metadata)
  VALUES (user_id_param, 'device_trust', true, jsonb_build_object('device_name', device_name_param));
  
  RETURN trust_token;
END;
$$;