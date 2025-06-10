
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'content_admin', 'support_admin', 'analytics_admin', 'user');

-- Create user_roles table with proper RLS
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, role)
);

-- Create admin permissions table for granular control
CREATE TABLE public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  permission_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  can_read BOOLEAN DEFAULT false,
  can_write BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission_name, resource_type)
);

-- Create admin activity log
CREATE TABLE public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Create function to check if user is any type of admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'content_admin', 'support_admin', 'analytics_admin')
      AND is_active = true
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TABLE(role app_role)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id
    AND ur.is_active = true
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for admin_permissions  
CREATE POLICY "Admins can view permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage permissions" 
  ON public.admin_permissions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for admin_activity_log
CREATE POLICY "Admins can view activity logs" 
  ON public.admin_activity_log 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert activity logs" 
  ON public.admin_activity_log 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- Insert default permissions for each role
INSERT INTO public.admin_permissions (role, permission_name, resource_type, can_read, can_write, can_delete) VALUES
-- Super Admin permissions (full access)
('super_admin', 'manage_users', 'users', true, true, true),
('super_admin', 'manage_content', 'content', true, true, true),
('super_admin', 'manage_system', 'system', true, true, true),
('super_admin', 'view_analytics', 'analytics', true, true, true),
('super_admin', 'manage_roles', 'roles', true, true, true),

-- Content Admin permissions
('content_admin', 'manage_content', 'content', true, true, true),
('content_admin', 'manage_therapists', 'therapists', true, true, true),
('content_admin', 'manage_techniques', 'techniques', true, true, true),
('content_admin', 'manage_notifications', 'notifications', true, true, false),

-- Support Admin permissions
('support_admin', 'view_users', 'users', true, true, false),
('support_admin', 'manage_support', 'support', true, true, true),
('support_admin', 'view_sessions', 'sessions', true, false, false),
('support_admin', 'view_analytics', 'analytics', true, false, false),

-- Analytics Admin permissions
('analytics_admin', 'view_analytics', 'analytics', true, false, false),
('analytics_admin', 'view_reports', 'reports', true, true, false),
('analytics_admin', 'view_users', 'users', true, false, false),
('analytics_admin', 'view_sessions', 'sessions', true, false, false);

-- Function to automatically assign user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger to assign default role
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();
