
-- Create integrations table to manage different integration types
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'sms', 'calendar', 'video', 'health', 'ehr', etc.
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_integrations table to track which integrations each user has enabled
CREATE TABLE public.user_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  integration_id UUID REFERENCES public.integrations NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  oauth_tokens JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, integration_id)
);

-- Create API keys table for external API access
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhooks table for external webhook management
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  url TEXT NOT NULL,
  event_types TEXT[] NOT NULL,
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integration_logs table for tracking integration activities
CREATE TABLE public.integration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  integration_id UUID REFERENCES public.integrations,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  status TEXT NOT NULL, -- 'success', 'failed', 'pending'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default integrations
INSERT INTO public.integrations (name, type, description) VALUES
('WhatsApp Business', 'messaging', 'WhatsApp Business API integration for secure messaging'),
('Twilio SMS', 'sms', 'SMS messaging and crisis alerts via Twilio'),
('Google Calendar', 'calendar', 'Calendar sync and appointment management'),
('Zoom', 'video', 'Video therapy sessions via Zoom'),
('Microsoft Teams', 'video', 'Video therapy sessions via Microsoft Teams'),
('Apple HealthKit', 'health', 'iOS health data integration'),
('Google Fit', 'health', 'Android fitness and health data'),
('Fitbit', 'health', 'Fitbit activity and sleep tracking'),
('Epic EHR', 'ehr', 'Epic Electronic Health Records integration'),
('Cerner EHR', 'ehr', 'Cerner Electronic Health Records integration'),
('Crisis Text Line', 'crisis', 'Crisis intervention text line integration'),
('National Suicide Prevention Lifeline', 'crisis', 'Emergency crisis line integration');

-- Enable RLS on all new tables
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for integrations (public read, admin write)
CREATE POLICY "Anyone can view integrations" ON public.integrations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify integrations" ON public.integrations FOR ALL USING (public.is_admin(auth.uid()));

-- RLS policies for user_integrations
CREATE POLICY "Users can view their own integrations" ON public.user_integrations 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own integrations" ON public.user_integrations 
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for api_keys
CREATE POLICY "Users can view their own API keys" ON public.api_keys 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can manage their own API keys" ON public.api_keys 
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for webhooks
CREATE POLICY "Users can view their own webhooks" ON public.webhooks 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can manage their own webhooks" ON public.webhooks 
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for integration_logs
CREATE POLICY "Users can view their own integration logs" ON public.integration_logs 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "System can insert integration logs" ON public.integration_logs 
  FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
