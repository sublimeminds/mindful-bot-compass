-- Fix database function security by adding proper search_path settings
-- This prevents SQL injection vulnerabilities in database functions

-- Update all functions to include SET search_path = public, pg_temp
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

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_plan_limits(user_id_param uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT COALESCE(sp.limits, '{}')
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_id_param AND us.status = 'active'
  UNION ALL
  SELECT sp.limits
  FROM public.subscription_plans sp
  WHERE sp.name = 'Free' AND NOT EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = user_id_param AND status = 'active'
  )
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.can_user_perform_action(user_id_param uuid, action_type text, current_usage integer DEFAULT 0)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT 
    CASE 
      WHEN limits->action_type = '-1' THEN true  -- unlimited
      WHEN (limits->action_type)::INTEGER > current_usage THEN true
      ELSE false
    END
  FROM (
    SELECT public.get_user_plan_limits(user_id_param) as limits
  ) subquery;
$function$;

-- Fix the super admin functions
CREATE OR REPLACE FUNCTION public.is_super_admin(_admin_id uuid, _permission admin_permission DEFAULT NULL::admin_permission)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.super_admins sa
    LEFT JOIN public.admin_role_permissions arp ON sa.role = arp.role
    WHERE sa.id = _admin_id 
      AND sa.is_active = true
      AND (_permission IS NULL OR (arp.permission = _permission AND arp.granted = true))
  );
$function$;

CREATE OR REPLACE FUNCTION public.validate_admin_session(_session_token text)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT admin_id 
  FROM public.admin_sessions 
  WHERE session_token = _session_token 
    AND is_active = true 
    AND expires_at > now()
    AND last_activity > now() - INTERVAL '1 hour';
$function$;

-- Add rate limiting function for authentication
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(_identifier text, _max_attempts integer DEFAULT 5, _window_minutes integer DEFAULT 15)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  attempt_count integer;
BEGIN
  -- Count attempts in the time window
  SELECT COUNT(*) INTO attempt_count
  FROM auth_rate_limits
  WHERE identifier = _identifier
    AND attempted_at > now() - (_window_minutes || ' minutes')::interval;
  
  -- Clean up old records
  DELETE FROM auth_rate_limits 
  WHERE attempted_at < now() - (_window_minutes || ' minutes')::interval;
  
  -- Record this attempt
  INSERT INTO auth_rate_limits (identifier, attempted_at)
  VALUES (_identifier, now());
  
  RETURN attempt_count < _max_attempts;
END;
$function$;

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  attempted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limiting table
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limiting table
CREATE POLICY "System can manage rate limits" ON public.auth_rate_limits
FOR ALL USING (true);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier_time 
ON public.auth_rate_limits (identifier, attempted_at);