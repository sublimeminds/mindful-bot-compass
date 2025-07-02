-- Create security events table for enterprise security monitoring
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'failed_login', 'password_change', 'data_access', 'suspicious_activity')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user sessions table for session management
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  terminated_at TIMESTAMP WITH TIME ZONE
);

-- Create two factor auth table
CREATE TABLE public.two_factor_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  is_enabled BOOLEAN DEFAULT false,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security tables
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

-- RLS policies for security events (admins can view all, users can view their own)
CREATE POLICY "Admins can view all security events"
ON public.security_events
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own security events"
ON public.security_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create security events"
ON public.security_events
FOR INSERT
WITH CHECK (true);

-- RLS policies for audit logs (admins can view all, users can view their own)
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- RLS policies for user sessions
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions"
ON public.user_sessions
FOR ALL
USING (auth.uid() = user_id);

-- RLS policies for two factor auth
CREATE POLICY "Users can manage their own 2FA"
ON public.two_factor_auth
FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at DESC);
CREATE INDEX idx_security_events_type_severity ON public.security_events(event_type, severity);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action_resource ON public.audit_logs(action, resource);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_last_activity ON public.user_sessions(last_activity DESC);

-- Create function to update two_factor_auth updated_at
CREATE OR REPLACE FUNCTION public.update_two_factor_auth_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for two_factor_auth
CREATE TRIGGER update_two_factor_auth_updated_at
BEFORE UPDATE ON public.two_factor_auth
FOR EACH ROW
EXECUTE FUNCTION public.update_two_factor_auth_updated_at();

-- Create function to clean up old sessions
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