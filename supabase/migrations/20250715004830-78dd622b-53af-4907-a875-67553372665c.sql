-- Create trigger for session activity
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_sessions_activity
  BEFORE UPDATE ON public.admin_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_activity();

-- Create a temporary admin account for initial setup
-- Note: This will need to be changed on first login
INSERT INTO public.super_admins (username, email, password_hash, role) VALUES
('admin', 'admin@therapysync.com', '$2b$10$dummy.hash.will.be.changed.on.first.login', 'super_admin');

-- Create admin configuration entries
-- Note: Using proper JSONB casting for config values
DO $$
DECLARE
  admin_id UUID;
  random_suffix TEXT;
BEGIN
  -- Get the admin ID
  SELECT id INTO admin_id FROM public.super_admins WHERE username = 'admin' LIMIT 1;
  
  -- Generate random suffix for URL
  random_suffix := encode(gen_random_bytes(16), 'hex');
  
  -- Insert configuration values
  INSERT INTO public.admin_configuration (config_key, config_value, description, is_sensitive, updated_by) VALUES
  ('secure_admin_url_prefix', to_jsonb('sys-admin-' || random_suffix), 'Randomized URL prefix for admin access', true, admin_id),
  ('admin_session_timeout', to_jsonb(60), 'Admin session timeout in minutes', false, admin_id),
  ('max_login_attempts', to_jsonb(5), 'Maximum login attempts before lockout', false, admin_id),
  ('lockout_duration_minutes', to_jsonb(30), 'Account lockout duration in minutes', false, admin_id);
END $$;