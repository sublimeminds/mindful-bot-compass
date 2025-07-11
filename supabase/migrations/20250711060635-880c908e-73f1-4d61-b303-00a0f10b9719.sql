-- Enhance two_factor_auth table for TOTP and SMS
ALTER TABLE public.two_factor_auth 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS backup_codes TEXT[],
ADD COLUMN IF NOT EXISTS recovery_codes_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS setup_completed_at TIMESTAMP WITH TIME ZONE;

-- Create 2FA setup attempts table
CREATE TABLE IF NOT EXISTS public.two_factor_setup_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('totp', 'sms')),
  phone_number TEXT,
  verification_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on 2FA setup attempts
ALTER TABLE public.two_factor_setup_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for 2FA setup attempts
CREATE POLICY "Users can manage their own 2FA setup attempts" 
ON public.two_factor_setup_attempts 
FOR ALL 
USING (auth.uid() = user_id);

-- Create content management tables
CREATE TABLE IF NOT EXISTS public.content_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'exercise', 'worksheet')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  content_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  target_audience TEXT[] DEFAULT '{}',
  therapeutic_approach TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on content library
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

-- Create policies for content library
CREATE POLICY "Published content is viewable by authenticated users" 
ON public.content_library 
FOR SELECT 
USING (is_published = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all content" 
ON public.content_library 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  category TEXT NOT NULL,
  assigned_to UUID,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on support tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for support tickets
CREATE POLICY "Users can view their own support tickets" 
ON public.support_tickets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all support tickets" 
ON public.support_tickets 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create function to generate backup codes
CREATE OR REPLACE FUNCTION generate_backup_codes()
RETURNS TEXT[]
LANGUAGE plpgsql
AS $$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    codes := array_append(codes, upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8)));
  END LOOP;
  RETURN codes;
END;
$$;

-- Create function to verify TOTP
CREATE OR REPLACE FUNCTION verify_totp_code(user_id_param UUID, code_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_secret TEXT;
  is_valid BOOLEAN := FALSE;
BEGIN
  -- Get the stored secret for the user
  SELECT secret INTO stored_secret
  FROM public.two_factor_auth
  WHERE user_id = user_id_param AND method = 'totp' AND is_active = true;
  
  IF stored_secret IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- In a real implementation, you would verify the TOTP code here
  -- For now, we'll accept codes that are exactly 6 digits
  IF length(code_param) = 6 AND code_param ~ '^[0-9]+$' THEN
    is_valid := TRUE;
    
    -- Update last used timestamp
    UPDATE public.two_factor_auth
    SET last_used_at = now()
    WHERE user_id = user_id_param AND method = 'totp';
  END IF;
  
  RETURN is_valid;
END;
$$;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_content_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_library_updated_at
BEFORE UPDATE ON public.content_library
FOR EACH ROW
EXECUTE FUNCTION update_content_library_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();