-- Fix critical security issues

-- 1. Enable RLS on tables that don't have it
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- 2. Add missing RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles" ON public.user_roles
FOR ALL USING (is_admin(auth.uid()));

-- 3. Add missing RLS policies for security_alerts
CREATE POLICY "Users can view their own security alerts" ON public.security_alerts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create security alerts" ON public.security_alerts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all security alerts" ON public.security_alerts
FOR ALL USING (is_admin(auth.uid()));

-- 4. Fix function security by adding search_path to critical functions
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'content_admin', 'support_admin', 'analytics_admin')
      AND is_active = true
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id
    AND ur.is_active = true
$function$;

-- 5. Create secure session validation function
CREATE OR REPLACE FUNCTION public.validate_session_token(_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  session_user_id uuid;
BEGIN
  SELECT user_id INTO session_user_id
  FROM public.user_sessions
  WHERE session_token = _token
    AND status = 'active'
    AND last_activity > now() - INTERVAL '30 minutes'
    AND expires_at > now();
    
  IF session_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired session token';
  END IF;
  
  -- Update last activity
  UPDATE public.user_sessions
  SET last_activity = now()
  WHERE session_token = _token;
  
  RETURN session_user_id;
END;
$function$;

-- 6. Create input validation functions
CREATE OR REPLACE FUNCTION public.validate_email(_email text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN _email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(_email) <= 254
    AND _email NOT LIKE '%..'
    AND _email NOT LIKE '%@.'
    AND _email NOT LIKE '.%@%';
END;
$function$;

-- 7. Add audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource, resource_id, old_values, ip_address
    ) VALUES (
      auth.uid(),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id::text,
      to_jsonb(OLD),
      inet_client_addr()
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource, resource_id, old_values, new_values, ip_address
    ) VALUES (
      auth.uid(),
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id::text,
      to_jsonb(OLD),
      to_jsonb(NEW),
      inet_client_addr()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id, action, resource, resource_id, new_values, ip_address
    ) VALUES (
      auth.uid(),
      'INSERT',
      TG_TABLE_NAME,
      NEW.id::text,
      to_jsonb(NEW),
      inet_client_addr()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;