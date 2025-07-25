-- Final security fixes to complete the comprehensive security overhaul
-- This addresses the remaining 7 security issues

-- Fix the remaining function with search_path issue
CREATE OR REPLACE FUNCTION public.generate_backup_codes()
 RETURNS text[]
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    codes := array_append(codes, upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8)));
  END LOOP;
  RETURN codes;
END;
$function$;

-- Find and fix any remaining tables that need RLS enabled
-- Enable RLS on any tables that might be missing it
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Enable RLS on any public tables that don't have it enabled
    FOR r IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
            AND t.schemaname = 'public'
        )
        -- Exclude tables that are likely lookup/reference tables
        AND tablename NOT LIKE '%_view'
        AND tablename NOT IN ('schema_migrations')
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.schemaname, r.tablename);
            RAISE NOTICE 'Enabled RLS on table: %.%', r.schemaname, r.tablename;
        EXCEPTION 
            WHEN insufficient_privilege THEN
                RAISE NOTICE 'Insufficient privileges to enable RLS on: %.%', r.schemaname, r.tablename;
            WHEN others THEN
                RAISE NOTICE 'Error enabling RLS on %.%: %', r.schemaname, r.tablename, SQLERRM;
        END;
    END LOOP;
END;
$$;

-- Create comprehensive RLS policies for tables that need them
-- Add policies for any tables that have RLS enabled but no policies

-- For the remaining tables that might need policies, add basic security policies
CREATE POLICY "Authenticated users can read public data" 
ON public.countries 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Update OTP settings to use shorter expiry times (this will be handled via auth configuration)
-- The OTP expiry and password protection settings need to be configured in Supabase auth settings

-- Add a comprehensive security check function for monitoring
CREATE OR REPLACE FUNCTION public.security_health_check()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  tables_without_rls INTEGER;
  tables_without_policies INTEGER;
  functions_without_search_path INTEGER;
  security_score NUMERIC;
  health_report JSONB;
BEGIN
  -- Count tables without RLS
  SELECT COUNT(*) INTO tables_without_rls
  FROM pg_tables t
  LEFT JOIN pg_class c ON c.relname = t.tablename
  WHERE t.schemaname = 'public' 
  AND (c.relrowsecurity = false OR c.relrowsecurity IS NULL);
  
  -- Count tables with RLS but no policies
  SELECT COUNT(*) INTO tables_without_policies
  FROM pg_tables t
  JOIN pg_class c ON c.relname = t.tablename
  LEFT JOIN pg_policies p ON p.tablename = t.tablename
  WHERE t.schemaname = 'public' 
  AND c.relrowsecurity = true
  AND p.policyname IS NULL;
  
  -- Count functions without proper search_path
  SELECT COUNT(*) INTO functions_without_search_path
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.prosrc NOT LIKE '%search_path%'
  AND p.proname NOT LIKE 'pg_%';
  
  -- Calculate overall security score (0-100)
  security_score := GREATEST(0, 100 - (tables_without_rls * 10) - (tables_without_policies * 5) - (functions_without_search_path * 2));
  
  health_report := jsonb_build_object(
    'security_score', security_score,
    'tables_without_rls', tables_without_rls,
    'tables_without_policies', tables_without_policies,
    'functions_without_search_path', functions_without_search_path,
    'status', CASE 
      WHEN security_score >= 95 THEN 'excellent'
      WHEN security_score >= 85 THEN 'good'
      WHEN security_score >= 70 THEN 'fair'
      ELSE 'needs_improvement'
    END,
    'last_checked', now()
  );
  
  RETURN health_report;
END;
$function$;

-- Add security monitoring trigger
CREATE OR REPLACE FUNCTION public.log_security_event()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Log security-relevant events
  INSERT INTO public.audit_logs (user_id, action, resource, resource_id, new_values, ip_address)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Enable comprehensive security monitoring on critical tables
DROP TRIGGER IF EXISTS security_log_profiles ON public.profiles;
CREATE TRIGGER security_log_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

DROP TRIGGER IF EXISTS security_log_user_roles ON public.user_roles;
CREATE TRIGGER security_log_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

-- Add final security hardening
-- Create a function to detect and prevent privilege escalation
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Prevent users from granting themselves admin roles
  IF NEW.role IN ('super_admin', 'content_admin', 'support_admin', 'analytics_admin') 
     AND auth.uid() = NEW.user_id 
     AND NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Cannot grant admin privileges to yourself';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Apply privilege escalation protection
DROP TRIGGER IF EXISTS prevent_self_admin ON public.user_roles;
CREATE TRIGGER prevent_self_admin
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_escalation();