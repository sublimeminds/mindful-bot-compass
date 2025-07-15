-- Create super-admin database structure
-- Phase 1: Secure Admin Database Tables

-- Create enum for admin roles
CREATE TYPE public.super_admin_role AS ENUM ('super_admin', 'content_admin', 'support_admin', 'analytics_admin', 'security_admin');

-- Create enum for admin permissions
CREATE TYPE public.admin_permission AS ENUM (
  'user_management', 'system_config', 'ai_management', 'content_management', 
  'translation_management', 'crisis_management', 'platform_analytics', 
  'security_management', 'audit_logs', 'admin_management'
);

-- Super admins table - separate from regular users
CREATE TABLE public.super_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role super_admin_role NOT NULL DEFAULT 'support_admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_mfa BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.super_admins(id),
  ip_whitelist TEXT[],
  session_timeout_minutes INTEGER DEFAULT 60
);

-- Admin sessions table for secure session management
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.super_admins(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_fingerprint TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_reason TEXT
);

-- Admin permissions table for granular access control
CREATE TABLE public.admin_role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role super_admin_role NOT NULL,
  permission admin_permission NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission)
);

-- Admin audit logs for complete tracking
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.super_admins(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET NOT NULL,
  user_agent TEXT,
  session_id UUID REFERENCES public.admin_sessions(id),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin configuration table for system settings
CREATE TABLE public.admin_configuration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID NOT NULL REFERENCES public.super_admins(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all admin tables
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_configuration ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for admin operations
CREATE OR REPLACE FUNCTION public.is_super_admin(_admin_id UUID, _permission admin_permission DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.super_admins sa
    LEFT JOIN public.admin_role_permissions arp ON sa.role = arp.role
    WHERE sa.id = _admin_id 
      AND sa.is_active = true
      AND (_permission IS NULL OR (arp.permission = _permission AND arp.granted = true))
  );
$$;

CREATE OR REPLACE FUNCTION public.validate_admin_session(_session_token TEXT)
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT admin_id 
  FROM public.admin_sessions 
  WHERE session_token = _session_token 
    AND is_active = true 
    AND expires_at > now()
    AND last_activity > now() - INTERVAL '1 hour';
$$;

-- Create RLS policies for admin tables
CREATE POLICY "Super admins can manage admin accounts" 
ON public.super_admins 
FOR ALL 
USING (public.is_super_admin(public.validate_admin_session(current_setting('app.admin_session_token', true)), 'admin_management'));

CREATE POLICY "Admins can view their own sessions" 
ON public.admin_sessions 
FOR SELECT 
USING (admin_id = public.validate_admin_session(current_setting('app.admin_session_token', true)));

CREATE POLICY "Super admins can manage sessions" 
ON public.admin_sessions 
FOR ALL 
USING (public.is_super_admin(public.validate_admin_session(current_setting('app.admin_session_token', true)), 'admin_management'));

CREATE POLICY "Super admins can view role permissions" 
ON public.admin_role_permissions 
FOR SELECT 
USING (public.is_super_admin(public.validate_admin_session(current_setting('app.admin_session_token', true)), 'admin_management'));

CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (public.is_super_admin(public.validate_admin_session(current_setting('app.admin_session_token', true)), 'audit_logs'));

CREATE POLICY "System can create audit logs" 
ON public.admin_audit_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Super admins can manage configuration" 
ON public.admin_configuration 
FOR ALL 
USING (public.is_super_admin(public.validate_admin_session(current_setting('app.admin_session_token', true)), 'system_config'));

-- Insert default permissions for each role
INSERT INTO public.admin_role_permissions (role, permission, granted) VALUES
-- Super admin has all permissions
('super_admin', 'user_management', true),
('super_admin', 'system_config', true),
('super_admin', 'ai_management', true),
('super_admin', 'content_management', true),
('super_admin', 'translation_management', true),
('super_admin', 'crisis_management', true),
('super_admin', 'platform_analytics', true),
('super_admin', 'security_management', true),
('super_admin', 'audit_logs', true),
('super_admin', 'admin_management', true),

-- Content admin permissions
('content_admin', 'content_management', true),
('content_admin', 'translation_management', true),
('content_admin', 'audit_logs', true),

-- Support admin permissions
('support_admin', 'user_management', true),
('support_admin', 'crisis_management', true),
('support_admin', 'audit_logs', true),

-- Analytics admin permissions
('analytics_admin', 'platform_analytics', true),
('analytics_admin', 'audit_logs', true),

-- Security admin permissions
('security_admin', 'security_management', true),
('security_admin', 'audit_logs', true),
('security_admin', 'admin_management', true);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_super_admins_updated_at
  BEFORE UPDATE ON public.super_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_updated_at();