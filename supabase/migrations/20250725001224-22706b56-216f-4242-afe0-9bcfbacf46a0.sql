-- Fix remaining security issues (skip existing policies)

-- 1. Enable RLS on tables that don't have it (skip if already enabled)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_roles' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Add missing RLS policies for user_roles (skip if exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "Users can view their own roles" ON public.user_roles
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can manage user roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "Only admins can manage user roles" ON public.user_roles
        FOR ALL USING (is_admin(auth.uid()));
    END IF;
END $$;

-- 3. Add missing policies for security_alerts (skip existing ones)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can create security alerts' AND tablename = 'security_alerts') THEN
        CREATE POLICY "System can create security alerts" ON public.security_alerts
        FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all security alerts' AND tablename = 'security_alerts') THEN
        CREATE POLICY "Admins can manage all security alerts" ON public.security_alerts
        FOR ALL USING (is_admin(auth.uid()));
    END IF;
END $$;